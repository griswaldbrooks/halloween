[![Unit Tests](https://github.com/griswaldbrooks/halloween/actions/workflows/test.yml/badge.svg)](https://github.com/griswaldbrooks/halloween/actions/workflows/test.yml)
[![Code Coverage](https://github.com/griswaldbrooks/halloween/actions/workflows/coverage.yml/badge.svg)](https://github.com/griswaldbrooks/halloween/actions/workflows/coverage.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=griswaldbrooks_halloween&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=griswaldbrooks_halloween)
[![codecov](https://codecov.io/gh/griswaldbrooks/halloween/branch/main/graph/badge.svg)](https://codecov.io/gh/griswaldbrooks/halloween)

# Halloween Haunted House - Reusable Components

A collection of Arduino-based animatronics and effects for annual Halloween haunted house experiences.

## 🎃 Project Structure

This repository is organized for reusability across multiple years:

```
halloween/
├── hatching_egg/              # Hatching spider egg animatronic
├── spider_crawl_projection/   # Browser-based spider walking animation
├── twitching_body/            # Servo-controlled twitching victim
├── window_spider_trigger/     # Motion-triggered video scare
├── 2025/                      # Year-specific materials (layouts, scripts, etc.)
└── [YEAR]/                    # Future years...
```

## ✨ Reusable Components

### Hatching Egg Spider
**Hardware:** DFRobot Beetle + PCA9685 + 4 servos (2 legs)

**Features:**
- 7 animations: zero, max, resting, slow_struggle, breaking_through, grasping, stabbing
- Autonomous idle behavior (cycles resting ↔ slow_struggle)
- Trigger-based hatching sequence (14 steps with progressive speed)
- 241 unit tests

**Quick Start:**
```bash
cd hatching_egg
pixi run upload
pixi run monitor
```

### Spider Crawl Projection
**Tech:** Browser-based procedural animation with WebGL

**Features:**
- Realistic tetrapod gait with inverse kinematics
- Zero leg intersections
- Procedural + keyframe animation modes
- Interactive keyframe editor

**Quick Start:**
```bash
cd spider_crawl_projection
pixi run serve
pixi run open
```

### Twitching Body
**Hardware:** DFRobot Beetle + PCA9685 + 3 servos

**Features:**
- Autonomous slow struggling (50-70% of time)
- Violent thrashing episodes (5% of time)
- Raspberry Pi audio integration
- Extensively tuned for dramatic effect

**Status:** ⚠️ Production-ready but needs tests

**Quick Start:**
```bash
cd twitching_body
pixi run deploy
```

### Window Spider Trigger
**Hardware:** DFRobot Beetle + momentary switch

**Features:**
- Single-video playback system
- Auto-reset after completion
- Node.js server with Socket.IO
- 65.28% test coverage (33 passing tests)

**Status:** ⚠️ Production-ready, test coverage can be improved to 80%

**Quick Start:**
```bash
cd window_spider_trigger
pixi run deploy
```

### CMake Prototype (Experimental)
**Location:** `cmake_prototype/`

**Status:** ✅ Verified working with SonarCloud

A proof-of-concept demonstrating:
- Zero code duplication
- 100% C++ test coverage (21 GoogleTest tests)
- SonarCloud integration that works
- CMake build system
- arduino-cli compatibility

This prototype solves the C++ coverage display issue that hatching_egg currently has. See `cmake_prototype/README.md` for complete documentation and `cmake_prototype/NEXT_AGENT.md` for next steps.

**Quick Start:**
```bash
cd cmake_prototype
pixi run test
pixi run coverage
```

## 🛠️ Development Environment

All projects use **Pixi** for reproducible environments:

```bash
# Install Pixi (one-time)
curl -fsSL https://pixi.sh/install.sh | bash

# Setup any project
cd <project>
pixi install
pixi run setup
```

## 🧪 Testing & Code Coverage

Each project has comprehensive unit tests:

```bash
cd <project>
pixi run test
```

**Current Test Coverage Status:**
- hatching_egg: 92.12% JS, 85.9% C++ (241 tests) ✅
- spider_crawl_projection: 97.55% JS (10 tests) ✅
- window_spider_trigger: 65.28% JS (33 tests) ⚠️ *Can be improved to 80%*
- twitching_body: 0% (needs refactoring) ❌

**Total: 284+ tests across all projects**
**Coverage Goal: 80%+ for all projects**

See `COVERAGE_ISSUES.md` for detailed improvement roadmap.

### Code Coverage

Run coverage locally for **all languages** (JavaScript, C++, Python):

```bash
./scripts/run-coverage.sh
```

Or for individual projects:
```bash
cd window_spider_trigger && pixi run coverage     # ⚠️ JavaScript only (no tests yet)
cd spider_crawl_projection && pixi run coverage   # ✅ JavaScript: 97.55%
cd hatching_egg && pixi run coverage              # ✅ JS: 92.12%, C++: 171 tests, Python: config tests
```

View coverage reports in your browser:
```bash
cd hatching_egg && pixi run view-coverage         # Opens all 3 reports (JS, C++, Python)
cd <other-project> && pixi run view-coverage      # Opens available reports
```

**Multi-Language Coverage:**
- **JavaScript:** c8 (Istanbul) - All projects with JS code
- **C++:** lcov/gcov - hatching_egg (171 gtest unit tests)
- **Python:** coverage.py - hatching_egg (configuration tests)

**Coverage Documentation:**
- 🚀 [NEXT_AGENT_COVERAGE.md](NEXT_AGENT_COVERAGE.md) - Quick-start guide for improving coverage
- 📋 [COVERAGE_ISSUES.md](COVERAGE_ISSUES.md) - Detailed implementation roadmap
- 📝 [COVERAGE.md](COVERAGE.md) - Complete documentation for local coverage

**Coverage Reports:**
- 📊 [SonarCloud Dashboard](https://sonarcloud.io/project/overview?id=griswaldbrooks_halloween) - Code quality & coverage
- 📈 [Codecov](https://codecov.io/gh/griswaldbrooks/halloween) - Visual coverage reports

All coverage metrics are automatically tracked and reported on GitHub PRs.

**For Next Agent:** To continue improving coverage to 80%+ across all projects, start with `NEXT_AGENT_COVERAGE.md` for a comprehensive guide.

## 📋 Year-Specific Materials

Each year's specific content goes in its own folder (e.g., `2025/`):
- Layout maps
- Shopping lists
- Scripts and dialogue
- Event documentation
- Retrospectives

This keeps the reusable components clean and ready for next year!

## 🚀 Getting Started for a New Year

1. **Review reusable components** - Test that they still work
2. **Run all tests** - Ensure nothing broke: `pixi run test` in each project
3. **Create new year folder** - `mkdir 2026/`
4. **Copy templates** - Copy layout maps, shopping lists from previous year
5. **Customize** - Adapt for new theme/layout
6. **Test early** - Run hardware tests well before the event

## 🎯 Hardware Requirements

**Microcontrollers:**
- 3x DFRobot Beetle (Leonardo) - one per animatronic
- 1x Raspberry Pi (optional, for audio)

**Servo Drivers:**
- 2x PCA9685 16-Channel PWM Driver

**Servos:**
- 4x servos for hatching egg (2x HS-322HD, 2x DS-3225MG)
- 3x HS-755MG servos for twitching body

**Other:**
- Momentary switches for triggers
- USB cables and power supplies (5V 5A+ for servos)

## 📚 Documentation

Each project contains comprehensive documentation:
- `README.md` - Quick start and overview
- `AGENT_HANDOFF.md` - Complete technical details
- `TROUBLESHOOTING.md` - Common issues and solutions
- `CHANGELOG.md` - Version history

## 🤝 Contributing

When making changes:
1. Update tests first
2. Run `pixi run test` to ensure nothing breaks
3. Update documentation
4. Commit with descriptive messages

## 📦 Continuous Integration

GitHub Actions automatically runs all unit tests on every push to ensure code quality and prevent regressions.

## 🎃 Past Years

- [2025/](2025/) - Spider haunted house (6 chambers, Cult of Arachne theme)

---

**Ready for years of Halloween fun!** 🕷️👻🎃
