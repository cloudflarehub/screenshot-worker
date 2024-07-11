import puppeteer, {Page} from "@cloudflare/puppeteer";
import {ScreenshotOptions} from "./schema";
import {PuppeteerBlocker} from "@cliqz/adblocker-puppeteer";

export const configScreenshotPage = async (page: Page, options: ScreenshotOptions) => {
  if (options.device === 'mobile') {
    await page.emulate(puppeteer.devices['iPhone 13']);
    await page.setViewport({
      width: options.width || 585,
      height: options.height || 1266,
      deviceScaleFactor: 3,
    });
  } else {
    await page.setViewport({
      width: options.width || 1920,
      height: options.height || 1080,
      deviceScaleFactor: 2,
    });
  }
}

export const scroll = async (page: Page) => {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        // @ts-ignore
        const scrollHeight = document.body.scrollHeight;
        // @ts-ignore
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          // @ts-ignore
          resolve();
        }
      }, 100);
    });
  });
}

export const blockAds = async (page: Page)=> {
  PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    // @ts-ignore
    blocker.enableBlockingInPage(page);
  });
}
