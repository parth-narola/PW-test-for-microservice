import { test, expect } from '@playwright/test';

test('pass - simple math', { tag: '@critical' }, () => {
  expect(1 + 1).toBe(2);
});

test('pass - string check', { tag: '@hotshot' }, () => {
  expect('hello world').toContain('world');
});

test('fail - intentional failure', () => {
  expect(true).toBe(false);
});

test('notify channel - login test', {
  annotation: {
    type: 'testdino:notify-slack',
    description: '#new-channel',
  },
}, async () => {
  // Fails on purpose so the testdino:notify-slack alert fires to the #new-channel channel.
  expect(true).toBe(false);
});

test('notify user - login test', {
  annotation: {
    type: 'testdino:notify-slack',
    description: '@patelsahil',
  },
}, async () => {
  // Fails on purpose so the testdino:notify-slack alert fires to the patelsahil.alphabin user.
  expect(true).toBe(false);
});
