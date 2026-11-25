/**
 * Starlight route middleware: adds social preview image tags to every page.
 * Docs pages get their own card from /og/<id>.png; generated pages (tags,
 * health) reuse the homepage card.
 */
import { getCollection } from 'astro:content';
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { withBase } from './lib/paths.ts';

const docIds = new Set((await getCollection('docs')).map((entry) => entry.id));

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  const id = docIds.has(route.id) ? route.id : 'index';
  const path = withBase(import.meta.env.BASE_URL, `og/${id === '' ? 'index' : id}.png`);
  const image = context.site ? new URL(path, context.site).href : path;

  route.head.push(
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
    // Starlight already sets `twitter:card` to `summary_large_image`.
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
  );
});
