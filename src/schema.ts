import {z} from "zod";

export const ScreenshotOptionsSchema = z.object({
  url: z.string().url(),
  device: z.string().optional().default('desktop'),
  width: z.number().int().min(1).optional(),
  height: z.number().int().min(1).optional(),
  fullPage: z.string().optional().default('false'),
  quality: z.number().optional().default(80),
  isBlockAds:  z.string().optional().default('false'),
});

export type ScreenshotOptions = z.infer<typeof ScreenshotOptionsSchema>;
