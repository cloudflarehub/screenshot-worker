import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { z } from 'zod'
import puppeteer, {BrowserWorker} from "@cloudflare/puppeteer";
import {autoScroll, configPage} from "./page";
import {generateRandomString, sleep} from "./utils";

type Bindings = {
  MYBROWSER: BrowserWorker
}
const app = new Hono<{ Bindings: Bindings }>()
app.use(logger())

app.get('/screenshot', 
  zValidator(
    'query',
    z.object({
      url: z.string().url(),
      device: z.string().optional().default('desktop'),
      width: z.number().optional(),
      height: z.number().optional(),
      fullPage: z.boolean().optional().default(false),
      quality: z.number().optional().default(80),
    })
  ),
  async (c) => {
  const { url, device, width, height, fullPage, quality } = c.req.query();

  const browser = await puppeteer.launch(c.env.MYBROWSER);
  const page = await browser.newPage();

  await configPage(page, device, width, height);

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  if (!fullPage) {
    await sleep(1500);
  } else {
    await autoScroll(page);
  }

  const screenshotBuffer = await page.screenshot({ fullPage: fullPage === 'true', type: 'jpeg', quality: parseInt(quality, 10) || 80});
  await browser.close();

  const randomFileName = `screenshot_${generateRandomString(10)}.jpg`;

  return new Response(screenshotBuffer, {
    status: 200,
    headers: {
      'Content-Disposition': `attachment; filename=${randomFileName}`,
      'Content-Type': 'image/jpeg',
    }});
})

export default app
