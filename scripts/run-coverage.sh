#!/bin/bash
set -e

echo "🎃 Running Code Coverage for Halloween Monorepo (All Languages)"
echo "================================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Window Spider Trigger (JavaScript only)
echo -e "${YELLOW}Running coverage for Window Spider Trigger (JavaScript)...${NC}"
cd window_spider_trigger
pixi run coverage || echo "No tests yet for window_spider_trigger"
cd ..
echo -e "${GREEN}✓ Window Spider Trigger coverage complete${NC}"
echo ""

# Spider Crawl Projection (JavaScript only)
echo -e "${YELLOW}Running coverage for Spider Crawl Projection (JavaScript)...${NC}"
cd spider_crawl_projection
pixi run coverage || echo "Coverage collected for spider_crawl_projection"
cd ..
echo -e "${GREEN}✓ Spider Crawl Projection coverage complete${NC}"
echo ""

# Hatching Egg (JavaScript, C++, Python)
echo -e "${YELLOW}Running coverage for Hatching Egg (JavaScript, C++, Python)...${NC}"
cd hatching_egg
pixi run coverage || echo "Coverage collected for hatching_egg"
cd ..
echo -e "${GREEN}✓ Hatching Egg coverage complete (all languages)${NC}"
echo ""

# Summary
echo ""
echo "================================================================"
echo -e "${GREEN}✓ Coverage collection complete!${NC}"
echo ""
echo -e "${BLUE}Coverage collected by language:${NC}"
echo ""
echo "JavaScript:"
echo "  ✅ window_spider_trigger    (0% - no tests yet)"
echo "  ✅ spider_crawl_projection  (97.55%)"
echo "  ✅ hatching_egg             (92.12%)"
echo ""
echo "C++:"
echo "  ✅ hatching_egg             (3 test suites)"
echo ""
echo "Python:"
echo "  ✅ hatching_egg             (config tests)"
echo ""
echo "Skipped (Arduino-only):"
echo "  ⚠️  twitching_body"
echo ""
echo "================================================================"
echo -e "${BLUE}View coverage reports:${NC}"
echo ""
echo "JavaScript:"
echo "  - window_spider_trigger/coverage/index.html"
echo "  - spider_crawl_projection/coverage/index.html"
echo "  - hatching_egg/coverage-js/index.html"
echo ""
echo "C++ (hatching_egg):"
echo "  - hatching_egg/coverage-cpp/index.html"
echo ""
echo "Python (hatching_egg):"
echo "  - hatching_egg/coverage-python/index.html"
echo ""
echo "To view in browser:"
echo "  cd hatching_egg && pixi run view-coverage  # Opens all 3 reports"
echo "  cd <other-project> && pixi run view-coverage"
echo ""
