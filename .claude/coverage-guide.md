# Code Coverage Quick Reference for Agents

## Running Coverage Locally

```bash
# All projects at once
./scripts/run-coverage.sh

# Individual projects
cd window_spider_trigger && npm run test:coverage
cd spider_crawl_projection && npm run test:coverage
```

## Checking Coverage Results

```bash
# View summary in terminal
cat window_spider_trigger/coverage/coverage-summary.json | grep -A 5 total

# Open HTML report
xdg-open window_spider_trigger/coverage/index.html
```

## Coverage Tools by Project

| Project | Tool | Config File | Coverage Command |
|---------|------|------------|------------------|
| window_spider_trigger | Jest | jest.config.js | `npm run test:coverage` |
| spider_crawl_projection | c8 | c8.config.json | `npm run test:coverage` |
| hatching_egg | c8 | N/A (inline) | See run-coverage.sh |

## Improving Coverage

When coverage is low:

1. **Identify uncovered code:**
   ```bash
   # Run coverage
   npm run test:coverage

   # Open HTML report to see red/yellow highlighted lines
   xdg-open coverage/index.html
   ```

2. **Add tests for uncovered lines:**
   - Look for untested functions
   - Add test cases for edge cases
   - Test error handling paths

3. **Re-run coverage:**
   ```bash
   npm run test:coverage
   ```

## Common Coverage Issues

### "No tests found"
- Ensure test files match pattern: `**/*.test.js` or `**/test-*.js`
- Check that Jest/c8 is installed: `npm install`

### "Coverage threshold not met"
- Check jest.config.js for thresholds
- Add more tests to increase coverage
- Or adjust thresholds if appropriate

### "Cannot find module"
- Install dependencies: `npm install`
- Check that test imports match actual file paths

## Coverage on GitHub

- **SonarCloud:** Quality gate checks on PRs
- **Codecov:** Visual coverage diffs on PRs
- **GitHub Actions:** Workflow runs on every push

## Files Created

- `sonar-project.properties` - SonarCloud configuration
- `.github/workflows/coverage.yml` - GitHub Actions workflow
- `scripts/run-coverage.sh` - Local coverage script
- `COVERAGE.md` - Full coverage documentation
- `jest.config.js` - Jest configuration (per project)
- `c8.config.json` - c8 configuration (per project)
