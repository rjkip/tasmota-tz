import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
  await page.goto('/');

  // Search for Amsterdam and select Europe/Amsterdam time zone
  await page.fill('input[type="search"]', 'Amsterdam');
  await page.getByText('Amsterdam').first().click();
  await page.getByTestId('select-timezone').click();
  await page.getByText(/Europe\/Amsterdam/).click();

  // Assert command is constructed and displayed
  await expect(page.getByTestId('copy')).toHaveValue(
    'Backlog Latitude 52.3730796; Longitude 4.8924534; TimeDST 0,0,3,1,1,120; TimeSTD 0,0,10,1,1,60; TimeZone 99',
  );

  await page.getByTestId('copy').click();

  // Assert "Command copied!" is shown
  await expect(page.getByText(/✅ Command copied!/)).toBeVisible();
});
