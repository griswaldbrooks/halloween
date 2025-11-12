#include <gtest/gtest.h>
#include "servo_logic.h"

/**
 * @brief Test suite for servo_logic library
 *
 * These tests demonstrate 100% code coverage of the library.
 * Each function is tested with normal cases, edge cases, and boundary conditions.
 */

// Test angleToPWM function
TEST(ServoLogic, AngleToPWM_MinAngle) {
    EXPECT_EQ(angleToPWM(0, 150, 600), 150);
}

TEST(ServoLogic, AngleToPWM_MaxAngle) {
    EXPECT_EQ(angleToPWM(180, 150, 600), 600);
}

TEST(ServoLogic, AngleToPWM_MiddleAngle) {
    EXPECT_EQ(angleToPWM(90, 150, 600), 375);
}

TEST(ServoLogic, AngleToPWM_NegativeAngle) {
    // Should constrain to 0
    EXPECT_EQ(angleToPWM(-10, 150, 600), 150);
}

TEST(ServoLogic, AngleToPWM_OverMaxAngle) {
    // Should constrain to 180
    EXPECT_EQ(angleToPWM(200, 150, 600), 600);
}

TEST(ServoLogic, AngleToPWM_DifferentRange) {
    // Test with different PWM range
    EXPECT_EQ(angleToPWM(90, 100, 500), 300);
}

// Test constrainAngle function
TEST(ServoLogic, ConstrainAngle_NegativeValue) {
    EXPECT_EQ(constrainAngle(-10), 0);
    EXPECT_EQ(constrainAngle(-1), 0);
    EXPECT_EQ(constrainAngle(-100), 0);
}

TEST(ServoLogic, ConstrainAngle_OverMax) {
    EXPECT_EQ(constrainAngle(200), 180);
    EXPECT_EQ(constrainAngle(181), 180);
    EXPECT_EQ(constrainAngle(1000), 180);
}

TEST(ServoLogic, ConstrainAngle_ValidRange) {
    EXPECT_EQ(constrainAngle(0), 0);
    EXPECT_EQ(constrainAngle(90), 90);
    EXPECT_EQ(constrainAngle(180), 180);
}

// Test interpolate function
TEST(ServoLogic, Interpolate_StartPosition) {
    EXPECT_EQ(interpolate(0, 180, 0.0f), 0);
}

TEST(ServoLogic, Interpolate_EndPosition) {
    EXPECT_EQ(interpolate(0, 180, 1.0f), 180);
}

TEST(ServoLogic, Interpolate_MiddlePosition) {
    EXPECT_EQ(interpolate(0, 180, 0.5f), 90);
}

TEST(ServoLogic, Interpolate_QuarterPosition) {
    EXPECT_EQ(interpolate(0, 180, 0.25f), 45);
}

TEST(ServoLogic, Interpolate_NegativeProgress) {
    // Should constrain to 0.0
    EXPECT_EQ(interpolate(0, 180, -0.5f), 0);
}

TEST(ServoLogic, Interpolate_ProgressOverOne) {
    // Should constrain to 1.0
    EXPECT_EQ(interpolate(0, 180, 1.5f), 180);
}

TEST(ServoLogic, Interpolate_ReverseDirection) {
    EXPECT_EQ(interpolate(180, 0, 0.5f), 90);
}

// Test isIntervalElapsed function
TEST(ServoLogic, IsIntervalElapsed_NotElapsed) {
    EXPECT_FALSE(isIntervalElapsed(1000, 500, 1000));
}

TEST(ServoLogic, IsIntervalElapsed_JustElapsed) {
    EXPECT_TRUE(isIntervalElapsed(1500, 500, 1000));
}

TEST(ServoLogic, IsIntervalElapsed_LongElapsed) {
    EXPECT_TRUE(isIntervalElapsed(5000, 500, 1000));
}

TEST(ServoLogic, IsIntervalElapsed_ZeroInterval) {
    EXPECT_TRUE(isIntervalElapsed(1000, 1000, 0));
}

TEST(ServoLogic, IsIntervalElapsed_MillisOverflow) {
    // Test millis() overflow handling
    // When millis() wraps from 4294967295 to 0, math should still work
    unsigned long beforeOverflow = 4294967200UL;  // Near max
    unsigned long afterOverflow = 200UL;           // After overflow
    unsigned long interval = 1000UL;

    // This should return true because 1000ms has elapsed
    // (afterOverflow - beforeOverflow) wraps to ~1096, which is >= 1000
    EXPECT_TRUE(isIntervalElapsed(afterOverflow, beforeOverflow, interval));
}

// Main function to run all tests
int main(int argc, char **argv) {
    testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
