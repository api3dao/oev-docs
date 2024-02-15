---
title: dApp Onboarding
sidebarHeader: Reference
sidebarSubHeader: OEV
pageHeader: Reference → OEV -> dApps
path: /reference/oev-network/dapps/index.html
outline: deep
tags:
---

<PageHeader/>

<SearchHighlight/>

# {{$frontmatter.title}}

OEV auctions operate as a supplementary service to regular data feed operations,
ensuring that updates persist through the oracle even during OEV relay downtime
or periods with limited OEV opportunities. Integration involves deploying a
proxy data feed contract and directing the dApp to it.

## Proxy Contract

<div>
  <img src="/reference/oev/assets/dAPI.png" />
</div>

Searchers use signed data from Airnodes to update the proxy contract with the
latest data point. However, if
[`Api3ServerV1`](https://dapi-docs.api3.org/reference/dapis/understand/read-dapis.htmls)
has a more recent timestamp than the last searcher update, the data point from
`Api3ServerV1` will be displayed. Each dApp has its own proxy to determine the
distribution of OEV proceeds. The data feed also reads from `Api3ServerV1` to
provide a fallback that is updated by the oracle instead of the searcher.

### Deploying a Proxy

When deploying a proxy, the dApp specifies an address that can withdraw OEV
proceeds from
[`Api3ServerV1`](https://dapi-docs.api3.org/reference/dapis/understand/read-dapis.htmls).
This enables the distribution of proceeds to the appropriate dApp.

::: tip

Please refer to the following guide on how to read from a proxy contract:

- [Reading a Self-Funded dAPI Proxy](https://dapi-docs.api3.org/guides/dapis/read-self-funded-dapi/)

:::

By integrating OEV auctions as a supplementary service, developers can ensure a
seamless transition between oracle updates and OEV opportunities while
maintaining the desired distribution of proceeds.
