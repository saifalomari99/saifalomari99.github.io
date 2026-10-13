import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_IDS, PROJECT_TYPES, TIERS } from './data/categories';

/**
 * Projects live in src/content/projects/<slug>/index.md with images beside them
 * in an images/ folder. The folder name is the URL slug (/projects/<slug>/).
 * Folders starting with "_" (e.g. _template) are ignored by the loader.
 */
const projects = defineCollection({
  loader: glob({
    pattern: ['*/index.md', '!_*/**'],
    base: './src/content/projects',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** One line shown under the title on cards and the detail page. */
      tagline: z.string().max(160),
      /** 1-3 sentences used on cards and as the page meta description. */
      summary: z.string(),
      /** Primary category (drives the main badge and default filter match). */
      category: z.enum(CATEGORY_IDS),
      /** Secondary categories; the filter also matches these. */
      tags: z.array(z.enum(CATEGORY_IDS)).default([]),
      /** Languages, tools, boards, libraries. */
      tech: z.array(z.string()).default([]),
      type: z.enum(PROJECT_TYPES),
      /** Controls the Featured badge only; ordering is by `order`. */
      tier: z.enum(TIERS).default('standard'),
      /** Position in the gallery: lower numbers come first (steps of 10 leave room to insert). */
      order: z.number().int().default(100),
      dates: z.object({
        /** "YYYY", "YYYY-MM", or free text such as "Spring 2024". */
        start: z.string(),
        /** Omit for single-period projects; use "present" for ongoing work. */
        end: z.string().optional(),
      }),
      /** e.g. "UCSB ECE 253", "Habaka Semiconductor Solutions". */
      affiliation: z.string().optional(),
      /** e.g. "Team of 2" (names are intentionally not listed). */
      team: z.string().optional(),
      /** Short description of your role, shown in the meta sidebar. */
      role: z.string().optional(),
      repo: z.url().optional(),
      sourceStatus: z.enum(['open', 'closed']).default('open'),
      links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
      hero: z
        .object({
          src: image(),
          alt: z.string(),
          caption: z.string().optional(),
        })
        .optional(),
      /** Optional card image; defaults to `hero`. Use fit: contain for logos and diagrams. */
      thumbnail: z
        .object({
          src: image(),
          alt: z.string(),
          fit: z.enum(['cover', 'contain']).default('cover'),
        })
        .optional(),
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string().optional(),
          }),
        )
        .default([]),
      /** Documented, verifiable numbers only. */
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      /** Third-party frameworks, drivers, datasets, or starter code used by the project. */
      credits: z
        .array(z.object({ name: z.string(), url: z.url().optional(), note: z.string().optional() }))
        .default([]),
      /** True when the entry describes a series/collection of smaller projects. */
      collection: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

/**
 * Technical articles. Add src/content/writing/<slug>.md and the Writing section
 * appears automatically in the navigation and on the home page.
 */
const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      hero: z.object({ src: image(), alt: z.string() }).optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects, writing };
