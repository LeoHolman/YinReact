param(
	[switch]$SkipRestore,
	[switch]$RebuildPitchExtractor,
	[switch]$SkipInstall
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
$pitchExtractorRoot = Join-Path $projectsRoot 'pitch_extractor'

$frontendRoot = Join-Path $yinRoot 'yin'
$backendRoot = Join-Path $yinRoot 'yin-backend'
$dumpRoot = Join-Path $yinRoot 'database\yin-1-2-3-4-5'

if (-not (Test-Path $pitchExtractorRoot)) {
	throw "pitch_extractor directory was not found at: $pitchExtractorRoot"
}

if (-not (Test-Path $frontendRoot)) {
	throw "Frontend directory was not found at: $frontendRoot"
}

if (-not (Test-Path $backendRoot)) {
	throw "Backend directory was not found at: $backendRoot"
}

if (-not (Test-Path $dumpRoot)) {
	throw "Database dump directory was not found at: $dumpRoot"
}

Write-Host 'Checking Docker daemon...' -ForegroundColor Cyan
Invoke-ExternalCommand -File 'docker' -Arguments @('info')

$pitchImage = docker images --format '{{.Repository}}:{{.Tag}}' | Where-Object { $_ -like 'pitch_extractor:*' } | Select-Object -First 1
if ($RebuildPitchExtractor -or -not $pitchImage) {
	Write-Host 'Building pitch_extractor Docker image...' -ForegroundColor Cyan
	Invoke-ExternalCommand -File 'docker' -Arguments @('build', '-t', 'pitch_extractor', '.') -WorkingDirectory $pitchExtractorRoot
}
else {
	Write-Host 'pitch_extractor image already exists. Skipping build.' -ForegroundColor DarkGreen
}

Ensure-ContainerRunning -ContainerName 'pitch_extractor' -ImageName 'pitch_extractor' -RunArguments @('-p', '8080:8080')
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
	Ensure-NodeModules -ProjectPath $backendRoot
}

Start-NpmScriptInNewWindow -ProjectPath $backendRoot -ScriptName 'start' -Title 'yin-backend'
Start-NpmScriptInNewWindow -ProjectPath $frontendRoot -ScriptName 'start' -Title 'yin frontend'

Write-Host ''
Write-Host 'Development environment is starting.' -ForegroundColor Green
Write-Host 'Frontend: https://localhost:3000' -ForegroundColor Green
Write-Host 'Backend:  https://localhost:8000' -ForegroundColor Green
Write-Host 'Pitch API: http://localhost:8080' -ForegroundColor Green
Write-Host 'MongoDB:   mongodb://localhost:27017/yin' -ForegroundColor Green
