---
title: dAPP Onboarding
sidebarHeader: Reference
sidebarSubHeader: OEV
pageHeader: Reference → OEV -> dAPPs
path: /reference/oev/dapps/index.html
outline: deep
tags:
---

<PageHeader/>

<SearchHighlight/>

# {{$frontmatter.title}}

OEV auctions operate as a sidecar service to regular data feed operation,
ensuring that updates continue through the oracle in case of OEV relay downtime
or lack of OEV opportunities. Integration requires deploying a proxy data feed
contract and pointing the dApp towards it.

## Proxy Contract

<div>
  <img src="/reference/oev/assets/dAPI.png" />
</div>

The proxy contract is updated with the latest data point by searchers using
signed-data from airnodes. However, it displays the data point from
[`Api3ServerV1`](https://dapi-docs.api3.org/reference/dapis/understand/read-dapis.htmls)
if it has a more recent timestamp than the last searcher update. Each dApp has
its own proxy in order to determine which dApps the OEV proceeds should be
distributed to. The data feed reads from `Api3ServerV1` as well in order to have
a fallback that is updated by the oracle rather than the searcher.

### Deploying a Proxy

When deploying a proxy, the dApp specifies an address that can withdraw OEV
proceeds from
[`Api3ServerV1`](https://dapi-docs.api3.org/reference/dapis/understand/read-dapis.htmls).
This allows for the distribution of proceeds to the appropriate dApp.

::: tip

Please refer to the following guide on how to read from a proxy contract:

- [Reading a Self-Funded dAPI Proxy](https://dapi-docs.api3.org/guides/dapis/read-self-funded-dapi/)

:::

By integrating OEV auctions as a sidecar service, developers can ensure a
seamless transition between oracle updates and OEV opportunities while
maintaining the desired distribution of proceeds.
