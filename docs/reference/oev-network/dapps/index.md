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
  <img src="/reference/dapis/assets/images/proxy.png" />
</div>

Searchers use signed data from Airnodes to update the proxy contract with the
latest data point. However, if
[`Api3ServerV1`](https://docs.api3.org/reference/dapis/understand/read-dapis.htmls)
has a more recent timestamp than the last searcher update, the data point from
`Api3ServerV1` will be displayed. Each dApp has its own proxy to determine the
distribution of OEV proceeds.

### Deploying a Proxy

To deploy a proxy, head over to the [API3 Market](https://market.api3.org) and
select the dAPI you want to deploy a proxy for. The API3 Market will guide you
through the process of deploying a proxy.

When deploying a proxy, the dApp specifies an address that can withdraw OEV
proceeds from
[`Api3ServerV1`](https://docs.api3.org/reference/dapis/understand/read-dapis.htmls).
This enables the distribution of proceeds to the appropriate dApp.

::: tip

Please refer to the following guide on how to read from a proxy contract:

- [Reading a dAPI Proxy](https://docs.api3.org/guides/dapis/read-a-dapi/)

:::

By integrating OEV auctions as a supplementary service, developers can ensure a
seamless transition between oracle updates and OEV opportunities while
maintaining the desired distribution of proceeds.
