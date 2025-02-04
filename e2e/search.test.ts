/**
 * @license
 * Copyright 2021 The Go Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import './global-types';
import puppeteer, { Page } from 'puppeteer';

let page: Page;

beforeAll(async () => {
  page = await newPage();
  await page.goto(baseURL + '/search?q=http');
});

afterAll(async () => {
  await page.close();
});

test('accessibility tree (desktop)', async () => {
  await prepare(page);
  const a11yTree = await page.accessibility.snapshot();
  expect(a11yTree).toMatchSnapshot();
});

test('full page (desktop)', async () => {
  await prepare(page);
  const image = await page.screenshot({ fullPage: true });
  expect(image).toMatchImageSnapshot();
});

test('accessibility tree (mobile)', async () => {
  await prepare(page);
  const a11yTree = await page.accessibility.snapshot();
  expect(a11yTree).toMatchSnapshot();
});

test('full page (mobile)', async () => {
  await page.emulate(puppeteer.devices['Pixel 2']);
  await prepare(page);
  const image = await page.screenshot({ fullPage: true });
  expect(image).toMatchImageSnapshot();
});

test('no page errors', () => {
  expect(pageErrors).toHaveLength(0);
});

/**
 * prepare gets the page ready for snapshot tests by rewriting highly
 * variable page content to constant values.
 * @param page The page to prepare
 */
async function prepare(page: Page): Promise<void> {
  await Promise.all([
    page.$$eval('[data-test-id="snippet-title"]', els =>
      els.map(el => {
        el.innerHTML = 'net/http/pprof';
        (el as HTMLAnchorElement).href = 'net/http/pprof';
      })
    ),
    page.$$eval('[data-test-id="snippet-synopsis"]', els =>
      els.map(el => {
        el.innerHTML =
          'Package pprof serves via its HTTP server runtime profiling ' +
          'data in the format expected by the pprof visualization tool.';
      })
    ),
    page.$$eval('[data-test-id="snippet-version"]', els =>
      els.map(el => (el.innerHTML = 'go1.16.3'))
    ),
    page.$$eval('[data-test-id="snippet-published"]', els =>
      els.map(el => (el.innerHTML = 'Apr 1, 2021'))
    ),
    page.$$eval('[data-test-id="snippet-importedby"]', els =>
      els.map(el => (el.innerHTML = '11632'))
    ),
    page.$$eval('[data-test-id="snippet-license"]', els =>
      els.map(el => (el.innerHTML = 'BSD-3-Clause'))
    ),
  ]);
}
