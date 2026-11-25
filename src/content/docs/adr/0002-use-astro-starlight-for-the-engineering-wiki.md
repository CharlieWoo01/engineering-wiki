---
title: 'ADR-0002: Use Astro Starlight for the Engineering Wiki'
description: We will build the Engineering Wiki with Astro Starlight and host it on GitHub Pages.
tags: [decision-making, documentation]
sidebar:
  order: 4
  label: '0002: Use Astro Starlight'
---

| Field          | Value           |
| -------------- | --------------- |
| Status         | Accepted        |
| Date           | 2026-11-25      |
| Decision maker | Wiki maintainer |

## Context

Technical notes, documentation and decisions were spread across several places. A central wiki
was needed that treats documentation as code: written in Markdown, reviewed in pull requests,
validated automatically and published without manual steps. It should start as a proof of
concept and be able to grow into an engineering handbook.

## Decision drivers

- Markdown and MDX content stored in Git.
- Good navigation, full-text search, and light and dark themes with minimal custom code.
- Static output that can be hosted for free, with no backend or database.
- Accessible, responsive output.
- An active, well-maintained project.

## Considered options

1. **Astro Starlight** — documentation framework built on Astro.
2. **Docusaurus** — React-based documentation framework.
3. **MkDocs with Material** — Python-based static site generator.
4. **A hosted wiki product** — for example a SaaS knowledge base.

## Decision

We will build the wiki with **Astro Starlight**, written in TypeScript, and deploy it to
**GitHub Pages** using GitHub Actions.

### Rationale

- Starlight provides navigation, Pagefind search, theming, accessible components, edit links and
  "last updated" dates out of the box, so no custom components are needed.
- Astro ships minimal client-side JavaScript by default, keeping the site fast.
- Content collections validate frontmatter against a schema at build time.
- A static build deploys to GitHub Pages at no cost and could move to any static host later.
- Docusaurus and MkDocs are credible alternatives. Starlight was preferred for its lighter
  client-side footprint and TypeScript-first tooling; a hosted wiki was rejected because it does
  not support a docs-as-code workflow.

## Consequences

### Positive

- Adding a page means adding a Markdown file; the sidebar and search update automatically.
- The same tooling validates content and code in CI.

### Negative

- GitHub Pages sites are public (see
  [About › Visibility](../../getting-started/about/#visibility-and-access-control)), so only
  non-sensitive content can be published until private hosting is in place.
- Starlight is pre-1.0, so minor releases may include breaking changes; Dependabot updates must
  be reviewed rather than merged blindly.
- Content must use relative links to work under the GitHub Pages base path.

## References

- [Starlight documentation](https://starlight.astro.build/)
- [PoC: Engineering Wiki on Astro Starlight](../../research/engineering-wiki-poc/)
