#include "servo_logic.h"

int angleToPWM(int angle, int minPWM, int maxPWM) {
    // First constrain the angle to valid range
    int constrained = constrainAngle(angle);

    // Linear mapping: PWM = minPWM + (angle/180) * (maxPWM - minPWM)
    return minPWM + (constrained * (maxPWM - minPWM)) / 180;
}

int constrainAngle(int angle) {
    if (angle < 0) {
        return 0;
    }
    if (angle > 180) {
        return 180;
    }
    return angle;
}

int interpolate(int startPos, int endPos, float progress) {
    // Constrain progress to [0.0, 1.0]
    if (progress < 0.0f) {
        progress = 0.0f;
    }
    if (progress > 1.0f) {
        progress = 1.0f;
    }

    // Linear interpolation
    return startPos + static_cast<int>((endPos - startPos) * progress);
}

bool isIntervalElapsed(unsigned long currentTime, unsigned long lastTime, unsigned long interval) {
    // Handle millis() overflow correctly
    // This works because unsigned arithmetic wraps around
    return (currentTime - lastTime) >= interval;
}
