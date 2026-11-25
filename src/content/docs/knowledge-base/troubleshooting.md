---
title: Troubleshooting
description: Known problems and fixes, starting with issues you may hit when working on this wiki.
sidebar:
  order: 3
---

Each entry follows the same shape: **symptom**, **cause**, **fix**. Add new entries at the end
of the relevant section.

## Working on this wiki

### Styles or links are broken on GitHub Pages but fine locally

- **Symptom:** the deployed site loads without CSS, or links return 404.
- **Cause:** a root-relative link (`/adr/…`) skips the `/engineering-wiki/` base path.
- **Fix:** use relative links in Markdown (`../../adr/introduction/`). `pnpm check:links` reports
  any link outside the base path.

### The build fails with a frontmatter error

- **Symptom:** `pnpm build` or `pnpm check` reports `description: Required` or similar.
- **Cause:** frontmatter does not match the schema in `src/lib/frontmatter.ts`.
- **Fix:** add the missing field; see
  [Contributing › Frontmatter](../../getting-started/contributing/#frontmatter).

### The build fails with "invalid link"

- **Symptom:** `starlight-links-validator` lists broken links.
- **Cause:** a page was renamed or a heading anchor changed.
- **Fix:** update the link. Anchors are the heading text in lowercase, with spaces as hyphens.

### "Last updated" dates are missing or wrong

- **Symptom:** every page shows the same date, or none.
- **Cause:** the dates come from Git history, and shallow clones have none.
- **Fix:** CI checks out with `fetch-depth: 0`. Locally, make sure your clone is not shallow
  (`git fetch --unshallow`).

### Playwright cannot find a browser

- **Symptom:** `pnpm test:e2e` fails with `Executable doesn't exist`.
- **Fix:** run `pnpm exec playwright install chromium`.
