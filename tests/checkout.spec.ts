import { test, expect } from '@playwright/test';
import { waitForProducts } from './helpers/waitForProducts';

test('checkout button visible', async ({ page }) => {
  const products = await waitForProducts(page);

  await products.first().click();
  await page.getByRole('button', { name: /add to cart/i }).click();

  await page.click('[data-testid="cart-link"]');

  const checkoutBtn = page.getByRole('button', { name: /checkout/i });

  await expect(checkoutBtn).toBeVisible();
  await expect(checkoutBtn).toBeEnabled();
});