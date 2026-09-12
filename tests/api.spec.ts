// import { test, expect, Page } from '@playwright/test';

// // Test data
// const TEST_TODOS = [
//     'API Test Todo 1',
//     'API Test Todo 2',
//     'API Test Todo 3',
//     'API Test Todo 4',
//     'API Test Todo 5'
// ];

// // Helper functions
// async function createTodo(page: Page, text: string) {
//     const newTodoInput = page.getByPlaceholder('What needs to be done?');
//     await newTodoInput.fill(text);
//     await newTodoInput.press('Enter');
//     await expect(page.getByText(text)).toBeVisible();
// }

// async function getTodoCount(page: Page): Promise<number> {
//     return await page.locator('.todo-list li').count();
// }

// // Test suite configuration
// test.describe('TodoMVC API and Data Tests', () => {
//     // Global test configuration
//     test.describe.configure({ 
//         retries: 1,
//         mode: 'parallel'
//     });

//     // Setup and teardown hooks
//     test.beforeEach(async ({ page }) => {
//         console.log('=== Test Setup: Navigating to TodoMVC ===');
        
//         test.info().annotations.push(
//             { type: 'test-type', description: 'API Test' },
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
//                 path: `test-results/api-${testInfo.title.replace(/\s+/g, '-')}-failure.png`,
//                 fullPage: true 
//             });
//         }
//     });

//     // Test 1: Verify initial localStorage state
//     test('should have empty localStorage on initial load', { 
//         tag: ['@api', '@localStorage', '@all'],
//     }, async ({ page, context }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Storage' }
//         );

//         const storageState = await context.storageState();
//         console.log('Initial storage state:', JSON.stringify(storageState));
//     });

//     // Test 2: Verify localStorage after creating todos
//     test('should persist todos in localStorage', { 
//         tag: ['@api', '@localStorage', '@all'],
//     }, async ({ page, context }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Storage' }
//         );

//         await createTodo(page, 'Storage Test Todo');
//         await page.waitForTimeout(500);
        
//         const localStorage = await page.evaluate(() => {
//             return localStorage.getItem('todos-todo');
//         });
        
//         expect(localStorage).toBeTruthy();
//         console.log('LocalStorage contains todos:', localStorage);
//     });

//     // Test 3: Verify network request on page load
//     test('should make network requests on page load', { 
//         tag: ['@api', '@network', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Network' }
//         );

//         const requests: string[] = [];
//         page.on('request', request => {
//             requests.push(request.url());
//         });

//         await page.reload({ waitUntil: 'networkidle' });
        
//         expect(requests.length).toBeGreaterThan(0);
//         console.log(`Total requests: ${requests.length}`);
//     });

//     // Test 4: Verify response status codes
//     test('should receive 200 status for main resources', { 
//         tag: ['@api', '@network', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Network' }
//         );

//         const responses: Array<{ url: string; status: number }> = [];
        
//         page.on('response', response => {
//             responses.push({ url: response.url(), status: response.status() });
//         });

//         await page.reload({ waitUntil: 'networkidle' });
        
//         const mainResources = responses.filter(r => 
//             r.url.includes('todomvc') || r.url.includes('playwright')
//         );
        
//         mainResources.forEach(resource => {
//             expect(resource.status).toBe(200);
//         });
//     });

//     // Test 5: Verify data structure in localStorage
//     test('should store todos in correct JSON format', { 
//         tag: ['@api', '@localStorage', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Data Structure' }
//         );

//         await createTodo(page, 'JSON Test');
//         await page.waitForTimeout(500);
        
//         const todosJson = await page.evaluate(() => {
//             return localStorage.getItem('todos-todo');
//         });
        
//         expect(todosJson).toBeTruthy();
//         const todos = JSON.parse(todosJson!);
//         expect(Array.isArray(todos)).toBe(true);
//         expect(todos.length).toBeGreaterThan(0);
//     });

//     // Test 6: Verify todo object properties
//     test('should have correct todo object properties', { 
//         tag: ['@api', '@data-validation', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Data Validation' }
//         );

//         await createTodo(page, 'Property Test');
//         await page.waitForTimeout(500);
        
//         const todos = await page.evaluate(() => {
//             const stored = localStorage.getItem('todos-todo');
//             return stored ? JSON.parse(stored) : [];
//         });
        
//         const todo = todos[0];
//         expect(todo).toHaveProperty('title');
//         expect(todo).toHaveProperty('completed');
//         expect(todo).toHaveProperty('id');
//     });

//     // Test 7: Verify multiple todos storage
//     test('should store multiple todos correctly', { 
//         tag: ['@api', '@localStorage', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Storage' }
//         );

//         for (const todo of TEST_TODOS) {
//             await createTodo(page, todo);
//         }
        
//         await page.waitForTimeout(500);
        
//         const todos = await page.evaluate(() => {
//             const stored = localStorage.getItem('todos-todo');
//             return stored ? JSON.parse(stored) : [];
//         });
        
//         expect(todos.length).toBe(TEST_TODOS.length);
//     });

//     // Test 8: Verify completed status persistence
//     test('should persist completed status in localStorage', { 
//         tag: ['@api', '@localStorage', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Storage' }
//         );

//         await createTodo(page, 'Complete Test');
//         await page.locator('.todo-list li').first().locator('input[type="checkbox"]').check();
//         await page.waitForTimeout(500);
        
//         const todos = await page.evaluate(() => {
//             const stored = localStorage.getItem('todos-todo');
//             return stored ? JSON.parse(stored) : [];
//         });
        
//         expect(todos[0].completed).toBe(true);
//     });

//     // Test 9: Verify deletion updates localStorage
//     test('should update localStorage on todo deletion', { 
//         tag: ['@api', '@localStorage', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Storage' }
//         );

//         await createTodo(page, 'Delete Test 1');
//         await createTodo(page, 'Delete Test 2');
        
//         const initialCount = await page.evaluate(() => {
//             const stored = localStorage.getItem('todos-todo');
//             return stored ? JSON.parse(stored).length : 0;
//         });
        
//         await page.locator('.todo-list li').first().hover();
//         await page.locator('.todo-list li').first().locator('.destroy').click();
//         await page.waitForTimeout(500);
        
//         const finalCount = await page.evaluate(() => {
//             const stored = localStorage.getItem('todos-todo');
//             return stored ? JSON.parse(stored).length : 0;
//         });
        
//         expect(finalCount).toBe(initialCount - 1);
//     });

//     // Test 10: Verify edit updates localStorage
//     test('should update localStorage on todo edit', { 
//         tag: ['@api', '@localStorage', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Storage' }
//         );

//         await createTodo(page, 'Original Text');
//         await page.locator('.todo-list li').first().dblclick();
//         await page.locator('.todo-list li.editing input.edit').fill('Edited Text');
//         await page.locator('.todo-list li.editing input.edit').press('Enter');
//         await page.waitForTimeout(500);
        
//         const todos = await page.evaluate(() => {
//             const stored = localStorage.getItem('todos-todo');
//             return stored ? JSON.parse(stored) : [];
//         });
        
//         expect(todos[0].title).toBe('Edited Text');
//     });

//     // Test 11: Verify filter state in URL
//     test('should update URL on filter change', { 
//         tag: ['@api', '@url-state', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'URL State' }
//         );

//         await createTodo(page, 'Filter Test');
//         await page.getByRole('link', { name: 'Active' }).click();
        
//         const url = page.url();
//         console.log('URL after filter:', url);
//         expect(url).toBeTruthy();
//     });

//     // Test 12: Verify data integrity after reload
//     test('should maintain data integrity after page reload', { 
//         tag: ['@api', '@persistence', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Persistence' }
//         );

//         await createTodo(page, 'Reload Test 1');
//         await createTodo(page, 'Reload Test 2');
        
//         await page.reload({ waitUntil: 'networkidle' });
        
//         await expect(page.getByText('Reload Test 1')).toBeVisible();
//         await expect(page.getByText('Reload Test 2')).toBeVisible();
//     });

//     // Test 13: Verify network timing
//     test('should measure network request timing', { 
//         tag: ['@api', '@performance', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Performance' }
//         );

//         const requestTimes = new Map<string, number>();
//         const timings: number[] = [];
        
//         page.on('request', request => {
//             requestTimes.set(request.url(), Date.now());
//         });
        
//         page.on('response', response => {
//             const requestTime = requestTimes.get(response.url());
//             if (requestTime) {
//                 const responseTime = Date.now();
//                 timings.push(responseTime - requestTime);
//             }
//         });

//         const startTime = Date.now();
//         await page.reload({ waitUntil: 'networkidle' });
//         const totalTime = Date.now() - startTime;
        
//         if (timings.length > 0) {
//             const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
//             console.log(`Average response time: ${avgTiming}ms`);
//             console.log(`Total page load time: ${totalTime}ms`);
//         }
        
//         expect(totalTime).toBeLessThan(10000);
//     });

//     // Test 14: Verify request headers
//     test('should send correct request headers', { 
//         tag: ['@api', '@network', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Network' }
//         );

//         let headers: Record<string, string> = {};
        
//         page.on('request', request => {
//             if (request.url().includes('todomvc')) {
//                 headers = request.headers();
//             }
//         });

//         await page.reload({ waitUntil: 'networkidle' });
        
//         expect(headers).toBeTruthy();
//         console.log('Request headers:', headers);
//     });

//     // Test 15: Verify response headers
//     test('should receive correct response headers', { 
//         tag: ['@api', '@network', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Network' }
//         );

//         let headers: Record<string, string> = {};
        
//         page.on('response', response => {
//             if (response.url().includes('todomvc')) {
//                 headers = response.headers();
//             }
//         });

//         await page.reload({ waitUntil: 'networkidle' });
        
//         expect(headers).toBeTruthy();
//         expect(headers['content-type']).toBeTruthy();
//     });

//     // Test 16: Verify localStorage size limits
//     test('should handle large localStorage data', { 
//         tag: ['@api', '@storage', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Storage' }
//         );

//         const longText = 'A'.repeat(1000);
//         await createTodo(page, longText);
//         await page.waitForTimeout(500);
        
//         const todos = await page.evaluate(() => {
//             return localStorage.getItem('todos-todo');
//         });
        
//         expect(todos).toBeTruthy();
//         expect(todos!.length).toBeGreaterThan(1000);
//     });

//     // Test 17: Verify todo ID uniqueness
//     test('should generate unique IDs for todos', { 
//         tag: ['@api', '@data-validation', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Data Validation' }
//         );

//         for (const todo of TEST_TODOS) {
//             await createTodo(page, todo);
//         }
        
//         await page.waitForTimeout(500);
        
//         const todos = await page.evaluate(() => {
//             const stored = localStorage.getItem('todos-todo');
//             return stored ? JSON.parse(stored) : [];
//         });
        
//         const ids = todos.map((t: { id: string }) => t.id);
//         const uniqueIds = new Set(ids);
//         expect(uniqueIds.size).toBe(ids.length);
//     });

//     // Test 18: Verify data after clear completed
//     test('should update localStorage after clear completed', { 
//         tag: ['@api', '@localStorage', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Storage' }
//         );

//         await createTodo(page, 'Complete 1');
//         await createTodo(page, 'Complete 2');
//         await createTodo(page, 'Active 1');
        
//         await page.locator('.todo-list li').nth(0).locator('input[type="checkbox"]').check();
//         await page.locator('.todo-list li').nth(1).locator('input[type="checkbox"]').check();
        
//         await page.getByRole('button', { name: 'Clear completed' }).click();
//         await page.waitForTimeout(500);
        
//         const todos = await page.evaluate(() => {
//             const stored = localStorage.getItem('todos-todo');
//             return stored ? JSON.parse(stored) : [];
//         });
        
//         expect(todos.length).toBe(1);
//         expect(todos[0].title).toBe('Active 1');
//     });

//     // Test 19: Verify toggle all updates localStorage
//     test('should update all todos in localStorage on toggle all', { 
//         tag: ['@api', '@localStorage', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Storage' }
//         );

//         for (const todo of TEST_TODOS) {
//             await createTodo(page, todo);
//         }
        
//         await page.locator('.toggle-all').click();
//         await page.waitForTimeout(500);
        
//         const todos = await page.evaluate(() => {
//             const stored = localStorage.getItem('todos-todo');
//             return stored ? JSON.parse(stored) : [];
//         });
        
//         todos.forEach((todo: { completed: boolean }) => {
//             expect(todo.completed).toBe(true);
//         });
//     });

//     // Test 20: Verify network error handling
//     test('should handle network errors gracefully', {
//         tag: ['@api', '@error-handling', '@all'],
//         annotation: { type: 'testdino:notify-slack', description: '@sahil,@priv,#priv' },
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Error Handling' }
//         );

//         const errors: string[] = [];
        
//         page.on('requestfailed', request => {
//             errors.push(request.url());
//         });

//         await page.reload({ waitUntil: 'networkidle' });
        
//         // Application should still work even with some failed requests
//         await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
//         // Force fail so testdino:notify-slack sends alert to @sahil,@priv
//         expect(1).toBe(2);
//     });

//     // Test 21: Verify data serialization
//     test('should serialize todo data correctly', { 
//         tag: ['@api', '@data-validation', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Data Validation' }
//         );

//         await createTodo(page, 'Serialization Test');
//         await page.waitForTimeout(500);
        
//         const todosJson = await page.evaluate(() => {
//             return localStorage.getItem('todos-todo');
//         });
        
//         const parsed = JSON.parse(todosJson!);
//         const reSerialized = JSON.stringify(parsed);
        
//         expect(reSerialized).toBe(todosJson);
//     });

//     // Test 22: Verify localStorage key name
//     test('should use correct localStorage key', { 
//         tag: ['@api', '@localStorage', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Storage' }
//         );

//         await createTodo(page, 'Key Test');
//         await page.waitForTimeout(500);
        
//         const keys = await page.evaluate(() => {
//             return Object.keys(localStorage);
//         });
        
//         const todoKey = keys.find(key => key.includes('todo'));
//         expect(todoKey).toBeTruthy();
//     });

//     // Test 23: Verify data after multiple operations
//     test('should maintain correct data after multiple operations', { 
//         tag: ['@api', '@data-integrity', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Data Integrity' }
//         );

//         await createTodo(page, 'Op Test 1');
//         await createTodo(page, 'Op Test 2');
//         await page.locator('.todo-list li').first().locator('input[type="checkbox"]').check();
//         await page.locator('.todo-list li').first().dblclick();
//         await page.locator('.todo-list li.editing input.edit').fill('Edited');
//         await page.locator('.todo-list li.editing input.edit').press('Enter');
//         await page.waitForTimeout(500);
        
//         const todos = await page.evaluate(() => {
//             const stored = localStorage.getItem('todos-todo');
//             return stored ? JSON.parse(stored) : [];
//         });
        
//         expect(todos.length).toBe(2);
//         expect(todos[0].title).toBe('Edited');
//         expect(todos[0].completed).toBe(true);
//     });

//     // Test 24: Verify request method types
//     test('should use correct HTTP methods', { 
//         tag: ['@api', '@network', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Network' }
//         );

//         const methods: string[] = [];
        
//         page.on('request', request => {
//             methods.push(request.method());
//         });

//         await page.reload({ waitUntil: 'networkidle' });
        
//         expect(methods).toContain('GET');
//         console.log('HTTP methods used:', [...new Set(methods)]);
//     });

//     // Test 25: Verify response content types
//     test('should receive correct content types', { 
//         tag: ['@api', '@network', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Network' }
//         );

//         const contentTypes: string[] = [];
        
//         page.on('response', response => {
//             const contentType = response.headers()['content-type'];
//             if (contentType) {
//                 contentTypes.push(contentType);
//             }
//         });

//         await page.reload({ waitUntil: 'networkidle' });
        
//         expect(contentTypes.length).toBeGreaterThan(0);
//         console.log('Content types:', [...new Set(contentTypes)]);
//     });

//     // Test 26: Verify localStorage quota
//     test('should handle localStorage quota limits', { 
//         tag: ['@api', '@storage', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Storage' }
//         );

//         const quota = await page.evaluate(() => {
//             if ('storage' in navigator && 'estimate' in navigator.storage) {
//                 return navigator.storage.estimate();
//             }
//             return null;
//         });
        
//         if (quota) {
//             console.log('Storage quota:', quota);
//             expect(quota).toBeTruthy();
//         }
//     });

//     // Test 27: Verify data after filter operations
//     test('should maintain data after filter operations', { 
//         tag: ['@api', '@localStorage', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P1' },
//             { type: 'category', description: 'Storage' }
//         );

//         await createTodo(page, 'Filter Data 1');
//         await createTodo(page, 'Filter Data 2');
//         await page.locator('.todo-list li').first().locator('input[type="checkbox"]').check();
        
//         await page.getByRole('link', { name: 'Active' }).click();
//         await page.waitForTimeout(500);
        
//         const todos = await page.evaluate(() => {
//             const stored = localStorage.getItem('todos-todo');
//             return stored ? JSON.parse(stored) : [];
//         });
        
//         expect(todos.length).toBe(2);
//     });

//     // Test 28: Verify request URLs
//     test('should make requests to correct URLs', { 
//         tag: ['@api', '@network', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Network' }
//         );

//         const urls: string[] = [];
        
//         page.on('request', request => {
//             urls.push(request.url());
//         });

//         await page.reload({ waitUntil: 'networkidle' });
        
//         const mainUrl = urls.find(url => url.includes('todomvc') || url.includes('playwright'));
//         expect(mainUrl).toBeTruthy();
//     });

//     // Test 29: Verify response status codes distribution
//     test('should receive appropriate status codes', { 
//         tag: ['@api', '@network', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P2' },
//             { type: 'category', description: 'Network' }
//         );

//         const statusCodes: number[] = [];
        
//         page.on('response', response => {
//             statusCodes.push(response.status());
//         });

//         await page.reload({ waitUntil: 'networkidle' });
        
//         const successCodes = statusCodes.filter(code => code >= 200 && code < 300);
//         expect(successCodes.length).toBeGreaterThan(0);
//     });

//     // Test 30: Verify complete data lifecycle
//     test('should handle complete data lifecycle correctly', { 
//         tag: ['@api', '@integration', '@all'],
//     }, async ({ page }) => {
//         test.info().annotations.push(
//             { type: 'priority', description: 'P0' },
//             { type: 'category', description: 'Integration' }
//         );

//         // Create
//         await createTodo(page, 'Lifecycle Test');
//         await page.waitForTimeout(300);
        
//         // Read
//         const initialTodos = await page.evaluate(() => {
//             const stored = localStorage.getItem('todos-todo');
//             return stored ? JSON.parse(stored) : [];
//         });
//         expect(initialTodos.length).toBe(1);
        
//         // Update
//         await page.locator('.todo-list li').first().dblclick();
//         await page.locator('.todo-list li.editing input.edit').fill('Updated');
//         await page.locator('.todo-list li.editing input.edit').press('Enter');
//         await page.waitForTimeout(300);
        
//         const updatedTodos = await page.evaluate(() => {
//             const stored = localStorage.getItem('todos-todo');
//             return stored ? JSON.parse(stored) : [];
//         });
//         expect(updatedTodos[0].title).toBe('Updated');
        
//         // Delete
//         await page.locator('.todo-list li').first().hover();
//         await page.locator('.todo-list li').first().locator('.destroy').click();
//         await page.waitForTimeout(300);
        
//         const finalTodos = await page.evaluate(() => {
//             const stored = localStorage.getItem('todos-todo');
//             return stored ? JSON.parse(stored) : [];
//         });
//         expect(finalTodos.length).toBe(0);
//     });
// });

