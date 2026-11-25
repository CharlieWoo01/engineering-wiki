# Contributing

Thanks for helping improve the Engineering Wiki. The full authoring guide — folder structure,
naming conventions, frontmatter, links, diagrams and templates — is published in the wiki at
[Getting Started › Contributing](https://charliewoo01.github.io/engineering-wiki/getting-started/contributing/)
and lives in [`src/content/docs/getting-started/contributing.mdx`](src/content/docs/getting-started/contributing.mdx).

> [!WARNING]
> The site is **public**. Never commit secrets, credentials, internal hostnames, IP addresses,
> personal data or other sensitive information.

## Quick start

```sh
pnpm install
pnpm dev            # http://localhost:4321/engineering-wiki/
```

## Adding a page

1. Copy a template from [`templates/`](templates/) into the right folder under
   `src/content/docs/`.
2. Fill in `title` and `description` (both required) and write the content.
3. Use relative links between pages, for example `../../adr/introduction/`.
4. Run `pnpm validate`.
5. Open a pull request using the template.

The sidebar is generated from the folder structure, so new pages in existing sections need no
configuration.

## Changing code or configuration

- Keep dependencies to a minimum and prefer built-in Starlight features over custom components.
- Add Vitest unit tests for new logic in `src/lib/` or `scripts/`, and Playwright tests for new
  user-facing behaviour.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages, for
  example `docs(adr): add ADR-0003` or `ci: cache Playwright browsers`.

## Pull request checks

Every pull request must pass the CI workflow. See the
[README](README.md#cicd-architecture) for the list of checks and how to run them locally.
