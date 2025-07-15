@echo off
echo ========================================
echo    VAT Manager - Local Server
echo ========================================
echo.
echo Starting local server...
echo.
echo Your VAT Manager will be available at:
echo http://localhost:8000
echo.
echo To access from other devices on your network:
echo http://your-ip-address:8000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    echo Please install Python from https://python.org
    echo.
    pause
    exit /b 1
)

echo Starting server...
python -m http.server 8000

pause 