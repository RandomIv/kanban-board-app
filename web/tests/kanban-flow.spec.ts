import { test, expect } from '@playwright/test';

test.describe('Kanban Critical Path', () => {
  test('Full Lifecycle: Create Board -> Add Task -> Drag & Drop -> Edit -> Delete', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByText('Create New Board').click();
    await expect(page).toHaveURL(/\/board\//);

    const columns = page.locator('.w-112\\.5');
    const todoColumn = columns.filter({ hasText: 'To Do' });
    const doneColumn = columns.filter({ hasText: 'Done' });

    await expect(todoColumn).toBeVisible();

    const addTaskBtn = todoColumn.getByRole('button', { name: 'Add Task' });
    const tasks = ['Task 1', 'Task 2'];

    for (const taskName of tasks) {
      await addTaskBtn.click();
      await page.getByLabel('Task Title').fill(taskName);
      await page.getByRole('button', { name: 'Create Task' }).click();
      await expect(todoColumn).toContainText(taskName);
    }

    const card1 = page.locator('.group', { hasText: 'Task 1' });

    const srcBox = await card1.boundingBox();
    const targetBox = await doneColumn.boundingBox();

    if (srcBox && targetBox) {
      await page.mouse.move(
        srcBox.x + srcBox.width / 2,
        srcBox.y + srcBox.height / 2,
      );
      await page.mouse.down();
      await page.mouse.move(
        srcBox.x + srcBox.width / 2 + 10,
        srcBox.y + srcBox.height / 2,
      );
      await page.mouse.move(
        targetBox.x + targetBox.width / 2,
        targetBox.y + targetBox.height / 2,
        { steps: 20 },
      );
      await page.mouse.up();
    }

    await expect(doneColumn).toContainText('Task 1');
    await expect(todoColumn).not.toContainText('Task 1');
    await expect(todoColumn).toContainText('Task 2');

    const card2 = page.locator('.group', { hasText: 'Task 2' });
    await card2.hover();

    const editBtn = card2.locator('button').first();
    await editBtn.click();

    await expect(page.getByLabel('Task Title')).toHaveValue('Task 2');
    await page.getByLabel('Task Title').fill('Task 2 Updated');
    await page.getByRole('button', { name: 'Save Changes' }).click();

    await expect(todoColumn).toContainText('Task 2 Updated');

    const card2Updated = page.locator('.group', { hasText: 'Task 2 Updated' });
    await card2Updated.hover();

    const deleteCardBtn = card2Updated.locator('button').last();
    await deleteCardBtn.click();

    await expect(todoColumn).not.toContainText('Task 2 Updated');

    await page.getByRole('button', { name: 'Delete Board' }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();

    await expect(page).toHaveURL('http://localhost:3000/');
  });
});
