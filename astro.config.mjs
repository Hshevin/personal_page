import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkMath from 'remark-math';

export default defineConfig({
  site: 'https://personal-page.example',
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeSlug, rehypeKatex],
      remarkPlugins: [remarkMath],
    }),
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
});
