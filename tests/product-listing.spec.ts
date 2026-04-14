import { test, expect } from '@playwright/test';

test('search product', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.locator('[data-testid="search-input"]');
  await expect(searchInput).toBeVisible({ timeout: 15000 });

  await searchInput.fill('shirt');

  const products = page.locator('[data-testid^="product-card-prod-"]');
  await expect(products.first()).toBeVisible({ timeout: 15000 });
});

test('empty search shows message', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.locator('[data-testid="search-input"]');
  await expect(searchInput).toBeVisible({ timeout: 15000 });

  await searchInput.fill('asdjklasjd');

  await expect(page.locator('text=No products found')).toBeVisible({ timeout: 15000 });
});

test('open product page', async ({ page }) => {
  await page.goto('/');

  const products = page.locator('[data-testid^="product-card-prod-"]');
  await expect(products.first()).toBeVisible({ timeout: 15000 });

  await products.first().click();

  await expect(page).toHaveURL(/product|prod/);
});