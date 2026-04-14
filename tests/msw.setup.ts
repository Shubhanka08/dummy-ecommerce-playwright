import { test as setup } from '@playwright/test';

setup('enable msw + load app', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // wait for app boot
  await page.waitForLoadState('domcontentloaded');

  // IMPORTANT: wait for products to exist
  await page.waitForSelector('[data-testid="product-card"]', {
    timeout: 20000,
  });
});