---
title: Dependency management
description: Keeping third-party dependencies minimal, pinned, current and free of known vulnerabilities.
sidebar:
  order: 2
---

Third-party dependencies are code you did not write but are responsible for. Manage them
deliberately.

## Practices

1. **Add dependencies sparingly.** Check maintenance activity, licence, size and transitive
   dependencies before adding one.
2. **Commit lockfiles** and install with a frozen lockfile in CI so builds are reproducible.
3. **Automate updates** with Dependabot or Renovate, grouped to keep review effort manageable.
4. **Scan for vulnerabilities** in CI, and review new dependencies in pull requests.
5. **Pin CI actions and container images** to immutable references (commit SHAs, digests).
6. **Delay brand-new releases** where your package manager supports it, to reduce exposure to
   compromised packages.

## How this wiki does it

| Practice               | Implementation                                                |
| ---------------------- | ------------------------------------------------------------- |
| Lockfile               | `pnpm-lock.yaml`, installed with `--frozen-lockfile`          |
| Automated updates      | Dependabot for npm and GitHub Actions, weekly, grouped        |
| Vulnerability scanning | `pnpm audit` in CI; GitHub dependency review on pull requests |
| Release-age delay      | pnpm's `minimumReleaseAge` setting                            |
| Pinned actions         | Full-length commit SHAs                                       |

```sh
# Check for known vulnerabilities locally
pnpm audit --audit-level high

# See which dependencies are outdated
pnpm outdated
```

## Further reading

- [OpenSSF — Concise guide for evaluating open source software](https://best.openssf.org/Concise-Guide-for-Evaluating-Open-Source-Software)
- [GitHub — Dependabot](https://docs.github.com/en/code-security/dependabot)
