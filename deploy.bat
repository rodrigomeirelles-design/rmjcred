@echo off
REM Executar script de deploy do Netlify
cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -File "deploy.ps1"
pause
