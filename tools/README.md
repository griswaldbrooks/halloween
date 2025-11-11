# Project Tools

This directory contains utility tools for the Halloween animatronics project.

## sonarcloud_verify.py

**Purpose:** Verifies SonarCloud coverage state by querying the SonarCloud API directly, providing reliable verification of what SonarCloud actually knows about project coverage.

**Why This Tool Exists:**
- SonarCloud web UI updates are delayed and can be confusing
- Need programmatic access to verify coverage integration works
- API provides ground truth for coverage state
- Enables automated verification in CI/CD
- Allows comparing local coverage reports with SonarCloud state

### Requirements

```bash
pip install requests pytest
```

Or use your system's Python packages:

```bash
# Already available on most systems
python3 -c "import requests" 2>/dev/null && echo "✅ requests installed" || echo "❌ Install with: pip install requests"
```

### Usage

#### Check Specific Component

```bash
# Check hatching_egg coverage
python tools/sonarcloud_verify.py \
    --project griswaldbrooks_halloween \
    --component hatching_egg

# Check window_spider_trigger coverage
python tools/sonarcloud_verify.py \
    --project griswaldbrooks_halloween \
    --component window_spider_trigger

# Check spider_crawl_projection coverage
python tools/sonarcloud_verify.py \
    --project griswaldbrooks_halloween \
    --component spider_crawl_projection
```

#### Check Whole Project

```bash
python tools/sonarcloud_verify.py \
    --project griswaldbrooks_halloween
```

#### Compare with Local Coverage

```bash
python tools/sonarcloud_verify.py \
    --project griswaldbrooks_halloween \
    --component window_spider_trigger \
    --compare-local window_spider_trigger/coverage/lcov.info
```

### Output Format

The tool provides:

1. **Project Summary:** Overall coverage metrics
2. **Files with Coverage:** List of all files that have coverage data in SonarCloud
   - ✅ = Coverage ≥ 80% (good)
   - ⚠️ = Coverage < 80% (needs improvement)
   - Shows: percentage, lines to cover, uncovered lines, branch coverage
3. **Files Without Coverage:** Files that SonarCloud knows about but have no coverage data
4. **Summary Statistics:** Total files, average coverage, etc.

Example output:

```
================================================================================
SonarCloud Coverage Report
================================================================================
Project: griswaldbrooks_halloween
Component: window_spider_trigger
Last Analysis: 2025-11-11T18:40:28+0000

Project Summary:
--------------------------------------------------------------------------------
Overall Coverage: 91.8%
Lines to Cover: 2130
Uncovered Lines: 173

Files with Coverage:
--------------------------------------------------------------------------------
✅ window_spider_trigger/server.js: 90.7% (41 lines, 3 uncovered) [Line: 92.7%, Branch: 84.6%]
✅ window_spider_trigger/lib/SerialPortManager.js: 99.0% (77 lines, 0 uncovered) [Line: 100.0%, Branch: 95.5%]
✅ window_spider_trigger/lib/SocketIOHandler.js: 100.0% (26 lines, 0 uncovered) [Line: 100.0%, Branch: 100.0%]

Files Without Coverage:
--------------------------------------------------------------------------------
❌ window_spider_trigger/public/client.js (js)
❌ window_spider_trigger/jest.config.js (js)
...

Summary:
--------------------------------------------------------------------------------
Total Files Analyzed: 12
Files with Coverage: 3
Files without Coverage: 9
Average Coverage (files with data): 96.6%
```

### API Endpoints Used

The tool uses these SonarCloud REST APIs (no authentication required for public projects):

1. **components/tree** - Lists all files in the project
2. **measures/component_tree** - Gets coverage metrics for all files (efficient batch query)
3. **measures/component** - Gets detailed metrics for a single file or project
4. **project_analyses/search** - Gets analysis history
5. **qualitygates/project_status** - Gets quality gate status

See `tools/SONARCLOUD_API.md` for detailed API documentation.

### Testing

The tool includes comprehensive tests:

```bash
# Run tests
cd /home/griswald/personal/halloween
python -m pytest tools/test_sonarcloud_verify.py -v

# Run tests with coverage
python -m pytest tools/test_sonarcloud_verify.py -v --cov=tools.sonarcloud_verify --cov-report=term
```

Test coverage: 18 tests covering:
- API client functionality
- Pagination handling
- Coverage verification
- Report generation
- Local vs SonarCloud comparison
- lcov.info parsing

### Common Use Cases

#### 1. Verify Coverage Integration After CI Push

```bash
# After pushing code and waiting for CI to complete
python tools/sonarcloud_verify.py \
    --project griswaldbrooks_halloween \
    --component window_spider_trigger
```

Look for your files in the "Files with Coverage" section. If they're in "Files Without Coverage", the integration isn't working.

#### 2. Debug "SonarCloud Shows 0% Coverage" Issues

```bash
# Check what SonarCloud actually has
python tools/sonarcloud_verify.py \
    --project griswaldbrooks_halloween \
    --component your_project

# Compare with local coverage
python tools/sonarcloud_verify.py \
    --project griswaldbrooks_halloween \
    --component your_project \
    --compare-local your_project/coverage/lcov.info
```

Common issues revealed:
- Files in SonarCloud but no coverage data → Coverage upload not working
- Files not in SonarCloud at all → Not analyzed by SonarCloud
- Path mismatch between local and SonarCloud → lcov.info paths need fixing

#### 3. Verify All Projects Have Adequate Coverage

```bash
# Check each project
for project in hatching_egg window_spider_trigger spider_crawl_projection; do
    echo "=== Checking $project ==="
    python tools/sonarcloud_verify.py \
        --project griswaldbrooks_halloween \
        --component $project | grep "Average Coverage"
done
```

#### 4. CI/CD Integration

Add to `.github/workflows/coverage.yml`:

```yaml
- name: Verify SonarCloud Coverage
  run: |
    python tools/sonarcloud_verify.py \
      --project griswaldbrooks_halloween \
      --component ${{ matrix.project }} > sonarcloud_report.txt
    cat sonarcloud_report.txt

    # Fail if average coverage is below threshold
    if grep -q "Average Coverage.*: [0-7][0-9]\." sonarcloud_report.txt; then
      echo "❌ Coverage below 80%"
      exit 1
    fi
```

### Troubleshooting

#### "Error communicating with SonarCloud API"

- Check internet connection
- Verify project key is correct: `griswaldbrooks_halloween`
- Check if SonarCloud is down: https://status.sonarcloud.io/

#### "FILE NOT FOUND" in local comparison

The local lcov.info file uses relative paths (e.g., `server.js`) but SonarCloud uses absolute paths from repo root (e.g., `window_spider_trigger/server.js`). This is expected and indicates the paths in your lcov.info need the project prefix.

Use the `scripts/fix-lcov-paths.sh` script before uploading to SonarCloud:

```bash
cd window_spider_trigger
../scripts/fix-lcov-paths.sh coverage/lcov.info window_spider_trigger
```

#### No coverage data for source files

If your `.js` files show "NO COVERAGE DATA":
1. Check that tests are generating coverage (`coverage/lcov.info` exists)
2. Verify lcov.info has correct paths (use `--compare-local`)
3. Check CI workflow uploads coverage to SonarCloud
4. Verify `sonar-project.properties` has correct coverage paths

### Tool Philosophy

This tool embodies the project's "build tools to verify state" philosophy:

**Instead of:** "I can't tell if SonarCloud has the coverage data"
**Do:** "Let me query the API and show exactly what's there"

**Instead of:** "The UI looks wrong but I can't verify"
**Do:** "Let me build a tool that gives me ground truth"

When something is hard to verify manually:
1. **Explore the APIs** - Read documentation, test endpoints
2. **Build a tool** - Create a script to get the data you need
3. **Test the tool** - Write tests to ensure it works correctly
4. **Integrate it** - Make it easy to run (documentation, pixi tasks)
5. **Maintain it** - Keep it working as APIs change

See `tools/SONARCLOUD_API.md` for detailed API reference documentation.

### Future Enhancements

Potential improvements:
- Add JSON output mode for easier CI integration
- Add coverage trend tracking (compare across analyses)
- Add automatic fix suggestions for common issues
- Add support for multiple projects at once
- Add visualization of coverage over time
- Add alerting for coverage regressions

---

**Created:** 2025-11-11
**Purpose:** Reliable verification of SonarCloud state
**Philosophy:** Build tools to get ground truth, don't guess from UIs
