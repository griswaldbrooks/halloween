# Code Coverage Guide

This document explains how to use code coverage tools locally and view coverage reports on GitHub.

## Quick Start - Run Coverage Locally

```bash
# Run coverage for all projects
./scripts/run-coverage.sh

# Or run coverage for individual projects using Pixi:
cd window_spider_trigger && pixi run coverage
cd spider_crawl_projection && pixi run coverage
cd hatching_egg && pixi run coverage
```

## Viewing Coverage Reports

### Local HTML Reports

After running coverage, open the HTML reports in your browser:

```bash
# Window Spider Trigger
xdg-open window_spider_trigger/coverage/index.html

# Spider Crawl Projection
xdg-open spider_crawl_projection/coverage/index.html

# Hatching Egg
xdg-open hatching_egg/coverage/index.html
```

### GitHub - SonarCloud

Coverage reports are automatically uploaded to SonarCloud on every push and pull request.

**View on SonarCloud:**
1. Go to https://sonarcloud.io/organizations/griswaldbrooks
2. Select the "Halloween Haunted House" project
3. View coverage metrics, code smells, and quality gates

### GitHub - Codecov

Coverage is also uploaded to Codecov for visual diff reporting.

**Setup Codecov (one-time):**
1. Go to https://codecov.io/
2. Sign in with GitHub
3. Enable the `halloween` repository
4. Copy the upload token
5. Add it to GitHub Secrets as `CODECOV_TOKEN`:
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `CODECOV_TOKEN`
   - Value: (paste token from Codecov)

## Project-Specific Coverage

### Window Spider Trigger
- **Tool:** Jest
- **Config:** `window_spider_trigger/jest.config.js`
- **Run:** `pixi run coverage` or `pixi run test-coverage`
- **View:** `pixi run view-coverage`
- **Coverage thresholds:** 50% (branches, functions, lines, statements)
- **Current Status:** ⚠️ No tests yet (passes with passWithNoTests flag)

### Spider Crawl Projection
- **Tool:** c8 (Istanbul)
- **Config:** Inline in pixi.toml
- **Run:** `pixi run coverage` or `pixi run test-coverage`
- **View:** `pixi run view-coverage`
- **Excludes:** test files, optimization scripts
- **Current Coverage:** ✅ 97.55% (10/10 tests passing)

### Hatching Egg (Multi-Language)
- **JavaScript Coverage:**
  - Tool: c8
  - Run: `pixi run coverage-js-only`
  - Coverage: ✅ 92.12% (41 tests: 31 kinematics + 10 animation)
- **C++ Coverage:**
  - Tool: lcov/gcov
  - Run: `pixi run test-cpp-coverage`
  - Coverage: ✅ 171 tests (44 servo mapping + 34 servo tester + 93 servo sweep)
- **Python Coverage:**
  - Tool: coverage.py
  - Run: `pixi run test-python-coverage`
  - Coverage: ✅ Configuration validation tests
- **Combined:** `pixi run coverage` (runs all three)
- **View Reports:** `pixi run view-coverage` (opens all 3 HTML reports)

### Twitching Body
- **Type:** Arduino-only (C/C++) - No testable coverage
- **Testing:** Hardware integration tests only
- **No coverage task:** Hardware-dependent code only

## SonarCloud Setup (one-time)

If you need to set up SonarCloud from scratch:

1. **Create SonarCloud account:**
   - Go to https://sonarcloud.io/
   - Sign in with GitHub

2. **Create organization:**
   - Create organization `griswaldbrooks`
   - Import the `halloween` repository

3. **Get SONAR_TOKEN:**
   - Go to Account → Security
   - Generate a new token
   - Add to GitHub Secrets as `SONAR_TOKEN`

4. **Verify configuration:**
   - Check `sonar-project.properties` in repo root
   - Ensure projectKey matches: `griswaldbrooks_halloween`

## GitHub Actions Workflow

The coverage workflow (`.github/workflows/coverage.yml`) automatically:
1. Runs tests with coverage for all projects
2. Uploads coverage to Codecov
3. Runs SonarCloud analysis
4. Uploads coverage artifacts for download
5. Provides a summary in the workflow output

## Coverage Metrics

Current coverage targets:
- **Minimum:** 50% across all metrics
- **Goal:** 70%+ coverage on critical paths
- **Focus areas:**
  - Core animation logic
  - Kinematics calculations
  - Server/client communication
  - Hardware trigger handling

## Troubleshooting

### Coverage not generating

If coverage reports aren't being generated:

```bash
# Ensure pixi environment is set up
pixi install

# Run coverage using pixi (recommended)
pixi run coverage

# Or if you need to reinstall dependencies
cd window_spider_trigger
pixi run install
pixi run coverage

# Same for other projects
cd spider_crawl_projection
pixi install
pixi run coverage
```

### SonarCloud analysis failing

Check these common issues:
1. Ensure `SONAR_TOKEN` is set in GitHub Secrets
2. Verify `sonar-project.properties` has correct projectKey
3. Check that coverage files exist before SonarCloud step
4. Review workflow logs for specific errors

### Codecov upload failing

1. Verify `CODECOV_TOKEN` is set in GitHub Secrets
2. Check that lcov.info files are generated
3. Try running locally: `bash <(curl -s https://codecov.io/bash)`

## For AI Agents

To run coverage and check results:

```bash
# Run coverage for all projects
./scripts/run-coverage.sh

# Or run for a specific project
cd <project> && pixi run coverage

# Check coverage percentage (example)
cat window_spider_trigger/coverage/coverage-summary.json

# View coverage report in browser
pixi run view-coverage

# Fix uncovered code
# 1. Review coverage report HTML (pixi run view-coverage)
# 2. Add tests for uncovered lines
# 3. Re-run coverage to verify improvement (pixi run coverage)
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [c8 (Istanbul) Documentation](https://github.com/bcoe/c8)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [Codecov Documentation](https://docs.codecov.com/)
