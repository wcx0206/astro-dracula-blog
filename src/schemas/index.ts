import { z } from "astro:content"

export const PostFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()),
  categories: z.array(z.string()).optional(),
  abbrlink: z.string().optional(),
  date: z.date(),
  updated: z.date().optional(),
});

export const PostSchema = z.object({
  data: PostFrontmatterSchema,
  slug: z.string(),
  body: z.string(),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;
export type Post = z.infer<typeof PostSchema>;
