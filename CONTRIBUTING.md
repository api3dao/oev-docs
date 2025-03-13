# Contributors' guide

Welcome to the Api3 documentation repository. This guide will help you get
started with contributing to the Api3 documentation. The docs use [VitePress](https://vitepress.dev/), a Vue-powered static
site generator. Follow the steps below to get started.

## Submitting an issue

You can submit an issue if you find any bugs or have any feature requests.
Please make sure to check if the issue already exists before submitting a new
one.

## Making a pull request

After making changes in a feature branch, submit a pull request (PR) against the `main` branch.
Make sure to link the corresponding GitHub Issue in the PR description e.g.
`Closes #1`. You will be able to see the changes within a Firebase preview
deployment that is unique to the PR. The PR will be reviewed by the team and
merged into the `main` branch, which will result in the changes going live into
production.

### Getting started

After cloning the repo locally, install the dependencies and run the docs locally.

```bash
pnpm install
pnpm docs:dev
```
