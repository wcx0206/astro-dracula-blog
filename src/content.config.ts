import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { PostFrontmatterSchema } from "@/schemas/post";

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" }),
  schema: PostFrontmatterSchema,
});

const infoCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/info" }),
});

export const collections = {
  posts: postsCollection,
  info: infoCollection,
};
