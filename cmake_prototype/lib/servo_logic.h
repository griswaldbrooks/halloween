#ifndef SERVO_LOGIC_H
#define SERVO_LOGIC_H

/**
 * @file servo_logic.h
 * @brief Pure logic functions for servo control (no hardware dependencies)
 *
 * This library demonstrates how to separate testable logic from hardware I/O.
 * These functions can be tested with GoogleTest and used in Arduino sketches.
 */

/**
 * @brief Convert angle (0-180) to PWM value
 * @param angle Servo angle in degrees (0-180)
 * @param minPWM Minimum PWM value (e.g., 150 for most servos)
 * @param maxPWM Maximum PWM value (e.g., 600 for most servos)
 * @return PWM value corresponding to the angle
 *
 * Example: angleToPWM(90, 150, 600) = 375 (middle position)
 */
int angleToPWM(int angle, int minPWM, int maxPWM);

/**
 * @brief Constrain angle to valid servo range (0-180)
 * @param angle Input angle (can be any value)
 * @return Constrained angle (0 if < 0, 180 if > 180, otherwise unchanged)
 */
int constrainAngle(int angle);

/**
 * @brief Calculate interpolated position for smooth movement
 * @param startPos Starting position (0-180)
 * @param endPos Ending position (0-180)
 * @param progress Progress from 0.0 (start) to 1.0 (end)
 * @return Interpolated position
 *
 * Example: interpolate(0, 180, 0.5) = 90
 */
int interpolate(int startPos, int endPos, float progress);

/**
 * @brief Check if time interval has elapsed
 * @param currentTime Current time in milliseconds
 * @param lastTime Last event time in milliseconds
 * @param interval Interval to check in milliseconds
 * @return true if interval has elapsed, false otherwise
 *
 * Handles millis() overflow correctly
 */
bool isIntervalElapsed(unsigned long currentTime, unsigned long lastTime, unsigned long interval);

#endif // SERVO_LOGIC_H
