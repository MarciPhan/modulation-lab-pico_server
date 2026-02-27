#!/bin/bash
# Universal Upload Script for Raspberry Pi Pico W (Linux / macOS)
# Requires 'mpremote' installed: pip install mpremote

echo "================================================="
echo "   Modulation Lab - Pico W Flashing Tool         "
echo "================================================="

# Auto-detect port (Linux: ttyACM*, macOS: tty.usbmodem*)
PORT=$(ls /dev/ttyACM* 2>/dev/null | head -n 1)
if [ -z "$PORT" ]; then
    PORT=$(ls /dev/tty.usbmodem* 2>/dev/null | head -n 1)
fi

PORT_ARG=""
if [ -n "$PORT" ]; then
    echo "Detected device port: $PORT"
    PORT_ARG="connect $PORT"
else
    echo "No explicit device port found. Attempting auto-detect..."
fi

echo "1) Cleaning target device..."
mpremote $PORT_ARG run clean_pico.py || { echo -e "\nFailed to clean device. Is Pico connected?\nEnsure permissions: sudo chmod 666 /dev/ttyACM0"; exit 1; }

echo "2) Uploading main.py..."
mpremote $PORT_ARG fs cp main.py :

echo "3) Uploading www/ directory..."
mpremote $PORT_ARG fs cp -r www :

echo "4) Soft resetting Pico W..."
mpremote $PORT_ARG reset

echo "================================================="
echo "   Done! Your Pico W is ready and updated.       "
echo "================================================="
