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
export const getUniqueLowerCaseTagMap = (tags: string[]): Map<string, number> => {
  const tagCounts = new Map<string, number>();
  tags.forEach(tag => {
    const lowercaseTag = tag.toLowerCase();
    tagCounts.set(lowercaseTag, (tagCounts.get(lowercaseTag) || 0) + 1);
  });
  return tagCounts;
};

/**
 * Returns the closer date from two date strings.
 * @param dateStringA - The first date string.
 * @param dateStringB - The second date string.
 * @returns The closest date to the current date.
 */
export const getCloserFormattedDate = (dateStringA?: string, dateStringB?: string) => {
  if (!dateStringA && !dateStringB) return undefined;
  if (!dateStringA) return dateStringB;
  if (!dateStringB) return dateStringA;

  const dateA = new Date(dateStringA);
  const dateB = new Date(dateStringB);
  const dateToReturn = dateA < dateB ? dateA : dateB;
  return dateToReturn.toISOString().slice(0, 10);
}