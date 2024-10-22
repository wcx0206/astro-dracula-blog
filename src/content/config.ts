import { defineCollection } from 'astro:content';
import { PostSchema } from '../schemas';

const postsCollection = defineCollection({
    type: 'content',
    schema: PostSchema,
});

const infoCollection = defineCollection({
    type: 'content',
})

export const collections = {
    'posts': postsCollection,
    'info': infoCollection,
};