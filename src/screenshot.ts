import puppeteer, {BrowserWorker} from "@cloudflare/puppeteer";
import {blockAds, configScreenshotPage, scroll} from "./page";
import {generateRandomString, wait} from "./utils";
import {ScreenshotOptions} from "./schema";

export const screenshot = async (options: ScreenshotOptions, endpoint: BrowserWorker) => {
  const { url, fullPage, quality, isBlockAds } = options;

  const browser = await puppeteer.launch(endpoint);
  const page = await browser.newPage();

  await configScreenshotPage(page, options);

  if (isBlockAds) {
    await blockAds(page);
  }

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  if (!fullPage) {
    await wait(1500);
  } else {
    await scroll(page);
  }

  const screenshotBuffer = await page.screenshot({ fullPage: fullPage, type: 'jpeg', quality: quality });
  await browser.close();

  const randomFileName = `screenshot_${generateRandomString(10)}.jpg`;

  return new Response(screenshotBuffer, {
    status: 200,
    headers: {
      'Content-Disposition': `attachment; filename=${randomFileName}`,
      'Content-Type': 'image/jpeg',
    }});
}
