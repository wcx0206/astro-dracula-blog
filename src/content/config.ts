import { z, defineCollection } from 'astro:content';
const postsCollection = defineCollection({
    type: 'content',
    schema: {
        title: z.string(),
        tags: z.array(z.string()),
        abbrlink: z.string(),
        date: z.string(),
    }
});
export const collections = {
    'posts': postsCollection,
};