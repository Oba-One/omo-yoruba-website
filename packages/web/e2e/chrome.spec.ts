import { expect, test } from './fixtures';
import { PLACEHOLDER_PROJECT } from './helpers';

test.describe('site chrome', () => {
  test('nothing is open on load, the footer carries the trust line, and the router is on', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    // The EIN reads XX-XXXXXXX until the settings hold it; either way the line is there.
    await expect(page.locator('footer.oy-footer .oy-footer-trust')).toContainText(
      '501(c)(3) nonprofit • Founded 1997 • EIN ',
    );
    await expect(page.locator('footer.oy-footer .oy-footer-trust')).toContainText(
      'Los Angeles, CA',
    );
    await expect(page.locator('meta[name="astro-view-transitions-enabled"]')).toHaveCount(1);
    await expect(page.locator('html')).not.toHaveAttribute('data-loading', 'true');
    const fadeDuration = await page.evaluate(() =>
      Array.from(document.querySelectorAll('style')).some((style) =>
        style.textContent?.includes('380ms'),
      ),
    );
    expect(fadeDuration).toBe(true);
  });

  test('the page links its tab icon and its touch icon, and both files answer', async ({
    page,
    request,
  }) => {
    await page.goto('/');
    // `/favicon.ico` is also the address a browser asks for on a page that links no icon (the member guide).
    await expect(page.locator('head link[rel="icon"]')).toHaveAttribute('href', '/favicon.ico');
    await expect(page.locator('head link[rel="apple-touch-icon"]')).toHaveAttribute(
      'href',
      '/apple-touch-icon.png',
    );
    for (const address of ['/favicon.ico', '/apple-touch-icon.png']) {
      const response = await request.get(address);
      expect(response.status(), address).toBe(200);
      expect(response.headers()['content-type'], address).toMatch(/^image\//);
    }
  });

  test('a page names its address on the public host and carries a link preview; an error page names none', async ({
    page,
  }) => {
    // Asked with a query, the page still names its own address alone (ADR 0060).
    await page.goto('/odunde?enquiry=vendor');
    const head = page.locator('head');
    await expect(head.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://www.omoyorubasocal.org/odunde',
    );
    await expect(head.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://www.omoyorubasocal.org/odunde',
    );
    await expect(head.locator('meta[property="og:title"]')).toHaveAttribute('content', /\S/);
    await expect(head.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /^https:\/\//,
    );
    await expect(head.locator('meta[property="og:image:width"]')).toHaveAttribute(
      'content',
      /^\d+$/,
    );
    await expect(head.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    await page.goto('/no-such-page');
    await expect(page.locator('head link[rel="canonical"]')).toHaveCount(0);
  });

  test('robots.txt keeps search off the Studio and the API and names the sitemap, which lists the pages', async ({
    request,
  }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    const rules = await robots.text();
    expect(rules).toContain('Disallow: /admin');
    expect(rules).toContain('Disallow: /api/');
    expect(rules).toContain('Sitemap: https://www.omoyorubasocal.org/sitemap.xml');
    const sitemap = await request.get('/sitemap.xml');
    // The placeholder project reads nothing, so the sitemap asks a crawler to come back.
    if (PLACEHOLDER_PROJECT) {
      expect(sitemap.status()).toBe(503);
      return;
    }
    expect(sitemap.status()).toBe(200);
    expect(sitemap.headers()['content-type']).toMatch(/^application\/xml/);
    const locations = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => match[1] ?? '',
    );
    expect(locations).toContain('https://www.omoyorubasocal.org/');
    expect(locations).toContain('https://www.omoyorubasocal.org/gallery');
    for (const location of locations) {
      expect(location).toMatch(/^https:\/\/www\.omoyorubasocal\.org\//);
      expect(location).not.toMatch(/\?|\/404$|\/admin|\/api\//);
    }
  });

  test('a page carries the security headers and a policy that names its inline scripts by hash', async ({
    request,
  }) => {
    const headers = (await request.get('/')).headers();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');
    // Report-only under `astro dev`, enforced on a deployed site (PLAYWRIGHT_TEST_BASE_URL).
    const policy =
      headers['content-security-policy'] ?? headers['content-security-policy-report-only'] ?? '';
    expect(policy).toMatch(/script-src 'self' 'sha256-/);
    expect(policy).not.toMatch(/script-src[^;]*'unsafe-inline'/);
  });

  test('the router swaps under the same policy and fully loads a page from another deploy (ADR 0062)', async ({
    page,
  }) => {
    const marker = () =>
      page.evaluate(() => (window as unknown as { sameDocument?: boolean }).sameDocument === true);
    await page.goto('/');
    await page.evaluate(() => Object.assign(window, { sameDocument: true }));
    await page.locator('footer a[href="/our-story"]').first().click();
    await expect(page).toHaveURL(/\/our-story$/);
    await expect(page.locator('h1')).toBeVisible();
    expect(await marker()).toBe(true);

    // The next page as a deploy with another policy would serve it.
    await page.route('**/impact', async (route) => {
      const response = await route.fetch();
      const html = (await response.text()).replace(
        /(<meta name="oy-csp" content=")[^"]*"/,
        '$1from-another-deploy"',
      );
      await route.fulfill({ response, body: html });
    });
    const fullLoad = page.waitForEvent('load');
    await page.locator('footer a[href="/impact"]').first().click();
    await fullLoad;
    await expect(page).toHaveURL(/\/impact$/);
    await expect(page.locator('h1')).toBeVisible();
    expect(await marker()).toBe(false);
    // The full load replaced the swap: one history entry for the page, so Back returns to Our Story.
    await page.goBack();
    await expect(page).toHaveURL(/\/our-story$/);
  });

  test('no inline script breaks the policy, on load, in the Give Dialog or across a router swap (ADR 0062)', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const seen: string[] = [];
      Object.assign(window, { cspViolations: seen });
      document.addEventListener('securitypolicyviolation', (event) => {
        if (event.effectiveDirective.startsWith('script-src')) {
          seen.push(`${event.blockedURI} ${event.sourceFile}:${event.lineNumber}`);
        }
      });
    });
    await page.goto('/donate#give');
    const give = page.locator('dialog#give');
    await expect(give).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(give).not.toHaveAttribute('open', '');
    await page.locator('footer a[href="/our-story"]').first().click();
    await expect(page).toHaveURL(/\/our-story$/);
    await expect(page.locator('h1')).toBeVisible();
    const violations = await page.evaluate(
      () => (window as unknown as { cspViolations: string[] }).cspViolations,
    );
    expect(violations).toEqual([]);
  });

  test('the cross-fade honours reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const reduced = await page.evaluate(
      () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
    expect(reduced).toBe(true);
    // Astro's own stylesheet switches every view transition animation off under this query.
    const rule = await page.evaluate(() =>
      Array.from(document.styleSheets).some((sheet) => {
        try {
          return Array.from(sheet.cssRules).some(
            (r) =>
              r instanceof CSSMediaRule &&
              r.conditionText.includes('prefers-reduced-motion') &&
              r.cssText.includes('view-transition'),
          );
        } catch {
          return false;
        }
      }),
    );
    expect(rule).toBe(true);
  });

  test('the Events dropdown opens on hover and focus and closes on Escape', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'the links give way to the burger under 880px');
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Events' });
    const festival = page.locator('.oy-nav-drop-menu a', { hasText: 'Ọdúndé Festival' });
    await expect(festival).toBeHidden();
    await trigger.hover();
    await expect(festival).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.mouse.move(0, 400);
    await expect(festival).toBeHidden();
    await trigger.focus();
    await expect(festival).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(festival).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('the mobile menu traps focus, closes on Escape and returns focus to the burger', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'the burger shows under 880px');
    await page.goto('/');
    const burger = page.getByRole('button', { name: 'Open menu' });
    const menu = page.locator('dialog.oy-nav-menu');
    await burger.click();
    await expect(menu).toHaveAttribute('open', '');
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    // The page behind a modal dialog is inert: focus stays in the menu, or leaves the document
    // for the browser's own chrome (the body in a headless run), never a link behind the scrim.
    for (let step = 0; step < 10; step += 1) {
      await page.keyboard.press('Tab');
      const where = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active || active === document.body) return 'body';
        return document.querySelector('dialog.oy-nav-menu')?.contains(active) ? 'menu' : 'page';
      });
      expect(where).not.toBe('page');
    }
    await page.keyboard.press('Escape');
    await expect(menu).not.toHaveAttribute('open', '');
    await expect(burger).toBeFocused();
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
  });
});
