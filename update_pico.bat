@echo off
setlocal
echo =================================================
echo    Modulation Lab - Pico W Flashing Tool (Win)   
echo =================================================

REM Check if mpremote is installed
where mpremote >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: 'mpremote' is not recognized. 
    echo Please install it using: pip install mpremote
    pause
    exit /b 1
)

echo 1) Cleaning target device...
mpremote run clean_pico.py
if %errorlevel% neq 0 (
    echo Failed to clean device. Is Pico connected?
    pause
    exit /b 1
)

echo 2) Uploading main.py...
mpremote fs cp main.py :

echo 3) Uploading www/ directory...
mpremote fs cp -r www :

echo 4) Soft resetting Pico W...
mpremote reset

echo =================================================
echo    Done! Your Pico W is ready and updated.       
echo =================================================
pause
