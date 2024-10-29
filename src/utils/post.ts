import type { Post, PureSlug } from "@/schemas/post";
import { getDescFromMdString } from "@/utils/markdown";
import { defaultLang, type Lang } from "@/utils/i18n";


export const getLangFromSlug = (slug: string): Lang => {
    const [lang] = slug.split("/");
    return lang as Lang;
}

export const getPureSlugFromSlug = (slug: string): PureSlug => {
    if (!slug.includes("/")) {
        return slug;
    }
    const [, ...rest] = slug.split("/");
    return rest.join("/");
}

export const classifyByLangs = (posts: Post[]) => {
    const map = new Map<PureSlug, Post[]>();
    posts.forEach(post => {
        const pureSlug = getPureSlugFromSlug(post.slug);
        map.set(pureSlug, [...(map.get(pureSlug) || []), post]);
    });
    return map;
}

/**
 * Returns a list of unique posts by language, in the order of:
 * 
 * 1. The post with the expected language.
 * 2. The post with the default language.
 * 3. The post with the first language in the supported languages list.
 * 
 * @param posts - A list of posts.
 * @param expectedLang - The expected language.
 * @returns The list of unique posts.
 */
export const makeUniqueByLang = (posts: Post[], expectedLang: Lang) => {
    const classified = classifyByLangs(posts);

    return Array.from(classified.keys()).map((pureSlug) => {
        const signlePostMultipleLangs = classified.get(pureSlug)!;
        return signlePostMultipleLangs.find(version => getLangFromSlug(version.slug) === expectedLang)
            || signlePostMultipleLangs.find(version => getLangFromSlug(version.slug) === defaultLang)
            || signlePostMultipleLangs[0];
    });
}

/**
 * Gets the snapshots of posts. They are unique to languages, and sorted by date.
 */
export const getSnapshots = async (posts: Post[], expectedLang: Lang) => {
    const uniquePosts = makeUniqueByLang(posts, expectedLang);
    const sorted = uniquePosts.sort((a, b) => {
        const dateA = a.data.updated || a.data.date;
        const dateB = b.data.updated || b.data.date;
        return dateB.getTime() - dateA.getTime();
    });
    return sorted.map((post) => {
        const [lang, ...rest] = post.slug.split("/");
        const slugWithoutLang = rest.join("/");
        return {
            href: `/${lang}/posts/${slugWithoutLang}`,
            title: post.data.title,
            date: getCloserFormattedDate(post.data.updated?.toISOString(), post.data.date.toISOString())!,
            description: getDescFromMdString(post.body),
            slugWithoutLang: slugWithoutLang,
            tags: Array.from(getUniqueLowerCaseTagMap(post.data.tags).keys()),
        }
    })
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