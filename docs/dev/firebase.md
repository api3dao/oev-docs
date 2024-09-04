---
title: Firebase
pageHeader: Docs Development
outline: deep
---

<PageHeader/>

# {{$frontmatter.title}}

All production and PR preview deployments are published on Firebase hosting and
are built automatically using GitHub
[workflows](https://github.com/api3dao/vitepress-docs/tree/main/.github/workflows)
stored in the `vitepress-docs` repo.

- Production: https://vitepress-docs.web.app (and https://docs.api3.org)

## Repo Branches

When a PR is merged into the default branch, `main`, a Firebase deployment of
the docs production website is triggered.

## Firebase emulator

You can run the docs using the firebase emulator after updating the flex indexes
and prior to pushing changes to the repo. Run the following commands from the
root of the project after ensuring that the firebase CLI is installed.

```sh
firebase:emulator
```

OR

```sh
pnpm docs:build

firebase emulators:start
```
