# =====================================================================
#  sync-preview.ps1
#  Pushes the latest website from the source folder to the DigitalOcean
#  PREVIEW app and triggers a redeploy. ONE command to update the preview.
#
#  Run:  powershell -ExecutionPolicy Bypass -File "sync-preview.ps1"
#
#  Source of truth : ..\<source>  (the working website folder)
#  Target          : this folder  (bor-miz-preview) -> GitHub -> DigitalOcean
#  Live site (www.bor-miz.co.il on Netlify) is NEVER touched by this script.
# =====================================================================
$ErrorActionPreference = "Stop"

# Build Hebrew folder names from char codes so this file stays pure-ASCII
# (avoids PowerShell 5.1 mis-reading a UTF-8 script on a Hebrew-locale machine).
function U([int[]]$c) { -join ($c | ForEach-Object { [char]$_ }) }

$dst    = $PSScriptRoot
$parent = Split-Path $dst -Parent
$src    = Join-Path $parent (U 0x05D0,0x05EA,0x05E8)                                   # "אתר"
$matpro = U 0x05D7,0x05D5,0x05DE,0x05E8,0x20,0x05DE,0x05E7,0x05E6,0x05D5,0x05E2,0x05D9 # "חומר מקצועי"

if (-not (Test-Path $src)) { throw "Source folder not found: $src" }

Write-Host "1/4  Syncing files from source ..."
robocopy $src $dst /E /PURGE /XD ".git" ".netlify" ".do" $matpro `
    /XF "*.zip" "index-old.html" "state.json" "robots.txt" ".gitignore" ".do-token" ".do-app-id" ".do-url" `
    /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed (exit $LASTEXITCODE)" }

Write-Host "2/4  Checking for changes ..."
git -C $dst add -A
$changes = git -C $dst status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host "     No file changes - skipping commit/push."
} else {
    $stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    git -C $dst commit -q -m "Update preview ($stamp)"
    Write-Host "3/4  Pushing to GitHub ..."
    $ghToken = ((git -C $src remote get-url origin) -replace 'https://[^:]+:([^@]+)@.*', '$1')
    $pushUrl = "https://maormiz757-star:$ghToken@github.com/maormiz757-star/bor-miz-preview.git"
    $ErrorActionPreference = "Continue"
    git -C $dst push $pushUrl main:main *> $null
    $code = $LASTEXITCODE
    $ErrorActionPreference = "Stop"
    if ($code -ne 0) { throw "git push failed (exit $code)" }
}

Write-Host "4/4  Triggering DigitalOcean redeploy ..."
$doToken = (Get-Content (Join-Path $dst ".do-token") -Raw).Trim()
$appId   = (Get-Content (Join-Path $dst ".do-app-id") -Raw).Trim()
$headers = @{ Authorization = "Bearer $doToken" }
$resp = Invoke-RestMethod -Method Post -Headers $headers -ContentType "application/json" `
    -Uri "https://api.digitalocean.com/v2/apps/$appId/deployments" -Body '{"force_build":true}'
Write-Host ("     Deployment " + $resp.deployment.id + " started (" + $resp.deployment.phase + ").")

$url = ""
if (Test-Path (Join-Path $dst ".do-url")) { $url = (Get-Content (Join-Path $dst ".do-url") -Raw).Trim() }
Write-Host ""
Write-Host "Done. Preview will refresh in ~1-2 minutes." -ForegroundColor Green
if ($url) { Write-Host "Preview URL: $url" -ForegroundColor Green }
