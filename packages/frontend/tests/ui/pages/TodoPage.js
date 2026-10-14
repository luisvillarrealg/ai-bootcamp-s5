const { expect } = require('@playwright/test');

class TodoPage {
  constructor(page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.addButton = page.getByRole('button', { name: 'Add', exact: true });
    this.errorAlert = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/');
    await expect(
      this.page.getByRole('heading', { name: 'TODO App' })
    ).toBeVisible();
  }

  todoItem(title) {
    return this.page.getByRole('listitem').filter({ hasText: title });
  }

  async addTodo(title) {
    await this.newTodoInput.fill(title);
    await this.addButton.click();
    await expect(this.todoItem(title)).toBeVisible();
  }

  async toggleTodo(title) {
    await this.page.getByRole('checkbox', { name: `Toggle ${title}` }).click();
  }

  async editTodo(title, newTitle) {
    await this.page.getByRole('button', { name: `Edit ${title}` }).click();
    const input = this.page.getByRole('textbox', { name: 'Edit todo title' });
    await input.fill(newTitle);
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async deleteTodo(title) {
    await this.page.getByRole('button', { name: `Delete ${title}` }).click();
  }
}

module.exports = { TodoPage };
