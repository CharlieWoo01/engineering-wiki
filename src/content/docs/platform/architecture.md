---
title: Architecture
description: Structure for documenting platform architecture using the C4 model and diagrams as code.
tags: [platform, architecture]
status: draft
sidebar:
  order: 2
---

:::caution[Placeholder]
No platform architecture is documented yet. The diagram below is an **illustrative example** of
the notation, not a description of a real system.
:::

## Recommended approach

Use the [C4 model](https://c4model.com/) to describe architecture at increasing levels of
detail — context, containers, components — and keep diagrams in Markdown as Mermaid so they are
versioned and reviewed like code.

## Illustrative example: system context

```mermaid title="Illustrative system context"
flowchart LR
  dev([Engineer]) -->|pushes code| scm[Source control]
  scm -->|triggers| ci[CI/CD pipelines]
  ci -->|deploys to| rt[Runtime platform]
  rt -->|emits telemetry| obs[Observability stack]
  dev -->|reads dashboards| obs
```

## What to document

- **Context:** who uses the platform and which external systems it depends on.
- **Containers:** the deployable pieces and how they communicate.
- **Key decisions:** link each significant choice to an [ADR](../../adr/introduction/).
- **Quality attributes:** availability, scalability and security expectations.
