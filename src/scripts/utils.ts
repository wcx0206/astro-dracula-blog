import type { PostSearchItem, Post } from "../schemas";
import { getDescFromMdString } from "./markdown";
import { defaultLang } from "../i18n/ui";

/**
 * Returns a Map of slugs without language as keys with their supported languages as values.
 * @param posts - An array of Post objects.
 * @returns A Map of slugs without language as keys with their supported languages as values.
 */
export const getPostSupportedLangsMap = (posts: Post[]) => {
  const supportedLangsMap = new Map<string, string[]>();
  posts.forEach(post => {
    const [lang, ...rest] = post.slug.split("/");
    const slugWithoutLang = rest.join("/");
    supportedLangsMap.set(slugWithoutLang, [...(supportedLangsMap.get(slugWithoutLang) || []), lang]);
  });
  return supportedLangsMap;
}

/**
 * Returns a list of PostSearchItem objects, sorted by date.
 * The posts are filtered by the expected language.
 * If the expected language is not supported, the default language is used.
 * If the default language is not supported, the first supported language is used.
 * @param posts - An array of Post objects.
 * @param expectedLang - The expected language of the posts.
 * @returns A sorted array of PostSearchItem objects.
 */
export const getSortedPostSearchItemsWithLang = async (posts: Post[], expectedLang: string): Promise<PostSearchItem[]> => {
  const supportedLangsMap = getPostSupportedLangsMap(posts);
  
  const filteredPosts = posts.filter(post => {
    const [, ...rest] = post.slug.split("/");
    const slugWithoutLang = rest.join("/");
    const supportedLangs = supportedLangsMap.get(slugWithoutLang) || [];
    const [postLang] = post.slug.split("/");
    
    return postLang === expectedLang ||
      (!supportedLangs.includes(expectedLang) && postLang === defaultLang) ||
      (!supportedLangs.includes(expectedLang) && !supportedLangs.includes(defaultLang) && postLang === supportedLangs[0]);
  });

  return filteredPosts.sort((a, b) => {
    const dateA = a.data.updated || a.data.date;
    const dateB = b.data.updated || b.data.date;
    return dateB.getTime() - dateA.getTime();
  }).map(post => {
    const [, ...rest] = post.slug.split("/");
    const slugWithoutLang = rest.join("/");
    const supportedLangs = supportedLangsMap.get(slugWithoutLang) || [];
    
    let lang = expectedLang;
    if (!supportedLangs.includes(expectedLang)) {
      lang = supportedLangs.includes(defaultLang) ? defaultLang : supportedLangs[0];
    }

    return {
      href: `/${lang}/posts/${slugWithoutLang}`,
      title: post.data.title,
      date: getCloserFormattedDate(post.data.updated?.toISOString(), post.data.date.toISOString())!,
      description: getDescFromMdString(post.body),
      slugWithoutLang: slugWithoutLang,
      tags: Array.from(getUniqueLowerCaseTagMap(post.data.tags).keys()),
    };
  });
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