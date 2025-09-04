// src/utils/types.ts
import { z } from "zod";

export const WebsiteCreateSchema = z.object({
  title: z.string().min(2),
  url: z.string().transform((val) => {
    // If URL doesn't have a protocol, add https:// to it
    if (val && !val.match(/^https?:\/\//)) {
      return `https://${val}`;
    }
    return val;
  }).pipe(z.string().url()),
  description: z.string().min(10),
  priceCents: z.number().int().nonnegative(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  image: z.string().url().optional(),
});


export const AdRequestSchema = z.object({
  websiteId: z.string().min(1),
  message: z.string().min(5),
});
