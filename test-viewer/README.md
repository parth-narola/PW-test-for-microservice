# TestDino Live Test Viewer

Real-time visualization of Playwright test execution with source code highlighting.

## Features

- 🔴 Live test status updates (pending → running → passed/failed)
- 📋 Step-by-step execution tracking
- 📄 Source code with inline status indicators
- 📊 Timeline visualization of all events
- 🔍 Filter tests by status
- 🦊 Multi-browser support (shows browser for each test)

## Quick Start

```bash
# 1. Start the viewer server (in one terminal)
cd test-viewer
node server.js ../test-data-output

# 2. Open browser
open http://localhost:3456

# 3. Run your Playwright tests (in another terminal)
npx playwright test
```

## Usage

### Start the Server

```bash
# Default: watches ./test-data-output
node server.js

# Custom directory
node server.js /path/to/output

# Custom port
PORT=8080 node server.js
```

### Configure Reporter

In your `playwright.config.js`:

```javascript
module.exports = {
  reporter: [
    ['./standalone-file-reporter.js', { 
      outputDir: './test-data-output',
      prettyPrint: true
    }]
  ]
};
```

## UI Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ 🦖 TestDino                    [Running]    ✓ 5  ✗ 1  ● 2      │
├──────────────────┬──────────────────────────────────────────────┤
│ Tests            │ Test Details                                 │
│ ──────────────── │ ────────────────────────────────────────────│
│ ✓ login test     │ 📋 Steps                                     │
│   chromium 1.2s  │ ┌─────────────────────────────────────────┐ │
│ ● form test      │ │ ✓ Setup (1.2s)                          │ │
│   firefox        │ │   ✓ Fixture "browser" (800ms)           │ │
│ ✗ api test       │ │   ✓ Fixture "page" (400ms)              │ │
│   webkit 2.1s    │ │ ✓ Navigate to homepage (1.0s)           │ │
│                  │ │   → page.goto (800ms)                   │ │
│                  │ │   → expect.toHaveURL (200ms)            │ │
│                  │ │ ● Click on Contact link                 │ │
│                  │ └─────────────────────────────────────────┘ │
│                  │                                              │
│                  │ 📄 Source Code                               │
│                  │ ┌─────────────────────────────────────────┐ │
│                  │ │  5 │ test('form test', async ({ page }) │ │
│                  │ │  6 │   await test.step('Navigate...  ✓  │ │
│                  │ │  7 │     await page.goto('/');          │ │
│                  │ │  8 │   });                               │ │
│                  │ │  9 │   await test.step('Click...    ●   │ │
│                  │ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ Timeline: ▓▓▓▓░░▓▓▓░░▓▓▓▓▓░░▓▓▓░░▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────────────────────────────────┘
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Web UI |
| `/events` | GET | SSE stream of real-time events |
| `/api/events` | GET | All events as JSON array |
| `/api/reset` | POST | Clear all events |

## How It Works

1. **Reporter** writes JSON files to output directory
2. **Server** watches directory for new files
3. **Server** parses JSON and broadcasts via SSE
4. **UI** receives events and updates in real-time

## Event Types

| Event | Description |
|-------|-------------|
| `session_request` | Test run started |
| `session_response` | Server acknowledged |
| `test_discovery` | All tests discovered with source code |
| `test_started` | Individual test began |
| `test_setup` | Fixtures/hooks completed |
| `step_started` | User test.step() began |
| `action` | Playwright action (click, goto, etc.) |
| `assertion` | Expect assertion |
| `step_completed` | User test.step() finished |
| `test_completed` | Individual test finished |
| `session_end` | Test run completed |
