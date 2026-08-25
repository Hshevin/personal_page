import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const linkSchema = z.object({
  label: z.string().min(1),
  url: z.url(),
});

const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(220),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string().min(1)).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

const profile = defineCollection({
  loader: file('./src/content/profile.yaml'),
  schema: z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    avatar: z.string().min(1),
    location: z.string().optional(),
    bio: z.array(z.string().min(1)).min(1),
    socials: z.array(linkSchema),
    education: z
      .array(
        z.object({
          institution: z.string().min(1),
          program: z.string().min(1),
          period: z.string().min(1),
          url: z.url().optional(),
        }),
      )
      .default([]),
    skills: z.array(
      z.object({
        category: z.string().min(1),
        items: z.array(z.string().min(1)).min(1),
      }),
    ),
  }),
});

const projects = defineCollection({
  loader: file('./src/content/projects.yaml'),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    stack: z.array(z.string().min(1)),
    links: z.array(linkSchema).default([]),
    featured: z.boolean().default(false),
    order: z.number().int().default(0),
  }),
});

const links = defineCollection({
  loader: file('./src/content/links.yaml'),
  schema: z.object({
    name: z.string().min(1),
    url: z.url(),
    avatar: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    order: z.number().int().default(0),
  }),
});

export const collections = { links, posts, profile, projects };
