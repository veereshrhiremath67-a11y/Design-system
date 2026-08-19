# restore.ps1 — Revert all generator-upgrade changes back to the pre-upgrade snapshot.
# Run: powershell -ExecutionPolicy Bypass -File backups\restore.ps1
# Safe to run any time. Only restores files that exist in the snapshot folder.

$snapshot = Join-Path $PSScriptRoot "snapshot-v1"
$root = Split-Path $PSScriptRoot -Parent

if (-not (Test-Path -LiteralPath $snapshot)) {
  Write-Host "No snapshot found at $snapshot" -ForegroundColor Red
  exit 1
}

$map = @{
  "src-app-api-generate-route.ts.bak"   = "src\app\api\generate\route.ts"
  "src-app-preview-page.tsx.bak"        = "src\app\preview\page.tsx"
  "src-app-api-export--id--route.ts.bak"= "src\app\api\export\[id]\route.ts"
  "src-app-project--id--page.tsx.bak"   = "src\app\project\[id]\page.tsx"
  "src-app-create-page.tsx.bak"         = "src\app\create\page.tsx"
  "src-app-globals.css.bak"             = "src\app\globals.css"
  "package.json.bak"                    = "package.json"
}

foreach ($entry in $map.GetEnumerator()) {
  $src = Join-Path $snapshot $entry.Key
  if (Test-Path -LiteralPath $src) {
    $dest = Join-Path $root $entry.Value
    $destDir = Split-Path $dest -Parent
    if (-not (Test-Path -LiteralPath $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
    Copy-Item -LiteralPath $src -Destination $dest -Force
    Write-Host "Restored: $($entry.Value)"
  } else {
    Write-Host "Skip (not in snapshot): $($entry.Key)" -ForegroundColor Yellow
  }
}

Write-Host ""
Write-Host "Restore complete. To finish undoing, delete the new files added by the upgrade:" -ForegroundColor Cyan
Write-Host "  - src\lib\color.ts"
Write-Host "  - src\lib\generator-v2.ts"
Write-Host "  - src\components\token-gallery.tsx"
Write-Host "Then run: npm install  (if you want to remove the @fontsource packages)." -ForegroundColor Cyan
