Set-Content -Path "C:\Users\Rishutosh Kumar\Documents\sync-platform.ps1" -Value @'
Write-Host "Syncing platform..." -ForegroundColor Cyan
Set-Location "C:\Users\Rishutosh Kumar\Documents\platform"
git pull origin main
Write-Host ""
Write-Host "OPUS_CONTEXT.md:" -ForegroundColor Yellow
Get-Content OPUS_CONTEXT.md
Write-Host ""
Write-Host "Done." -ForegroundColor Green
'@