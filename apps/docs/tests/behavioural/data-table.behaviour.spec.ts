import { test, expect } from '@playwright/test';

test.describe('@behavioural data-table', () => {
  test('renders the seeded headers + 2 data rows', async ({ page }) => {
    await page.goto('/#data-table', { waitUntil: 'networkidle' });
    const card = page.locator('section#data-table .showcase__preview');
    await expect(card.locator('table.data-table__table')).toBeVisible();
    const headers = card.locator('th.data-table__header');
    await expect(headers).toHaveCount(3);
    await expect(headers.nth(0)).toContainText('Cert');
    await expect(headers.nth(1)).toContainText('Hours');
    await expect(headers.nth(2)).toContainText('Status');
    const rows = card.locator('tbody tr[data-row-id]');
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0)).toContainText('Responsive Web Design');
    await expect(rows.nth(1)).toContainText('JavaScript Algorithms');
  });

  test('sortable Cert header declares aria-sort=none initially', async ({
    page
  }) => {
    await page.goto('/#data-table', { waitUntil: 'networkidle' });
    const card = page.locator('section#data-table .showcase__preview');
    const certHeader = card.locator('th').filter({ hasText: 'Cert' });
    // The demo does not wire `onSortChange`, so DataTable does not
    // emit the `<button class="data-table__sort-btn">` (the click
    // would no-op anyway). The interactive sort cycle is locked at
    // the L1 unit level — see DataTable.dom.test.tsx →
    // "clicking a sortable header cycles asc → desc → null". Here
    // we just lock the header advertising itself as sortable via
    // `aria-sort` so screen readers can announce the surface.
    await expect(certHeader).toHaveAttribute('aria-sort', 'none');
  });

  test('alignment modifier classes paint per column.align', async ({
    page
  }) => {
    await page.goto('/#data-table', { waitUntil: 'networkidle' });
    const card = page.locator('section#data-table .showcase__preview');
    // Hours column is align='right', Status is align='center'.
    await expect(
      card.locator('td.data-table__cell--right').first()
    ).toBeVisible();
    await expect(
      card.locator('td.data-table__cell--center').first()
    ).toBeVisible();
  });
});
