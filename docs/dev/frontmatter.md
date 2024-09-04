---
title: Frontmatter
pageHeader: Docs Development
outline: deep
---

<PageHeader/>

# {{$frontmatter.title}}

The frontmatter must be at the top of the Markdown file, and must take the form
of valid YAML set between triple-dashed lines. Each page must contain
`$frontmatter` which is used to provide navigation, navigation labels, and
search criteria. Below is the `$frontmatter` for this page.

```yaml
---
title: Frontmatter
pageHeader: Docs Development
outline: deep
---
```

## Fields

Most `$frontmatter` keys are required.

### `title`

(required) Sets the page's title. This title is not used by the sidebars which
must provide a title for each page using the key `text`. They can be the same or
different.

### `path`

(required) The path to the page. The path is used by the search engine as a
target URL and to logically group search results for display to the reader.

### `version`

(required for Airnode and OIS) The version number for the Airnode and OIS
docsets.

### `outline`

(optional) Each page has its own table of contents component displayed on its
right side if the page use heading elements H2-H6. Without a value for `outline`
only H2 elements will be displayed. A value of deep will show all elements
H2-H6.

- `outline: null`: Shows H2
- `outline: false`: The TOC is hidden
- `outline: [2,4]`: Shows H2-H4
- `outline: deep`: Shows H2-H6

### `tags`

(optional) For future use, provides important key search words for the search
engine.
