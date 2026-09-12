# Test Viewer UI Improvements

## What's New

### 1. Merged Source Code + Steps View
Instead of separate sections, the source code now shows:
- ✅ **Inline step status** - Each `test.step()` line shows running/passed/failed status
- 📊 **Step details** - Duration and actions appear directly below the step line
- 🎨 **Color-coded lines** - Background colors indicate step status
- 🔍 **Real-time updates** - Lines update as steps execute

**Before:**
```
Source Code (separate)
Steps (separate list)
```

**After:**
```
5  ○  test('form test', async ({ page }) => {
6  ✓    await test.step('Navigate...
       ├─ test.step (1.2s)
       │  → page.goto (800ms)
       │  → expect.toHaveURL (200ms)
7  ●    await test.step('Click...
       ├─ test.step (running)
       │  → page.click (...)
```

### 2. Console Output Inline
Console logs (stdout/stderr) now appear:
- 📍 **At the right step** - Shows exactly when the log occurred
- 🔴 **stderr highlighted** - Error output in red
- 📝 **Timestamped** - Matched to step execution time

**Example:**
```
6  ✓  await test.step('Navigate...
     ├─ test.step (1.2s)
     [stdout] Debug: navigating to homepage
     [stderr] Warning: deprecated API
```

### 3. Errors Inline
Test failures now show:
- 📍 **At the failing line** - Error appears right where it happened
- 💬 **Error message** - Clear, highlighted message
- 📚 **Stack trace** - Collapsible stack trace below
- 🎯 **Line highlighting** - Failed line has red border

**Example:**
```
15  ✗  await expect(page).toHaveTitle('Wrong')
      ❌ Expected "Wrong" but got "Example Domain"
         at tests/example.spec.ts:15:10
         at ...
```

### 4. Shards View (GitHub Actions Style)
When running with shards (parallel execution across machines):
- 🎯 **Shard cards** - Visual grid of all shards
- 📊 **Per-shard stats** - Passed/failed/running counts
- 🖥️ **Machine ID** - Shows which machine ran which shard
- 🔄 **Real-time status** - Updates as shards complete
- 🎨 **Color-coded** - Running (blue), passed (green), failed (red)

**UI:**
```
┌─────────────────────────────────────────────────────┐
│ Shards                                   [Hide]     │
├──────────────┬──────────────┬──────────────────────┤
│ Shard 1/3  ✓ │ Shard 2/3  ● │ Shard 3/3  ○         │
│ ✓ 45 ✗ 2    │ ✓ 38 ● 5    │ ✓ 0 ○ 0              │
│ runner-1     │ runner-2     │ runner-3             │
└──────────────┴──────────────┴──────────────────────┘
```

## Visual Comparison

### Old UI
```
┌─────────────────────────────────────────────────────┐
│ Test Details                                        │
├─────────────────────────────────────────────────────┤
│ Steps:                                              │
│ ✓ Navigate to homepage (1.2s)                      │
│   → page.goto (800ms)                               │
│   → expect.toHaveURL (200ms)                        │
│ ✗ Click on Contact link (500ms)                    │
│                                                     │
│ Errors:                                             │
│ ❌ Element not found                                │
│                                                     │
│ Source Code:                                        │
│ 5  test('form test', async ({ page }) => {         │
│ 6    await test.step('Navigate...                  │
│ 7    await test.step('Click...                     │
└─────────────────────────────────────────────────────┘
```

### New UI
```
┌─────────────────────────────────────────────────────┐
│ Test Execution                                      │
├─────────────────────────────────────────────────────┤
│ 5  ○  test('form test', async ({ page }) => {      │
│ 6  ✓    await test.step('Navigate...               │
│        ├─ test.step (1.2s)                          │
│        │  → page.goto (800ms)                       │
│        │  → expect.toHaveURL (200ms)                │
│        [stdout] Debug: navigating to homepage       │
│ 7  ✗    await test.step('Click...                  │
│        ├─ test.step (500ms)                         │
│        │  → page.click (...)                        │
│        ❌ Element not found: text=Contact           │
│           at tests/form.spec.ts:7:10                │
└─────────────────────────────────────────────────────┘
```

## Benefits

1. **Context** - See exactly what code is running and when
2. **Debugging** - Errors appear right where they happen
3. **Performance** - Step durations inline with code
4. **Logs** - Console output at the right moment
5. **Shards** - Visual overview of parallel execution
6. **Real-time** - Everything updates live as tests run

## Usage

Just run the viewer as before - the new UI is automatic:

```bash
cd test-viewer
node server.js ../test-data-output
open http://localhost:3456
```

Then run your tests:
```bash
npx playwright test
```

For sharded runs:
```bash
# Terminal 1
npx playwright test --shard=1/3

# Terminal 2
npx playwright test --shard=2/3

# Terminal 3
npx playwright test --shard=3/3
```

The UI will automatically detect and display the shards view!
