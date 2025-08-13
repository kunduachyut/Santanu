// src/utils/types.ts
import { z } from "zod";

export const WebsiteCreateSchema = z.object({
  title: z.string().min(2),
  url: z.string().url(),
  description: z.string().min(10),
  priceCents: z.number().int().nonnegative(),
});

export const AdRequestSchema = z.object({
  websiteId: z.string().min(1),
  message: z.string().min(5),
});
