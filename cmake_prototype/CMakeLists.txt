# Root CMakeLists.txt for Arduino Servo Logic Library
# This demonstrates industry-standard CMake structure for embedded C++ with testing

cmake_minimum_required(VERSION 3.14)

# Project metadata
project(ArduinoServoLibrary
    VERSION 1.0.0
    DESCRIPTION "Arduino servo control library with GoogleTest unit tests"
    LANGUAGES CXX
)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Options
option(BUILD_TESTS "Build unit tests" ON)
option(ENABLE_COVERAGE "Enable code coverage" ON)

# Set default build type to Debug for development
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Debug CACHE STRING "Build type" FORCE)
endif()

# Print configuration
message(STATUS "")
message(STATUS "=== Arduino Servo Library Configuration ===")
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}")
message(STATUS "C++ standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "Build tests: ${BUILD_TESTS}")
message(STATUS "Enable coverage: ${ENABLE_COVERAGE}")
message(STATUS "==========================================")
message(STATUS "")

# Add the library subdirectory
add_subdirectory(lib)

# Add tests if enabled
if(BUILD_TESTS)
    enable_testing()
    add_subdirectory(test)

    message(STATUS "Tests enabled. Run with: make test or ctest")
endif()

# Coverage target (run after tests)
if(ENABLE_COVERAGE AND BUILD_TESTS)
    message(STATUS "Coverage enabled. Generate with: make coverage")
endif()
