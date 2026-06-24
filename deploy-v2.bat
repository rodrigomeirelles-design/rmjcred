@echo off
chcp 65001 > nul
cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -File "deploy-simples.ps1"
pause
