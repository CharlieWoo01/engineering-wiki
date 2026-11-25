---
title: Design patterns
description: A curated index of design and architecture patterns with guidance on when to apply them.
tags: [architecture, reliability]
status: draft
sidebar:
  order: 3
---

Design patterns are named, reusable solutions to recurring design problems. Their main value is a
shared vocabulary: "put a circuit breaker in front of that call" communicates a lot in a few words.

:::tip
A pattern is only worth applying when you have the problem it solves. Start simple and refactor
towards a pattern when the need appears.
:::

## Pattern catalogue

| Pattern            | Problem it solves                                                  | Category      |
| ------------------ | ------------------------------------------------------------------ | ------------- |
| Strategy           | Swap an algorithm at runtime without conditionals everywhere.      | Behavioural   |
| Adapter            | Make an incompatible interface fit the one your code expects.      | Structural    |
| Repository         | Isolate domain logic from data-access details.                     | Architectural |
| Retry with backoff | Recover from transient failures without overwhelming a dependency. | Resilience    |
| Circuit breaker    | Stop calling a failing dependency so it, and you, can recover.     | Resilience    |
| Outbox             | Publish events reliably alongside a database transaction.          | Integration   |
| Strangler fig      | Replace a legacy system incrementally rather than in a big bang.   | Migration     |

## Example: retry with exponential backoff

```ts title="retry.ts"
export async function retry<T>(
  operation: () => Promise<T>,
  { attempts = 3, baseDelayMs = 200 } = {},
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= attempts) throw error;
      const jitter = Math.random() * baseDelayMs;
      await new Promise((resolve) =>
        setTimeout(resolve, baseDelayMs * 2 ** (attempt - 1) + jitter),
      );
    }
  }
}
```

Only retry operations that are safe to repeat (idempotent), and cap the total time spent retrying.

## Further reading

- [Refactoring Guru — Design Patterns](https://refactoring.guru/design-patterns)
- [Microsoft — Cloud Design Patterns](https://learn.microsoft.com/en-us/azure/architecture/patterns/)
- [Martin Fowler — Strangler Fig Application](https://martinfowler.com/bliki/StranglerFigApplication.html)
