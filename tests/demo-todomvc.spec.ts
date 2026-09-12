import { test, expect, Page } from '@playwright/test';

const TODOMVC_URL = 'https://demo.playwright.dev/todomvc/';

async function createTodo(page: Page, text: string) {
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill(text);
  await input.press('Enter');
  await expect(page.getByTestId('todo-title').filter({ hasText: text })).toBeVisible({ timeout: 10_000 });
}

test.describe('TodoMVC — realistic demo flows', () => {
  test.describe.configure({ mode: 'parallel', timeout: 30_000 });

  test.beforeEach(async ({ page }) => {
    test.info().annotations.push(
      { type: 'test-type', description: 'E2E Demo' },
      { type: 'application', description: 'TodoMVC' },
    );

    await page.goto(TODOMVC_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible({ timeout: 15_000 });
  });

  test('user can add a new todo item', {
    tag: ['@demo', '@create', '@smoke'],
  }, async ({ page }) => {
    await createTodo(page, 'Buy groceries for the week');

    await expect(page.getByTestId('todo-title')).toHaveText('Buy groceries for the week');
    await expect(page.getByTestId('todo-count')).toContainText('1');
  });

  test('user can mark a todo as completed', {
    tag: ['@demo', '@complete'],
  }, async ({ page }) => {
    await createTodo(page, 'Finish project report');

    const todo = page.locator('.todo-list li').filter({ hasText: 'Finish project report' });
    await todo.getByRole('checkbox').check();

    await expect(todo).toHaveClass(/completed/);
    await expect(page.getByTestId('todo-count')).toContainText('0');
  });

  test('user can edit an existing todo', {
    tag: ['@demo', '@edit'],
  }, async ({ page }) => {
    await createTodo(page, 'Call dentist');

    const todo = page.locator('.todo-list li').filter({ hasText: 'Call dentist' });
    await todo.dblclick();

    const editInput = todo.getByRole('textbox');
    await editInput.fill('Call dentist on Monday');
    await editInput.press('Enter');

    await expect(page.getByTestId('todo-title')).toHaveText('Call dentist on Monday');
  });

  test('user can filter active and completed todos', {
    tag: ['@demo', '@filter'],
  }, async ({ page }) => {
    await createTodo(page, 'Write unit tests');
    await createTodo(page, 'Review pull request');

    const reviewTodo = page.locator('.todo-list li').filter({ hasText: 'Review pull request' });
    await reviewTodo.getByRole('checkbox').check();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.getByTestId('todo-title')).toHaveCount(1);
    await expect(page.getByTestId('todo-title')).toHaveText('Write unit tests');

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.getByTestId('todo-title')).toHaveCount(1);
    await expect(page.getByTestId('todo-title')).toHaveText('Review pull request');

    await page.getByRole('link', { name: 'All' }).click();
    await expect(page.getByTestId('todo-title')).toHaveCount(2);
  });

  test('user can clear all completed todos', {
    tag: ['@demo', '@clear'],
  }, async ({ page }) => {
    await createTodo(page, 'Ship release notes');
    await createTodo(page, 'Update documentation');

    const first = page.locator('.todo-list li').filter({ hasText: 'Ship release notes' });
    await first.getByRole('checkbox').check();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.getByTestId('todo-title')).toHaveCount(1);
    await expect(page.getByTestId('todo-title')).toHaveText('Update documentation');
    await expect(page.getByTestId('todo-count')).toContainText('1');
  });

  // Realistic failure: after deleting a todo, the footer count should drop to 0.
  // Assertion expects "1 item left" — a genuine bug in the expected result, so it
  // fails on the first run and again under isolated retries (not a resource flake).
  test('deleted todo should leave empty list with zero items remaining', {
    tag: ['@demo', '@delete', '@fail'],
  }, async ({ page }) => {
    await createTodo(page, 'Temporary task to remove');

    const todo = page.locator('.todo-list li').filter({ hasText: 'Temporary task to remove' });
    await todo.hover();
    await todo.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByTestId('todo-title')).toHaveCount(0);
    // Wrong expectation on purpose — list is empty, so count is 0, not 1.
    await expect(page.getByTestId('todo-count')).toContainText('1 item left');
  });
});
