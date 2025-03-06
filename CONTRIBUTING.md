# Contributor's Guide

Welcome to the Api3 documentation repository. This guide will help you get
started with contributing to the Api3 documentation. The docs use [VitePress](https://vitepress.dev/), a Vue-powered static
site generator. Follow the steps below to get started.

Make sure to check out https://docs.api3.org/dev/ for more details and
information about getting started and making a contribution to the Api3 Docs.

## Installation

```bash
pnpm install
```

## Running the local development server

Run the following command to start the local development server on port `5173`:

```bash
pnpm docs:dev
```

## Building the static site

```bash
pnpm docs:build
```

## Prettier Formatting

Make sure to run the following command before submitting a PR to format the
markdown. The Github action will check for prettier formatting:

```bash
pnpm format
```

## Git Workflow:

- `main` branch: for the current live site [docs.api3.org](https://docs.api3.org)

[Check this out](https://docs.api3.org/dev/firebase.html#repo-branches) for more
info about the branches.

## Submitting an Issue

You can submit an issue if you find any bugs or have any feature requests.
Please make sure to check if the issue already exists before submitting a new
one.

You can:

- Submit an issue for a bug.
- Submit an issue for a feature request.
- Submit an issue for a documentation request.

## Making a PR

After making changes in a feature branch, submit a PR against the `main` branch.
Make sure to link the corresponding GitHub Issue in the PR description e.g.
`Closes #1`. You will be able to see the changes within a Firebase preview
deployment that is unique to the PR. The PR will be reviewed by the team and
merged into the `main` branch, which will result in the changes going live into
production.
