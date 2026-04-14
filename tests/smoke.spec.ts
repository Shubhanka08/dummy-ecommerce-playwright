import { test, expect } from '@playwright/test';

test('app loads products and opens product', async ({ page }) => {
  await page.goto('/');

  // wait for products
  const products = page.locator('[data-testid^="product-card"]');
  await expect(products.first()).toBeVisible({ timeout: 15000 });

  // click first product
  await products.first().click();

  // check navigation worked
  await expect(page).toHaveURL(/products/);

  // check add to cart exists
  const addBtn = page.getByRole('button', { name: /add to cart/i });
  await expect(addBtn).toBeVisible();
});