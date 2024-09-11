---
title: dApp Onboarding
pageHeader: OEV -> dApps
outline: deep
---

<PageHeader/>

<!-- TODO: Explain dApp ID -->

# dApp Onboarding

OEV auctions operate as a supplementary service to regular data feed operations,
ensuring that updates persist through the oracle even during OEV Network
downtime or periods with limited OEV opportunities.

## Integration

Integration involves reading from a proxy contract visible on the
[API3 Market](https://market.api3.org).

All the dAPIs on over 35+ chains have their own proxy addresses listed on the
market.

<div>
  <img src="/oev/dapps/assets/market.png" />
</div>

## Proxy Contract

<div>
  <img src="/dapis/assets/images/dAPI_explainer.png" />
</div>

Searchers use signed data from Airnodes to update the proxy contract with the
latest data point. However, if [`Api3ServerV1`](/dapis/reference/understand/)
has a more recent timestamp than the last searcher update, the data point from
`Api3ServerV1` will be displayed.

::: tip

Please refer to the following guide on how to read from a proxy contract:

- [Reading a dAPI Proxy](/dapis/guides/read-a-dapi/index.md)

:::

By integrating OEV auctions as a supplementary service, developers can ensure a
seamless transition between oracle updates and OEV opportunities while
maintaining the desired distribution of proceeds.
