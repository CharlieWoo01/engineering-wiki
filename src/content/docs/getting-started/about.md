---
title: About the Engineering Wiki
description: Purpose, principles, technology and visibility limitations of the Engineering Wiki.
sidebar:
  order: 2
  label: About
---

## Purpose

The wiki started as a proof of concept for centralising engineering knowledge that would
otherwise be scattered across personal notes, chat threads and repository READMEs. The aim is
for it to grow into a comprehensive engineering and platform handbook without needing a rewrite.

## Principles

- **Documentation as code.** Content lives in Git next to the tooling that validates it.
- **Simple over clever.** Native [Starlight](https://starlight.astro.build/) features are preferred
  over custom components; dependencies are kept to a minimum.
- **Static by default.** The site is plain HTML, CSS and a little JavaScript. There is no backend,
  database or tracking.
- **Honest content.** Pages say when they are drafts, and illustrative examples are labelled.
- **Automated quality.** Formatting, frontmatter, links, accessibility and the build are checked
  in CI on every pull request.

## Technology

| Concern           | Choice                                                                         |
| ----------------- | ------------------------------------------------------------------------------ |
| Site framework    | [Astro](https://astro.build/) with [Starlight](https://starlight.astro.build/) |
| Language          | TypeScript (strict)                                                            |
| Search            | [Pagefind](https://pagefind.app/), built into Starlight                        |
| Diagrams          | [Mermaid](https://mermaid.js.org/) via a small built-in Starlight plugin       |
| AI-readable index | [`llms.txt`](https://llmstxt.org/) via `starlight-llms-txt`                    |
| Testing           | Vitest, Playwright and axe-core                                                |
| Hosting and CI/CD | GitHub Pages and GitHub Actions                                                |

The reasoning behind these choices is recorded in
[ADR-0002](../../adr/0002-use-astro-starlight-for-the-engineering-wiki/).

## Visibility and access control

:::danger[This site is public]
The wiki is published with **GitHub Pages**. Pages sites are publicly accessible on the internet
— even when the source repository is private — unless the repository belongs to a GitHub
Enterprise Cloud organisation with access control enabled. Anyone with the URL can read every
page, and pages may be indexed by search engines.

**Never publish** credentials, internal hostnames or IP addresses, customer data, personal data,
security vulnerabilities, incident details or any other private or sensitive information.
:::

GitHub Enterprise Cloud supports
[access-controlled Pages sites](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)
for private repositories. If the wiki ever needs to hold internal content, it must move to
private hosting with authentication first — see the roadmap in the repository README.
