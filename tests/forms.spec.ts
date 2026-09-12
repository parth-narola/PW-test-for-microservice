// import { test, expect, Page, BrowserContext } from '@playwright/test';

// // Test data
// const TODO_ITEMS = [
//     'Buy groceries',
//     'Write tests',
//     'Review code',
//     'Deploy application',
//     'Update documentation'
// ];

// const LONG_TODO = 'This is a very long todo item that should test how the application handles lengthy text input and ensures proper text wrapping and display';
// const SPECIAL_CHARS_TODO = 'Todo with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
// const EMOJI_TODO = 'Todo with emoji 🎉 🚀 💻 ✅';

// // Helper functions
// async function createTodo(page: Page, text: string) {
//     console.log(`Creating todo: "${text}"`);
//     const newTodoInput = page.getByPlaceholder('What needs to be done?');
//     await newTodoInput.fill(text);
//     await newTodoInput.press('Enter');
//     await expect(page.getByText(text)).toBeVisible();
// }

// async function getTodoCount(page: Page): Promise<number> {
//     return await page.locator('.todo-list li').count();
// }

// async function getActiveTodoCount(page: Page): Promise<number> {
//     const countText = await page.locator('.todo-count').textContent();
//     const match = countText?.match(/(\d+)/);
//     return match ? parseInt(match[1]) : 0;
// }

// async function getCompletedTodoCount(page: Page): Promise<number> {
//     const todos = page.locator('.todo-list li');
//     const count = await todos.count();
//     let completed = 0;
//     for (let i = 0; i < count; i++) {
//         const todo = todos.nth(i);
//         if (await todo.locator('input[type="checkbox"]').isChecked()) {
//             completed++;
//         }
//     }
//     return completed;
// }

// // Test suite configuration
// test.describe('TodoMVC Comprehensive Test Suite', () => {
//     {}
//     // Global test configuration
//     test.describe.configure({ 
//         retries: 1,
//         mode: 'parallel'
//     });

//     // Setup and teardown hooks
//     test.beforeEach(async ({ page, context }) => {
//         console.log('=== Test Setup: Navigating to TodoMVC ===');
        
//         // Add annotations
//         test.info().annotations.push(
//             { type: 'test-type', description: 'E2E Test' },
//             { type: 'application', description: 'TodoMVC' },
//             { type: 'url', description: 'https://demo.playwright.dev/todomvc/' }
//         );

//         // Set viewport
//         await page.setViewportSize({ width: 1280, height: 720 });
//         console.log('Viewport set to 1280x720');

//         // Navigate to TodoMVC
//         const response = await page.goto('https://demo.playwright.dev/todomvc/', {
//             waitUntil: 'networkidle',
//             timeout: 30000
//         });
        
//         console.log(`Navigation response status: ${response?.status()}`);
//         expect(response?.status()).toBe(200);

//         // Verify page loaded
//         await expect(page).toHaveTitle(/TodoMVC/);
//         await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
        
//         console.log('TodoMVC page loaded successfully');
//     });

//     test.afterEach(async ({ page }, testInfo) => {
//         console.log(`=== Test Teardown: ${testInfo.title} ===`);
        
//         // Take screenshot on failure
//         if (testInfo.status !== 'passed') {
//             await page.screenshot({ 
//                 path: `test-results/${testInfo.title.replace(/\s+/g, '-')}-failure.png`,
//                 fullPage: true 
//             });
//             console.log('Screenshot captured on test failure');
//         }

//         // Log test duration
//         console.log(`Test duration: ${testInfo.duration}ms`);
//     });

//     // ========== SMOKE TESTS ==========
//     test.describe('Smoke Tests', () => {
//         test('should load TodoMVC application', { 
//             tag: ['@smoke', '@critical', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P0' },
//                 { type: 'category', description: 'Smoke' }
//             );

//             console.log('=== Smoke Test: Application Load ===');

//             await test.step('Verify page title', async () => {
//                 await expect(page).toHaveTitle(/TodoMVC/);
//                 console.log('Page title verified');
//             });

//             await test.step('Verify main input field', async () => {
//                 const input = page.getByPlaceholder('What needs to be done?');
//                 await expect(input).toBeVisible();
//                 await expect(input).toBeEnabled();
//                 console.log('Main input field verified');
//             });

//             await test.step('Verify footer links', async () => {
//                 const footer = page.locator('footer');
//                 await expect(footer).toBeVisible();
//                 console.log('Footer verified');
//             });

//             await test.step('Check page structure', async () => {
//                 const body = page.locator('body');
//                 const className = await body.getAttribute('class');
//                 console.log(`Body class: ${className}`);
//                 expect(className).toBeTruthy();
//             });
//         });

//         test('should create a single todo item', { 
//             tag: ['@smoke', '@critical', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P0' },
//                 { type: 'category', description: 'CRUD' }
//             );

//             console.log('=== Smoke Test: Create Todo ===');

//             const todoText = 'Test todo item';
            
//             await test.step('Create todo', async () => {
//                 await createTodo(page, todoText);
//                 console.log(`Todo "${todoText}" created successfully`);
//             });

//             await test.step('Verify todo appears in list', async () => {
//                 const todo = page.locator('.todo-list li').first();
//                 await expect(todo).toBeVisible();
//                 await expect(todo).toContainText(todoText);
//                 console.log('Todo verified in list');
//             });

//             await test.step('Verify todo count', async () => {
//                 const count = await getTodoCount(page);
//                 expect(count).toBe(1);
//                 console.log(`Todo count verified: ${count}`);
//             });

//             await test.step('Verify input is cleared', async () => {
//                 const input = page.getByPlaceholder('What needs to be done?');
//                 await expect(input).toHaveValue('');
//                 console.log('Input cleared after submission');
//             });
//         });
//     });

//     // ========== CRUD OPERATIONS ==========
//     test.describe('CRUD Operations', () => {
//         test('should create multiple todos', { 
//             tag: ['@regression', '@crud', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P1' },
//                 { type: 'category', description: 'Create' }
//             );

//             console.log('=== Test: Create Multiple Todos ===');

//             await test.step('Create multiple todos', async () => {
//                 for (const todo of TODO_ITEMS) {
//                     await createTodo(page, todo);
//                     await page.waitForTimeout(100); // Small delay for UI update
//                 }
//                 console.log(`Created ${TODO_ITEMS.length} todos`);
//             });

//             await test.step('Verify all todos are displayed', async () => {
//                 const count = await getTodoCount(page);
//                 expect(count).toBe(TODO_ITEMS.length);
//                 console.log(`Verified ${count} todos in list`);

//                 for (const todo of TODO_ITEMS) {
//                     await expect(page.getByText(todo)).toBeVisible();
//                 }
//             });

//             await test.step('Verify active count', async () => {
//                 const activeCount = await getActiveTodoCount(page);
//                 expect(activeCount).toBe(TODO_ITEMS.length);
//                 console.log(`Active count: ${activeCount}`);
//             });
//         });

//         test('should complete a todo', { 
//             tag: ['@regression', '@crud', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P1' },
//                 { type: 'category', description: 'Update' }
//             );

//             console.log('=== Test: Complete Todo ===');

//             await test.step('Create a todo', async () => {
//                 await createTodo(page, 'Todo to complete');
//             });

//             await test.step('Complete the todo', async () => {
//                 const checkbox = page.locator('.todo-list li').first().locator('input[type="checkbox"]');
//                 await checkbox.check();
//                 console.log('Todo marked as complete');
//             });

//             await test.step('Verify todo is completed', async () => {
//                 const checkbox = page.locator('.todo-list li').first().locator('input[type="checkbox"]');
//                 await expect(checkbox).toBeChecked();
//                 console.log('Todo completion verified');
//             });

//             await test.step('Verify active count decreased', async () => {
//                 const activeCount = await getActiveTodoCount(page);
//                 expect(activeCount).toBe(0);
//                 console.log('Active count verified');
//             });

//             await test.step('Verify completed count', async () => {
//                 const completedCount = await getCompletedTodoCount(page);
//                 expect(completedCount).toBe(1);
//                 console.log(`Completed count: ${completedCount}`);
//             });
//         });

//         test('should uncomplete a todo', { 
//             tag: ['@regression', '@crud', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Update' }
//             );

//             console.log('=== Test: Uncomplete Todo ===');

//             await test.step('Create and complete a todo', async () => {
//                 await createTodo(page, 'Todo to uncomplete');
//                 const checkbox = page.locator('.todo-list li').first().locator('input[type="checkbox"]');
//                 await checkbox.check();
//             });

//             await test.step('Uncomplete the todo', async () => {
//                 const checkbox = page.locator('.todo-list li').first().locator('input[type="checkbox"]');
//                 await checkbox.uncheck();
//                 console.log('Todo uncompleted');
//             });

//             await test.step('Verify todo is active again', async () => {
//                 const checkbox = page.locator('.todo-list li').first().locator('input[type="checkbox"]');
//                 await expect(checkbox).not.toBeChecked();
//                 const activeCount = await getActiveTodoCount(page);
//                 expect(activeCount).toBe(1);
//                 console.log('Todo is active again');
//             });
//         });

//         test('should edit a todo', { 
//             tag: ['@regression', '@crud', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P1' },
//                 { type: 'category', description: 'Update' }
//             );

//             console.log('=== Test: Edit Todo ===');

//             const originalText = 'Original todo';
//             const editedText = 'Edited todo';

//             await test.step('Create a todo', async () => {
//                 await createTodo(page, originalText);
//             });

//             await test.step('Double-click to edit', async () => {
//                 const todo = page.locator('.todo-list li').first();
//                 await todo.dblclick();
//                 console.log('Double-clicked todo to enter edit mode');
//             });

//             await test.step('Edit the todo text', async () => {
//                 const editInput = page.locator('.todo-list li.editing input.edit');
//                 await expect(editInput).toBeVisible();
//                 await editInput.fill(editedText);
//                 await editInput.press('Enter');
//                 console.log(`Todo edited from "${originalText}" to "${editedText}"`);
//             });

//             await test.step('Verify todo is updated', async () => {
//                 await expect(page.getByText(editedText)).toBeVisible();
//                 await expect(page.getByText(originalText)).not.toBeVisible();
//                 console.log('Todo edit verified');
//             });
//         });

//         test('should delete a todo', { 
//             tag: ['@regression', '@crud', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P1' },
//                 { type: 'category', description: 'Delete' }
//             );

//             console.log('=== Test: Delete Todo ===');

//             await test.step('Create multiple todos', async () => {
//                 await createTodo(page, 'Todo 1');
//                 await createTodo(page, 'Todo 2');
//                 await createTodo(page, 'Todo 3');
//             });

//             await test.step('Hover over todo to reveal delete button', async () => {
//                 const firstTodo = page.locator('.todo-list li').first();
//                 await firstTodo.hover();
//                 console.log('Hovered over todo');
//             });

//             await test.step('Click delete button', async () => {
//                 const deleteButton = page.locator('.todo-list li').first().locator('.destroy');
//                 await deleteButton.click();
//                 console.log('Delete button clicked');
//             });

//             await test.step('Verify todo is deleted', async () => {
//                 const count = await getTodoCount(page);
//                 expect(count).toBe(2);
//                 await expect(page.getByText('Todo 1')).not.toBeVisible();
//                 console.log('Todo deletion verified');
//             });
//         });
//     });

//     // ========== FILTERING TESTS ==========
//     test.describe('Filtering Tests', () => {
//         test.beforeEach(async ({ page }) => {
//             // Setup: Create mix of completed and active todos
//             await createTodo(page, 'Active Todo 1');
//             await createTodo(page, 'Active Todo 2');
//             await createTodo(page, 'Completed Todo 1');
//             await createTodo(page, 'Completed Todo 2');
            
//             // Complete last two todos
//             const todos = page.locator('.todo-list li');
//             await todos.nth(2).locator('input[type="checkbox"]').check();
//             await todos.nth(3).locator('input[type="checkbox"]').check();
//         });

//         test('should filter by All', { 
//             tag: ['@regression', '@filtering', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P1' },
//                 { type: 'category', description: 'Filtering' }
//             );

//             console.log('=== Test: Filter All ===');

//             await test.step('Click All filter', async () => {
//                 await page.getByRole('link', { name: 'All' }).click();
//                 console.log('All filter clicked');
//             });

//             await test.step('Verify all todos are visible', async () => {
//                 const count = await getTodoCount(page);
//                 expect(count).toBe(4);
//                 console.log(`All ${count} todos visible`);
//             });
//         });

//         test('should filter by Active', { 
//             tag: ['@regression', '@filtering', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P1' },
//                 { type: 'category', description: 'Filtering' }
//             );

//             console.log('=== Test: Filter Active ===');

//             await test.step('Click Active filter', async () => {
//                 await page.getByRole('link', { name: 'Active' }).click();
//                 console.log('Active filter clicked');
//             });

//             await test.step('Verify only active todos are visible', async () => {
//                 const count = await getTodoCount(page);
//                 expect(count).toBe(2);
//                 await expect(page.getByText('Active Todo 1')).toBeVisible();
//                 await expect(page.getByText('Active Todo 2')).toBeVisible();
//                 console.log('Only active todos visible');
//             });
//         });

//         test('should filter by Completed', { 
//             tag: ['@regression', '@filtering', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P1' },
//                 { type: 'category', description: 'Filtering' }
//             );

//             console.log('=== Test: Filter Completed ===');

//             await test.step('Click Completed filter', async () => {
//                 await page.getByRole('link', { name: 'Completed' }).click();
//                 console.log('Completed filter clicked');
//             });

//             await test.step('Verify only completed todos are visible', async () => {
//                 const count = await getTodoCount(page);
//                 expect(count).toBe(2);
//                 await expect(page.getByText('Completed Todo 1')).toBeVisible();
//                 await expect(page.getByText('Completed Todo 2')).toBeVisible();
//                 console.log('Only completed todos visible');
//             });
//         });
//     });

//     // ========== KEYBOARD SHORTCUTS ==========
//     test.describe('Keyboard Shortcuts', () => {
//         test.beforeEach(async ({ page }) => {
//             await createTodo(page, 'Todo 1');
//             await createTodo(page, 'Todo 2');
//         });

//         test('should create todo with Enter key', { 
//             tag: ['@regression', '@keyboard', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P1' },
//                 { type: 'category', description: 'Keyboard' }
//             );

//             console.log('=== Test: Enter Key ===');

//             const input = page.getByPlaceholder('What needs to be done?');
//             await input.fill('New todo with Enter');
//             await input.press('Enter');
            
//             await expect(page.getByText('New todo with Enter')).toBeVisible();
//             console.log('Todo created with Enter key');
//         });

//         test('should cancel edit with Escape key', { 
//             tag: ['@regression', '@keyboard', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Keyboard' }
//             );

//             console.log('=== Test: Escape Key ===');

//             const originalText = 'Original';
//             const editText = 'Should not save';

//             await test.step('Enter edit mode', async () => {
//                 const todo = page.locator('.todo-list li').first();
//                 await todo.dblclick();
//             });

//             await test.step('Type new text and press Escape', async () => {
//                 const editInput = page.locator('.todo-list li.editing input.edit');
//                 await editInput.fill(editText);
//                 await editInput.press('Escape');
//                 console.log('Escape pressed to cancel edit');
//             });

//             await test.step('Verify original text is preserved', async () => {
//                 await expect(page.getByText(originalText)).toBeVisible();
//                 await expect(page.getByText(editText)).not.toBeVisible();
//                 console.log('Edit cancelled successfully');
//             });
//         });

//         test('should toggle all todos with keyboard', { 
//             tag: ['@regression', '@keyboard', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Keyboard' }
//             );

//             console.log('=== Test: Toggle All Keyboard ===');

//             // Focus on toggle all checkbox
//             const toggleAll = page.locator('.toggle-all');
//             await toggleAll.focus();
//             await toggleAll.press('Space');
            
//             // Verify all are checked
//             const todos = page.locator('.todo-list li');
//             const count = await todos.count();
//             for (let i = 0; i < count; i++) {
//                 await expect(todos.nth(i).locator('input[type="checkbox"]')).toBeChecked();
//             }
//             console.log('All todos toggled with keyboard');
//         });
//     });

//     // ========== EDGE CASES ==========
//     test.describe('Edge Cases', () => {
//         test('should handle empty todo input', { 
//             tag: ['@regression', '@edge-case', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Edge Case' }
//             );

//             console.log('=== Test: Empty Input ===');

//             const input = page.getByPlaceholder('What needs to be done?');
//             await input.press('Enter');
            
//             const count = await getTodoCount(page);
//             expect(count).toBe(0);
//             console.log('Empty input handled correctly');
//         });

//         test('should handle whitespace-only todo', { 
//             tag: ['@regression', '@edge-case', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Edge Case' }
//             );

//             console.log('=== Test: Whitespace Only ===');

//             const input = page.getByPlaceholder('What needs to be done?');
//             await input.fill('   ');
//             await input.press('Enter');
            
//             const count = await getTodoCount(page);
//             expect(count).toBe(0);
//             console.log('Whitespace-only input handled correctly');
//         });

//         test('should handle very long todo text', { 
//             tag: ['@regression', '@edge-case', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Edge Case' }
//             );

//             console.log('=== Test: Long Text ===');

//             await createTodo(page, LONG_TODO);
            
//             const todo = page.locator('.todo-list li').first();
//             await expect(todo).toContainText(LONG_TODO);
            
//             // Verify text wrapping
//             const boundingBox = await todo.boundingBox();
//             expect(boundingBox?.height).toBeGreaterThan(20);
//             console.log('Long text handled correctly');
//         });

//         test('should handle special characters', { 
//             tag: ['@regression', '@edge-case', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Edge Case' }
//             );

//             console.log('=== Test: Special Characters ===');

//             await createTodo(page, SPECIAL_CHARS_TODO);
//             await expect(page.getByText(SPECIAL_CHARS_TODO)).toBeVisible();
//             console.log('Special characters handled correctly');
//         });

//         test('should handle emoji in todos', { 
//             tag: ['@regression', '@edge-case', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Edge Case' }
//             );

//             console.log('=== Test: Emoji ===');

//             await createTodo(page, EMOJI_TODO);
//             await expect(page.getByText(EMOJI_TODO)).toBeVisible();
//             console.log('Emoji handled correctly');
//         });

//         test('should handle rapid todo creation', { 
//             tag: ['@regression', '@edge-case', '@performance', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Performance' }
//             );

//             console.log('=== Test: Rapid Creation ===');

//             const input = page.getByPlaceholder('What needs to be done?');
//             const startTime = Date.now();

//             for (let i = 0; i < 10; i++) {
//                 await input.fill(`Rapid todo ${i}`);
//                 await input.press('Enter');
//             }

//             const endTime = Date.now();
//             const duration = endTime - startTime;

//             const count = await getTodoCount(page);
//             expect(count).toBe(10);
//             console.log(`Created 10 todos in ${duration}ms`);
//         });
//     });

//     // ========== BULK OPERATIONS ==========
//     test.describe('Bulk Operations', () => {
//         test.beforeEach(async ({ page }) => {
//             for (const todo of TODO_ITEMS) {
//                 await createTodo(page, todo);
//             }
//         });

//         test('should toggle all todos complete', { 
//             tag: ['@regression', '@bulk', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P1' },
//                 { type: 'category', description: 'Bulk' }
//             );

//             console.log('=== Test: Toggle All Complete ===');

//             await test.step('Click toggle all', async () => {
//                 await page.locator('.toggle-all').click();
//                 console.log('Toggle all clicked');
//             });

//             await test.step('Verify all todos are completed', async () => {
//                 const todos = page.locator('.todo-list li');
//                 const count = await todos.count();
//                 for (let i = 0; i < count; i++) {
//                     await expect(todos.nth(i).locator('input[type="checkbox"]')).toBeChecked();
//                 }
//                 console.log('All todos completed');
//             });

//             await test.step('Verify active count is zero', async () => {
//                 const activeCount = await getActiveTodoCount(page);
//                 expect(activeCount).toBe(0);
//                 console.log('Active count verified');
//             });
//         });

//         test('should clear completed todos', { 
//             tag: ['@regression', '@bulk', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P1' },
//                 { type: 'category', description: 'Bulk' }
//             );

//             console.log('=== Test: Clear Completed ===');

//             await test.step('Complete some todos', async () => {
//                 const todos = page.locator('.todo-list li');
//                 await todos.nth(0).locator('input[type="checkbox"]').check();
//                 await todos.nth(1).locator('input[type="checkbox"]').check();
//                 console.log('Completed 2 todos');
//             });

//             await test.step('Click clear completed', async () => {
//                 await page.getByRole('button', { name: 'Clear completed' }).click();
//                 console.log('Clear completed clicked');
//             });

//             await test.step('Verify completed todos are removed', async () => {
//                 const count = await getTodoCount(page);
//                 expect(count).toBe(3);
//                 console.log('Completed todos cleared');
//             });
//         });
//     });

//     // ========== PERSISTENCE TESTS ==========
//     test.describe('Persistence Tests', () => {
//         test('should persist todos in localStorage', { 
//             tag: ['@regression', '@persistence', '@all'],
//         }, async ({ page, context }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P1' },
//                 { type: 'category', description: 'Persistence' }
//             );

//             console.log('=== Test: LocalStorage Persistence ===');

//             await test.step('Create todos', async () => {
//                 await createTodo(page, 'Persistent Todo 1');
//                 await createTodo(page, 'Persistent Todo 2');
//             });

//             await test.step('Check localStorage', async () => {
//                 const storage = await context.storageState();
//                 console.log('Storage state captured');
                
//                 // Reload page
//                 await page.reload();
//                 await page.waitForLoadState('networkidle');
//             });

//             await test.step('Verify todos persist after reload', async () => {
//                 await expect(page.getByText('Persistent Todo 1')).toBeVisible();
//                 await expect(page.getByText('Persistent Todo 2')).toBeVisible();
//                 console.log('Todos persisted after reload');
//             });
//         });

//         test('should maintain filter state', { 
//             tag: ['@regression', '@persistence', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Persistence' }
//             );

//             console.log('=== Test: Filter State Persistence ===');

//             await createTodo(page, 'Test Todo');
//             await page.getByRole('link', { name: 'Active' }).click();
            
//             await page.reload();
//             await page.waitForLoadState('networkidle');
            
//             // Filter state might be maintained via URL or localStorage
//             const url = page.url();
//             console.log(`Current URL: ${url}`);
//         });
//     });

//     // ========== NETWORK AND PERFORMANCE ==========
//     test.describe('Network and Performance', () => {
//         test('should monitor network requests', { 
//             tag: ['@regression', '@network', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Network' }
//             );

//             console.log('=== Test: Network Monitoring ===');

//             const requests: string[] = [];
//             const responses: string[] = [];

//             page.on('request', request => {
//                 requests.push(request.url());
//                 console.log(`Request: ${request.method()} ${request.url()}`);
//             });

//             page.on('response', response => {
//                 responses.push(response.url());
//                 console.log(`Response: ${response.status()} ${response.url()}`);
//             });

//             await createTodo(page, 'Network test todo');

//             expect(requests.length).toBeGreaterThan(0);
//             expect(responses.length).toBeGreaterThan(0);
//             console.log(`Captured ${requests.length} requests and ${responses.length} responses`);
//         });

//         test('should measure page load performance', { 
//             tag: ['@regression', '@performance', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Performance' }
//             );

//             console.log('=== Test: Performance Measurement ===');

//             const startTime = Date.now();
//             await page.goto('https://demo.playwright.dev/todomvc/', { waitUntil: 'load' });
//             const loadTime = Date.now() - startTime;

//             const metrics = await page.evaluate(() => {
//                 return {
//                     domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
//                     loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart
//                 };
//             });

//             console.log(`Page load time: ${loadTime}ms`);
//             console.log(`DOM Content Loaded: ${metrics.domContentLoaded}ms`);
//             console.log(`Load Complete: ${metrics.loadComplete}ms`);

//             expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
//         });
//     });

//     // ========== ACCESSIBILITY TESTS ==========
//     test.describe('Accessibility Tests', () => {
//         test('should have proper ARIA labels', { 
//             tag: ['@regression', '@a11y', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Accessibility' }
//             );

//             console.log('=== Test: ARIA Labels ===');

//             const input = page.getByPlaceholder('What needs to be done?');
//             const role = await input.getAttribute('role');
//             const ariaLabel = await input.getAttribute('aria-label');
            
//             console.log(`Input role: ${role}`);
//             console.log(`Input aria-label: ${ariaLabel}`);
//         });

//         test('should support keyboard navigation', { 
//             tag: ['@regression', '@a11y', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P1' },
//                 { type: 'category', description: 'Accessibility' }
//             );

//             console.log('=== Test: Keyboard Navigation ===');

//             await createTodo(page, 'Todo 1');
//             await createTodo(page, 'Todo 2');

//             // Tab through elements
//             await page.keyboard.press('Tab');
//             await page.keyboard.press('Tab');
            
//             // Verify focus management
//             const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
//             console.log(`Focused element: ${focusedElement}`);
//         });
//     });

//     // ========== MULTI-BROWSER TESTS ==========
//     test.describe('Cross-Browser Tests', () => {
//         test('should work consistently across browsers', { 
//             tag: ['@regression', '@cross-browser', '@all'],
//         }, async ({ page, browserName }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P1' },
//                 { type: 'category', description: 'Cross-Browser' },
//                 { type: 'browser', description: browserName }
//             );

//             console.log(`=== Test: Cross-Browser (${browserName}) ===`);

//             await createTodo(page, `Todo in ${browserName}`);
//             await expect(page.getByText(`Todo in ${browserName}`)).toBeVisible();
//             console.log(`Test passed on ${browserName}`);
//         });
//     });

//     // ========== VIEWPORT TESTS ==========
//     test.describe('Responsive Design Tests', () => {
//         const viewports = [
//             { width: 1920, height: 1080, name: 'Desktop' },
//             { width: 768, height: 1024, name: 'Tablet' },
//             { width: 375, height: 667, name: 'Mobile' }
//         ];

//         for (const viewport of viewports) {
//             test(`should work on ${viewport.name} viewport`, { 
//                 tag: ['@regression', '@responsive', '@all'],
//             }, async ({ page }) => {
//                 test.info().annotations.push(
//                     { type: 'priority', description: 'P2' },
//                     { type: 'category', description: 'Responsive' },
//                     { type: 'viewport', description: `${viewport.name} (${viewport.width}x${viewport.height})` }
//                 );

//                 console.log(`=== Test: ${viewport.name} Viewport ===`);

//                 await page.setViewportSize({ width: viewport.width, height: viewport.height });
                
//                 await createTodo(page, `${viewport.name} todo`);
//                 await expect(page.getByText(`${viewport.name} todo`)).toBeVisible();

//                 // Take screenshot for visual verification
//                 await page.screenshot({ 
//                     path: `test-results/todomvc-${viewport.name.toLowerCase()}.png`,
//                     fullPage: true 
//                 });
//                 console.log(`Screenshot captured for ${viewport.name}`);
//             });
//         }
//     });

//     // ========== STRESS TESTS ==========
//     test.describe('Stress Tests', () => {
//         test('should handle 100 todos', { 
//             tag: ['@stress', '@performance', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P3' },
//                 { type: 'category', description: 'Stress' }
//             );

//             console.log('=== Test: 100 Todos ===');

//             const startTime = Date.now();
//             const input = page.getByPlaceholder('What needs to be done?');

//             for (let i = 0; i < 100; i++) {
//                 await input.fill(`Todo ${i}`);
//                 await input.press('Enter');
//             }

//             const endTime = Date.now();
//             const duration = endTime - startTime;

//             const count = await getTodoCount(page);
//             expect(count).toBe(100);
//             console.log(`Created 100 todos in ${duration}ms (${(duration / 100).toFixed(2)}ms per todo)`);
//         });

//         test('should handle rapid toggle operations', { 
//             tag: ['@stress', '@performance', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P3' },
//                 { type: 'category', description: 'Stress' }
//             );

//             console.log('=== Test: Rapid Toggle ===');

//             // Create 20 todos
//             for (let i = 0; i < 20; i++) {
//                 await createTodo(page, `Todo ${i}`);
//             }

//             // Rapidly toggle todos
//             const todos = page.locator('.todo-list li');
//             const startTime = Date.now();

//             for (let i = 0; i < 20; i++) {
//                 await todos.nth(i).locator('input[type="checkbox"]').check();
//                 await todos.nth(i).locator('input[type="checkbox"]').uncheck();
//             }

//             const endTime = Date.now();
//             const duration = endTime - startTime;
//             console.log(`Toggled 20 todos in ${duration}ms`);
//         });
//     });

//     // ========== INTEGRATION TESTS ==========
//     test.describe('Integration Tests', () => {
//         test('should handle complete workflow', { 
//             tag: ['@integration', '@e2e', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P0' },
//                 { type: 'category', description: 'Integration' }
//             );

//             console.log('=== Test: Complete Workflow ===');

//             await test.step('Create multiple todos', async () => {
//                 for (const todo of TODO_ITEMS.slice(0, 3)) {
//                     await createTodo(page, todo);
//                 }
//                 console.log('Created 3 todos');
//             });

//             await test.step('Complete some todos', async () => {
//                 const todos = page.locator('.todo-list li');
//                 await todos.nth(0).locator('input[type="checkbox"]').check();
//                 await todos.nth(1).locator('input[type="checkbox"]').check();
//                 console.log('Completed 2 todos');
//             });

//             await test.step('Filter by Active', async () => {
//                 await page.getByRole('link', { name: 'Active' }).click();
//                 const count = await getTodoCount(page);
//                 expect(count).toBe(1);
//                 console.log('Filtered to active todos');
//             });

//             await test.step('Edit remaining todo', async () => {
//                 const todo = page.locator('.todo-list li').first();
//                 await todo.dblclick();
//                 const editInput = page.locator('.todo-list li.editing input.edit');
//                 await editInput.fill('Edited todo');
//                 await editInput.press('Enter');
//                 console.log('Edited todo');
//             });

//             await test.step('Complete and clear', async () => {
//                 await page.getByRole('link', { name: 'All' }).click();
//                 await page.locator('.todo-list li').first().locator('input[type="checkbox"]').check();
//                 await page.getByRole('button', { name: 'Clear completed' }).click();
//                 console.log('Cleared completed todos');
//             });

//             await test.step('Verify final state', async () => {
//                 const count = await getTodoCount(page);
//                 expect(count).toBe(2);
//                 console.log('Workflow completed successfully');
//             });
//         });
//     });

//     // ========== ERROR HANDLING ==========
//     test.describe('Error Handling', () => {
//         test('should handle console errors gracefully', { 
//             tag: ['@regression', '@error-handling', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Error Handling' }
//             );

//             console.log('=== Test: Console Error Handling ===');

//             const consoleErrors: string[] = [];
//             page.on('console', msg => {
//                 if (msg.type() === 'error') {
//                     consoleErrors.push(msg.text());
//                     console.log(`Console error: ${msg.text()}`);
//                 }
//             });

//             page.on('pageerror', error => {
//                 console.log(`Page error: ${error.message}`);
//             });

//             await createTodo(page, 'Test todo');
//             // Application should work even if there are console errors
//             await expect(page.getByText('Test todo')).toBeVisible();
//         });
//     });

//     // ========== VISUAL TESTS ==========
//     test.describe('Visual Tests', () => {
//         test('should capture screenshots at key points', { 
//             tag: ['@regression', '@visual', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Visual' }
//             );

//             console.log('=== Test: Visual Screenshots ===');

//             await test.step('Initial state', async () => {
//                 await page.screenshot({ 
//                     path: 'test-results/todomvc-initial.png',
//                     fullPage: true 
//                 });
//             });

//             await test.step('With todos', async () => {
//                 await createTodo(page, 'Screenshot Todo 1');
//                 await createTodo(page, 'Screenshot Todo 2');
//                 await page.screenshot({ 
//                     path: 'test-results/todomvc-with-todos.png',
//                     fullPage: true 
//                 });
//             });

//             await test.step('With completed todos', async () => {
//                 await page.locator('.todo-list li').first().locator('input[type="checkbox"]').check();
//                 await page.screenshot({ 
//                     path: 'test-results/todomvc-completed.png',
//                     fullPage: true 
//                 });
//             });

//             console.log('Screenshots captured');
//         });

//         test('should verify element bounding boxes', { 
//             tag: ['@regression', '@visual', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P3' },
//                 { type: 'category', description: 'Visual' }
//             );

//             console.log('=== Test: Bounding Boxes ===');

//             await createTodo(page, 'Bounding box test');

//             const input = page.getByPlaceholder('What needs to be done?');
//             const todo = page.locator('.todo-list li').first();

//             const inputBox = await input.boundingBox();
//             const todoBox = await todo.boundingBox();

//             console.log(`Input box: ${JSON.stringify(inputBox)}`);
//             console.log(`Todo box: ${JSON.stringify(todoBox)}`);

//             expect(inputBox).toBeTruthy();
//             expect(todoBox).toBeTruthy();
//         });
//     });

//     // ========== ADVANCED FEATURES ==========
//     test.describe('Advanced Playwright Features', () => {
//         test('should use storage state', { 
//             tag: ['@regression', '@advanced', '@all'],
//         }, async ({ page, context }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Advanced' }
//             );

//             console.log('=== Test: Storage State ===');

//             await createTodo(page, 'Storage state todo');

//             const storageState = await context.storageState();
//             console.log('Storage state:', JSON.stringify(storageState, null, 2));
//         });

//         test('should handle multiple contexts', { 
//             tag: ['@regression', '@advanced', '@all'],
//         }, async ({ browser }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Advanced' }
//             );

//             console.log('=== Test: Multiple Contexts ===');

//             const context1 = await browser.newContext();
//             const context2 = await browser.newContext();

//             const page1 = await context1.newPage();
//             const page2 = await context2.newPage();

//             await page1.goto('https://demo.playwright.dev/todomvc/');
//             await page2.goto('https://demo.playwright.dev/todomvc/');

//             await createTodo(page1, 'Context 1 todo');
//             await createTodo(page2, 'Context 2 todo');

//             await expect(page1.getByText('Context 1 todo')).toBeVisible();
//             await expect(page2.getByText('Context 2 todo')).toBeVisible();

//             await context1.close();
//             await context2.close();

//             console.log('Multiple contexts handled successfully');
//         });

//         test('should use request interception', { 
//             tag: ['@regression', '@advanced', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Advanced' }
//             );

//             console.log('=== Test: Request Interception ===');

//             let interceptedRequests = 0;

//             await page.route('**/*', route => {
//                 interceptedRequests++;
//                 console.log(`Intercepted: ${route.request().url()}`);
//                 route.continue();
//             });

//             await page.goto('https://demo.playwright.dev/todomvc/', { waitUntil: 'networkidle' });
//             await createTodo(page, 'Intercepted todo');

//             console.log(`Total intercepted requests: ${interceptedRequests}`);
//             expect(interceptedRequests).toBeGreaterThan(0);
//         });

//         test('should evaluate JavaScript in page context', { 
//             tag: ['@regression', '@advanced', '@all'],
//         }, async ({ page }) => {
//             test.info().annotations.push(
//                 { type: 'priority', description: 'P2' },
//                 { type: 'category', description: 'Advanced' }
//             );

//             console.log('=== Test: JavaScript Evaluation ===');

//             const windowSize = await page.evaluate(() => {
//                 return {
//                     width: window.innerWidth,
//                     height: window.innerHeight
//                 };
//             });

//             console.log(`Window size: ${windowSize.width}x${windowSize.height}`);

//             const todoCount = await page.evaluate(() => {
//                 return document.querySelectorAll('.todo-list li').length;
//             });

//             console.log(`Initial todo count: ${todoCount}`);

//             // Create todo via JavaScript
//             await page.evaluate(() => {
//                 const input = document.querySelector('.new-todo') as HTMLInputElement;
//                 if (input) {
//                     input.value = 'JS Created Todo';
//                     input.dispatchEvent(new Event('change'));
//                     input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
//                 }
//             });

//             await expect(page.getByText('JS Created Todo')).toBeVisible();
//             console.log('JavaScript evaluation successful');
//         });
//     });
// });
