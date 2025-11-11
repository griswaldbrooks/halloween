#!/usr/bin/env python3
"""
GCOV File Diagnostic Tool

Validates .gcov files and checks path compatibility with SonarCloud.

Usage:
    python tools/gcov_diagnostic.py hatching_egg
"""

import sys
import os
import glob
from typing import List, Dict, Optional
from dataclasses import dataclass


@dataclass
class GcovFile:
    """Represents a .gcov file with metadata."""
    filename: str
    source_path: Optional[str] = None
    total_lines: int = 0
    executed_lines: int = 0
    has_coverage: bool = False

    @property
    def coverage_percent(self) -> float:
        """Calculate coverage percentage."""
        if self.total_lines == 0:
            return 0.0
        return (self.executed_lines / self.total_lines) * 100.0


def parse_gcov_file(filepath: str) -> GcovFile:
    """Parse a .gcov file and extract metadata."""
    gcov = GcovFile(filename=filepath)

    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                # Extract Source: path (first line usually)
                if line.strip().startswith('-:    0:Source:'):
                    gcov.source_path = line.split('Source:')[1].strip()

                # Count executable lines
                if not line.startswith(' ' * 8 + '-:'):  # Not a non-executable line
                    parts = line.split(':', 2)
                    if len(parts) >= 2:
                        try:
                            execution_count = parts[0].strip()
                            if execution_count != '-' and execution_count != '':
                                gcov.total_lines += 1
                                if execution_count != '#####' and execution_count != '=====' and int(execution_count.replace('*', '')) > 0:
                                    gcov.executed_lines += 1
                                    gcov.has_coverage = True
                        except ValueError:
                            pass

    except Exception as e:
        print(f"Warning: Error parsing {filepath}: {e}")

    return gcov


def find_gcov_files(project_dir: str) -> List[str]:
    """Find all .gcov files in project directory."""
    patterns = [
        f'{project_dir}/*.gcov',
        f'{project_dir}/**/*.gcov',
    ]

    files = []
    for pattern in patterns:
        files.extend(glob.glob(pattern, recursive=True))

    return files


def get_sonarcloud_expected_paths(project_dir: str) -> List[str]:
    """Get list of source paths that SonarCloud expects."""
    # This is what SonarCloud uses as file keys
    # Format: project_name/path/to/file.h
    base_name = os.path.basename(project_dir)

    expected = []

    # Find actual source files
    for ext in ['.h', '.hpp', '.cpp', '.cc', '.cxx']:
        for root, dirs, files in os.walk(project_dir):
            # Skip .pixi and test directories
            if '.pixi' in root or '__pycache__' in root:
                continue

            for file in files:
                if file.endswith(ext):
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, os.path.dirname(project_dir))
                    expected.append(rel_path)

    return expected


def main():
    if len(sys.argv) < 2:
        print("Usage: python tools/gcov_diagnostic.py <project_dir>")
        print("Example: python tools/gcov_diagnostic.py hatching_egg")
        return 1

    project_dir = sys.argv[1]

    if not os.path.isdir(project_dir):
        print(f"Error: {project_dir} is not a directory")
        return 1

    print("=" * 80)
    print("GCOV FILE DIAGNOSTIC REPORT")
    print("=" * 80)
    print(f"Project Directory: {project_dir}")
    print()

    # Find all .gcov files
    gcov_files = find_gcov_files(project_dir)
    print(f"Found {len(gcov_files)} .gcov files")
    print()

    # Parse each .gcov file
    parsed_files = []
    for filepath in gcov_files:
        gcov = parse_gcov_file(filepath)
        parsed_files.append(gcov)

    # Filter to only relevant source files (not stdlib)
    project_gcov = [g for g in parsed_files if g.source_path and project_dir in g.source_path]

    print("GCOV Files for Project Source:")
    print("-" * 80)
    for gcov in project_gcov:
        status = "✅" if gcov.has_coverage else "❌"
        cov_pct = gcov.coverage_percent
        print(f"{status} Source: {gcov.source_path}")
        print(f"   Coverage: {cov_pct:.1f}% ({gcov.executed_lines}/{gcov.total_lines} lines)")
        print(f"   .gcov file: {os.path.basename(gcov.filename)}")
        print()

    # Expected paths
    expected_paths = get_sonarcloud_expected_paths(project_dir)
    print("Expected Source Paths (SonarCloud format):")
    print("-" * 80)
    for path in sorted(expected_paths):
        print(f"  {path}")
    print()

    # Path matching analysis
    print("Path Matching Analysis:")
    print("-" * 80)

    gcov_sources = {g.source_path for g in project_gcov if g.source_path}

    matched = []
    unmatched_expected = []
    unmatched_gcov = []

    for expected in expected_paths:
        # Check if any gcov source matches
        found = False
        for gcov_src in gcov_sources:
            if expected in gcov_src or gcov_src.endswith(expected):
                matched.append((expected, gcov_src))
                found = True
                break

        if not found:
            unmatched_expected.append(expected)

    # Find gcov files not matching expected
    for gcov_src in gcov_sources:
        found = False
        for expected in expected_paths:
            if expected in gcov_src or gcov_src.endswith(expected):
                found = True
                break
        if not found:
            unmatched_gcov.append(gcov_src)

    print(f"Matched: {len(matched)}")
    print(f"Expected but no .gcov: {len(unmatched_expected)}")
    print(f".gcov but not in expected: {len(unmatched_gcov)}")
    print()

    if matched:
        print("Matched Paths:")
        for expected, gcov_src in matched:
            print(f"  ✅ {expected}")
            print(f"     .gcov Source: {gcov_src}")
        print()

    if unmatched_expected:
        print("WARNING: Expected but NO .gcov file found:")
        for path in unmatched_expected:
            print(f"  ❌ {path}")
        print()

    if unmatched_gcov:
        print("INFO: .gcov files not matching expected paths:")
        for path in unmatched_gcov:
            print(f"  ⚠️  {path}")
        print()

    # Summary
    print("Summary:")
    print("-" * 80)
    print(f"Total .gcov files: {len(gcov_files)}")
    print(f"Project source .gcov files: {len(project_gcov)}")
    print(f"Files with coverage data: {len([g for g in project_gcov if g.has_coverage])}")
    print(f"Files without coverage: {len([g for g in project_gcov if not g.has_coverage])}")

    return 0


if __name__ == '__main__':
    sys.exit(main())
