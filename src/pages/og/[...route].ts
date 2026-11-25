/**
 * Social preview images (Open Graph / Twitter cards) for every docs page,
 * generated at build time, e.g. /og/adr/introduction.png. Linked from each
 * page's <head> by src/route-middleware.ts.
 *
 * Fonts and logo are local files so the build never depends on a font CDN.
 */
import { OGImageRoute } from 'astro-og-canvas';
import { loadDocSummaries } from '../../lib/docs.ts';

const INTER = './node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2';

const pages = Object.fromEntries((await loadDocSummaries()).map((doc) => [doc.id, doc]));

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page: (typeof pages)[string]) => ({
    title: page.title,
    description: page.description,
    logo: { path: './src/assets/og-logo.png', size: [80] },
    bgGradient: [
      [24, 24, 27],
      [36, 20, 22],
    ],
    border: { color: [239, 68, 68], width: 12, side: 'inline-start' },
    padding: 80,
    fonts: [INTER],
    font: {
      title: { families: ['Inter Variable'], size: 68, lineHeight: 1.15, color: [255, 255, 255] },
      description: {
        families: ['Inter Variable'],
        size: 34,
        lineHeight: 1.4,
        color: [196, 196, 200],
      },
    },
  }),
});
