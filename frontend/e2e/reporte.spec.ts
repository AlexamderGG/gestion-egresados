import { test, expect } from '@playwright/test';
test('generar reporte requiere login', async ({ page }) => {
  await page.goto('/reportes');
  await expect(page).toHaveURL(/.*login/);
});