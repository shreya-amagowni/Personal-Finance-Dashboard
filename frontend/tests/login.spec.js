import { test, expect } from '@playwright/test';

test('frontend loads successfully', async ({ page }) => {
  await page.goto('/');

  // Replace text if needed
  await expect(page.getByText("Login")).toBeVisible();
});
