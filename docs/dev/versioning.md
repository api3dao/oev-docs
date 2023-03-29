---
title: Airnode/OIS Versioning
sidebarHeader: Docs Development
sidebarSubHeader:
pageHeader: Docs Development
basePath: /dev/versioning.html
outline: deep
tags:
---

<PageHeader/>

# {{$frontmatter.title}}

Versioning of a a [docset](/dev/docsets.md) only applies to Airnode and OIS.
There is the concept of `/latest` and `/next`. Consider the chart below which
represents Airnode:

| File path and URI         | Version |
| ------------------------- | ------- |
| /reference/airnode/next   | v0.13   |
| /reference/airnode/latest | v0.12   |
| /reference/airnode/v0.11  | v0.11   |

Also consider the directory structure of the project:

```sh
reference
├── airnode
    └── latest       ← v0.12
        ├── assets
        ├── concepts
        ├── ...
    └── next         ← v0.13
        ├── assets
        ├── concepts
        ├── ...
    └── v0.11
        ├── assets
        ├── concepts
        ├── ...
├── ...
```

## Putting `/next` into production

Using the versions depicted above (`v0.11, v0.12 as latest, and v0.13 as next`)
the process of moving `/next` into production means turning `/next` into
`/latest`. Before this can be done, `/latest` must first become `v0.13`.

In order to advance the versioning the following actions occur:

1. rename the `/latest` folder to `vx.xx`
1. rename `/next` to `/latest`
1. create a new folder `/next` as a copy of `/latest`

Update links and other version specific content. For each folder that has been
renamed make the following changes.

1. Update `themeConfig.sidebar` in `/.vitepress/config.js`
1. Update `/.vitepress/versions.json` to reflect the latest version.
1. Update internal hyperlinks in the content. In latest use `/latest`, next use
   `/next`. For folders of a specific version use the correct version number.
1. For `/latest` look for and change external links to API3 repos that may use
   older repo tags, `/master`, or `/main`. Some repos may not use tags and
   `/main` must be used, some may have tags unrelated to Airnode. Evaluate each
   link for changes as needed.
1. `/next` will not have a repo tag created until its version is release. Use
   the version of `/latest` in the mean time.