---
layout: home

hero:
  name: API3
  text: Documentation
  tagline:
    API3 builds solutions that bridge the gap between off-chain data and
    on-chain applications with maximum security and minimal latency.
  image:
    src: /img/beacons.svg
    alt: API3
  actions:
    - theme: brand
      text: dAPIs
      link: /dapis/
    - theme: brand
      text: OEV Network
      link: /oev/
features:
  - icon: 🌍
    title: Simple and minimal, always
    details: Lorem ipsum...
  - icon:
      src: /img/small-logo.png
    title: Another cool feature
    details: Lorem ipsum...
  - icon:
      dark: /img/Folder-Dark.png
      light: /img/Folder-Light.png
    title: Another cool feature
    details: Lorem ipsum...
---

## Adding markdown

You can use markdown on this page. Learn more about other home page features
[here](https://vitepress.dev/reference/default-theme-home-page). When using home
page features the framework will manage the flex alignment of the content for
you.

## Links

`<a href="/oev/">OEV</a>`

You can do these but be sure the SPA does not reload. This one works.
<a href="/oev/">OEV</a>

## Vue components

Custom Vue component can also be added to the Home page as well.
[See this on in GitHub](https://github.com/api3dao/oev-docs/blob/main/docs/_components/EthersAbiCoder.vue).
Let me know if you need help to build one.

<EthersAbiCoder/>

<style>
  /**
  Add style for this page here. Prefix each class name with "api3-"
  less you overwrite a Vitepress class name.
  */
</style>
