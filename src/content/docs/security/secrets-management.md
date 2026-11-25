---
title: Secrets management
description: How to store, inject, rotate and detect secrets without committing them to source control.
tags: [security, github-actions]
sidebar:
  order: 3
---

A secret is any value that grants access: passwords, API keys, tokens, private keys, connection
strings.

:::danger[Never commit secrets]
Secrets must never appear in source control, documentation, logs, container images or this wiki.
Git history is permanent: a committed secret must be treated as **compromised** and rotated, even
if the commit is removed.
:::

## Practices

- **Store** secrets in a dedicated secrets manager or your CI platform's encrypted secrets.
- **Inject** them at runtime through environment variables or mounted files.
- **Prefer short-lived credentials**, for example OpenID Connect (OIDC) federation from CI to
  cloud providers instead of long-lived keys.
- **Scope** each secret to the smallest set of systems and people that need it.
- **Rotate** regularly and immediately after any suspected exposure.
- **Detect** leaks with secret scanning and push protection.

## If a secret is exposed

1. Revoke or rotate the secret immediately.
2. Check access logs for misuse.
3. Remove it from the code and history if appropriate (rotation is still required).
4. Record what happened and how to prevent a recurrence.

## Local development

Use a `.env` file for local-only values. It is ignored by `.gitignore` in this repository; commit
a `.env.example` with placeholder values instead.

## Further reading

- [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
