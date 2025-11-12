/**
 * @file example_sketch.ino
 * @brief Example Arduino sketch using the servo_logic library
 *
 * This demonstrates how Arduino sketches can use the shared library
 * without any code duplication. The library is included via relative path.
 *
 * Hardware:
 * - Arduino Leonardo (DFRobot Beetle) or compatible
 * - Servo connected to pin 9
 *
 * The sketch demonstrates:
 * 1. Using library functions for angle calculations
 * 2. Smooth interpolation between positions
 * 3. Timing control with isIntervalElapsed
 */

// Include the library via relative path
// This is the ONLY place we reference the library code
#include "../../lib/servo_logic.h"

// Arduino Servo library for hardware control
#include <Servo.h>

// Hardware configuration
const int SERVO_PIN = 9;
const int MIN_PWM = 150;
const int MAX_PWM = 600;

// Animation state
Servo servo;
int currentPos = 0;
int targetPos = 180;
unsigned long lastUpdateTime = 0;
const unsigned long UPDATE_INTERVAL = 20;  // Update every 20ms

// Interpolation state
float progress = 0.0f;
const float SPEED = 0.01f;  // 1% per update = 2 seconds for full sweep

void setup() {
    // Initialize serial for debugging
    Serial.begin(9600);
    while (!Serial && millis() < 3000) {
        // Wait for serial or timeout after 3s
    }

    Serial.println("=== Servo Logic Library Demo ===");
    Serial.println();

    // Attach servo
    servo.attach(SERVO_PIN);

    // Demonstrate library functions
    demonstrateLibraryFunctions();

    // Start animation
    Serial.println("Starting smooth animation...");
    Serial.println("Servo will sweep from 0 to 180 degrees");
    Serial.println();
}

void loop() {
    unsigned long currentTime = millis();

    // Check if it's time to update using library function
    if (isIntervalElapsed(currentTime, lastUpdateTime, UPDATE_INTERVAL)) {
        lastUpdateTime = currentTime;

        // Calculate interpolated position using library function
        int newPos = interpolate(currentPos, targetPos, progress);

        // Convert angle to PWM using library function
        int pwm = angleToPWM(newPos, MIN_PWM, MAX_PWM);

        // Write to servo (this is the ONLY hardware-specific code)
        servo.writeMicroseconds(pwm);

        // Update progress
        progress += SPEED;

        // Reverse direction when target reached
        if (progress >= 1.0f) {
            progress = 0.0f;
            currentPos = targetPos;
            targetPos = (targetPos == 180) ? 0 : 180;

            Serial.print("Reached position: ");
            Serial.print(currentPos);
            Serial.println(" degrees");
        }
    }
}

/**
 * @brief Demonstrate all library functions with test cases
 *
 * This runs once at startup to show how the library functions work.
 * In production, you would remove this and just use the functions.
 */
void demonstrateLibraryFunctions() {
    Serial.println("--- Testing Library Functions ---");
    Serial.println();

    // Test angleToPWM
    Serial.println("angleToPWM() tests:");
    Serial.print("  0 degrees   -> PWM ");
    Serial.println(angleToPWM(0, MIN_PWM, MAX_PWM));
    Serial.print("  90 degrees  -> PWM ");
    Serial.println(angleToPWM(90, MIN_PWM, MAX_PWM));
    Serial.print("  180 degrees -> PWM ");
    Serial.println(angleToPWM(180, MIN_PWM, MAX_PWM));
    Serial.println();

    // Test constrainAngle
    Serial.println("constrainAngle() tests:");
    Serial.print("  -10 degrees -> ");
    Serial.println(constrainAngle(-10));
    Serial.print("  90 degrees  -> ");
    Serial.println(constrainAngle(90));
    Serial.print("  200 degrees -> ");
    Serial.println(constrainAngle(200));
    Serial.println();

    // Test interpolate
    Serial.println("interpolate() tests:");
    Serial.print("  0 to 180, 0% progress   -> ");
    Serial.println(interpolate(0, 180, 0.0f));
    Serial.print("  0 to 180, 50% progress  -> ");
    Serial.println(interpolate(0, 180, 0.5f));
    Serial.print("  0 to 180, 100% progress -> ");
    Serial.println(interpolate(0, 180, 1.0f));
    Serial.println();

    // Test isIntervalElapsed
    Serial.println("isIntervalElapsed() tests:");
    unsigned long testTime = millis();
    Serial.print("  Same time, 1000ms interval -> ");
    Serial.println(isIntervalElapsed(testTime, testTime, 1000) ? "true" : "false");
    Serial.print("  +500ms, 1000ms interval    -> ");
    Serial.println(isIntervalElapsed(testTime + 500, testTime, 1000) ? "true" : "false");
    Serial.print("  +1500ms, 1000ms interval   -> ");
    Serial.println(isIntervalElapsed(testTime + 1500, testTime, 1000) ? "true" : "false");
    Serial.println();

    Serial.println("--- All Tests Complete ---");
    Serial.println();
}
