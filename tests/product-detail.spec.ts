import { test, expect } from '@playwright/test';

test('product details are visible', async ({ page }) => {
  await page.goto('/');
  const products = page.locator('[data-testid^="product-card"]');
  await expect(products.first()).toBeVisible();

  await products.first().click();

  await expect(page).toHaveURL(/products/);

  await expect(page.getByText(/₹|\$/)).toBeVisible();
});

test('add to cart button works', async ({ page }) => {
  await page.goto('/');

  const products = page.locator('[data-testid^="product-card"]');
  await products.first().click();

  const addBtn = page.getByRole('button', { name: /add to cart/i });
  await expect(addBtn).toBeVisible();
  await expect(addBtn).toBeEnabled();
});