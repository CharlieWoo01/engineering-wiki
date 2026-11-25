---
title: Runbook introduction
description: What runbooks are, what makes a good one and how they relate to alerts and incidents.
tags: [operations, reliability]
sidebar:
  order: 1
  label: Introduction
---

A **runbook** is a step-by-step procedure for a known operational task or failure scenario. A good
runbook lets an engineer who has never seen the problem before resolve it safely — at 3 a.m.,
under pressure.

## What makes a good runbook

- **Specific trigger:** it names the alert or symptom that should lead someone to it.
- **Copy-pasteable steps:** commands are complete, with the expected output described.
- **Verification:** every change is followed by a way to confirm it worked.
- **Rollback and escalation:** it says how to back out and when to stop and ask for help.
- **Reviewed regularly:** `lastReviewed` in the frontmatter shows when it was last checked.

:::caution[Public site]
This wiki is public. Runbooks here must not contain hostnames, IP addresses, account
identifiers, credentials or personal contact details. Refer to roles, teams and tools instead.
:::

## Runbooks and alerts

Every alert that can page a human should link to a runbook (see
[Monitoring and alerting](../../observability/monitoring-and-alerting/)). If an alert has no
runbook, either write one or question whether the alert should page at all.

## Index

| Runbook                                                                     | Trigger                                     |
| --------------------------------------------------------------------------- | ------------------------------------------- |
| [Roll back a GitHub Pages deployment](../rollback-github-pages-deployment/) | A bad change has been deployed to this wiki |

## Writing a runbook

Start from the [runbook template](../template/).
