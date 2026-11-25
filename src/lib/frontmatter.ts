import { z } from 'astro/zod';

/**
 * Wiki-specific frontmatter, merged into Starlight's `docsSchema()`.
 *
 * Starlight already validates `title`, `sidebar`, `template`, etc. This adds
 * the conventions documented in "Getting Started › Contributing".
 */
export const PAGE_STATUSES = ['draft', 'published', 'deprecated'] as const;

export const wikiFrontmatter = z.object({
  /** Required so every page has a meaningful meta description and search snippet. */
  description: z
    .string()
    .trim()
    .min(10, 'description must be a meaningful sentence (at least 10 characters)')
    .max(200, 'description should be concise (200 characters or fewer)'),
  /** Lifecycle of the page. Drafts are published but clearly incomplete. */
  status: z.enum(PAGE_STATUSES).default('published'),
  /** Person or team accountable for keeping the page accurate. */
  owner: z.string().trim().min(1).optional(),
  /** Date the content was last reviewed for accuracy (YYYY-MM-DD). */
  lastReviewed: z.coerce.date().optional(),
  /** Cross-cutting topics, shown under the title and listed at /tags/. */
  tags: z
    .array(
      z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'tags must be lowercase kebab-case, e.g. "ci-cd"'),
    )
    .max(6, 'use at most 6 tags per page')
    .refine((tags) => new Set(tags).size === tags.length, 'tags must be unique')
    .default([]),
});

export type WikiFrontmatter = z.infer<typeof wikiFrontmatter>;
