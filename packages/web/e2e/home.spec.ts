import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// The homepage blocks in the prototype's order (ROUTES section 4), each present whether the
// Studio holds its content or renders Pending (CI runs with a placeholder project, so every read
// answers null): the hero with one h1, the stat strip, the event band, programs, member voices,
// news, the year in the life, raise your hand, and the footer. The doors open the Enquiry Modal.
test.describe('the homepage', () => {
  test('carries every block in order, one h1 and nothing open on load', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    const order = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main > *'))
        .map((el) => el.id || el.className.split(' ')[0])
        .join(' '),
    );
    expect(order).toBe('top impact lead-event programs voices news gallery get-involved');
    await expect(page.locator('header.v2-hero .v2-hero-scrim')).toHaveCount(1);
    await expect(page.locator('#lead-event.oy-event-band')).toHaveCount(1);
    await expect(page.locator('#programs [data-columns="3"]')).toHaveCount(1);
    await expect(page.locator('#voices .oy-quote-card')).toHaveCount(3);
    // The mosaic shows as many tiles as the gallery option on the body asks for.
    const tiles = Number(await page.locator('body').getAttribute('data-gallery'));
    await expect(page.locator('#gallery .oy-mosaic figure')).toHaveCount(tiles);
    await expect(page.locator('footer.oy-footer')).toHaveCount(1);
    // The body carries the layout options the tokens read.
    await expect(page.locator('body')).toHaveAttribute('data-motion', /true|false/);
    await expect(page.locator('body')).toHaveAttribute('data-pattern', /rich|subtle/);
    await expect(page.locator('body')).toHaveAttribute(
      'data-highlight',
      /festival|school|collective/,
    );
  });

  test('shows the Studio content or a named Pending chip, never an invented fact', async ({
    page,
  }) => {
    await page.goto('/');
    const hero = page.locator('header.v2-hero');
    const heroText = await hero.innerText();
    const seeded = heroText.includes('Yoruba culture, alive in Southern California');
    expect(seeded || /pending: the hero heading/i.test(heroText)).toBe(true);
    // With the Studio's content the band carries an edition (its year or the registry's chip for
    // a missing fact); only CI's placeholder project shows the Pending line for no edition
    // (innerText applies the chip's uppercase transform, so the match ignores case).
    const bandText = await page.locator('#lead-event').innerText();
    expect(bandText).toMatch(seeded ? /pending: the|\b\d{4}\b/i : /pending from you/i);
    // The trust line's EIN placeholder, the mock address and the mock prices never appear.
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/95-4612387|Leimert Boulevard|555-0148|\$\d/);
  });

  test('holds the prototype layout at this width', async ({ page }) => {
    await page.goto('/');
    // The hero copy is set left; the tokens' generic hero centres its own inner class.
    await expect(page.locator('header.v2-hero h1')).toHaveCSS('text-align', 'start');
    // Each member voice fills its grid cell (a figure keeps the browser's side margins otherwise).
    const cells = await page.locator('#voices .oy-card-grid').evaluate((grid) => {
      const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').map(parseFloat);
      return Array.from(grid.children).map((card, index) => ({
        width: card.getBoundingClientRect().width,
        column: columns[index % columns.length] ?? 0,
      }));
    });
    expect(cells).toHaveLength(3);
    for (const { width, column } of cells) expect(Math.abs(width - column)).toBeLessThan(1);
    // The band's button keeps to the right edge of the content, wrapped or not (an edition exists
    // only with the Studio's content, so CI's placeholder run has no button to measure).
    const band = page.locator('#lead-event .oy-band-inner');
    const button = band.locator('.oy-btn');
    if ((await button.count()) > 0) {
      const [inner, box] = await Promise.all([band.boundingBox(), button.boundingBox()]);
      const padding = await band.evaluate((el) => parseFloat(getComputedStyle(el).paddingRight));
      expect(
        inner && box && Math.abs(inner.x + inner.width - padding - (box.x + box.width)),
      ).toBeLessThan(1);
    }
  });

  test('the first door is the one gold action of its view and opens the Enquiry Modal', async ({
    page,
  }) => {
    await page.goto('/');
    const section = page.locator('#get-involved');
    await section.scrollIntoViewIfNeeded();
    const gold = section.locator('.oy-btn--primary');
    const doors = section.locator('[data-enquiry], [data-give]');
    if ((await doors.count()) === 0) {
      // A placeholder project: the doors render Pending and there is nothing to open.
      await expect(section.locator('.oy-pend').first()).toBeVisible();
      return;
    }
    expect(await gold.count()).toBeLessThanOrEqual(1);
    const trigger = doors.first();
    await trigger.click();
    await expect(page.locator('dialog#enquiry')).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });

  test('is clean for axe with the page settled', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
          .map((animation) => animation.finished.catch(() => undefined)),
      ),
    );
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
      })),
    ).toEqual([]);
  });
});
