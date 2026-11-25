---
title: Engineering principles
description: Widely accepted engineering principles to use as a starting point for agreed team principles.
tags: [architecture, reliability]
status: draft
sidebar:
  order: 1
---

:::caution[Draft — no agreed principles yet]
This page lists widely accepted, general engineering principles as a starting point. They are
not an agreed organisational standard. Replace or refine them once principles are agreed, and
record significant choices as [ADRs](../../adr/introduction/).
:::

## Purpose of this page

Engineering principles are short statements that guide everyday decisions when there is no
explicit rule. Good principles are few, memorable and occasionally in tension with each other —
which is exactly when they are useful.

## Candidate principles

| Principle                     | What it means in practice                                                     |
| ----------------------------- | ----------------------------------------------------------------------------- |
| **Prefer simplicity**         | Choose the simplest design that meets today's known requirements.             |
| **Make it observable**        | Every service emits logs, metrics and traces that explain its behaviour.      |
| **Automate the repeatable**   | Builds, tests, deployments and checks run without manual steps.               |
| **Secure by default**         | Least privilege, secrets out of code, dependencies kept current.              |
| **Small, reversible changes** | Ship in small increments behind safe rollout mechanisms; make rollback cheap. |
| **Write it down**             | Decisions, designs and procedures are documented where people will find them. |
| **You build it, you run it**  | Teams own the operational health of what they ship.                           |

## Further reading

- [The Twelve-Factor App](https://12factor.net/)
- [Google SRE Book](https://sre.google/sre-book/table-of-contents/)
- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
