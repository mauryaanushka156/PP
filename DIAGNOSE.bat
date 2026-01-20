@echo off
color 0E
title Progress Point - Full Diagnostic
cls

echo.
echo ============================================================
echo           COMPLETE SYSTEM DIAGNOSTIC
echo ============================================================
echo.

echo [1/6] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo    [FAIL] Node.js is NOT installed!
    echo.
    echo    SOLUTION: Install from https://nodejs.org/
    echo    Then RESTART your computer.
    echo.
    pause
    exit /b 1
) else (
    echo    [OK] Node.js version:
    node --version
)

echo.
echo [2/6] Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo    [FAIL] npm is NOT installed!
    pause
    exit /b 1
) else (
    echo    [OK] npm version:
    npm --version
)

echo.
echo [3/6] Checking project files...
if not exist "package.json" (
    echo    [FAIL] package.json not found!
    echo    Make sure you're in the correct folder.
    pause
    exit /b 1
) else (
    echo    [OK] package.json found
)

if not exist "public\index.html" (
    echo    [WARN] public\index.html not found!
) else (
    echo    [OK] public\index.html found
)

if not exist "server\index.js" (
    echo    [WARN] server\index.js not found!
) else (
    echo    [OK] server\index.js found
)

echo.
echo [4/6] Checking dependencies...
if not exist "node_modules" (
    echo    [WARN] node_modules not found - dependencies not installed
    echo    Installing now...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo    [FAIL] Failed to install dependencies!
        pause
        exit /b 1
    )
) else (
    echo    [OK] Dependencies installed
)

echo.
echo [5/6] Checking if port 3000 is available...
netstat -ano | findstr :3000 >nul
if %ERRORLEVEL% EQU 0 (
    echo    [WARN] Port 3000 is already in use!
    echo    Another application is using this port.
    echo.
    echo    Processes using port 3000:
    netstat -ano | findstr :3000
    echo.
    echo    You can:
    echo    1. Kill the process (use PID from above)
    echo    2. Use a different port (change in server/index.js)
) else (
    echo    [OK] Port 3000 is available
)

echo.
echo [6/6] Testing minimal server...
echo    Starting test server on port 3001...
echo.
start /B node minimal-server.js > test-server.log 2>&1
timeout /t 2 /nobreak >nul

curl -s http://localhost:3001/test >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    [OK] Test server responded!
    echo    Open: http://localhost:3001/test
) else (
    echo    [FAIL] Test server did not respond
    echo    Check test-server.log for errors
)

echo.
echo ============================================================
echo           DIAGNOSTIC COMPLETE
echo ============================================================
echo.
echo Next steps:
echo 1. If all checks passed, run: npm start
echo 2. Open browser to: http://localhost:3000
echo 3. If port 3000 is busy, change PORT in server/index.js
echo.
pause
