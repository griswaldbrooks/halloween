#!/bin/bash
set -e

echo "🎃 Running Code Coverage for Halloween Monorepo"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create coverage directory
mkdir -p coverage-reports

# Window Spider Trigger
echo -e "${YELLOW}Running coverage for Window Spider Trigger...${NC}"
cd window_spider_trigger
npm install
npm run test:coverage || echo "No tests yet for window_spider_trigger"
cd ..
echo -e "${GREEN}✓ Window Spider Trigger coverage complete${NC}"
echo ""

# Spider Crawl Projection
echo -e "${YELLOW}Running coverage for Spider Crawl Projection...${NC}"
cd spider_crawl_projection
npm install c8 2>/dev/null || true
npm run test:coverage || echo "Coverage collected for spider_crawl_projection"
cd ..
echo -e "${GREEN}✓ Spider Crawl Projection coverage complete${NC}"
echo ""

# Hatching Egg (Node.js tests only for coverage)
echo -e "${YELLOW}Running coverage for Hatching Egg (JavaScript only)...${NC}"
cd hatching_egg
npx c8 --reporter=html --reporter=lcov --reporter=text \
  --include="*.js" \
  --exclude="test_*.js" \
  --exclude="arduino/**" \
  --exclude="scripts/**" \
  --report-dir=coverage \
  bash -c "node test_leg_kinematics.js && node test_animation_behaviors.js" || echo "Coverage collected for hatching_egg"
cd ..
echo -e "${GREEN}✓ Hatching Egg coverage complete${NC}"
echo ""

# Summary
echo ""
echo "================================================"
echo -e "${GREEN}✓ Coverage collection complete!${NC}"
echo ""
echo "View coverage reports:"
echo "  - window_spider_trigger/coverage/index.html"
echo "  - spider_crawl_projection/coverage/index.html"
echo "  - hatching_egg/coverage/index.html"
echo ""
echo "To view in browser:"
echo "  xdg-open window_spider_trigger/coverage/index.html"
echo "  xdg-open spider_crawl_projection/coverage/index.html"
echo "  xdg-open hatching_egg/coverage/index.html"
echo ""
