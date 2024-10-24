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

