# Security policy

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Report vulnerabilities privately using GitHub's
[private vulnerability reporting](https://github.com/CharlieWoo01/engineering-wiki/security/advisories/new).
Include a description of the issue, steps to reproduce and its potential impact. You should
receive an acknowledgement within a few working days.

## Sensitive content

The Engineering Wiki is published to **GitHub Pages and is publicly accessible**. If you find
content on the site or in this repository that should not be public — credentials, tokens,
internal hostnames or IP addresses, personal data or details of unresolved vulnerabilities —
report it privately as above so it can be removed and, where relevant, rotated.

Removing a secret from the site or Git history does not make it safe: any exposed secret must be
treated as compromised and rotated.

## Scope

This repository is a static documentation site. It has no backend, database, user accounts or
runtime secrets. Relevant issues include:

- vulnerabilities in dependencies that affect the build or the generated site;
- weaknesses in the GitHub Actions workflows (for example, excessive permissions);
- cross-site scripting or similar issues in generated pages.

## Supported versions

Only the latest version on the `main` branch, as deployed to GitHub Pages, is supported.

## Security practices

- GitHub Actions use least-privilege tokens and are pinned to full commit SHAs.
- Pull requests from forks run without secrets or write permissions.
- Dependabot keeps npm dependencies and GitHub Actions up to date.
- CI audits dependencies and reviews dependency changes in pull requests.
