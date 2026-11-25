---
title: 'Runbook: Roll back a GitHub Pages deployment'
description: Restore the Engineering Wiki to a previous good version after a bad deployment.
tags: [operations, deployment, github-actions]
owner: Wiki maintainers
lastReviewed: 2026-11-25
sidebar:
  order: 3
  label: Roll back a Pages deployment
---

:::caution[Before you start]
Read the whole runbook first. If any step behaves differently from what is described, stop and
ask a repository maintainer for help rather than improvising.
:::

## Summary

| Field              | Value                                                         |
| ------------------ | ------------------------------------------------------------- |
| Service / system   | Engineering Wiki (GitHub Pages)                               |
| Trigger            | The live site is broken or shows content that must be removed |
| Severity guidance  | Urgent if sensitive content was published; otherwise routine  |
| Expected duration  | 10–15 minutes                                                 |
| Required access    | Write access to the repository                                |
| Escalation contact | Repository maintainers (via a GitHub issue)                   |

## Symptoms

- Pages fail to load, styles are missing or navigation is broken on the live site.
- Content was published that should not be public.

## Prerequisites

- [ ] Write access to the repository and the GitHub CLI (`gh`) authenticated, or access to the
      GitHub web interface.
- [ ] A local clone that is up to date: `git switch main && git pull`.

## Diagnosis

1. Identify the deployment that introduced the problem:

   ```sh
   gh run list --workflow deploy.yml --branch main --limit 5
   ```

   Each run shows the commit it deployed. The last run **before** the problem appeared is the
   last known good version.

2. Confirm which commit introduced the problem:

   ```sh
   git log --oneline -10
   ```

## Resolution

1. Revert the offending commit on a new branch. A revert keeps history intact and goes through
   the normal checks:

   ```sh
   git switch -c revert/bad-deploy
   git revert <bad-commit-sha>
   git push --set-upstream origin revert/bad-deploy
   gh pr create --fill --title "Revert: <description>"
   ```

2. Merge the pull request once CI passes. The deploy workflow publishes the reverted site
   automatically.

3. **If sensitive content was published**, take the site offline first and revert afterwards: a
   repository administrator can choose **Unpublish site** under **Settings → Pages**. Re-enable
   Pages (and re-run the deploy workflow) once the revert has merged.

4. **If the deploy succeeded but the site still looks wrong**, re-run the latest deployment with
   **Actions → Deploy → Run workflow** on `main`.

## Verification

- [ ] The deploy workflow run for the revert succeeded:
      `gh run watch $(gh run list --workflow deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId')`
- [ ] The live site loads, including styles, search and navigation.
- [ ] The problem content or behaviour is gone (hard-refresh to bypass the browser cache).

## Rollback

A revert is itself revertible: if the revert causes a new problem, revert the revert commit using
the same steps.

## Escalation

If the site cannot be restored within 30 minutes, or sensitive content was exposed, open a GitHub
issue for the maintainers. For exposed secrets, follow
[Secrets management › If a secret is exposed](../../security/secrets-management/#if-a-secret-is-exposed)
immediately — removing the page does not make a leaked secret safe.

## Post-incident

- Record what happened and why the checks did not catch it.
- Add a test or validation rule that would have caught it, if practical.
- Update this runbook with anything that was unclear.

## Related

- [Deployment strategies](../../devops/deployment-strategies/)
- [CI/CD](../../devops/ci-cd/)
