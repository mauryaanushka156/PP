@echo off
color 0A
title Progress Point - GUARANTEED TO WORK
cls

echo.
echo ============================================================
echo        PROGRESS POINT - GUARANTEED WORKING VERSION
echo ============================================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is NOT installed!
    echo.
    echo Install from: https://nodejs.org/
    echo Then RESTART your computer and run this again.
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo.
echo ============================================================
echo Starting server...
echo ============================================================
echo.
echo The server will start now.
echo.
echo Once you see "SERVER IS RUNNING":
echo   1. Open your browser
echo   2. Go to: http://localhost:3000
echo.
echo If port 3000 is busy, the server will tell you.
echo.
echo Press Ctrl+C to stop the server
echo ============================================================
echo.

timeout /t 3 /nobreak >nul

call npm start

pause
