import { test, expect } from '@playwright/test';

// All three deliberate failures are fixed, so a re-run of an earlier run's
// failures against this commit shows them turn green. Declaration order is kept:
// with 15 tests over 4 shards Playwright splits them 4/4/4/3 in order.

test('stable 1', () => expect(1).toBe(1));
test('stable 2', () => expect(1).toBe(1));
test('stable 3', () => expect(1).toBe(1));
test('flips on retry A', () => expect(1).toBe(1));

test('stable 4', () => expect(1).toBe(1));
test('stable 5', () => expect(1).toBe(1));
test('stable 6', () => expect(1).toBe(1));
test('flips on retry B', () => expect(1).toBe(1));

test('stable 7', () => expect(1).toBe(1));
test('stable 8', () => expect(1).toBe(1));
test('stable 9', () => expect(1).toBe(1));
test('stable 10', () => expect(1).toBe(1));

test('always fails', () => expect(1).toBe(1));
test('stable 11', () => expect(1).toBe(1));
test('stable 12', () => expect(1).toBe(1));
