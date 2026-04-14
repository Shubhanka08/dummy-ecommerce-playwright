import { Page, expect } from '@playwright/test';

export async function waitForProducts(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' });

  // wait until at least 1 product appears OR timeout
  await page.waitForFunction(() => {
    return document.querySelectorAll('[data-testid="product-card"]').length > 0;
  }, { timeout: 20000 });

  const products = page.locator('[data-testid="product-card"]');
  await expect(products.first()).toBeVisible();

  return products;
}