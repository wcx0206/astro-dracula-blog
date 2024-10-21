import { defineCollection } from 'astro:content';
import { PostSchema } from '../schemas';

const postsCollection = defineCollection({
    type: 'content',
    schema: PostSchema,
});

export const collections = {
    'posts': postsCollection,
};