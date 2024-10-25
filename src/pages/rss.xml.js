import { SITE } from '../config.ts';
import { AUTHOR } from '../config.ts';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getDescFromMdString } from '../scripts/markdown.ts';

export async function GET(context) {
    const posts = await getCollection('posts');
    return rss({
        title: SITE.title,
        description: SITE.description,
        site: context.site,
        items: posts.map((post) => ({
            title: post.data.title,
            description: getDescFromMdString(post.body),
            author: AUTHOR.name,
            pubDate: post.data.date,
            link: `/posts/${post.slug}`,
        })),
    });
}