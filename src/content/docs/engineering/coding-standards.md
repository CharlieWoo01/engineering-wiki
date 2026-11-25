---
title: Coding standards
description: How coding standards should be defined and enforced, with general starting points.
status: draft
sidebar:
  order: 2
---

:::caution[Draft — no agreed standards yet]
No organisation-specific coding standards have been agreed. This page describes how standards
should be captured and enforced, plus general starting points.
:::

## Approach

Prefer standards that a tool can enforce over standards that rely on reviewers remembering them.

1. **Formatters** remove style debates entirely (for example Prettier, `gofmt`, Black, `rustfmt`).
2. **Linters** catch bugs and enforce conventions (for example ESLint, Ruff, golangci-lint).
3. **Type checkers** catch whole classes of errors before runtime (TypeScript strict mode, mypy).
4. **Written guidance** covers what tools cannot: naming, error handling, module boundaries.

Run all of them locally (editor integration, pre-commit) and in CI so violations never reach
the default branch.

## What a language standard page should cover

- Supported language and runtime versions.
- Formatter and linter configuration (link to the shared config).
- Naming conventions and project layout.
- Error handling and logging expectations.
- Testing expectations (see [Testing strategies](../testing-strategies/)).
- Dependency policy (see [Dependency management](../../security/dependency-management/)).

## Example: this repository

This wiki's own code follows enforceable standards — strict TypeScript, ESLint with
`typescript-eslint`'s strict type-checked rules, Prettier and markdownlint — all run by
`pnpm validate` and in CI.

## Further reading

- [Google Style Guides](https://google.github.io/styleguide/)
- [Conventional Commits](https://www.conventionalcommits.org/)
