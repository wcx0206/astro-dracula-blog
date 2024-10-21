import { z } from "astro:content"

export const PostSchema = z.object({
  title: z.string(),
  tags: z.array(z.string()),
  categories: z.array(z.string()).optional(),
  abbrlink: z.string().optional(),
  date: z.date(),
})