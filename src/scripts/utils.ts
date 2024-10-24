import { getCollection, render } from "astro:content";
import Fuse from "fuse.js";

export interface SearchItem {
  title: string;
  description: string;
  slug: string;
  tags: string[];
}

/**
 * Creates a search index for the posts.
 * @returns A Fuse instance for searching the posts.
 */
export async function createSearchIndex() {
  const posts = await getCollection("posts");
  const searchItems: SearchItem[] = await Promise.all(posts.map(async (post) => {
    const { remarkPluginFrontmatter } = await render(post);
    return {
      title: post.data.title,
      description: remarkPluginFrontmatter.desc,
      slug: post.slug,
      tags: post.data.tags,
    };
  })
  );

  const fuse = new Fuse(searchItems, {
    keys: ["title", "description", "slug", "tags"],
  });

  return fuse;
}

/**
 * Returns a Map of tags with their lowercase versions as keys and counts as values.
 * @param tags - An array of tags.
 * @returns A Map of tags with their lowercase versions as keys and counts as values.
 */
export const uniqueLowerCaseTags = (tags: string[]): Map<string, number> => {
  const tagCounts = new Map<string, number>();
  tags.forEach(tag => {
    const lowercaseTag = tag.toLowerCase();
    tagCounts.set(lowercaseTag, (tagCounts.get(lowercaseTag) || 0) + 1);
  });
  return tagCounts;
};