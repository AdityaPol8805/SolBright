@echo off
echo Starting BrightSol Advisor Backend Server...
cd /d "%~dp0"
echo Current directory: %CD%
echo.
echo Installing dependencies if needed...
if not exist node_modules npm install
echo.
echo Starting server...
node server.js
pause