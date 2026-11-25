/**
 * Loads the docs collection as plain summaries for the tag pages, the health
 * report and social images. (Astro-specific; the logic lives in docs-index.ts.)
 */
import { getCollection } from 'astro:content';
import type { DocSummary } from './docs-index.ts';

export async function loadDocSummaries(): Promise<DocSummary[]> {
  const entries = await getCollection('docs');
  return entries.map(({ id, data }) => ({
    id,
    title: data.title,
    description: data.description,
    status: data.status,
    owner: data.owner,
    lastReviewed: data.lastReviewed,
    tags: data.tags,
  }));
}
