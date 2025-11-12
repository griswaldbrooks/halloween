# Test CMakeLists.txt
# Builds GoogleTest test executable with coverage enabled

# Find GoogleTest package
find_package(GTest REQUIRED)

# Create test executable
add_executable(servo_logic_tests
    test_servo_logic.cpp
)

# Link against the library and GoogleTest
target_link_libraries(servo_logic_tests
    servo_logic          # Our library
    GTest::gtest        # GoogleTest framework
    GTest::gtest_main   # GoogleTest main() function
    gcov                # Coverage library
)

# Enable coverage for both compilation and linking
target_compile_options(servo_logic_tests PRIVATE
    --coverage              # Enable coverage
    -fprofile-arcs         # Generate .gcda files
    -ftest-coverage        # Generate .gcno files
    -O0                    # Disable optimization for accurate coverage
    -g                     # Include debug symbols
)

target_link_options(servo_logic_tests PRIVATE
    --coverage             # Link with gcov
)

# Also enable coverage for the library itself
target_compile_options(servo_logic PRIVATE
    --coverage
    -fprofile-arcs
    -ftest-coverage
    -O0
    -g
)

# Register test with CTest
enable_testing()
add_test(NAME servo_logic_tests COMMAND servo_logic_tests)

# Set test properties
set_tests_properties(servo_logic_tests PROPERTIES
    TIMEOUT 30
    LABELS "unit"
)
