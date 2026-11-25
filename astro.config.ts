import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import starlightLlmsTxt from 'starlight-llms-txt';
import { satteri } from '@astrojs/markdown-satteri';
import { SECTIONS } from './src/config/sections.ts';
import { resolveDeployment } from './src/lib/deployment.ts';
import { taskListLabels } from './src/lib/task-list-labels.ts';
import starlightMermaid from './src/plugins/mermaid/index.ts';

const REPOSITORY_URL = 'https://github.com/CharlieWoo01/engineering-wiki';

// `site` and `base` come from SITE_URL / BASE_PATH (see src/lib/deployment.ts).
const { site, base } = resolveDeployment(process.env);

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  markdown: {
    // Sätteri is Astro's default Markdown processor (MDX inherits it). The plugin
    // gives `- [ ]` checklist items accessible names (WCAG 4.1.2).
    processor: satteri({ hastPlugins: [taskListLabels] }),
  },
  vite: {
    // Mermaid's renderers are large but lazy-loaded only on pages that contain
    // a diagram, so Vite's default 500 kB chunk warning is just noise here.
    build: { chunkSizeWarningLimit: 1600 },
  },
  integrations: [
    starlight({
      title: 'Engineering Wiki',
      description:
        'Technical notes, engineering standards, architecture decisions and runbooks, maintained as code.',
      logo: { src: './src/assets/logo.svg', alt: '' },
      favicon: '/favicon.svg',
      social: [{ icon: 'github', label: 'GitHub repository', href: REPOSITORY_URL }],
      editLink: { baseUrl: `${REPOSITORY_URL}/edit/main/` },
      lastUpdated: true,
      head: [{ tag: 'meta', attrs: { name: 'theme-color', content: '#b91c1c' } }],
      customCss: [
        // Self-hosted variable fonts: no third-party requests.
        '@fontsource-variable/inter',
        '@fontsource-variable/jetbrains-mono',
        './src/styles/custom.css',
      ],
      components: {
        // Adds status, owner and review date under each page title.
        PageTitle: './src/components/PageTitle.astro',
      },
      plugins: [
        // Brand-themed Mermaid diagrams with an expanded view (src/plugins/mermaid).
        starlightMermaid(),
        // Content uses relative links so it works under any base path (GitHub
        // Pages project site today, a custom domain at "/" tomorrow). Relative
        // links are still resolved and validated, including heading anchors.
        starlightLinksValidator({ errorOnRelativeLinks: false, errorOnLocalLinks: true }),
        // Publishes /llms.txt so AI assistants can read the wiki efficiently.
        starlightLlmsTxt({
          projectName: 'Engineering Wiki',
          description:
            'Engineering notes, standards, architecture decision records and runbooks, maintained as code.',
        }),
      ],
      sidebar: SECTIONS.map(({ title, directory, collapsed = false }) => ({
        label: title,
        collapsed,
        items: [{ autogenerate: { directory } }],
      })),
    }),
  ],
});
