import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import starlightLinksValidator from 'starlight-links-validator';
import { satteri } from '@astrojs/markdown-satteri';
import { resolveDeployment } from './src/lib/deployment.ts';
import { taskListLabels } from './src/lib/task-list-labels.ts';

const REPOSITORY_URL = 'https://github.com/CharlieWoo01/engineering-wiki';

// `site` and `base` come from SITE_URL / BASE_PATH (see src/lib/deployment.ts).
const { site, base } = resolveDeployment(process.env);

/** Sidebar group that lists every page in a directory, ordered by `sidebar.order`. */
const section = (label: string, directory: string, collapsed = false) => ({
  label,
  collapsed,
  items: [{ autogenerate: { directory } }],
});

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
    // Must be registered before Starlight so it can process ```mermaid code blocks.
    mermaid({ theme: 'default', autoTheme: true }),
    starlight({
      title: 'Engineering Wiki',
      description:
        'Technical notes, engineering standards, architecture decisions and runbooks, maintained as code.',
      logo: { src: './src/assets/logo.svg', alt: '' },
      favicon: '/favicon.svg',
      social: [{ icon: 'github', label: 'GitHub repository', href: REPOSITORY_URL }],
      editLink: { baseUrl: `${REPOSITORY_URL}/edit/main/` },
      lastUpdated: true,
      customCss: ['./src/styles/custom.css'],
      plugins: [
        // Content uses relative links so it works under any base path (GitHub
        // Pages project site today, a custom domain at "/" tomorrow). Relative
        // links are still resolved and validated, including heading anchors.
        starlightLinksValidator({ errorOnRelativeLinks: false, errorOnLocalLinks: true }),
      ],
      sidebar: [
        section('Getting Started', 'getting-started'),
        section('Engineering', 'engineering'),
        section('Platform', 'platform'),
        section('DevOps', 'devops'),
        section('Observability', 'observability'),
        section('Security', 'security'),
        section('Knowledge Base', 'knowledge-base'),
        section('Research & Development', 'research'),
        section('Architecture Decision Records', 'adr', true),
        section('Runbooks', 'runbooks', true),
      ],
    }),
  ],
});
