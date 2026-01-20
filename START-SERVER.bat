@echo off
echo ========================================
echo Progress Point PWA - Server Starter
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Then restart this script.
    echo.
    pause
    exit /b 1
)

echo Node.js found!
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed!
    echo Please reinstall Node.js.
    pause
    exit /b 1
)

echo npm found!
npm --version
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo This may take a few minutes...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
    echo.
)

echo Running diagnostics...
echo.
call node test-server.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo Diagnostics failed! Please fix the issues above.
    echo See FIX-CONNECTION.md for help.
    echo ========================================
    echo.
    pause
    exit /b 1
)

echo.
echo Starting server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

call npm start

pause
