param(
    [ValidateSet('Setup','Api','Web','Mobile','Build','Check')]
    [string]$Action = 'Setup'
)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$commands = @{Setup='setup';Api='start:api';Web='start:web';Mobile='start:mobile';Build='build';Check='check:api'}
Push-Location $root
try {
    & npm.cmd run $commands[$Action]
    if ($LASTEXITCODE -ne 0) { throw "El comando terminó con código $LASTEXITCODE" }
} finally { Pop-Location }
