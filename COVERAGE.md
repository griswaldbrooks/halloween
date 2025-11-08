# Code Coverage Guide

This document explains how to use code coverage tools locally and view coverage reports on GitHub.

## Quick Start - Run Coverage Locally

```bash
# Run coverage for all projects
./scripts/run-coverage.sh

# Or run coverage for individual projects:
cd window_spider_trigger && npm run test:coverage
cd spider_crawl_projection && npm run test:coverage
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
- **Run:** `npm run test:coverage`
- **Coverage thresholds:** 50% (branches, functions, lines, statements)

### Spider Crawl Projection
- **Tool:** c8 (Istanbul for ESM)
- **Config:** `spider_crawl_projection/c8.config.json`
- **Run:** `npm run test:coverage`
- **Excludes:** test files, optimization scripts

### Hatching Egg
- **Tool:** c8 (for JavaScript files only)
- **Coverage for:** JavaScript kinematics and animation logic
- **Excludes:** C++ tests, Arduino code, Python scripts
- **Note:** C++ tests use gtest but coverage not tracked

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
# Ensure dependencies are installed
npm install

# Window Spider Trigger
cd window_spider_trigger
npm install jest @jest/globals supertest
npm run test:coverage

# Spider Crawl Projection
cd spider_crawl_projection
npm install c8
npm run test:coverage
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
# Run coverage
./scripts/run-coverage.sh

# Check coverage percentage (example)
cat window_spider_trigger/coverage/coverage-summary.json

# Fix uncovered code
# 1. Review coverage report HTML
# 2. Add tests for uncovered lines
# 3. Re-run coverage to verify improvement
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [c8 (Istanbul) Documentation](https://github.com/bcoe/c8)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [Codecov Documentation](https://docs.codecov.com/)
