# =====================================================================
#  sync-preview.ps1
#  Pushes the latest website from the source folder to the PREVIEW.
#  ONE command to update the preview. DigitalOcean Autodeploy + GitHub
#  Pages both rebuild automatically on push (~1-2 min).
#
#  Run from the project root:
#    powershell -ExecutionPolicy Bypass -File ".\bor-miz-preview\sync-preview.ps1"
#
#  Source of truth : ..\<source>  (the working website folder, edited directly)
#  Targets         : DigitalOcean (squid-app-irm2r.ondigitalocean.app) + GitHub Pages
#  Live site (www.bor-miz.co.il on Netlify) is NEVER touched by this script.
# =====================================================================
$ErrorActionPreference = "Stop"

# Build Hebrew folder names from char codes so this file stays pure-ASCII
# (avoids PowerShell 5.1 mis-reading a UTF-8 script on a Hebrew-locale machine).
function U([int[]]$c) { -join ($c | ForEach-Object { [char]$_ }) }

$dst    = $PSScriptRoot
$src    = Join-Path (Split-Path $dst -Parent) (U 0x05D0,0x05EA,0x05E8)                 # "אתר"
$matpro = U 0x05D7,0x05D5,0x05DE,0x05E8,0x20,0x05DE,0x05E7,0x05E6,0x05D5,0x05E2,0x05D9 # "חומר מקצועי"

if (-not (Test-Path $src)) { throw "Source folder not found: $src" }

Write-Host "1/3  Syncing files from source ..."
robocopy $src $dst /E /PURGE /XD ".git" ".netlify" ".do" $matpro `
    /XF "*.zip" "index-old.html" "state.json" "robots.txt" ".gitignore" ".nojekyll" "sync-preview.ps1" ".do-token" ".do-app-id" ".do-url" `
    /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed (exit $LASTEXITCODE)" }

Write-Host "2/3  Checking for changes ..."
git -C $dst add -A
$changes = git -C $dst status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host "     No file changes - nothing to deploy."
    return
}

$stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
git -C $dst commit -q -m "Update preview ($stamp)"

Write-Host "3/3  Pushing (DigitalOcean + GitHub Pages rebuild automatically) ..."
$ghToken = ((git -C $src remote get-url origin) -replace 'https://[^:]+:([^@]+)@.*', '$1')
$pushUrl = "https://maormiz757-star:$ghToken@github.com/maormiz757-star/bor-miz-preview.git"
$ErrorActionPreference = "Continue"
git -C $dst push $pushUrl main:main *> $null
$code = $LASTEXITCODE
$ErrorActionPreference = "Stop"
if ($code -ne 0) { throw "git push failed (exit $code)" }

Write-Host ""
Write-Host "Done. The preview will refresh in about 1-2 minutes:" -ForegroundColor Green
Write-Host "  DigitalOcean : https://squid-app-irm2r.ondigitalocean.app" -ForegroundColor Green
Write-Host "  GitHub Pages : https://maormiz757-star.github.io/bor-miz-preview/" -ForegroundColor Green
