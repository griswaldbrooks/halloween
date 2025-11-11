#!/usr/bin/env python3
"""
Tests for SonarCloud Verification Tool

Run with: python -m pytest tools/test_sonarcloud_verify.py -v
"""

import pytest
import json
from unittest.mock import Mock, patch, mock_open
from sonarcloud_verify import (
    SonarCloudClient,
    CoverageVerifier,
    FileInfo
)


class TestSonarCloudClient:
    """Tests for SonarCloudClient."""

    def setup_method(self):
        """Set up test fixtures."""
        self.client = SonarCloudClient('test-org', 'test-project')

    @patch('sonarcloud_verify.requests.get')
    def test_get_all_files_single_page(self, mock_get):
        """Test getting all files when results fit in one page."""
        mock_response = Mock()
        mock_response.json.return_value = {
            'paging': {'pageIndex': 1, 'pageSize': 500, 'total': 2},
            'components': [
                {
                    'key': 'project:file1.js',
                    'path': 'src/file1.js',
                    'name': 'file1.js',
                    'language': 'js'
                },
                {
                    'key': 'project:file2.py',
                    'path': 'src/file2.py',
                    'name': 'file2.py',
                    'language': 'py'
                }
            ]
        }
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        files = self.client.get_all_files()

        assert len(files) == 2
        assert files[0].path == 'src/file1.js'
        assert files[0].language == 'js'
        assert files[1].path == 'src/file2.py'
        assert files[1].language == 'py'

        # Verify API call
        mock_get.assert_called_once()
        args, kwargs = mock_get.call_args
        assert 'params' in kwargs
        assert kwargs['params']['component'] == 'test-project'
        assert kwargs['params']['qualifiers'] == 'FIL'

    @patch('sonarcloud_verify.requests.get')
    def test_get_all_files_with_component_filter(self, mock_get):
        """Test filtering files by component."""
        mock_response = Mock()
        mock_response.json.return_value = {
            'paging': {'pageIndex': 1, 'pageSize': 500, 'total': 3},
            'components': [
                {'key': 'p:hatching_egg/file1.js', 'path': 'hatching_egg/file1.js', 'name': 'file1.js', 'language': 'js'},
                {'key': 'p:window_spider/file2.js', 'path': 'window_spider/file2.js', 'name': 'file2.js', 'language': 'js'},
                {'key': 'p:hatching_egg/file3.js', 'path': 'hatching_egg/file3.js', 'name': 'file3.js', 'language': 'js'}
            ]
        }
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        files = self.client.get_all_files(component_filter='hatching_egg')

        assert len(files) == 2
        assert all('hatching_egg' in f.path for f in files)

    @patch('sonarcloud_verify.requests.get')
    def test_get_file_coverage(self, mock_get):
        """Test getting coverage for a specific file."""
        mock_response = Mock()
        mock_response.json.return_value = {
            'component': {
                'measures': [
                    {'metric': 'coverage', 'value': '92.5'},
                    {'metric': 'lines_to_cover', 'value': '100'},
                    {'metric': 'uncovered_lines', 'value': '8'}
                ]
            }
        }
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        coverage = self.client.get_file_coverage('project:file.js')

        assert coverage['coverage'] == '92.5'
        assert coverage['lines_to_cover'] == '100'
        assert coverage['uncovered_lines'] == '8'

    @patch('sonarcloud_verify.requests.get')
    def test_get_all_coverage(self, mock_get):
        """Test getting coverage for all files."""
        mock_response = Mock()
        mock_response.json.return_value = {
            'paging': {'pageIndex': 1, 'pageSize': 500, 'total': 2},
            'components': [
                {
                    'key': 'p:file1.js',
                    'path': 'src/file1.js',
                    'name': 'file1.js',
                    'language': 'js',
                    'measures': [
                        {'metric': 'coverage', 'value': '90.5'},
                        {'metric': 'lines_to_cover', 'value': '50'},
                        {'metric': 'uncovered_lines', 'value': '5'}
                    ]
                },
                {
                    'key': 'p:file2.js',
                    'path': 'src/file2.js',
                    'name': 'file2.js',
                    'language': 'js',
                    'measures': []
                }
            ]
        }
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        files = self.client.get_all_coverage()

        assert len(files) == 2
        assert files[0].has_coverage
        assert files[0].coverage == 90.5
        assert files[0].lines_to_cover == 50
        assert files[0].uncovered_lines == 5
        assert not files[1].has_coverage

    @patch('sonarcloud_verify.requests.get')
    def test_get_project_summary(self, mock_get):
        """Test getting project summary metrics."""
        mock_response = Mock()
        mock_response.json.return_value = {
            'component': {
                'measures': [
                    {'metric': 'coverage', 'value': '91.8'},
                    {'metric': 'lines_to_cover', 'value': '2130'}
                ]
            }
        }
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        summary = self.client.get_project_summary()

        assert summary['coverage'] == '91.8'
        assert summary['lines_to_cover'] == '2130'

    @patch('sonarcloud_verify.requests.get')
    def test_get_recent_analyses(self, mock_get):
        """Test getting recent analysis history."""
        mock_response = Mock()
        mock_response.json.return_value = {
            'analyses': [
                {'date': '2025-11-11T18:40:28+0000', 'key': 'analysis1'},
                {'date': '2025-11-11T16:28:02+0000', 'key': 'analysis2'}
            ]
        }
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        analyses = self.client.get_recent_analyses(2)

        assert len(analyses) == 2
        assert analyses[0]['key'] == 'analysis1'

    @patch('sonarcloud_verify.requests.get')
    def test_get_quality_gate_status(self, mock_get):
        """Test getting quality gate status."""
        mock_response = Mock()
        mock_response.json.return_value = {
            'projectStatus': {
                'status': 'OK',
                'conditions': [
                    {'metricKey': 'new_coverage', 'status': 'OK', 'actualValue': '92.0'}
                ]
            }
        }
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        status = self.client.get_quality_gate_status()

        assert status['status'] == 'OK'
        assert len(status['conditions']) == 1


class TestCoverageVerifier:
    """Tests for CoverageVerifier."""

    def setup_method(self):
        """Set up test fixtures."""
        self.client = Mock(spec=SonarCloudClient)
        self.client.project_key = 'test-project'
        self.verifier = CoverageVerifier(self.client)

    def test_verify_file_exists_found(self):
        """Test verifying file exists when it does."""
        self.client.get_all_files.return_value = [
            FileInfo('p:file1.js', 'src/file1.js', 'file1.js', 'js'),
            FileInfo('p:file2.js', 'src/file2.js', 'file2.js', 'js')
        ]

        assert self.verifier.verify_file_exists('src/file1.js')

    def test_verify_file_exists_not_found(self):
        """Test verifying file exists when it doesn't."""
        self.client.get_all_files.return_value = [
            FileInfo('p:file1.js', 'src/file1.js', 'file1.js', 'js')
        ]

        assert not self.verifier.verify_file_exists('src/missing.js')

    def test_verify_coverage_meets_threshold(self):
        """Test verifying coverage meets minimum threshold."""
        file_info = FileInfo('p:file1.js', 'src/file1.js', 'file1.js', 'js')
        file_info.coverage = 85.0
        self.client.get_all_coverage.return_value = [file_info]

        assert self.verifier.verify_coverage('src/file1.js', 80.0)

    def test_verify_coverage_below_threshold(self):
        """Test verifying coverage below threshold."""
        file_info = FileInfo('p:file1.js', 'src/file1.js', 'file1.js', 'js')
        file_info.coverage = 75.0
        self.client.get_all_coverage.return_value = [file_info]

        assert not self.verifier.verify_coverage('src/file1.js', 80.0)

    def test_verify_coverage_no_data(self):
        """Test verifying coverage when no data exists."""
        file_info = FileInfo('p:file1.js', 'src/file1.js', 'file1.js', 'js')
        # No coverage data
        self.client.get_all_coverage.return_value = [file_info]

        assert not self.verifier.verify_coverage('src/file1.js', 80.0)

    def test_get_coverage_report(self):
        """Test generating coverage report."""
        # Mock data
        file_with_cov = FileInfo('p:file1.js', 'src/file1.js', 'file1.js', 'js')
        file_with_cov.coverage = 90.5
        file_with_cov.lines_to_cover = 50
        file_with_cov.uncovered_lines = 5

        file_without_cov = FileInfo('p:file2.js', 'src/file2.js', 'file2.js', 'js')

        self.client.get_all_coverage.return_value = [file_with_cov, file_without_cov]
        self.client.get_project_summary.return_value = {
            'coverage': '85.0',
            'lines_to_cover': '100'
        }
        self.client.get_recent_analyses.return_value = [
            {'date': '2025-11-11T18:40:28+0000'}
        ]

        report = self.verifier.get_coverage_report()

        # Check report contains expected sections
        assert 'SonarCloud Coverage Report' in report
        assert 'Project Summary' in report
        assert 'Files with Coverage' in report
        assert 'Files Without Coverage' in report
        assert 'src/file1.js' in report
        assert 'src/file2.js' in report
        assert '90.5%' in report

    def test_parse_lcov(self):
        """Test parsing lcov.info file."""
        lcov_content = """TN:
SF:src/file1.js
DA:1,1
DA:2,1
DA:3,0
DA:4,1
end_of_record
SF:src/file2.js
DA:1,1
DA:2,1
end_of_record
"""
        with patch('builtins.open', mock_open(read_data=lcov_content)):
            files = self.verifier._parse_lcov('fake_path.info')

        assert 'src/file1.js' in files
        assert files['src/file1.js'] == 75.0  # 3 of 4 lines hit
        assert 'src/file2.js' in files
        assert files['src/file2.js'] == 100.0  # 2 of 2 lines hit

    def test_compare_with_local_matching(self):
        """Test comparing local and SonarCloud coverage when they match."""
        lcov_content = """TN:
SF:src/file1.js
DA:1,1
DA:2,1
DA:3,0
DA:4,1
end_of_record
"""
        file_info = FileInfo('p:file1.js', 'src/file1.js', 'file1.js', 'js')
        file_info.coverage = 75.0

        self.client.get_all_coverage.return_value = [file_info]

        with patch('builtins.open', mock_open(read_data=lcov_content)):
            comparison = self.verifier.compare_with_local('fake.info')

        assert 'LOCAL vs SONARCLOUD COMPARISON' in comparison
        assert 'src/file1.js' in comparison
        assert '75.0%' in comparison

    def test_compare_with_local_missing_in_sonar(self):
        """Test comparing when local file is missing in SonarCloud."""
        lcov_content = """TN:
SF:src/missing.js
DA:1,1
DA:2,1
end_of_record
"""
        self.client.get_all_coverage.return_value = []

        with patch('builtins.open', mock_open(read_data=lcov_content)):
            comparison = self.verifier.compare_with_local('fake.info')

        assert 'src/missing.js' in comparison
        assert 'FILE NOT FOUND' in comparison


class TestFileInfo:
    """Tests for FileInfo dataclass."""

    def test_has_coverage_with_data(self):
        """Test has_coverage returns True when coverage data exists."""
        file_info = FileInfo('key', 'path', 'name', 'js')
        file_info.coverage = 90.0

        assert file_info.has_coverage

    def test_has_coverage_without_data(self):
        """Test has_coverage returns False when no coverage data."""
        file_info = FileInfo('key', 'path', 'name', 'js')

        assert not file_info.has_coverage


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
