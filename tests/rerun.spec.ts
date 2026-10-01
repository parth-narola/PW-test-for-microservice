import { test, expect } from '@playwright/test';

// The two "flips" tests fail on attempt 1 and pass on any GitHub retry, so their
// shards can turn green; "always fails" never does, so its shard stays red.
// Declaration order is deliberate: with 15 tests over 4 shards Playwright splits
// them 4/4/4/3 in order, which puts a failure in shards 1, 2 and 4 and leaves
// shard 3 all green — the shard GitHub must carry over instead of re-running.
const firstAttempt = process.env.GITHUB_RUN_ATTEMPT === '1';

test('stable 1', () => expect(1).toBe(1));
test('stable 2', () => expect(1).toBe(1));
test('stable 3', () => expect(1).toBe(1));
test('flips on retry A', () => expect(firstAttempt).toBe(false));

test('stable 4', () => expect(1).toBe(1));
test('stable 5', () => expect(1).toBe(1));
test('stable 6', () => expect(1).toBe(1));
test('flips on retry B', () => expect(firstAttempt).toBe(false));

test('stable 7', () => expect(1).toBe(1));
test('stable 8', () => expect(1).toBe(1));
test('stable 9', () => expect(1).toBe(1));
test('stable 10', () => expect(1).toBe(1));

test('always fails', () => expect(1).toBe(2));
test('stable 11', () => expect(1).toBe(1));
test('stable 12', () => expect(1).toBe(1));
