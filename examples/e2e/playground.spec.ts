import { expect, test } from '@playwright/test';

const TABS = [
  'Parse EPC',
  'Encode SGTIN-96',
  'Encode GID-96',
  'GTIN/EAN → SGTIN-96',
  'GS1 check digit',
];

test('renders all tool tabs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'EPC playground' })).toBeVisible();
  for (const label of TABS) {
    await expect(page.getByRole('tab', { name: label })).toBeVisible();
  }
});

test('parses the default EPC hex, shows its scheme, and derives a GTIN-14', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('SGTIN-96').first()).toBeVisible();
  await expect(
    page.locator('.tab-content:visible').getByText(/GTIN-14 \(via sgtin96ToGtin14\)/),
  ).toBeVisible();
});

test('encoding SGTIN-96 updates the result as fields change', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Encode SGTIN-96' }).click();
  await page.getByRole('textbox', { name: 'Company prefix' }).fill('0000001');
  await expect(page.getByText('urn:epc:tag:sgtin-96:3.0000001.812345.12345')).toBeVisible();
});

test('GTIN converter flags an invalid check digit', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'GTIN/EAN → SGTIN-96' }).click();
  await page.getByRole('textbox', { name: /GTIN-12/ }).fill('036000291459');
  await expect(page.getByText('Invalid code')).toBeVisible();
  await expect(page.getByText(/GTIN-12 check digit mismatch/)).toBeVisible();
});

test('GTIN converter switches code type and re-converts', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'GTIN/EAN → SGTIN-96' }).click();
  await page.getByLabel('Code type').selectOption('13');
  await expect(page.locator('input[value="4006381333931"]')).toBeVisible();
  await expect(page.getByText('Valid code')).toBeVisible();
  await expect(page.getByText(/produces the same EPC: true/)).toBeVisible();
});

test('GS1 check digit tool computes and validates codes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'GS1 check digit' }).click();
  await expect(page.locator('.badge-primary').filter({ hasText: /^2$/ })).toBeVisible();
  await expect(page.getByText('Valid check digit')).toBeVisible();
});

test('theme toggle switches the page into dark mode', async ({ page }) => {
  await page.goto('/');
  const themeCheckbox = page.locator('input.theme-controller');
  const navbar = page.locator('.navbar');
  const backgroundBefore = await navbar.evaluate((el) => getComputedStyle(el).backgroundColor);

  await page.locator('label.swap').click({ force: true });

  await expect(themeCheckbox).toBeChecked();
  await expect
    .poll(() => navbar.evaluate((el) => getComputedStyle(el).backgroundColor))
    .not.toBe(backgroundBefore);
});
