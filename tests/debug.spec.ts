import { test, expect } from '@playwright/test';

test('debug test', async ({ page }) => {
  // go to homepage
  await page.goto('/');

  // wait for page to fully load
  await page.waitForLoadState('networkidle');

  // check title
  const title = await page.title();
  console.log('Page Title:', title);

  // check if products exist
  const products = page.locator('[data-testid="product-card"]');
  const count = await products.count();
  console.log('Product count:', count);

  // take screenshot
  await page.screenshot({ path: 'debug.png', fullPage: true });

  // keep browser open for inspection
  await page.waitForTimeout(5000);
});