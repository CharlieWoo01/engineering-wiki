---
title: Infrastructure
description: Structure for documenting environments, cloud resources and their ownership.
tags: [platform, infrastructure]
status: draft
sidebar:
  order: 3
---

:::caution[Placeholder]
No infrastructure is documented yet. Remember this site is **public** — never publish hostnames,
IP addresses, account identifiers or network layouts.
:::

## What to document

| Topic             | Guidance                                                                                |
| ----------------- | --------------------------------------------------------------------------------------- |
| Environments      | Purpose of each environment and how changes are promoted between them.                  |
| Provisioning      | Where the [infrastructure as code](../../devops/infrastructure-as-code/) lives.         |
| Ownership         | Which team owns each area, and how to reach them.                                       |
| Cost              | How costs are attributed and monitored.                                                 |
| Disaster recovery | Recovery objectives and links to the relevant [runbooks](../../runbooks/introduction/). |

## Principles

- Infrastructure is defined in code and changed through pull requests.
- Environments are as similar as practical, differing only in scale and configuration.
- Manual changes are treated as drift and reconciled.
