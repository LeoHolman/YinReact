param(
    [int[]]$Ports = @(3000, 8000),
    [switch]$Quiet
)

$ErrorActionPreference = 'Stop'

function Test-PortBindable {
    param([int]$Port)

    $listener = $null
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
        $listener.Start()
        return $true
    }
    catch {
        return $false
    }
    finally {
        if ($listener) {
            $listener.Stop()
        }
    }
}

function Get-ListeningPids {
    param([int]$Port)

    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue |
        Where-Object { $_.State -eq 'Listen' }

    if (-not $connections) {
        return @()
    }

    return @($connections | Select-Object -ExpandProperty OwningProcess -Unique)
}

function Stop-ProcessOnPort {
    param([int]$Port)

    for ($attempt = 1; $attempt -le 5; $attempt++) {
        $allPids = Get-ListeningPids -Port $Port
        if (-not $allPids -or $allPids.Count -eq 0) {
            if (-not $Quiet) {
                Write-Host "Port $Port is free." -ForegroundColor DarkGreen
            }
            return
        }

        $pids = @($allPids | Where-Object { $_ -gt 0 })

        if ($pids.Count -eq 0) {
            if (Test-PortBindable -Port $Port) {
                if (-not $Quiet) {
                    Write-Host "Port $Port has no killable owner and is bindable. Treating as free." -ForegroundColor DarkGreen
                }
                return
            }
            break
        }

        foreach ($procId in $pids) {
            if (-not $Quiet) {
                Write-Host "Stopping PID $procId on port $Port (attempt $attempt/5)" -ForegroundColor Yellow
            }

            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
        }

        Start-Sleep -Milliseconds 300
    }

    $remainingPids = Get-ListeningPids -Port $Port
    if ($remainingPids -and $remainingPids.Count -gt 0) {
        if ($remainingPids.Count -eq 1 -and $remainingPids[0] -eq 0 -and (Test-PortBindable -Port $Port)) {
            if (-not $Quiet) {
                Write-Host "Port $Port only reports PID 0 and is bindable. Treating as free." -ForegroundColor DarkGreen
            }
            return
        }

        throw "Port $Port is still in use by PID(s): $($remainingPids -join ', ')"
    }

    if (-not $Quiet) {
        Write-Host "Port $Port is now free." -ForegroundColor Green
    }
}

foreach ($port in $Ports) {
    Stop-ProcessOnPort -Port $port
}
