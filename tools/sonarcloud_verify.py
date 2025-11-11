#!/usr/bin/env python3
"""
SonarCloud Verification Tool

Fetches comprehensive project state from SonarCloud API and provides
human-readable reports for verification.

Usage:
    python tools/sonarcloud_verify.py --project griswaldbrooks_halloween
    python tools/sonarcloud_verify.py --project griswaldbrooks_halloween --component hatching_egg
    python tools/sonarcloud_verify.py --project griswaldbrooks_halloween --compare-local window_spider_trigger/coverage/lcov.info
"""

import requests
import argparse
import json
import sys
from typing import Dict, List, Any, Optional
from dataclasses import dataclass


@dataclass
class FileInfo:
    """Information about a file in SonarCloud."""
    key: str
    path: str
    name: str
    language: str
    coverage: Optional[float] = None
    lines_to_cover: Optional[int] = None
    uncovered_lines: Optional[int] = None
    line_coverage: Optional[float] = None
    branch_coverage: Optional[float] = None

    @property
    def has_coverage(self) -> bool:
        """Check if this file has any coverage data."""
        return self.coverage is not None


class SonarCloudClient:
    """Client for interacting with SonarCloud API."""

    BASE_URL = "https://sonarcloud.io/api"

    def __init__(self, organization: str, project_key: str):
        self.organization = organization
        self.project_key = project_key

    def _get(self, endpoint: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Make a GET request to SonarCloud API."""
        url = f"{self.BASE_URL}/{endpoint}"
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

    def _get_paginated(self, endpoint: str, params: Dict[str, Any], max_pages: int = 100) -> List[Dict[str, Any]]:
        """Get all items from a paginated endpoint."""
        all_items = []
        page = 1
        params = params.copy()
        params['ps'] = 500  # Max page size

        while page <= max_pages:
            params['p'] = page
            data = self._get(endpoint, params)

            # Get items from response
            items = data.get('components', [])
            if not items:
                break

            all_items.extend(items)

            # Check if there are more pages
            paging = data.get('paging', {})
            total = paging.get('total', 0)
            page_size = paging.get('pageSize', 500)

            if len(all_items) >= total:
                break

            page += 1

        return all_items

    def get_all_files(self, component_filter: Optional[str] = None) -> List[FileInfo]:
        """Get ALL files in the project with pagination."""
        params = {
            'component': self.project_key,
            'qualifiers': 'FIL'
        }

        components = self._get_paginated('components/tree', params)

        # Filter by component if specified
        if component_filter:
            components = [c for c in components if c.get('path', '').startswith(component_filter)]

        # Convert to FileInfo objects
        files = []
        for c in components:
            files.append(FileInfo(
                key=c['key'],
                path=c['path'],
                name=c['name'],
                language=c.get('language', 'unknown')
            ))

        return files

    def get_file_coverage(self, file_key: str) -> Dict[str, Any]:
        """Get detailed coverage for a specific file."""
        params = {
            'component': file_key,
            'metricKeys': 'coverage,lines_to_cover,uncovered_lines,line_coverage,branch_coverage'
        }

        try:
            data = self._get('measures/component', params)
            component = data.get('component', {})
            measures = {m['metric']: m.get('value') for m in component.get('measures', [])}
            return measures
        except requests.exceptions.HTTPError:
            return {}

    def get_all_coverage(self, component_filter: Optional[str] = None) -> List[FileInfo]:
        """Get coverage for all files in one efficient call."""
        params = {
            'component': self.project_key,
            'metricKeys': 'coverage,lines_to_cover,uncovered_lines,line_coverage,branch_coverage',
            'qualifiers': 'FIL'
        }

        components = self._get_paginated('measures/component_tree', params)

        # Filter by component if specified
        if component_filter:
            components = [c for c in components if c.get('path', '').startswith(component_filter)]

        # Convert to FileInfo objects
        files = []
        for c in components:
            measures = {m['metric']: m.get('value') for m in c.get('measures', [])}

            file_info = FileInfo(
                key=c['key'],
                path=c['path'],
                name=c['name'],
                language=c.get('language', 'unknown')
            )

            # Add coverage data if present
            if 'coverage' in measures:
                file_info.coverage = float(measures['coverage'])
            if 'lines_to_cover' in measures:
                file_info.lines_to_cover = int(float(measures['lines_to_cover']))
            if 'uncovered_lines' in measures:
                file_info.uncovered_lines = int(float(measures['uncovered_lines']))
            if 'line_coverage' in measures:
                file_info.line_coverage = float(measures['line_coverage'])
            if 'branch_coverage' in measures:
                file_info.branch_coverage = float(measures['branch_coverage'])

            files.append(file_info)

        return files

    def get_project_summary(self) -> Dict[str, Any]:
        """Get overall project metrics."""
        params = {
            'component': self.project_key,
            'metricKeys': 'coverage,lines_to_cover,uncovered_lines,line_coverage,branch_coverage'
        }

        data = self._get('measures/component', params)
        component = data.get('component', {})
        measures = {m['metric']: m.get('value') for m in component.get('measures', [])}
        return measures

    def get_recent_analyses(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Get recent analysis history."""
        params = {
            'project': self.project_key,
            'ps': limit
        }

        data = self._get('project_analyses/search', params)
        return data.get('analyses', [])

    def get_quality_gate_status(self) -> Dict[str, Any]:
        """Get quality gate status."""
        params = {
            'projectKey': self.project_key
        }

        data = self._get('qualitygates/project_status', params)
        return data.get('projectStatus', {})


class CoverageVerifier:
    """Verifies and reports on SonarCloud coverage."""

    def __init__(self, client: SonarCloudClient):
        self.client = client

    def verify_file_exists(self, file_path: str) -> bool:
        """Verify a file exists in SonarCloud analysis."""
        files = self.client.get_all_files()
        return any(f.path == file_path for f in files)

    def verify_coverage(self, file_path: str, expected_min: float) -> bool:
        """Verify coverage meets minimum threshold."""
        files = self.client.get_all_coverage()
        file_info = next((f for f in files if f.path == file_path), None)

        if not file_info or not file_info.has_coverage:
            return False

        return file_info.coverage >= expected_min

    def get_coverage_report(self, component: Optional[str] = None) -> str:
        """Generate human-readable coverage report."""
        lines = []

        # Header
        lines.append("=" * 80)
        lines.append("SonarCloud Coverage Report")
        lines.append("=" * 80)
        lines.append(f"Project: {self.client.project_key}")
        if component:
            lines.append(f"Component: {component}")

        # Get recent analysis info
        analyses = self.client.get_recent_analyses(1)
        if analyses:
            lines.append(f"Last Analysis: {analyses[0].get('date')}")

        lines.append("")

        # Get project summary
        summary = self.client.get_project_summary()
        if summary:
            lines.append("Project Summary:")
            lines.append("-" * 80)
            if 'coverage' in summary:
                lines.append(f"Overall Coverage: {summary['coverage']}%")
            if 'lines_to_cover' in summary:
                lines.append(f"Lines to Cover: {summary['lines_to_cover']}")
            if 'uncovered_lines' in summary:
                lines.append(f"Uncovered Lines: {summary['uncovered_lines']}")
            lines.append("")

        # Get all files with coverage
        all_files = self.client.get_all_coverage(component)

        # Separate files with and without coverage
        with_coverage = [f for f in all_files if f.has_coverage]
        without_coverage = [f for f in all_files if not f.has_coverage]

        # Files with coverage
        if with_coverage:
            lines.append("Files with Coverage:")
            lines.append("-" * 80)

            # Sort by coverage (lowest first to highlight problem areas)
            with_coverage.sort(key=lambda f: f.coverage or 0)

            for f in with_coverage:
                status = "✅" if f.coverage >= 80 else "⚠️"
                cov_str = f"{f.coverage:.1f}%" if f.coverage is not None else "N/A"
                lines_str = f"{f.lines_to_cover}" if f.lines_to_cover is not None else "?"
                uncov_str = f"{f.uncovered_lines}" if f.uncovered_lines is not None else "?"

                line = f"{status} {f.path}: {cov_str}"
                line += f" ({lines_str} lines, {uncov_str} uncovered)"

                if f.line_coverage is not None and f.branch_coverage is not None:
                    line += f" [Line: {f.line_coverage:.1f}%, Branch: {f.branch_coverage:.1f}%]"

                lines.append(line)
            lines.append("")

        # Files without coverage
        if without_coverage:
            lines.append("Files Without Coverage:")
            lines.append("-" * 80)
            for f in without_coverage:
                lines.append(f"❌ {f.path} ({f.language})")
            lines.append("")

        # Summary stats
        lines.append("Summary:")
        lines.append("-" * 80)
        lines.append(f"Total Files Analyzed: {len(all_files)}")
        lines.append(f"Files with Coverage: {len(with_coverage)}")
        lines.append(f"Files without Coverage: {len(without_coverage)}")

        if with_coverage:
            avg_coverage = sum(f.coverage for f in with_coverage if f.coverage) / len(with_coverage)
            lines.append(f"Average Coverage (files with data): {avg_coverage:.1f}%")

        return "\n".join(lines)

    def compare_with_local(self, local_lcov_path: str) -> str:
        """Compare SonarCloud coverage with local lcov.info."""
        lines = []

        lines.append("=" * 80)
        lines.append("LOCAL vs SONARCLOUD COMPARISON")
        lines.append("=" * 80)
        lines.append(f"Local file: {local_lcov_path}")
        lines.append("")

        # Parse local lcov.info
        try:
            local_files = self._parse_lcov(local_lcov_path)
        except Exception as e:
            lines.append(f"Error reading local file: {e}")
            return "\n".join(lines)

        # Get SonarCloud data
        sonar_files = {f.path: f for f in self.client.get_all_coverage()}

        # Compare
        lines.append("File Comparison:")
        lines.append("-" * 80)

        for local_path, local_cov in local_files.items():
            if local_path in sonar_files:
                sonar_file = sonar_files[local_path]
                if sonar_file.has_coverage:
                    status = "✅"
                    diff = sonar_file.coverage - local_cov if sonar_file.coverage else 0
                    lines.append(f"{status} {local_path}")
                    lines.append(f"   Local: {local_cov:.1f}% | SonarCloud: {sonar_file.coverage:.1f}% | Diff: {diff:+.1f}%")
                else:
                    lines.append(f"⚠️  {local_path}")
                    lines.append(f"   Local: {local_cov:.1f}% | SonarCloud: NO DATA")
            else:
                lines.append(f"❌ {local_path}")
                lines.append(f"   Local: {local_cov:.1f}% | SonarCloud: FILE NOT FOUND")

        # Files in SonarCloud but not local
        local_paths = set(local_files.keys())
        sonar_only = [path for path in sonar_files.keys() if path not in local_paths]

        if sonar_only:
            lines.append("")
            lines.append("Files in SonarCloud but not in local lcov:")
            lines.append("-" * 80)
            for path in sonar_only:
                sonar_file = sonar_files[path]
                if sonar_file.has_coverage:
                    lines.append(f"  {path}: {sonar_file.coverage:.1f}%")
                else:
                    lines.append(f"  {path}: NO COVERAGE DATA")

        return "\n".join(lines)

    def _parse_lcov(self, lcov_path: str) -> Dict[str, float]:
        """Parse lcov.info file and extract coverage per file."""
        files = {}
        current_file = None
        lines_found = 0
        lines_hit = 0

        with open(lcov_path, 'r') as f:
            for line in f:
                line = line.strip()

                if line.startswith('SF:'):
                    # New file
                    current_file = line[3:]
                    lines_found = 0
                    lines_hit = 0

                elif line.startswith('DA:'):
                    # Line data: DA:line_number,hit_count
                    parts = line[3:].split(',')
                    if len(parts) >= 2:
                        lines_found += 1
                        if int(parts[1]) > 0:
                            lines_hit += 1

                elif line.startswith('end_of_record'):
                    # End of file
                    if current_file and lines_found > 0:
                        coverage = (lines_hit / lines_found) * 100
                        files[current_file] = coverage
                    current_file = None

        return files


def main():
    parser = argparse.ArgumentParser(
        description='Verify SonarCloud coverage state',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Check specific component
  python tools/sonarcloud_verify.py --project griswaldbrooks_halloween --component hatching_egg

  # Check whole project
  python tools/sonarcloud_verify.py --project griswaldbrooks_halloween

  # Compare with local coverage
  python tools/sonarcloud_verify.py --project griswaldbrooks_halloween \\
      --component window_spider_trigger \\
      --compare-local window_spider_trigger/coverage/lcov.info
        """
    )
    parser.add_argument('--project', required=True, help='SonarCloud project key')
    parser.add_argument('--organization', default='griswaldbrooks', help='SonarCloud organization')
    parser.add_argument('--component', help='Specific component to check (e.g., hatching_egg)')
    parser.add_argument('--compare-local', help='Path to local lcov.info for comparison')
    parser.add_argument('--json', action='store_true', help='Output in JSON format')

    args = parser.parse_args()

    try:
        client = SonarCloudClient(args.organization, args.project)
        verifier = CoverageVerifier(client)

        # Generate report
        report = verifier.get_coverage_report(args.component)
        print(report)

        # Compare with local if requested
        if args.compare_local:
            print("\n")
            comparison = verifier.compare_with_local(args.compare_local)
            print(comparison)

        return 0

    except requests.exceptions.RequestException as e:
        print(f"Error communicating with SonarCloud API: {e}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())
