---
title: Security principles
description: Foundational security principles to guide design and delivery decisions.
status: draft
sidebar:
  order: 1
---

:::caution[Draft — not a security policy]
These are widely accepted principles, not an organisational security policy. Formal policies
must come from the appropriate security owner. To report a vulnerability in this wiki, see
`SECURITY.md` in the repository.
:::

## Principles

| Principle                   | In practice                                                                  |
| --------------------------- | ---------------------------------------------------------------------------- |
| **Least privilege**         | Grant the minimum permissions needed, for the shortest time.                 |
| **Defence in depth**        | Layer controls so one failure does not compromise the system.                |
| **Secure by default**       | Safe configuration out of the box; insecure options require explicit opt-in. |
| **Minimise attack surface** | Remove unused code, dependencies, ports and permissions.                     |
| **Fail securely**           | Errors deny access rather than grant it, and do not leak internal detail.    |
| **Shift left**              | Catch issues early with automated checks in the editor and in CI.            |
| **Assume breach**           | Design so that detection, containment and recovery are possible.             |

## Example: this repository

- CI workflows use read-only tokens by default; only the deploy job can write to Pages.
- GitHub Actions are pinned to full commit SHAs and updated by Dependabot.
- Pull requests from forks run without access to secrets.
- The site is static, with no backend, database or user data.

## Further reading

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NCSC Secure development and deployment guidance](https://www.ncsc.gov.uk/collection/developers-collection)
- [OpenSSF Scorecard](https://scorecard.dev/)
