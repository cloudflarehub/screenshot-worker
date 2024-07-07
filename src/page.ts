import puppeteer, {Page} from "@cloudflare/puppeteer";

export const configPage = async (page: Page, device: string, width: string, height: string) => {
  const widthConfig = parseInt(width, 10);
  const heightConfig = parseInt(height, 10);
  if (device === 'mobile') {
    await page.emulate(puppeteer.devices['iPhone 13']);
    await page.setViewport({
      width: widthConfig || 585,
      height: heightConfig || 1266,
      deviceScaleFactor: 3,
    });
  } else {
    await page.setViewport({
      width: widthConfig || 1920,
      height: heightConfig || 1080,
      deviceScaleFactor: 2,
    });
  }
}

export const autoScroll = async (page: Page) => {
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
