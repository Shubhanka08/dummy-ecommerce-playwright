import { test, expect } from '@playwright/test';

test('product search works', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.getByPlaceholder(/search/i);
  await searchInput.fill('shirt');

  const products = page.locator('[data-testid^="product-card"]');
  await expect(products.first()).toBeVisible({ timeout: 15000 });
});

test('empty search shows no results', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.getByPlaceholder(/search/i);
  await searchInput.fill('asdjklasjd');

  await expect(page.locator('body')).toContainText(/no products found/i);
});