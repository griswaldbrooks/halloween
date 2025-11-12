# Library CMakeLists.txt
# This creates a static library that can be linked by tests

add_library(servo_logic STATIC
    servo_logic.cpp
)

# Make headers available to anything that links this library
target_include_directories(servo_logic PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
)

# Set C++ standard for this library
target_compile_features(servo_logic PUBLIC cxx_std_17)
