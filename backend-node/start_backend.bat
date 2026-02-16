@echo off
echo Installing dependencies...
call npm.cmd install
if %errorlevel% neq 0 (
    echo Error running npm install. trying npm.cmd from global path...
    call npm install
)

echo Starting server...
node server.js
pause
