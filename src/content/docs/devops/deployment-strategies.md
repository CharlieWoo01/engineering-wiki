---
title: Deployment strategies
description: Comparison of rolling, blue-green, canary and feature-flag deployment strategies.
tags: [deployment, reliability]
sidebar:
  order: 4
---

The right deployment strategy balances risk, speed and infrastructure cost.

## Comparison

| Strategy      | How it works                                                     | Rollback speed | Extra cost | Best for                                 |
| ------------- | ---------------------------------------------------------------- | -------------- | ---------- | ---------------------------------------- |
| Recreate      | Stop the old version, start the new one.                         | Slow           | None       | Non-critical or batch workloads.         |
| Rolling       | Replace instances gradually.                                     | Medium         | Low        | Stateless services (common default).     |
| Blue-green    | Run two environments; switch traffic all at once.                | Instant        | High       | Fast, low-risk cut-over and rollback.    |
| Canary        | Send a small share of traffic to the new version, then increase. | Fast           | Medium     | High-traffic services with good metrics. |
| Feature flags | Deploy code dark; enable features independently of deployment.   | Instant        | Tooling    | Decoupling release from deployment.      |

## Canary rollout

```mermaid title="Canary rollout with automated analysis"
flowchart LR
  A[Deploy canary] --> B[5% traffic]
  B --> C{Error rate and latency OK?}
  C -- yes --> D[25%] --> E[100%]
  C -- no --> R[Roll back]
```

Canary analysis is only as good as your telemetry — see
[Monitoring and alerting](../../observability/monitoring-and-alerting/).

## Static sites

For a static site like this wiki, each deployment replaces the whole site atomically. Rollback
means redeploying a previous commit — see the
[rollback runbook](../../runbooks/rollback-github-pages-deployment/).
