import { z, defineCollection } from 'astro:content';

const postsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        tags: z.array(z.string()),
        categories: z.array(z.string()).optional(),
        abbrlink: z.string().optional(),
        date: z.date(),
    }),
});

export const collections = {
    'posts': postsCollection,
};