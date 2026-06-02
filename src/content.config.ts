import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('Harbor City Church'),
    tags: z.array(z.string()).default([]),
    hero: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const sermons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/sermons' }),
  schema: z.object({
    title: z.string(),
    speaker: z.string().default('Pastor Michael Collins'),
    series: z.string().optional(),
    date: z.date(),
    scripture: z.string().optional(),
    videoUrl: z.string().optional(),
    audioUrl: z.string().optional(),
    description: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, sermons };
