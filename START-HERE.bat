@echo off
color 0A
title Progress Point - Start Here
cls

echo.
echo ============================================================
echo           PROGRESS POINT PWA - START HERE
echo ============================================================
echo.
echo This script will help you get started step by step.
echo.
pause

echo.
echo ============================================================
echo STEP 1: Checking Node.js Installation
echo ============================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is NOT installed!
    echo.
    echo Please install Node.js:
    echo 1. Go to: https://nodejs.org/
    echo 2. Download the LTS version
    echo 3. Install it (check "Add to PATH")
    echo 4. RESTART your computer
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Node.js is installed!
    node --version
    echo.
)

echo.
echo ============================================================
echo STEP 2: Checking npm
echo ============================================================
echo.

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not found!
    echo Please reinstall Node.js.
    pause
    exit /b 1
) else (
    echo [OK] npm is installed!
    npm --version
    echo.
)

echo.
echo ============================================================
echo STEP 3: Checking Project Files
echo ============================================================
echo.

if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo Make sure you're in the correct folder.
    pause
    exit /b 1
) else (
    echo [OK] Project files found!
    echo.
)

echo.
echo ============================================================
echo STEP 4: Installing Dependencies
echo ============================================================
echo.

if not exist "node_modules" (
    echo Installing dependencies (this may take a few minutes)...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERROR] Failed to install dependencies!
        echo.
        echo Try:
        echo 1. Check your internet connection
        echo 2. Run PowerShell as Administrator
        echo 3. Try: npm install --verbose
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed!
) else (
    echo [OK] Dependencies already installed!
    echo.
)

echo.
echo ============================================================
echo STEP 5: Testing Setup
echo ============================================================
echo.

if exist "test-server.js" (
    echo Running diagnostic tests...
    echo.
    call node test-server.js
    echo.
)

echo.
echo ============================================================
echo STEP 6: Starting Server
echo ============================================================
echo.
echo The server will start now.
echo.
echo Once you see "Server running on port XXXX":
echo 1. Open your browser
echo 2. Go to: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ============================================================
echo.

pause

call npm start

pause
