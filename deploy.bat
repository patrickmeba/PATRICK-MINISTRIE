@echo off
cd /d "%~dp0"
call firebase deploy --only hosting
echo.
echo Termine. Adresse : https://patrick-ministrie.web.app
pause
