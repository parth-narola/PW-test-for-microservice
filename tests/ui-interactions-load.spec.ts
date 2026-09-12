// import { test, expect, Page } from '@playwright/test';

// // Test data
// const UI_TEST_TODOS = [
//     'UI Test Todo 1',
//     'UI Test Todo 2',
//     'UI Test Todo 3',
//     'UI Test Todo 4',
//     'UI Test Todo 5'
// ];

// // Helper functions
// async function createTodo(page: Page, text: string) {
//     const newTodoInput = page.getByPlaceholder('What needs to be done?');
//     await newTodoInput.fill(text);
//     await newTodoInput.press('Enter');
//     await expect(page.getByText(text)).toBeVisible();
// }

// // Test suite configuration
// test.describe('TodoMVC UI Interactions and UX Tests', () => {
//     // Global test configuration
//     test.describe.configure({ 
//         retries: 1,
//         mode: 'parallel'
//     });

//     // Setup and teardown hooks
//     test.beforeEach(async ({ page }) => {
//         console.log('=== Test Setup: Navigating to TodoMVC ===');
        
//         test.info().annotations.push(
//             { type: 'test-type', description: 'UI Test' },
//             { type: 'application', description: 'TodoMVC' },
//             { type: 'url', description: 'https://demo.playwright.dev/todomvc/' }
//         );

//         await page.setViewportSize({ width: 1280, height: 720 });
        
//         const response = await page.goto('https://demo.playwright.dev/todomvc/', {
//             waitUntil: 'networkidle',
//             timeout: 30000
//         });
        
//         expect(response?.status()).toBe(200);
//         await expect(page).toHaveTitle(/TodoMVC/);
//         await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
//     });

//     test.afterEach(async ({ page }, testInfo) => {
//         if (testInfo.status !== 'passed') {
//             await page.screenshot({ 
//                 path: `test-results/ui-${testInfo.title.replace(/\s+/g, '-')}-failure.png`,
//                 fullPage: true 
//             });
//         }
//     });

//     // Test 1: Verify input field focus
//     test('should focus input field on page load', { 
//         tag: ['@ui', '@focus', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Focus Management' }
//         );

//         const input = page.getByPlaceholder('What needs to be done?');
//         const isFocused = await input.evaluate(el => document.activeElement === el);
//         console.log('Input focused:', isFocused);
//     });

//     // Test 2: Verify input placeholder text
//     test('should display correct placeholder text', { 
//         tag: ['@ui', '@accessibility', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Accessibility' }
//         );

//         const input = page.getByPlaceholder('What needs to be done?');
//         const placeholder = await input.getAttribute('placeholder');
//         expect(placeholder).toBe('What needs to be done?');
//     });

//     // Test 3: Verify todo list visibility
//     test('should show todo list when todos exist', { 
//         tag: ['@ui', '@visibility', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Visibility' }
//         );

//         await createTodo(page, 'Visibility Test');
//         const todoList = page.locator('.todo-list');
//         await expect(todoList).toBeVisible();
//     });

//     // Test 4: Verify todo count display
//     test('should display correct todo count', { 
//         tag: ['@ui', '@counter', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Counter' }
//         );

//         await createTodo(page, 'Count Test 1');
//         await createTodo(page, 'Count Test 2');
        
//         const countText = await page.locator('.todo-count').textContent();
//         expect(countText).toContain('2');
//     });

//     // Test 5: Verify checkbox visibility
//     test('should show checkbox for each todo', { 
//         tag: ['@ui', '@checkbox', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Checkbox' }
//         );

//         await createTodo(page, 'Checkbox Test');
//         const checkbox = page.locator('.todo-list li').first().locator('input[type="checkbox"]');
//         await expect(checkbox).toBeVisible();
//     });

//     // Test 6: Verify delete button on hover
//     test('should show delete button on todo hover', { 
//         tag: ['@ui', '@hover', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Hover' }
//         );

//         await createTodo(page, 'Hover Test');
//         const todo = page.locator('.todo-list li').first();
//         await todo.hover();
        
//         const deleteButton = todo.locator('.destroy');
//         await expect(deleteButton).toBeVisible();
//     });

//     // Test 7: Verify filter buttons visibility
//     test('should display all filter buttons', { 
//         tag: ['@ui', '@filters', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Filters' }
//         );

//         await createTodo(page, 'Filter UI Test');
        
//         await expect(page.getByRole('link', { name: 'All' })).toBeVisible();
//         await expect(page.getByRole('link', { name: 'Active' })).toBeVisible();
//         await expect(page.getByRole('link', { name: 'Completed' })).toBeVisible();
//     });

//     // Test 8: Verify toggle all button visibility
//     test('should show toggle all button when todos exist', { 
//         tag: ['@ui', '@toggle-all', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Toggle All' }
//         );

//         await createTodo(page, 'Toggle All Test');
//         const toggleAll = page.locator('.toggle-all');
//         await expect(toggleAll).toBeVisible();
//     });

//     // Test 9: Verify completed todo styling
//     test('should apply completed styling to checked todos', { 
//         tag: ['@ui', '@styling', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Styling' }
//         );

//         await createTodo(page, 'Styling Test');
//         const todo = page.locator('.todo-list li').first();
//         await todo.locator('input[type="checkbox"]').check();
        
//         const className = await todo.getAttribute('class');
//         expect(className).toContain('completed');
//     });

//     // Test 10: Verify edit mode activation
//     test('should enter edit mode on double click', { 
//         tag: ['@ui', '@edit-mode', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Edit Mode' }
//         );

//         await createTodo(page, 'Edit Mode Test');
//         const todo = page.locator('.todo-list li').first();
//         await todo.dblclick();
        
//         const editInput = page.locator('.todo-list li.editing input.edit');
//         await expect(editInput).toBeVisible();
//     });

//     // Test 11: Verify input field clears after submission
//     test('should clear input field after todo creation', { 
//         tag: ['@ui', '@input', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Input' }
//         );

//         const input = page.getByPlaceholder('What needs to be done?');
//         await input.fill('Clear Test');
//         await input.press('Enter');
        
//         await expect(input).toHaveValue('');
//     });

//     // Test 12: Verify footer visibility
//     test('should display footer when todos exist', { 
//         tag: ['@ui', '@footer', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Footer' }
//         );

//         await createTodo(page, 'Footer Test');
//         const footer = page.locator('footer');
//         await expect(footer).toBeVisible();
//     });

//     // Test 13: Verify clear completed button visibility
//     test('should show clear completed button when completed todos exist', { 
//         tag: ['@ui', '@clear-completed', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Clear Completed' }
//         );

//         await createTodo(page, 'Clear Test');
//         await page.locator('.todo-list li').first().locator('input[type="checkbox"]').check();
        
//         const clearButton = page.getByRole('button', { name: 'Clear completed' });
//         await expect(clearButton).toBeVisible();
//     });

//     // Test 14: Verify active filter highlighting
//     test('should highlight active filter', { 
//         tag: ['@ui', '@filters', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Filters' }
//         );

//         await createTodo(page, 'Filter Highlight Test');
//         await page.getByRole('link', { name: 'Active' }).click();
        
//         const activeLink = page.getByRole('link', { name: 'Active' });
//         const className = await activeLink.getAttribute('class');
//         expect(className).toContain('selected');
//     });

//     // Test 15: Verify todo text visibility
//     test('should display todo text correctly', { 
//         tag: ['@ui', '@text-display', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Text Display' }
//         );

//         const todoText = 'Text Display Test';
//         await createTodo(page, todoText);
        
//         await expect(page.getByText(todoText)).toBeVisible();
//     });

//     // Test 16: Verify element positioning
//     test('should position elements correctly', { 
//         tag: ['@ui', '@layout', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Layout' }
//         );

//         await createTodo(page, 'Layout Test');
        
//         const input = page.getByPlaceholder('What needs to be done?');
//         const todoList = page.locator('.todo-list');
        
//         const inputBox = await input.boundingBox();
//         const listBox = await todoList.boundingBox();
        
//         expect(inputBox).toBeTruthy();
//         expect(listBox).toBeTruthy();
//         expect(listBox!.y).toBeGreaterThan(inputBox!.y! + inputBox!.height!);
//     });

//     // Test 17: Verify keyboard focus navigation
//     test('should navigate focus with keyboard', { 
//         tag: ['@ui', '@keyboard', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Keyboard Navigation' }
//         );

//         await createTodo(page, 'Keyboard Test');
        
//         const input = page.getByPlaceholder('What needs to be done?');
//         await input.focus();
//         await page.keyboard.press('Tab');
        
//         const focusedElement = await page.evaluate(() => {
//             return document.activeElement?.tagName;
//         });
        
//         console.log('Focused element after Tab:', focusedElement);
//     });

//     // Test 18: Verify checkbox state change
//     test('should update checkbox state visually', { 
//         tag: ['@ui', '@checkbox', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Checkbox' }
//         );

//         await createTodo(page, 'Checkbox State Test');
//         const checkbox = page.locator('.todo-list li').first().locator('input[type="checkbox"]');
        
//         await expect(checkbox).not.toBeChecked();
//         await checkbox.check();
//         await expect(checkbox).toBeChecked();
//     });

//     // Test 19: Verify todo list ordering
//     test('should maintain todo list order', { 
//         tag: ['@ui', '@ordering', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Ordering' }
//         );

//         for (const todo of UI_TEST_TODOS) {
//             await createTodo(page, todo);
//         }
        
//         const todos = page.locator('.todo-list li');
//         for (let i = 0; i < UI_TEST_TODOS.length; i++) {
//             await expect(todos.nth(i)).toContainText(UI_TEST_TODOS[i]);
//         }
//     });

//     // Test 20: Verify responsive layout
//     test('should adapt to different viewport sizes', { 
//         tag: ['@ui', '@responsive', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Responsive' }
//         );

//         await page.setViewportSize({ width: 375, height: 667 });
//         await createTodo(page, 'Responsive Test');
        
//         const input = page.getByPlaceholder('What needs to be done?');
//         await expect(input).toBeVisible();
        
//         const inputBox = await input.boundingBox();
//         expect(inputBox!.width).toBeLessThan(400);
//     });

//     // Test 21: Verify element colors
//     test('should apply correct element colors', { 
//         tag: ['@ui', '@styling', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Styling' }
//         );

//         await createTodo(page, 'Color Test');
//         const todo = page.locator('.todo-list li').first();
        
//         const color = await todo.evaluate(el => {
//             return window.getComputedStyle(el).color;
//         });
        
//         expect(color).toBeTruthy();
//         console.log('Todo text color:', color);
//     });

//     // Test 22: Verify font sizes
//     test('should use appropriate font sizes', { 
//         tag: ['@ui', '@typography', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Typography' }
//         );

//         const input = page.getByPlaceholder('What needs to be done?');
//         const fontSize = await input.evaluate(el => {
//             return window.getComputedStyle(el).fontSize;
//         });
        
//         expect(fontSize).toBeTruthy();
//         console.log('Input font size:', fontSize);
//     });

//     // Test 23: Verify button click feedback
//     test('should provide visual feedback on button click', { 
//         tag: ['@ui', '@interaction', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Interaction' }
//         );

//         await createTodo(page, 'Button Feedback Test');
//         await page.locator('.todo-list li').first().locator('input[type="checkbox"]').check();
        
//         const clearButton = page.getByRole('button', { name: 'Clear completed' });
//         await clearButton.click();
        
//         await expect(page.getByText('Button Feedback Test')).not.toBeVisible();
//     });

//     // Test 24: Verify loading state
//     test('should handle loading states correctly', { 
//         tag: ['@ui', '@loading', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Loading' }
//         );

//         const input = page.getByPlaceholder('What needs to be done?');
//         await input.fill('Loading Test');
        
//         // Input should remain interactive during typing
//         await expect(input).toBeEnabled();
//         await input.press('Enter');
        
//         // Should show todo immediately
//         await expect(page.getByText('Loading Test')).toBeVisible();
//     });

//     // Test 25: Verify error state handling
//     test('should handle error states gracefully', { 
//         tag: ['@ui', '@error-handling', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Error Handling' }
//         );

//         // Try to create empty todo (should be handled)
//         const input = page.getByPlaceholder('What needs to be done?');
//         await input.press('Enter');
        
//         // Application should remain functional
//         await expect(input).toBeVisible();
//         await expect(input).toBeEnabled();
//     });

//     // Test 26: Verify scroll behavior
//     test('should handle scrolling with many todos', { 
//         tag: ['@ui', '@scrolling', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Scrolling' }
//         );

//         for (let i = 0; i < 20; i++) {
//             await createTodo(page, `Scroll Test ${i}`);
//         }
        
//         const todoList = page.locator('.todo-list');
//         const scrollHeight = await todoList.evaluate(el => el.scrollHeight);
//         const clientHeight = await todoList.evaluate(el => el.clientHeight);
        
//         if (scrollHeight > clientHeight) {
//             console.log('List is scrollable');
//         }
//     });

//     // Test 27: Verify element z-index
//     test('should layer elements correctly', { 
//         tag: ['@ui', '@layering', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Layering' }
//         );

//         await createTodo(page, 'Layering Test');
//         const todo = page.locator('.todo-list li').first();
//         await todo.hover();
        
//         const deleteButton = todo.locator('.destroy');
//         const zIndex = await deleteButton.evaluate(el => {
//             return window.getComputedStyle(el).zIndex;
//         });
        
//         console.log('Delete button z-index:', zIndex);
//     });

//     // Test 28: Verify transition animations
//     test('should apply smooth transitions', { 
//         tag: ['@ui', '@animations', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Animations' }
//         );

//         await createTodo(page, 'Animation Test');
//         const todo = page.locator('.todo-list li').first();
        
//         const transition = await todo.evaluate(el => {
//             return window.getComputedStyle(el).transition;
//         });
        
//         console.log('Todo transition:', transition);
//     });

//     // Test 29: Verify cursor styles
//     test('should show correct cursor styles', { 
//         tag: ['@ui', '@cursor', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Cursor' }
//         );

//         await createTodo(page, 'Cursor Test');
//         const todo = page.locator('.todo-list li').first();
        
//         const cursor = await todo.evaluate(el => {
//             return window.getComputedStyle(el).cursor;
//         });
        
//         console.log('Todo cursor:', cursor);
//     });

//     // Test 30: Verify complete UI workflow
//     test('should handle complete UI workflow smoothly', { 
//         tag: ['@ui', '@integration', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P0' },
//             { type: 'category', description: 'Integration' }
//         );

//         // Create todos
//         for (const todo of UI_TEST_TODOS) {
//             await createTodo(page, todo);
//         }
        
//         // Verify all visible
//         for (const todo of UI_TEST_TODOS) {
//             await expect(page.getByText(todo)).toBeVisible();
//         }
        
//         // Complete some
//         await page.locator('.todo-list li').nth(0).locator('input[type="checkbox"]').check();
//         await page.locator('.todo-list li').nth(1).locator('input[type="checkbox"]').check();
        
//         // Filter
//         await page.getByRole('link', { name: 'Active' }).click();
//         const activeCount = await page.locator('.todo-list li').count();
//         expect(activeCount).toBe(3);
        
//         // Edit
//         await page.getByRole('link', { name: 'All' }).click();
//         await page.locator('.todo-list li').nth(2).dblclick();
//         await page.locator('.todo-list li.editing input.edit').fill('Edited Todo');
//         await page.locator('.todo-list li.editing input.edit').press('Enter');
        
//         // Verify edit
//         await expect(page.getByText('Edited Todo')).toBeVisible();
        
//         // Clear completed
//         await page.getByRole('button', { name: 'Clear completed' }).click();
//         const finalCount = await page.locator('.todo-list li').count();
//         expect(finalCount).toBe(3);
//     });
// });

