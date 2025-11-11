#!/usr/bin/env python3
"""
Unit tests for generate_arduino_config.py

Tests all four main functions:
1. generate_header_lines() - Hardware and kinematics configuration
2. generate_animation_structures() - C++ struct definitions
3. generate_animation_data() - Animation keyframes and arrays
4. generate_arduino_header() - Main orchestration function

Coverage target: 80%+
"""

import unittest
import json
import tempfile
from pathlib import Path
from generate_arduino_config import (
    generate_header_lines,
    generate_animation_structures,
    generate_animation_data,
    generate_arduino_header
)


class TestGenerateHeaderLines(unittest.TestCase):
    """Tests for generate_header_lines() function."""

    def setUp(self):
        """Set up test data for hardware and kinematics configuration."""
        self.hw = {
            'i2c_address': '0x40',
            'servo_frequency': 50,
            'left_leg': {
                'shoulder_channel': 14,
                'elbow_channel': 15,
                'shoulder_min_pulse': 440,
                'shoulder_max_pulse': 300,
                'elbow_min_pulse': 530,
                'elbow_max_pulse': 360
            },
            'right_leg': {
                'shoulder_channel': 1,
                'elbow_channel': 0,
                'shoulder_min_pulse': 150,
                'shoulder_max_pulse': 280,
                'elbow_min_pulse': 150,
                'elbow_max_pulse': 330
            },
            'trigger_pin': 9
        }
        self.kin = {
            'upper_segment_length': 80,
            'lower_segment_length': 100,
            'shoulder_min_angle': 0,
            'shoulder_max_angle': 90,
            'elbow_min_angle': 0,
            'elbow_max_angle': 90
        }

    def test_generates_header_guard(self):
        """Should include header guard defines."""
        lines = generate_header_lines(self.hw, self.kin)
        self.assertIn('#ifndef ANIMATION_CONFIG_H', lines)
        self.assertIn('#define ANIMATION_CONFIG_H', lines)

    def test_generates_auto_generated_comment(self):
        """Should include auto-generated warning comment."""
        lines = generate_header_lines(self.hw, self.kin)
        self.assertIn('// AUTO-GENERATED - DO NOT EDIT', lines)
        self.assertIn('// Generated from animation-config.json', lines)

    def test_generates_i2c_address(self):
        """Should generate I2C address define."""
        lines = generate_header_lines(self.hw, self.kin)
        self.assertIn('#define I2C_ADDRESS 0x40', lines)

    def test_generates_servo_frequency(self):
        """Should generate servo frequency define."""
        lines = generate_header_lines(self.hw, self.kin)
        self.assertIn('#define SERVO_FREQ 50', lines)

    def test_generates_left_leg_channels(self):
        """Should generate left leg servo channel defines."""
        lines = generate_header_lines(self.hw, self.kin)
        self.assertIn('#define LEFT_SHOULDER_CHANNEL 14', lines)
        self.assertIn('#define LEFT_ELBOW_CHANNEL 15', lines)

    def test_generates_left_leg_pulses(self):
        """Should generate left leg pulse width defines."""
        lines = generate_header_lines(self.hw, self.kin)
        self.assertIn('#define LEFT_SHOULDER_MIN_PULSE 440', lines)
        self.assertIn('#define LEFT_SHOULDER_MAX_PULSE 300', lines)
        self.assertIn('#define LEFT_ELBOW_MIN_PULSE 530', lines)
        self.assertIn('#define LEFT_ELBOW_MAX_PULSE 360', lines)

    def test_generates_right_leg_channels(self):
        """Should generate right leg servo channel defines."""
        lines = generate_header_lines(self.hw, self.kin)
        self.assertIn('#define RIGHT_SHOULDER_CHANNEL 1', lines)
        self.assertIn('#define RIGHT_ELBOW_CHANNEL 0', lines)

    def test_generates_right_leg_pulses(self):
        """Should generate right leg pulse width defines."""
        lines = generate_header_lines(self.hw, self.kin)
        self.assertIn('#define RIGHT_SHOULDER_MIN_PULSE 150', lines)
        self.assertIn('#define RIGHT_SHOULDER_MAX_PULSE 280', lines)
        self.assertIn('#define RIGHT_ELBOW_MIN_PULSE 150', lines)
        self.assertIn('#define RIGHT_ELBOW_MAX_PULSE 330', lines)

    def test_generates_trigger_pin(self):
        """Should generate trigger pin define."""
        lines = generate_header_lines(self.hw, self.kin)
        self.assertIn('#define TRIGGER_PIN 9', lines)

    def test_generates_kinematics_lengths(self):
        """Should generate segment length defines."""
        lines = generate_header_lines(self.hw, self.kin)
        self.assertIn('#define UPPER_SEGMENT_LENGTH 80', lines)
        self.assertIn('#define LOWER_SEGMENT_LENGTH 100', lines)

    def test_generates_kinematics_angles(self):
        """Should generate angle limit defines."""
        lines = generate_header_lines(self.hw, self.kin)
        self.assertIn('#define SHOULDER_MIN_ANGLE 0', lines)
        self.assertIn('#define SHOULDER_MAX_ANGLE 90', lines)
        self.assertIn('#define ELBOW_MIN_ANGLE 0', lines)
        self.assertIn('#define ELBOW_MAX_ANGLE 90', lines)

    def test_returns_list_of_strings(self):
        """Should return a list of strings."""
        lines = generate_header_lines(self.hw, self.kin)
        self.assertIsInstance(lines, list)
        self.assertTrue(all(isinstance(line, str) for line in lines))

    def test_handles_different_numeric_values(self):
        """Should handle different numeric values correctly."""
        self.hw['servo_frequency'] = 60
        self.kin['upper_segment_length'] = 120
        lines = generate_header_lines(self.hw, self.kin)
        self.assertIn('#define SERVO_FREQ 60', lines)
        self.assertIn('#define UPPER_SEGMENT_LENGTH 120', lines)


class TestGenerateAnimationStructures(unittest.TestCase):
    """Tests for generate_animation_structures() function."""

    def test_generates_keyframe_struct(self):
        """Should generate Keyframe struct definition."""
        lines = generate_animation_structures()
        content = '\n'.join(lines)
        self.assertIn('struct Keyframe {', content)
        self.assertIn('unsigned long time_ms;', content)
        self.assertIn('int left_shoulder_deg;', content)
        self.assertIn('int left_elbow_deg;', content)
        self.assertIn('int right_shoulder_deg;', content)
        self.assertIn('int right_elbow_deg;', content)
        self.assertIn('};', content)

    def test_generates_animation_struct(self):
        """Should generate Animation struct definition."""
        lines = generate_animation_structures()
        content = '\n'.join(lines)
        self.assertIn('struct Animation {', content)
        self.assertIn('const char* name;', content)
        self.assertIn('unsigned long duration_ms;', content)
        self.assertIn('bool loop;', content)
        self.assertIn('int keyframe_count;', content)
        self.assertIn('const Keyframe* keyframes;', content)

    def test_returns_list_of_strings(self):
        """Should return a list of strings."""
        lines = generate_animation_structures()
        self.assertIsInstance(lines, list)
        self.assertTrue(all(isinstance(line, str) for line in lines))

    def test_includes_comments(self):
        """Should include descriptive comments."""
        lines = generate_animation_structures()
        self.assertIn('// Animation Keyframe Structure', lines)


class TestGenerateAnimationData(unittest.TestCase):
    """Tests for generate_animation_data() function."""

    def setUp(self):
        """Set up test animation data."""
        self.animations = {
            'zero': {
                'name': 'Zero Position',
                'duration_ms': 1000,
                'loop': True,
                'keyframes': [
                    {
                        'time_ms': 0,
                        'left_shoulder_deg': 0,
                        'left_elbow_deg': 0,
                        'right_shoulder_deg': 0,
                        'right_elbow_deg': 0
                    }
                ]
            },
            'test': {
                'name': 'Test Animation',
                'duration_ms': 2000,
                'loop': False,
                'keyframes': [
                    {
                        'time_ms': 0,
                        'left_shoulder_deg': 10,
                        'left_elbow_deg': 20,
                        'right_shoulder_deg': 30,
                        'right_elbow_deg': 40
                    },
                    {
                        'time_ms': 1000,
                        'left_shoulder_deg': 50,
                        'left_elbow_deg': 60,
                        'right_shoulder_deg': 70,
                        'right_elbow_deg': 80
                    }
                ]
            }
        }

    def test_generates_animation_name_strings(self):
        """Should generate PROGMEM name strings for each animation."""
        lines = generate_animation_data(self.animations)
        content = '\n'.join(lines)
        self.assertIn('const char ZERO_NAME[] PROGMEM = "Zero Position";', content)
        self.assertIn('const char TEST_NAME[] PROGMEM = "Test Animation";', content)

    def test_generates_keyframe_arrays(self):
        """Should generate keyframe arrays for each animation."""
        lines = generate_animation_data(self.animations)
        content = '\n'.join(lines)
        self.assertIn('const Keyframe ZERO_KEYFRAMES[] PROGMEM = {', content)
        self.assertIn('const Keyframe TEST_KEYFRAMES[] PROGMEM = {', content)

    def test_generates_keyframe_data(self):
        """Should generate keyframe data with correct values."""
        lines = generate_animation_data(self.animations)
        content = '\n'.join(lines)
        # Check zero animation keyframe
        self.assertIn('{0, 0, 0, 0, 0}', content)
        # Check test animation keyframes
        self.assertIn('{0, 10, 20, 30, 40}', content)
        self.assertIn('{1000, 50, 60, 70, 80}', content)

    def test_generates_animation_array(self):
        """Should generate ANIMATIONS array."""
        lines = generate_animation_data(self.animations)
        content = '\n'.join(lines)
        self.assertIn('const Animation ANIMATIONS[] PROGMEM = {', content)

    def test_generates_animation_entries(self):
        """Should generate entries in animation array."""
        lines = generate_animation_data(self.animations)
        content = '\n'.join(lines)
        self.assertIn('ZERO_NAME', content)
        self.assertIn('TEST_NAME', content)

    def test_loop_flag_true(self):
        """Should generate 'true' for looping animations."""
        lines = generate_animation_data(self.animations)
        content = '\n'.join(lines)
        # zero animation has loop=true
        self.assertIn('{ZERO_NAME, 1000, true, 1, ZERO_KEYFRAMES}', content)

    def test_loop_flag_false(self):
        """Should generate 'false' for non-looping animations."""
        lines = generate_animation_data(self.animations)
        content = '\n'.join(lines)
        # test animation has loop=false
        self.assertIn('{TEST_NAME, 2000, false, 2, TEST_KEYFRAMES}', content)

    def test_keyframe_count_correct(self):
        """Should include correct keyframe count."""
        lines = generate_animation_data(self.animations)
        content = '\n'.join(lines)
        # zero has 1 keyframe
        self.assertIn('true, 1, ZERO_KEYFRAMES', content)
        # test has 2 keyframes
        self.assertIn('false, 2, TEST_KEYFRAMES', content)

    def test_handles_empty_animations(self):
        """Should handle empty animations dictionary."""
        lines = generate_animation_data({})
        content = '\n'.join(lines)
        self.assertIn('const Animation ANIMATIONS[] PROGMEM = {', content)
        self.assertIn('};', content)

    def test_handles_multiple_keyframes(self):
        """Should handle animations with many keyframes."""
        multi_keyframe_anim = {
            'multi': {
                'name': 'Multi',
                'duration_ms': 5000,
                'loop': True,
                'keyframes': [
                    {'time_ms': i*100, 'left_shoulder_deg': i, 'left_elbow_deg': i,
                     'right_shoulder_deg': i, 'right_elbow_deg': i}
                    for i in range(10)
                ]
            }
        }
        lines = generate_animation_data(multi_keyframe_anim)
        content = '\n'.join(lines)
        self.assertIn('true, 10, MULTI_KEYFRAMES', content)

    def test_uppercase_animation_ids(self):
        """Should convert animation IDs to uppercase for constants."""
        lines = generate_animation_data(self.animations)
        content = '\n'.join(lines)
        self.assertIn('ZERO_NAME', content)
        self.assertIn('ZERO_KEYFRAMES', content)
        self.assertIn('TEST_NAME', content)
        self.assertIn('TEST_KEYFRAMES', content)

    def test_returns_list_of_strings(self):
        """Should return a list of strings."""
        lines = generate_animation_data(self.animations)
        self.assertIsInstance(lines, list)
        self.assertTrue(all(isinstance(line, str) for line in lines))


class TestGenerateArduinoHeader(unittest.TestCase):
    """Tests for generate_arduino_header() function."""

    def setUp(self):
        """Set up test configuration and temporary output file."""
        self.config_data = {
            'hardware': {
                'i2c_address': '0x40',
                'servo_frequency': 50,
                'left_leg': {
                    'shoulder_channel': 14,
                    'elbow_channel': 15,
                    'shoulder_min_pulse': 440,
                    'shoulder_max_pulse': 300,
                    'elbow_min_pulse': 530,
                    'elbow_max_pulse': 360
                },
                'right_leg': {
                    'shoulder_channel': 1,
                    'elbow_channel': 0,
                    'shoulder_min_pulse': 150,
                    'shoulder_max_pulse': 280,
                    'elbow_min_pulse': 150,
                    'elbow_max_pulse': 330
                },
                'trigger_pin': 9
            },
            'kinematics': {
                'upper_segment_length': 80,
                'lower_segment_length': 100,
                'shoulder_min_angle': 0,
                'shoulder_max_angle': 90,
                'elbow_min_angle': 0,
                'elbow_max_angle': 90
            },
            'animations': {
                'zero': {
                    'name': 'Zero Position',
                    'duration_ms': 1000,
                    'loop': True,
                    'keyframes': [
                        {
                            'time_ms': 0,
                            'left_shoulder_deg': 0,
                            'left_elbow_deg': 0,
                            'right_shoulder_deg': 0,
                            'right_elbow_deg': 0
                        }
                    ]
                },
                'test': {
                    'name': 'Test Animation',
                    'duration_ms': 2000,
                    'loop': False,
                    'keyframes': [
                        {
                            'time_ms': 0,
                            'left_shoulder_deg': 10,
                            'left_elbow_deg': 20,
                            'right_shoulder_deg': 30,
                            'right_elbow_deg': 40
                        }
                    ]
                }
            },
            'default_animation': 'test'
        }

        # Create temporary files
        self.temp_dir = tempfile.mkdtemp()
        self.config_path = Path(self.temp_dir) / 'test_config.json'
        self.output_path = Path(self.temp_dir) / 'output.h'

        # Write test config
        with open(self.config_path, 'w') as f:
            json.dump(self.config_data, f)

    def tearDown(self):
        """Clean up temporary files."""
        import shutil
        shutil.rmtree(self.temp_dir)

    def test_creates_output_file(self):
        """Should create the output header file."""
        generate_arduino_header(self.config_path, self.output_path)
        self.assertTrue(self.output_path.exists())

    def test_output_contains_header_guard(self):
        """Should include header guard in output."""
        generate_arduino_header(self.config_path, self.output_path)
        content = self.output_path.read_text()
        self.assertIn('#ifndef ANIMATION_CONFIG_H', content)
        self.assertIn('#define ANIMATION_CONFIG_H', content)
        self.assertIn('#endif // ANIMATION_CONFIG_H', content)

    def test_output_contains_hardware_config(self):
        """Should include hardware configuration defines."""
        generate_arduino_header(self.config_path, self.output_path)
        content = self.output_path.read_text()
        self.assertIn('#define I2C_ADDRESS 0x40', content)
        self.assertIn('#define SERVO_FREQ 50', content)
        self.assertIn('#define LEFT_SHOULDER_CHANNEL 14', content)

    def test_output_contains_kinematics_config(self):
        """Should include kinematics configuration defines."""
        generate_arduino_header(self.config_path, self.output_path)
        content = self.output_path.read_text()
        self.assertIn('#define UPPER_SEGMENT_LENGTH 80', content)
        self.assertIn('#define LOWER_SEGMENT_LENGTH 100', content)

    def test_output_contains_structs(self):
        """Should include struct definitions."""
        generate_arduino_header(self.config_path, self.output_path)
        content = self.output_path.read_text()
        self.assertIn('struct Keyframe {', content)
        self.assertIn('struct Animation {', content)

    def test_output_contains_animation_data(self):
        """Should include animation data."""
        generate_arduino_header(self.config_path, self.output_path)
        content = self.output_path.read_text()
        self.assertIn('ZERO_NAME', content)
        self.assertIn('TEST_NAME', content)
        self.assertIn('ZERO_KEYFRAMES', content)
        self.assertIn('TEST_KEYFRAMES', content)

    def test_output_contains_animation_count(self):
        """Should include animation count define."""
        generate_arduino_header(self.config_path, self.output_path)
        content = self.output_path.read_text()
        self.assertIn('#define ANIMATION_COUNT 2', content)

    def test_output_contains_default_animation(self):
        """Should include default animation index."""
        generate_arduino_header(self.config_path, self.output_path)
        content = self.output_path.read_text()
        # 'test' is the second animation (index 1)
        self.assertIn('#define DEFAULT_ANIMATION 1  // test', content)

    def test_default_animation_first(self):
        """Should correctly handle default animation as first."""
        self.config_data['default_animation'] = 'zero'
        with open(self.config_path, 'w') as f:
            json.dump(self.config_data, f)

        generate_arduino_header(self.config_path, self.output_path)
        content = self.output_path.read_text()
        self.assertIn('#define DEFAULT_ANIMATION 0  // zero', content)

    def test_handles_missing_config_file(self):
        """Should raise error for missing config file."""
        missing_path = Path(self.temp_dir) / 'missing.json'
        with self.assertRaises(FileNotFoundError):
            generate_arduino_header(missing_path, self.output_path)

    def test_handles_invalid_json(self):
        """Should raise error for invalid JSON."""
        invalid_path = Path(self.temp_dir) / 'invalid.json'
        invalid_path.write_text('not valid json{{{')

        with self.assertRaises(json.JSONDecodeError):
            generate_arduino_header(invalid_path, self.output_path)

    def test_requires_parent_directories_exist(self):
        """Should require parent directories to exist (caller's responsibility)."""
        nested_output = Path(self.temp_dir) / 'nested' / 'dir' / 'output.h'
        # Parent directories don't exist, should raise error
        with self.assertRaises(FileNotFoundError):
            generate_arduino_header(self.config_path, nested_output)

    def test_output_has_newline_at_end(self):
        """Should end output file with newline."""
        generate_arduino_header(self.config_path, self.output_path)
        content = self.output_path.read_text()
        self.assertTrue(content.endswith('\n'))


class TestEdgeCases(unittest.TestCase):
    """Tests for edge cases and error conditions."""

    def test_empty_keyframes_list(self):
        """Should handle animations with empty keyframes list."""
        animations = {
            'empty': {
                'name': 'Empty',
                'duration_ms': 1000,
                'loop': True,
                'keyframes': []
            }
        }
        lines = generate_animation_data(animations)
        content = '\n'.join(lines)
        self.assertIn('true, 0, EMPTY_KEYFRAMES', content)

    def test_large_angle_values(self):
        """Should handle large angle values correctly."""
        animations = {
            'large': {
                'name': 'Large',
                'duration_ms': 1000,
                'loop': False,
                'keyframes': [
                    {
                        'time_ms': 0,
                        'left_shoulder_deg': 180,
                        'left_elbow_deg': 270,
                        'right_shoulder_deg': 360,
                        'right_elbow_deg': 450
                    }
                ]
            }
        }
        lines = generate_animation_data(animations)
        content = '\n'.join(lines)
        self.assertIn('{0, 180, 270, 360, 450}', content)

    def test_negative_angle_values(self):
        """Should handle negative angle values correctly."""
        animations = {
            'negative': {
                'name': 'Negative',
                'duration_ms': 1000,
                'loop': False,
                'keyframes': [
                    {
                        'time_ms': 0,
                        'left_shoulder_deg': -10,
                        'left_elbow_deg': -20,
                        'right_shoulder_deg': -30,
                        'right_elbow_deg': -40
                    }
                ]
            }
        }
        lines = generate_animation_data(animations)
        content = '\n'.join(lines)
        self.assertIn('{0, -10, -20, -30, -40}', content)


if __name__ == '__main__':
    unittest.main()
