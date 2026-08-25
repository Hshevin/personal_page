import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

import { getPublishedPosts } from '../lib/content';

export async function GET(context: { site?: URL }) {
  const posts = getPublishedPosts(await getCollection('posts'));

  return rss({
    title: 'Hshevin 的文章',
    description: '学习记录、项目复盘与偶尔产生的想法。',
    site: context.site ?? 'https://personal-page.workers.dev',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: '<language>zh-CN</language>',
  });
}
