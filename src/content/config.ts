import { defineCollection } from 'astro:content';
import { PostFrontmatterSchema } from '../schemas';

const postsCollection = defineCollection({
    type: 'content',
    schema: PostFrontmatterSchema,
});

const infoCollection = defineCollection({
    type: 'content',
})

export const collections = {
    'posts': postsCollection,
    'info': infoCollection,
};