import { test, expect } from '@playwright/test';

test('cart shows item', async ({ page }) => {
  await page.goto('/');

  
  await page.waitForSelector('[data-testid="product-card"]', {
    timeout: 20000,
  });

  const products = page.locator('[data-testid="product-card"]');

  await expect(products.first()).toBeVisible();

  await products.first().click();

  await page.getByRole('button', { name: /add to cart/i }).click();

  await page.click('[data-testid="cart-link"]');

  await expect(page.getByText(/cart/i)).toBeVisible();
});

test('remove item from cart', async ({ page }) => {
  await page.goto('/');

  await page.waitForSelector('[data-testid="product-card"]', {
    timeout: 20000,
  });

  const products = page.locator('[data-testid="product-card"]');

  await products.first().click();

  await page.getByRole('button', { name: /add to cart/i }).click();

  await page.click('[data-testid="cart-link"]');

  const removeBtn = page.getByRole('button', { name: /remove/i });

  await expect(removeBtn).toBeVisible();

  await removeBtn.click();
});