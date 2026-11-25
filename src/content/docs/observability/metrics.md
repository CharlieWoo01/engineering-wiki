---
title: Metrics
description: Metric types, the RED and USE methods, and avoiding high-cardinality labels.
status: draft
sidebar:
  order: 3
---

:::caution[Draft]
General guidance; no organisation-specific metric naming or retention policy has been agreed.
:::

Metrics are numeric measurements aggregated over time. They are cheap to store and query, which
makes them ideal for dashboards and alerts.

## Instrument types

| Type          | Behaviour                          | Example                        |
| ------------- | ---------------------------------- | ------------------------------ |
| Counter       | Only increases.                    | `http.server.requests`         |
| UpDownCounter | Increases and decreases.           | Active connections             |
| Gauge         | A sampled current value.           | Memory in use                  |
| Histogram     | Distribution of values in buckets. | `http.server.request.duration` |

## What to measure

- **RED** for request-driven services: **R**ate, **E**rrors, **D**uration.
- **USE** for resources: **U**tilisation, **S**aturation, **E**rrors.
- **Golden signals** (Google SRE): latency, traffic, errors, saturation.

## Watch cardinality

Every unique combination of label values creates a new time series. Never use unbounded values —
user IDs, request IDs, full URLs — as metric labels; put them on traces or logs instead.

## Further reading

- [OpenTelemetry metrics](https://opentelemetry.io/docs/concepts/signals/metrics/)
- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
