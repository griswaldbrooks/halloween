#!/usr/bin/env python3
"""
Serial test script for servo test code
Reads output and sends test commands
"""

import serial
import time
import sys

PORT = '/dev/ttyACM0'
BAUD = 9600
TIMEOUT = 2

def read_serial_lines(ser, duration=None):
    """Read and print available serial output."""
    if duration:
        start_time = time.time()
        while time.time() - start_time < duration:
            if ser.in_waiting:
                line = ser.readline().decode('utf-8', errors='ignore').strip()
                if line:
                    print(line)
    else:
        while ser.in_waiting:
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if line:
                print(line)

def send_command_and_read(ser, command, description, delay=1):
    """Send a command and read the response."""
    print(f"\n=== {description} ===")
    ser.write(command.encode())
    time.sleep(delay)
    read_serial_lines(ser)

def test_serial():
    print("Opening serial port...")
    try:
        ser = serial.Serial(PORT, BAUD, timeout=TIMEOUT)
        time.sleep(2)  # Wait for Arduino reset

        print("\n=== Reading startup output ===")
        read_serial_lines(ser, duration=5)

        send_command_and_read(ser, 'i', "Sending 'i' command (I2C scan)", delay=2)
        send_command_and_read(ser, 's', "Sending 's' command (status)")
        send_command_and_read(ser, 'h', "Sending 'h' command (help)")

        ser.close()
        print("\n=== Test complete ===")
        return True

    except serial.SerialException as e:
        print(f"Error: {e}")
        return False
    except KeyboardInterrupt:
        print("\nInterrupted")
        return False

if __name__ == '__main__':
    success = test_serial()
    sys.exit(0 if success else 1)
