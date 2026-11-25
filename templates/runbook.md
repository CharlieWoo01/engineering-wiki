---
title: 'Runbook: Verb phrase describing the operation'
description: When to use this runbook and the outcome it achieves.
tags: []
status: draft
owner: Owning team
lastReviewed: 2026-01-01
---

:::caution[Before you start]
Read the whole runbook first. If any step behaves differently from what is
described, stop and escalate rather than improvising.
:::

## Summary

| Field              | Value                                      |
| ------------------ | ------------------------------------------ |
| Service / system   | _Affected service_                         |
| Trigger            | _Alert name, symptom or scheduled task_    |
| Severity guidance  | _When is this an incident?_                |
| Expected duration  | _e.g. 15 minutes_                          |
| Required access    | _Roles or permissions needed_              |
| Escalation contact | _Team, rota or channel (no personal data)_ |

## Symptoms

- _What does the operator observe? Dashboards, alerts, error messages._

## Prerequisites

- [ ] _Access, tooling and context needed before starting_

## Diagnosis

1. _Check …_

   ```sh
   # command with expected output described below
   ```

   _Expected result:_ …

## Resolution

1. _Step one_
2. _Step two_

## Verification

- [ ] _How to confirm the system is healthy again_

## Rollback

_How to undo the resolution steps if they make things worse._

## Escalation

_When and how to escalate, and what information to include._

## Post-incident

- _Record a timeline, raise follow-up issues and update this runbook._

## Related

- _Dashboards, alerts, architecture pages, ADRs_
