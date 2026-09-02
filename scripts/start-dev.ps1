param(
	[switch]$SkipRestore,
	[switch]$SkipInstall,
	[switch]$SkipPortGuard
)

$ErrorActionPreference = 'Stop'

function Assert-Command {
	param([string]$Name)

	if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
		throw "Required command '$Name' was not found on PATH."
	}
}

function Invoke-ExternalCommand {
	param(
		[string]$File,
		[string[]]$Arguments,
		[string]$WorkingDirectory = $null
	)

	if ($WorkingDirectory) {
		Push-Location $WorkingDirectory
	}

	try {
		& $File @Arguments
		if ($LASTEXITCODE -ne 0) {
			throw "Command failed: $File $($Arguments -join ' ')"
		}
	}
	finally {
		if ($WorkingDirectory) {
			Pop-Location
		}
	}
}

function Ensure-NodeModules {
	param([string]$ProjectPath)

	$nodeModulesPath = Join-Path $ProjectPath 'node_modules'
	if (-not (Test-Path $nodeModulesPath)) {
		Write-Host "Installing dependencies in $ProjectPath ..." -ForegroundColor Cyan
		Invoke-ExternalCommand -File 'npm' -Arguments @('install') -WorkingDirectory $ProjectPath
	}
}

function Start-NpmScriptInNewWindow {
	param(
		[string]$ProjectPath,
		[string]$ScriptName,
		[string]$Title
	)

	$command = "Set-Location -Path '$ProjectPath'; npm run $ScriptName"
	Start-Process -FilePath 'powershell' -ArgumentList @('-NoExit', '-Command', $command) -WindowStyle Normal | Out-Null
	Write-Host "Started $Title in a new terminal window." -ForegroundColor Green
}

function Ensure-ContainerRunning {
	param(
		[string]$ContainerName,
		[string]$ImageName,
		[string[]]$RunArguments
	)

	$exists = (docker ps -a --filter "name=^$ContainerName$" --format '{{.Names}}') -eq $ContainerName
	if (-not $exists) {
		Write-Host "Creating and starting container '$ContainerName'..." -ForegroundColor Cyan
		Invoke-ExternalCommand -File 'docker' -Arguments (@('run', '-d', '--name', $ContainerName) + $RunArguments + @($ImageName))
		return
	}

	$running = (docker inspect -f '{{.State.Running}}' $ContainerName) -eq 'true'
	if (-not $running) {
		Write-Host "Starting existing container '$ContainerName'..." -ForegroundColor Cyan
		Invoke-ExternalCommand -File 'docker' -Arguments @('start', $ContainerName)
	}
	else {
		Write-Host "Container '$ContainerName' is already running." -ForegroundColor DarkGreen
	}
}

function Ensure-BackendContainerRunning {
	param(
		[string]$ContainerName,
		[string]$ImageName,
		[string]$BackendRoot,
		[string]$MongoUrl
	)

	$uploadsPath = Join-Path $BackendRoot 'src\uploads'
	if (-not (Test-Path $uploadsPath)) {
		New-Item -Path $uploadsPath -ItemType Directory -Force | Out-Null
	}

	$uploadsPathForDocker = $uploadsPath -replace '\\', '/'

	Write-Host "Building backend image '$ImageName'..." -ForegroundColor Cyan
	Invoke-ExternalCommand -File 'docker' -Arguments @('build', '-t', $ImageName, '.') -WorkingDirectory $BackendRoot

	$exists = (docker ps -a --filter "name=^$ContainerName$" --format '{{.Names}}') -eq $ContainerName
	if ($exists) {
		Write-Host "Removing existing backend container '$ContainerName'..." -ForegroundColor Cyan
		Invoke-ExternalCommand -File 'docker' -Arguments @('rm', '-f', $ContainerName)
	}

	Write-Host "Starting backend container '$ContainerName' on port 8000..." -ForegroundColor Cyan
	Invoke-ExternalCommand -File 'docker' -Arguments @(
		'run', '-d',
		'--name', $ContainerName,
		'-p', '8000:8000',
		'-e', "MONGO_URL=$MongoUrl",
		'-v', "${uploadsPathForDocker}:/app/src/uploads",
		$ImageName
	)
}

function Wait-ForMongo {
	param([string]$ContainerName)

	Write-Host 'Waiting for MongoDB readiness...' -ForegroundColor Cyan
	for ($i = 0; $i -lt 30; $i++) {
		try {
			$ping = docker exec $ContainerName mongosh --quiet --eval "db.runCommand({ ping: 1 }).ok"
			if ($ping -match '1') {
				Write-Host 'MongoDB is ready.' -ForegroundColor Green
				return
			}
		}
		catch {
		}

		Start-Sleep -Seconds 2
	}

	throw 'MongoDB did not become ready in time.'
}

function Restore-MongoDump {
	param(
		[string]$DumpRoot,
		[string]$DbName
	)

	$dumpRootUnix = $DumpRoot -replace '\\', '/'
	if (-not (Test-Path (Join-Path $DumpRoot 'yin'))) {
		throw "Expected dump folder not found: $(Join-Path $DumpRoot 'yin')"
	}

	Write-Host "Restoring dump from $DumpRoot into database '$DbName'..." -ForegroundColor Cyan
	Invoke-ExternalCommand -File 'docker' -Arguments @(
		'run', '--rm',
		'-v', "${dumpRootUnix}:/dump:ro",
		'mongo:7',
		'mongorestore',
		'--host', 'host.docker.internal',
		'--port', '27017',
		'--drop',
		'--nsInclude', "$DbName.*",
		'/dump'
	)

	Write-Host 'MongoDB restore complete.' -ForegroundColor Green
}

Assert-Command -Name 'docker'
Assert-Command -Name 'npm'

$yinRoot = Split-Path -Parent $PSScriptRoot
$projectsRoot = Split-Path -Parent $yinRoot

$frontendRoot = Join-Path $yinRoot 'yin'
$backendRoot = Join-Path $yinRoot 'yin-backend'
$dumpRoot = Join-Path $yinRoot 'database\yin-1-2-3-4-5'

if (-not (Test-Path $frontendRoot)) {
	throw "Frontend directory was not found at: $frontendRoot"
}

if (-not (Test-Path $backendRoot)) {
	throw "Backend directory was not found at: $backendRoot"
}

if (-not (Test-Path $dumpRoot)) {
	throw "Database dump directory was not found at: $dumpRoot"
}

if (-not $SkipPortGuard) {
	$portGuardScript = Join-Path $PSScriptRoot 'guard-dev-ports.ps1'
	if (-not (Test-Path $portGuardScript)) {
		throw "Port guard script was not found at: $portGuardScript"
	}

	Write-Host 'Clearing stale dev listeners on ports 3000 and 8000...' -ForegroundColor Cyan
	& $portGuardScript -Ports @(3000, 8000)
}
else {
	Write-Host 'Skipping port guard because -SkipPortGuard was passed.' -ForegroundColor Yellow
}

Write-Host 'Checking Docker daemon...' -ForegroundColor Cyan
Invoke-ExternalCommand -File 'docker' -Arguments @('info')
Ensure-ContainerRunning -ContainerName 'yin-mongo' -ImageName 'mongo:7' -RunArguments @('-p', '27017:27017')

Wait-ForMongo -ContainerName 'yin-mongo'

if (-not $SkipRestore) {
	Restore-MongoDump -DumpRoot $dumpRoot -DbName 'yin'
}
else {
	Write-Host 'Skipping MongoDB restore because -SkipRestore was passed.' -ForegroundColor Yellow
}

if (-not $SkipInstall) {
	Ensure-NodeModules -ProjectPath $frontendRoot
}

$mongoUrlForBackendContainer = 'mongodb://host.docker.internal:27017/yin'
Ensure-BackendContainerRunning -ContainerName 'yin-backend' -ImageName 'yin-backend' -BackendRoot $backendRoot -MongoUrl $mongoUrlForBackendContainer

Start-NpmScriptInNewWindow -ProjectPath $frontendRoot -ScriptName 'start' -Title 'yin frontend'

Write-Host ''
Write-Host 'Development environment is starting.' -ForegroundColor Green
Write-Host 'Frontend: https://localhost:3000' -ForegroundColor Green
Write-Host 'Backend:  https://localhost:8000' -ForegroundColor Green
Write-Host 'Backend container: yin-backend' -ForegroundColor Green
Write-Host 'MongoDB:   mongodb://localhost:27017/yin' -ForegroundColor Green
