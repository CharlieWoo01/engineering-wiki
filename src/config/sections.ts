import type { StarlightIcon } from '@astrojs/starlight/types';

/**
 * The handbook's top-level sections — the single source for both the sidebar
 * (astro.config.ts) and the homepage section grid (src/content/docs/index.mdx).
 * Adding a section means creating its folder and adding one entry here.
 */
export interface WikiSection {
  title: string;
  /** Folder under src/content/docs/. */
  directory: string;
  description: string;
  icon: StarlightIcon;
  /** Page the homepage card opens, relative to the site root. */
  href: string;
  /** Start collapsed in the sidebar. */
  collapsed?: boolean;
}

export const SECTIONS: readonly WikiSection[] = [
  {
    title: 'Getting Started',
    directory: 'getting-started',
    description: 'What the wiki is, how it is organised and how to contribute.',
    icon: 'rocket',
    href: 'getting-started/introduction/',
  },
  {
    title: 'Engineering',
    directory: 'engineering',
    description: 'Principles, coding standards, design patterns, testing and workflows.',
    icon: 'puzzle',
    href: 'engineering/principles/',
  },
  {
    title: 'Platform',
    directory: 'platform',
    description: 'Platform architecture, infrastructure, developer experience and onboarding.',
    icon: 'laptop',
    href: 'platform/overview/',
  },
  {
    title: 'DevOps',
    directory: 'devops',
    description: 'CI/CD, containers, infrastructure as code and deployment strategies.',
    icon: 'setting',
    href: 'devops/ci-cd/',
  },
  {
    title: 'Observability',
    directory: 'observability',
    description: 'OpenTelemetry, logging, metrics, tracing, monitoring and alerting.',
    icon: 'analytics',
    href: 'observability/opentelemetry/',
  },
  {
    title: 'Security',
    directory: 'security',
    description: 'Security principles, dependency management and secrets management.',
    icon: 'padlock',
    href: 'security/principles/',
  },
  {
    title: 'Knowledge Base',
    directory: 'knowledge-base',
    description: 'Technical notes, troubleshooting, useful commands and tips.',
    icon: 'open-book',
    href: 'knowledge-base/technical-notes/',
  },
  {
    title: 'Research & Development',
    directory: 'research',
    description: 'Proofs of concept, technology evaluations and experiments.',
    icon: 'star',
    href: 'research/proofs-of-concept/',
  },
  {
    title: 'Architecture Decision Records',
    directory: 'adr',
    description: 'Significant decisions, their context and their consequences.',
    icon: 'approve-check-circle',
    href: 'adr/introduction/',
    collapsed: true,
  },
  {
    title: 'Runbooks',
    directory: 'runbooks',
    description: 'Step-by-step operational procedures for known scenarios.',
    icon: 'list-format',
    href: 'runbooks/introduction/',
    collapsed: true,
  },
];
