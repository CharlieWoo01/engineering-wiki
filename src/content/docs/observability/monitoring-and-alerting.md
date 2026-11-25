---
title: Monitoring and alerting
description: Symptom-based alerting, SLOs and error budgets, and keeping alerts actionable.
status: draft
sidebar:
  order: 5
---

:::caution[Draft]
General guidance; no service level objectives or on-call policy are defined here.
:::

## Alert on symptoms, not causes

Page a human when users are (or soon will be) affected — high error rates, slow responses — not
for every high CPU reading. Cause-based signals belong on dashboards for diagnosis.

## SLIs, SLOs and error budgets

| Term            | Meaning                               | Example                                    |
| --------------- | ------------------------------------- | ------------------------------------------ |
| SLI (indicator) | A measurement of user experience.     | Proportion of requests served under 300 ms |
| SLO (objective) | A target for the SLI over a window.   | 99.5% over 28 days                         |
| Error budget    | The allowed unreliability: `1 − SLO`. | 0.5% of requests may be slow or fail       |

Burn-rate alerts fire when the error budget is being consumed fast enough to exhaust it before
the window ends — they are both more sensitive and less noisy than static thresholds.

## Every alert should be actionable

- It indicates real or imminent user impact.
- It links to a [runbook](../../runbooks/introduction/).
- It has an owner and a clear severity.
- It is reviewed if it fires without action being needed.

## Further reading

- [Google SRE Workbook — Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)
