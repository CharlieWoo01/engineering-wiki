---
title: Logging
description: Structured logging practices, log levels and what never to log.
status: draft
sidebar:
  order: 2
---

:::caution[Draft]
General good practice; no organisation-wide logging standard or platform has been agreed.
:::

## Use structured logs

Emit logs as structured events (usually JSON) rather than free text, so they can be filtered and
aggregated without fragile parsing.

```json
{
  "timestamp": "2026-11-25T10:15:30.123Z",
  "severity": "ERROR",
  "service.name": "checkout",
  "message": "Payment authorisation failed",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
  "error.type": "TimeoutError"
}
```

Including `trace_id` and `span_id` lets you jump from a log line to the
[distributed trace](../distributed-tracing/) it belongs to.

## Log levels

| Level   | Use for                                                             |
| ------- | ------------------------------------------------------------------- |
| `ERROR` | A failure that needs attention; an operation did not complete.      |
| `WARN`  | Something unexpected that the system recovered from.                |
| `INFO`  | Significant business or lifecycle events (start-up, job completed). |
| `DEBUG` | Detailed diagnostics, normally disabled in production.              |

## Never log

:::danger
Never log secrets, tokens, passwords, full payment card numbers, or personal data beyond what is
strictly necessary and lawful. Redact at the source, and again in the collector as a safety net.
:::

## Further reading

- [OpenTelemetry Logs data model](https://opentelemetry.io/docs/specs/otel/logs/data-model/)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
