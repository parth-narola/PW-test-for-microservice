#!/bin/bash

# TestDino - Run Playwright tests with live viewer
# Usage: ./run-with-viewer.sh [playwright-test-args]

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
VIEWER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${OUTPUT_DIR:-./test-data-output}"
PORT="${PORT:-3456}"
TEST_DIR="${TEST_DIR:-..}"

echo -e "${BLUE}🦖 TestDino Live Test Viewer${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if node is available
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo -e "${YELLOW}⚠️  npx not found. Please install Node.js/npm first.${NC}"
    exit 1
fi

# Clean up function
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
    fi
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start the viewer server in background
echo -e "${GREEN}Starting viewer server...${NC}"
cd "$VIEWER_DIR"
PORT=$PORT node server.js "$OUTPUT_DIR" &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Check if server is running
if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Failed to start viewer server${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Viewer running at http://localhost:${PORT}${NC}"
echo ""

# Open browser (macOS)
if command -v open &> /dev/null; then
    echo -e "${BLUE}Opening browser...${NC}"
    open "http://localhost:${PORT}" 2>/dev/null || true
fi

# Open browser (Linux)
if command -v xdg-open &> /dev/null; then
    echo -e "${BLUE}Opening browser...${NC}"
    xdg-open "http://localhost:${PORT}" 2>/dev/null || true
fi

echo ""
echo -e "${GREEN}Running Playwright tests...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Change to test directory and run tests
cd "$TEST_DIR"

# Run Playwright with all passed arguments
npx playwright test "$@"

TEST_EXIT_CODE=$?

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓ Tests completed successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Tests completed with failures${NC}"
fi
echo -e "${BLUE}View results at: http://localhost:${PORT}${NC}"
echo ""
echo "Press Ctrl+C to stop the viewer server"

# Keep server running
wait $SERVER_PID
