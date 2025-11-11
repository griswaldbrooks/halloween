# SonarCloud REST API Reference

This document provides comprehensive reference documentation for the SonarCloud REST APIs used in this project, particularly for coverage verification.

**Created:** 2025-11-11
**Base URL:** `https://sonarcloud.io/api`
**Authentication:** Not required for public projects (like griswaldbrooks_halloween)

## Table of Contents

1. [Components API](#components-api)
2. [Measures API](#measures-api)
3. [Project Analyses API](#project-analyses-api)
4. [Quality Gates API](#quality-gates-api)
5. [Common Patterns](#common-patterns)
6. [Error Handling](#error-handling)
7. [Rate Limits](#rate-limits)

---

## Components API

### GET /api/components/tree

Lists all components (files, directories) in a project.

**Purpose:** Get a list of all files that SonarCloud knows about.

**URL:** `https://sonarcloud.io/api/components/tree`

**Parameters:**

| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| component | string | Yes | Project key (e.g., `griswaldbrooks_halloween`) | - |
| qualifiers | string | No | Filter by type: FIL (files), DIR (directories), TRK (project) | All |
| ps | integer | No | Page size (max: 500) | 100 |
| p | integer | No | Page number (1-based) | 1 |

**Response Format:**

```json
{
  "paging": {
    "pageIndex": 1,
    "pageSize": 500,
    "total": 66
  },
  "baseComponent": {
    "organization": "griswaldbrooks",
    "key": "griswaldbrooks_halloween",
    "name": "Halloween Haunted House"
  },
  "components": [
    {
      "organization": "griswaldbrooks",
      "key": "griswaldbrooks_halloween:hatching_egg/animation-behaviors.js",
      "name": "animation-behaviors.js",
      "qualifier": "FIL",
      "path": "hatching_egg/animation-behaviors.js",
      "language": "js"
    }
  ]
}
```

**Field Descriptions:**

- `paging.total`: Total number of components matching the query
- `components[].key`: Unique identifier for the component (used in other API calls)
- `components[].path`: File path from repository root
- `components[].qualifier`: FIL (file), DIR (directory), TRK (project)
- `components[].language`: Programming language (js, py, cpp, etc.)

**Example Usage:**

```bash
# Get all files in the project
curl "https://sonarcloud.io/api/components/tree?component=griswaldbrooks_halloween&qualifiers=FIL&ps=500"

# Get only JavaScript files (note: filtering by language requires multiple calls)
curl "https://sonarcloud.io/api/components/tree?component=griswaldbrooks_halloween&qualifiers=FIL&ps=500" | \
    jq '.components[] | select(.language == "js")'
```

**Pagination:**

The API returns a maximum of 500 items per page. To get all files in a large project:

```python
all_components = []
page = 1
while True:
    response = requests.get(
        'https://sonarcloud.io/api/components/tree',
        params={'component': 'project_key', 'qualifiers': 'FIL', 'ps': 500, 'p': page}
    )
    data = response.json()
    components = data.get('components', [])
    if not components:
        break
    all_components.extend(components)
    if len(all_components) >= data['paging']['total']:
        break
    page += 1
```

---

## Measures API

### GET /api/measures/component

Gets measures (metrics) for a single component.

**Purpose:** Get detailed coverage metrics for a specific file or project.

**URL:** `https://sonarcloud.io/api/measures/component`

**Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| component | string | Yes | Component key | `griswaldbrooks_halloween:window_spider_trigger/server.js` |
| metricKeys | string | Yes | Comma-separated list of metrics | `coverage,lines_to_cover,uncovered_lines` |

**Available Metrics:**

| Metric Key | Description | Example Value |
|------------|-------------|---------------|
| coverage | Overall coverage percentage | `90.7` |
| line_coverage | Line coverage percentage | `92.7` |
| branch_coverage | Branch coverage percentage | `84.6` |
| lines_to_cover | Total lines that can be covered | `41` |
| uncovered_lines | Number of uncovered lines | `3` |
| uncovered_conditions | Number of uncovered branches | `2` |
| conditions_to_cover | Total branches that can be covered | `13` |

**Response Format:**

```json
{
  "component": {
    "id": "AZplaQIVuDnk5Iy3JCv3",
    "key": "griswaldbrooks_halloween:window_spider_trigger/server.js",
    "name": "server.js",
    "qualifier": "FIL",
    "path": "window_spider_trigger/server.js",
    "language": "js",
    "measures": [
      {
        "metric": "coverage",
        "value": "90.7",
        "bestValue": false
      },
      {
        "metric": "lines_to_cover",
        "value": "41"
      },
      {
        "metric": "uncovered_lines",
        "value": "3",
        "bestValue": false
      }
    ]
  }
}
```

**Example Usage:**

```bash
# Get coverage for a specific file
curl "https://sonarcloud.io/api/measures/component?component=griswaldbrooks_halloween:window_spider_trigger/server.js&metricKeys=coverage,lines_to_cover,uncovered_lines,line_coverage,branch_coverage"

# Get project-level coverage
curl "https://sonarcloud.io/api/measures/component?component=griswaldbrooks_halloween&metricKeys=coverage,lines_to_cover,uncovered_lines"
```

**Interpreting Results:**

- If `measures` array is empty, the file exists but has no coverage data
- `bestValue: true` means the metric achieved the best possible value (100% for coverage)
- Some metrics may be missing if not applicable (e.g., no branches to cover)

### GET /api/measures/component_tree

Gets measures for all components in a tree (efficient batch query).

**Purpose:** Get coverage metrics for many files in one API call.

**URL:** `https://sonarcloud.io/api/measures/component_tree`

**Parameters:**

| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| component | string | Yes | Project key | - |
| metricKeys | string | Yes | Comma-separated list of metrics | - |
| qualifiers | string | No | Filter by type (FIL, DIR, etc.) | All |
| ps | integer | No | Page size (max: 500) | 100 |
| p | integer | No | Page number | 1 |

**Response Format:**

```json
{
  "paging": {
    "pageIndex": 1,
    "pageSize": 500,
    "total": 115
  },
  "baseComponent": {
    "key": "griswaldbrooks_halloween"
  },
  "components": [
    {
      "id": "AZplaQIVuDnk5Iy3JCv3",
      "key": "griswaldbrooks_halloween:window_spider_trigger/server.js",
      "name": "server.js",
      "qualifier": "FIL",
      "path": "window_spider_trigger/server.js",
      "language": "js",
      "measures": [
        {
          "metric": "coverage",
          "value": "90.7",
          "bestValue": false
        }
      ]
    }
  ]
}
```

**Key Difference from components/tree:**

- `components/tree`: Returns ALL components (with or without measures)
- `measures/component_tree`: Returns components WITH measures data included

**Example Usage:**

```bash
# Get coverage for all files in one call
curl "https://sonarcloud.io/api/measures/component_tree?component=griswaldbrooks_halloween&metricKeys=coverage,lines_to_cover,uncovered_lines&qualifiers=FIL&ps=500"

# Filter by component prefix (component filter applied client-side after retrieval)
curl "https://sonarcloud.io/api/measures/component_tree?component=griswaldbrooks_halloween&metricKeys=coverage&qualifiers=FIL&ps=500" | \
    jq '.components[] | select(.path | startswith("window_spider_trigger"))'
```

**Performance Note:**

This endpoint is much more efficient than calling `/api/measures/component` for each file individually. Always prefer this for batch queries.

---

## Project Analyses API

### GET /api/project_analyses/search

Gets the history of project analyses.

**Purpose:** See when SonarCloud last analyzed the project, track analysis history.

**URL:** `https://sonarcloud.io/api/project_analyses/search`

**Parameters:**

| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| project | string | Yes | Project key | - |
| ps | integer | No | Number of analyses to return | 100 |

**Response Format:**

```json
{
  "paging": {
    "pageIndex": 1,
    "pageSize": 5,
    "total": 158
  },
  "analyses": [
    {
      "key": "cb2b6fed-6444-4399-ae49-1e082dedeee3",
      "date": "2025-11-11T18:40:28+0000",
      "projectVersion": "not provided",
      "buildString": "not provided",
      "manualNewCodePeriodBaseline": false,
      "revision": "3b6fb48d1c3f2c5c8e1e5e3e3e3e3e3e3e3e3e3e"
    }
  ]
}
```

**Field Descriptions:**

- `analyses[].key`: Unique identifier for this analysis
- `analyses[].date`: ISO 8601 timestamp when analysis completed
- `analyses[].revision`: Git commit hash that was analyzed

**Example Usage:**

```bash
# Get last 5 analyses
curl "https://sonarcloud.io/api/project_analyses/search?project=griswaldbrooks_halloween&ps=5"

# Check when coverage was last updated
curl "https://sonarcloud.io/api/project_analyses/search?project=griswaldbrooks_halloween&ps=1" | \
    jq -r '.analyses[0].date'
```

**Use Cases:**

- Verify CI/CD triggered a new analysis after push
- Debug "coverage not updating" by checking analysis timestamps
- Track analysis frequency

---

## Quality Gates API

### GET /api/qualitygates/project_status

Gets the quality gate status for a project.

**Purpose:** Check if the project passes quality standards, see detailed condition results.

**URL:** `https://sonarcloud.io/api/qualitygates/project_status`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| projectKey | string | Yes | Project key |

**Response Format:**

```json
{
  "projectStatus": {
    "status": "OK",
    "conditions": [
      {
        "status": "OK",
        "metricKey": "new_coverage",
        "comparator": "LT",
        "periodIndex": 1,
        "errorThreshold": "80",
        "actualValue": "92.02709744658677"
      },
      {
        "status": "ERROR",
        "metricKey": "new_maintainability_rating",
        "comparator": "GT",
        "errorThreshold": "1",
        "actualValue": "2"
      }
    ],
    "periods": [
      {
        "index": 1,
        "mode": "previous_version",
        "date": "2025-11-08T23:41:09+0000"
      }
    ],
    "ignoredConditions": false
  }
}
```

**Field Descriptions:**

- `projectStatus.status`: Overall status (OK, WARN, ERROR)
- `conditions[].status`: Status of individual condition (OK, WARN, ERROR)
- `conditions[].metricKey`: Which metric is being evaluated
- `conditions[].comparator`: Comparison operator (LT = less than, GT = greater than)
- `conditions[].errorThreshold`: Threshold value for failure
- `conditions[].actualValue`: Actual measured value

**Common Quality Gate Conditions:**

| Metric Key | Description | Typical Threshold |
|------------|-------------|-------------------|
| new_coverage | Coverage on new code | ≥ 80% |
| new_duplicated_lines_density | Duplication in new code | ≤ 3% |
| new_maintainability_rating | Maintainability rating | A (1) |
| new_reliability_rating | Reliability rating | A (1) |
| new_security_rating | Security rating | A (1) |

**Example Usage:**

```bash
# Check quality gate status
curl "https://sonarcloud.io/api/qualitygates/project_status?projectKey=griswaldbrooks_halloween"

# Check if quality gate passes
curl "https://sonarcloud.io/api/qualitygates/project_status?projectKey=griswaldbrooks_halloween" | \
    jq -r '.projectStatus.status'

# Get new coverage value
curl "https://sonarcloud.io/api/qualitygates/project_status?projectKey=griswaldbrooks_halloween" | \
    jq '.projectStatus.conditions[] | select(.metricKey == "new_coverage") | .actualValue'
```

---

## Common Patterns

### Pattern 1: Get All Files with Coverage

```python
import requests

def get_all_files_with_coverage(project_key):
    """Get all files in project with their coverage metrics."""
    url = 'https://sonarcloud.io/api/measures/component_tree'
    params = {
        'component': project_key,
        'metricKeys': 'coverage,lines_to_cover,uncovered_lines,line_coverage,branch_coverage',
        'qualifiers': 'FIL',
        'ps': 500,
        'p': 1
    }

    all_files = []
    while True:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        components = data.get('components', [])
        if not components:
            break

        all_files.extend(components)

        # Check if we got all files
        paging = data.get('paging', {})
        if len(all_files) >= paging.get('total', 0):
            break

        params['p'] += 1

    return all_files
```

### Pattern 2: Filter by Component/Directory

```python
def get_component_files(project_key, component_prefix):
    """Get files in a specific component (e.g., 'window_spider_trigger')."""
    all_files = get_all_files_with_coverage(project_key)

    # Filter by path prefix
    return [
        f for f in all_files
        if f.get('path', '').startswith(component_prefix)
    ]
```

### Pattern 3: Calculate Average Coverage

```python
def calculate_average_coverage(files):
    """Calculate average coverage across files that have coverage data."""
    files_with_coverage = [
        f for f in files
        if any(m['metric'] == 'coverage' for m in f.get('measures', []))
    ]

    if not files_with_coverage:
        return 0.0

    total_coverage = sum(
        float(m['value'])
        for f in files_with_coverage
        for m in f.get('measures', [])
        if m['metric'] == 'coverage'
    )

    return total_coverage / len(files_with_coverage)
```

### Pattern 4: Compare Local vs SonarCloud

```python
def parse_lcov_file(lcov_path):
    """Parse lcov.info and extract coverage per file."""
    coverage = {}
    current_file = None
    lines_found = 0
    lines_hit = 0

    with open(lcov_path) as f:
        for line in f:
            if line.startswith('SF:'):
                current_file = line[3:].strip()
                lines_found = lines_hit = 0
            elif line.startswith('DA:'):
                parts = line[3:].split(',')
                lines_found += 1
                if int(parts[1]) > 0:
                    lines_hit += 1
            elif line.startswith('end_of_record'):
                if current_file and lines_found > 0:
                    coverage[current_file] = (lines_hit / lines_found) * 100
                current_file = None

    return coverage

def compare_coverage(project_key, lcov_path):
    """Compare local lcov coverage with SonarCloud."""
    local_coverage = parse_lcov_file(lcov_path)
    sonar_files = get_all_files_with_coverage(project_key)

    sonar_coverage = {}
    for f in sonar_files:
        path = f.get('path')
        for m in f.get('measures', []):
            if m['metric'] == 'coverage':
                sonar_coverage[path] = float(m['value'])

    # Compare
    for local_path, local_cov in local_coverage.items():
        if local_path in sonar_coverage:
            sonar_cov = sonar_coverage[local_path]
            diff = sonar_cov - local_cov
            print(f"{local_path}: Local={local_cov:.1f}% Sonar={sonar_cov:.1f}% Diff={diff:+.1f}%")
        else:
            print(f"{local_path}: Local={local_cov:.1f}% Sonar=NOT FOUND")
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid parameters or malformed request |
| 404 | Not Found | Component/project doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | SonarCloud issue (rare) |

### Common Errors

#### Component Not Found

```json
{
  "errors": [
    {
      "msg": "Component 'invalid_key' not found"
    }
  ]
}
```

**Solution:** Verify the component key is correct. Use `/api/components/tree` to list valid keys.

#### Invalid Metric Key

```json
{
  "errors": [
    {
      "msg": "The following metrics are not found: invalid_metric"
    }
  ]
}
```

**Solution:** Check metric key spelling. Valid metrics: coverage, lines_to_cover, uncovered_lines, line_coverage, branch_coverage.

#### Empty Measures Array

```json
{
  "component": {
    "key": "project:file.js",
    "measures": []
  }
}
```

**This is not an error!** It means the file exists in SonarCloud but has no coverage data. Common causes:
- File not included in coverage report (lcov.info)
- File excluded via sonar.coverage.exclusions
- File is not a testable source file (config, HTML, etc.)

---

## Rate Limits

**Public projects:** SonarCloud does not publish specific rate limits for public projects, but reasonable use (< 100 requests/minute) should be fine.

**Best practices:**
- Use batch APIs (`/measures/component_tree`) instead of individual calls
- Cache results when possible
- Implement exponential backoff for 429 errors
- Don't poll continuously (check once per CI run)

**Example exponential backoff:**

```python
import time
import requests

def api_call_with_retry(url, params, max_retries=3):
    """Make API call with exponential backoff on rate limit."""
    for attempt in range(max_retries):
        response = requests.get(url, params=params)

        if response.status_code == 429:
            wait_time = 2 ** attempt  # 1s, 2s, 4s
            print(f"Rate limited, waiting {wait_time}s...")
            time.sleep(wait_time)
            continue

        response.raise_for_status()
        return response.json()

    raise Exception("Max retries exceeded")
```

---

## Additional Resources

**Official Documentation:**
- Web API Reference: https://sonarcloud.io/web_api
- SonarCloud Docs: https://docs.sonarsource.com/sonarcloud/

**Project-Specific:**
- SonarCloud Dashboard: https://sonarcloud.io/dashboard?id=griswaldbrooks_halloween
- Quality Gate: https://sonarcloud.io/quality_gates/show/9
- Coverage Reports: https://sonarcloud.io/component_measures?id=griswaldbrooks_halloween&metric=coverage

**Tools:**
- `tools/sonarcloud_verify.py`: Implementation of these APIs
- `tools/test_sonarcloud_verify.py`: Tests showing API usage patterns

---

## Changelog

**2025-11-11:**
- Initial documentation created
- Documented 4 main API endpoints
- Added common patterns and examples
- Included error handling guide

**Future Additions:**
- Authentication for private projects
- Webhooks API (if needed)
- Issues API (for code smells/bugs)
- Pull request decoration API
