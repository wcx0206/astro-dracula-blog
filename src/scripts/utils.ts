import type { PostSearchItem, Post } from "../schemas";
import { getDescFromMdString } from "./markdown";

/**
 * Returns a sorted array of PostSearchItem objects, sorted by date.
 * @param posts - An array of Post objects.
 * @returns A sorted array of PostSearchItem objects.
 */
export const getSortedPostSearchItems = async (posts: Post[]): Promise<PostSearchItem[]> => {
  return posts.sort((a, b) => {
    const dateA = a.data.updated || a.data.date;
    const dateB = b.data.updated || b.data.date;
    return dateB.getTime() - dateA.getTime();
  }).map(post => ({
    href: `/posts/${post.slug}`,
    title: post.data.title,
    date: getCloserFormattedDate(post.data.updated?.toISOString(), post.data.date.toISOString())!,
    description: getDescFromMdString(post.body),
    slug: post.slug,
    tags: Array.from(getUniqueLowerCaseTagMap(post.data.tags).keys()),
  }));
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
  const dateToReturn = dateA < dateB ? dateB : dateA;
  return dateToReturn.toISOString().slice(0, 10);
}