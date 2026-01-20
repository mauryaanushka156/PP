@echo off
echo ========================================
echo Quick Fix for Connection Issues
echo ========================================
echo.

echo Step 1: Testing setup...
call node test-server.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Issues found! Trying to fix...
    echo.
)

echo.
echo Step 2: Installing/Updating dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to install dependencies!
    echo.
    echo Try running as Administrator or check your internet connection.
    pause
    exit /b 1
)

echo.
echo Step 3: Checking for port conflicts...
netstat -ano | findstr :3000 >nul
if %ERRORLEVEL% EQU 0 (
    echo WARNING: Port 3000 is in use!
    echo.
    echo Would you like to use port 3001 instead? (Y/N)
    set /p choice=
    if /i "%choice%"=="Y" (
        echo Changing port to 3001...
        powershell -Command "(Get-Content server\index.js) -replace 'PORT \|\| 3000', 'PORT || 3001' | Set-Content server\index.js"
        echo Port changed! Server will use port 3001.
        echo.
    )
)

echo.
echo Step 4: Starting server...
echo.
echo ========================================
echo.

call npm start

pause
