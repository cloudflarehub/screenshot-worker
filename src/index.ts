import {zValidator} from '@hono/zod-validator'
import {Hono} from 'hono'
import {logger} from 'hono/logger'
import {BrowserWorker} from "@cloudflare/puppeteer";
import {ScreenshotOptionsSchema} from "./schema";
import {screenshot} from "./screenshot";

type Bindings = {
  MYBROWSER: BrowserWorker
}
const app = new Hono<{ Bindings: Bindings }>()
app.use(logger())

app.get('/screenshot', zValidator('query', ScreenshotOptionsSchema), async (c) => {
  const screenshotOptions = c.req.valid("query");
  return await screenshot(screenshotOptions, c.env.MYBROWSER);
})

app.notFound((c) => {
  return c.text('404 Not Found', 404);
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text(`Error Message: ${err.message}`, 500);
})

export default app
