---
title: Introduction
description: What the Engineering Wiki is, who it is for and how to find your way around.
tags: [documentation, onboarding]
sidebar:
  order: 1
---

The Engineering Wiki is a central, searchable home for technical notes, engineering
documentation, research, architectural decisions and operational procedures. It is maintained as
code: every page is a Markdown file in Git, and every change goes through a pull request.

## Who this wiki is for

- **Engineers** looking for standards, patterns, commands and troubleshooting notes.
- **Platform and operations engineers** looking for runbooks and infrastructure context.
- **New joiners** looking for a structured route into how things work.
- **Decision makers** looking for the reasoning behind past architectural choices.

## How the content is organised

| Section                                                     | What you will find                                                    |
| ----------------------------------------------------------- | --------------------------------------------------------------------- |
| [Engineering](../../engineering/principles/)                | Principles, coding standards, design patterns, testing and workflows. |
| [Platform](../../platform/overview/)                        | Platform architecture, infrastructure and developer experience.       |
| [DevOps](../../devops/ci-cd/)                               | Delivery pipelines, containers, infrastructure as code, deployments.  |
| [Observability](../../observability/opentelemetry/)         | Telemetry, logging, metrics, tracing and alerting.                    |
| [Security](../../security/principles/)                      | Security principles, dependencies and secrets.                        |
| [Knowledge Base](../../knowledge-base/technical-notes/)     | Short notes, troubleshooting, commands and tips.                      |
| [Research & Development](../../research/proofs-of-concept/) | Proofs of concept, technology evaluations and experiments.            |
| [Architecture Decision Records](../../adr/introduction/)    | Significant decisions and their context.                              |
| [Runbooks](../../runbooks/introduction/)                    | Step-by-step procedures for operational tasks.                        |

## Finding information

- **Search:** press <kbd>/</kbd> or <kbd>Ctrl</kbd> + <kbd>K</kbd> (<kbd>⌘</kbd> + <kbd>K</kbd> on macOS).
- **Navigate:** use the sidebar, which is generated automatically from the folder structure.
- **On this page:** the table of contents on wide screens lists the headings on the current page.

## Page status

Many pages are deliberately marked as **drafts**. They describe what the page will eventually
cover and list well-established, general guidance, but they do **not** yet contain
organisation-specific standards. Content that is illustrative rather than authoritative is always
labelled as such.

:::note
Want to add or improve something? Read [Contributing](../contributing/) — it takes a few minutes
to publish a new page.
:::
