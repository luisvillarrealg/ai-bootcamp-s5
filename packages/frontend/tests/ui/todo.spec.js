const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

// The backend store is shared and in-memory, so each test uses a unique title
const uniqueTitle = (label) => `${label} ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

test.describe('TODO app critical journeys', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
  });

  test('creates a todo', async () => {
    const title = uniqueTitle('Create');
    await todoPage.goto();

    await todoPage.addTodo(title);

    await expect(todoPage.newTodoInput).toHaveValue('');
    await todoPage.deleteTodo(title);
  });

  test('toggles a todo complete and back', async ({ page }) => {
    const title = uniqueTitle('Toggle');
    await todoPage.goto();
    await todoPage.addTodo(title);
    const checkbox = page.getByRole('checkbox', { name: `Toggle ${title}` });

    await todoPage.toggleTodo(title);
    await expect(checkbox).toBeChecked();

    await todoPage.toggleTodo(title);
    await expect(checkbox).not.toBeChecked();

    await todoPage.deleteTodo(title);
  });

  test('edits a todo title', async () => {
    const title = uniqueTitle('Edit');
    const newTitle = `${title} updated`;
    await todoPage.goto();
    await todoPage.addTodo(title);

    await todoPage.editTodo(title, newTitle);

    await expect(todoPage.todoItem(newTitle)).toBeVisible();
    await todoPage.deleteTodo(newTitle);
  });

  test('deletes a todo', async () => {
    const title = uniqueTitle('Delete');
    await todoPage.goto();
    await todoPage.addTodo(title);

    await todoPage.deleteTodo(title);

    await expect(todoPage.todoItem(title)).toHaveCount(0);
  });

  test('shows an error message when the API fails', async ({ page }) => {
    await page.route('**/api/todos', (route) => route.abort());

    await page.goto('/');

    await expect(todoPage.errorAlert).toContainText('Failed to load todos');
  });
});
