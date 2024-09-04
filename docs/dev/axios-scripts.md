---
title: Axios Scripts
pageHeader: Docs Development
outline: deep
---

<PageHeader/>

# {{$frontmatter.title}}

The script
[axiosBuildScripts.js](https://github.com/api3dao/vitepress-docs/blob/main/libs/axiosBuildScripts.js)
is used to generated local data files. These files are rendered by certain
markdown pages as a data source. For example see these markdown files:

- [dAPIs chains list](/dapis/reference/chains/chains-list.md)

The local data files provide for a better page load experience rather than
real-time data access from the monorepo.

## Building the local data files

The local data files can be refreshed by running the
`/libs/axiosBuildScripts.js` script as follows:

```sh
pnpm axios:build
```
