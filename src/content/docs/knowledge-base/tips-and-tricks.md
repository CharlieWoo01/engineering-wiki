---
title: Tips and tricks
description: Small productivity tips for working with this wiki and everyday engineering tools.
sidebar:
  order: 5
---

## Using this wiki

- Press <kbd>/</kbd> or <kbd>Ctrl</kbd> + <kbd>K</kbd> to search from any page.
- Use **Edit page** at the bottom of any page to open the source file on GitHub.
- Heading links are shareable: hover a heading, then copy its anchor link.

## Writing documentation

- Write the page title and description first — if they are hard to write, the page lacks focus.
- Lead with the answer; put background and detail after it.
- Prefer tables for comparisons and numbered lists for procedures.
- Use `pnpm dev` while writing: the page reloads as you save.

## Git

Set useful defaults once:

```sh
git config --global pull.rebase true
git config --global rebase.autoStash true
git config --global push.autoSetupRemote true
git config --global init.defaultBranch main
```

## Terminal

- `Ctrl` + `R` searches shell history.
- `cd -` returns to the previous directory.
- `!!` repeats the last command (for example, `sudo !!`).
