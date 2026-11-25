---
title: Running TypeScript scripts with Node.js type stripping
description: Run .ts tooling scripts directly with Node.js — no build step or extra dependency.
tags: [typescript, nodejs]
lastReviewed: 2026-11-25
sidebar:
  order: 2
  label: 'Note: Node.js type stripping'
---

## Summary

Modern Node.js can run TypeScript files directly by stripping type annotations, so small tooling
scripts no longer need `ts-node`, `tsx` or a compile step. This wiki's link checker
(`scripts/check-links.ts`) runs this way.

## Context

Type stripping was added behind a flag in Node.js 22.6 and has been enabled by default since
Node.js 22.18 and 23.6. This repository targets the Node.js 26 LTS release (see `.nvmrc`).

## Details

```sh
node scripts/check-links.ts
```

Node.js **removes** type annotations; it does not type check or transform code. That leads to a
few rules:

| Rule                                               | Why                                                |
| -------------------------------------------------- | -------------------------------------------------- |
| Include the `.ts` extension in imports             | Node.js resolves files exactly as written.         |
| Use `import type` for type-only imports            | Type-only imports would otherwise fail at runtime. |
| Avoid `enum`, `namespace` and parameter properties | They need code generation, not just erasure.       |
| Run `tsc --noEmit` (or `astro check`) in CI        | Type errors are not reported at runtime.           |

The TypeScript compiler can enforce these rules for you:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "allowImportingTsExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "noEmit": true
  }
}
```

## Caveats

- Files inside `node_modules` are never type-stripped.
- `tsconfig.json` settings such as path aliases are ignored at runtime.

## References

- [Node.js — Running TypeScript natively](https://nodejs.org/en/learn/typescript/run-natively)
- [Node.js — Modules: TypeScript](https://nodejs.org/api/typescript.html)
