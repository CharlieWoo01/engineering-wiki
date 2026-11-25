---
title: 'ADR-0001: Record architecture decisions'
description: We will record significant architectural decisions as ADRs in this wiki.
tags: [decision-making, documentation]
sidebar:
  order: 3
  label: '0001: Record architecture decisions'
---

| Field          | Value           |
| -------------- | --------------- |
| Status         | Accepted        |
| Date           | 2026-11-25      |
| Decision maker | Wiki maintainer |

## Context

Decisions about architecture and tooling are made continually, but the reasoning behind them is
easily lost in chat threads and meetings. New contributors cannot tell whether a choice was
deliberate or accidental, and old debates are repeated.

## Decision drivers

- Decisions should be discoverable alongside other engineering documentation.
- Recording a decision must be lightweight enough that people actually do it.
- History should be preserved, including decisions that were later reversed.

## Considered options

1. Do not record decisions formally.
2. Record decisions in a separate tool (issue tracker or shared documents).
3. Record decisions as Markdown ADRs in this wiki.

## Decision

We will record significant architectural decisions as Architecture Decision Records in
`src/content/docs/adr/`, using the format described by Michael Nygard and the
[ADR template](../template/).

### Rationale

ADRs in the wiki are versioned, reviewed through pull requests, searchable and published next to
the documentation they relate to.

## Consequences

### Positive

- The reasoning behind decisions is preserved and easy to find.
- Pull requests provide a natural place to discuss proposed decisions.

### Negative

- Writing an ADR adds a small amount of effort to significant decisions.
- The ADR index on the [introduction page](../introduction/#index) must be kept up to date.
