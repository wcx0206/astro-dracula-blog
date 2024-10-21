export const uniqueLowerCaseTags = (tags: string[]) =>
    [...new Set(tags.map((tag) => tag.toLowerCase()))];

