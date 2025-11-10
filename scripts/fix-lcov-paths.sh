#!/bin/bash
# Fix LCOV paths to be relative to repository root for SonarCloud
# This script is idempotent - safe to run multiple times

# Fix window_spider_trigger paths (only if not already prefixed)
if [ -f "window_spider_trigger/coverage/lcov.info" ]; then
  echo "Fixing paths in window_spider_trigger/coverage/lcov.info..."
  # Only add prefix if line doesn't already start with "SF:window_spider_trigger/"
  sed -i '/^SF:window_spider_trigger\//!s|^SF:|SF:window_spider_trigger/|g' window_spider_trigger/coverage/lcov.info
  echo "✓ Fixed window_spider_trigger paths"
fi

# Fix spider_crawl_projection paths (only if not already prefixed)
if [ -f "spider_crawl_projection/coverage/lcov.info" ]; then
  echo "Fixing paths in spider_crawl_projection/coverage/lcov.info..."
  # Only add prefix if line doesn't already start with "SF:spider_crawl_projection/"
  sed -i '/^SF:spider_crawl_projection\//!s|^SF:|SF:spider_crawl_projection/|g' spider_crawl_projection/coverage/lcov.info
  echo "✓ Fixed spider_crawl_projection paths"
fi

# Fix hatching_egg paths (only if not already prefixed)
if [ -f "hatching_egg/coverage-js/lcov.info" ]; then
  echo "Fixing paths in hatching_egg/coverage-js/lcov.info..."
  # Only add prefix if line doesn't already start with "SF:hatching_egg/"
  sed -i '/^SF:hatching_egg\//!s|^SF:|SF:hatching_egg/|g' hatching_egg/coverage-js/lcov.info
  echo "✓ Fixed hatching_egg paths"
fi

echo "✓ All LCOV paths fixed for SonarCloud"
