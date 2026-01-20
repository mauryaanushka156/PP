@echo off
color 0A
title Progress Point - Start Server NOW
cls

echo.
echo ============================================================
echo           STARTING PROGRESS POINT SERVER
echo ============================================================
echo.

REM Quick Node.js check
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found!
    echo.
    echo Install Node.js from: https://nodejs.org/
    echo Then RESTART your computer and try again.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found
node --version
echo.

REM Install if needed
if not exist "node_modules" (
    echo Installing dependencies (first time only)...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Installation failed!
        pause
        exit /b 1
    )
    echo.
)

echo ============================================================
echo Starting server...
echo ============================================================
echo.
echo IMPORTANT:
echo   - Keep this window open
echo   - Wait for "SERVER IS RUNNING" message
echo   - Then open: http://localhost:3000
echo.
echo If you see "Port already in use":
echo   - Close other applications using port 3000
echo   - Or change PORT in server/index.js to 3001
echo.
echo Press Ctrl+C to stop the server
echo ============================================================
echo.

timeout /t 2 /nobreak >nul

REM Try main server first
node server/index.js

REM If that fails, try minimal server
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Main server failed, trying minimal server...
    echo.
    node minimal-server.js
)

pause
