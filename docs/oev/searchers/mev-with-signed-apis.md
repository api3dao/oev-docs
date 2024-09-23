---
title: MEV with Signed APIs
pageHeader: OEV → Searchers
outline: deep
---

<PageHeader/>

# MEV with Signed APIs

One step closer to OEV searching, is to extend MEV bots to utilize the public
[Base Feed Endpoints](/oev/overview/target-chain.html#base-feed-endpoints).
These endpoints are public, and also used by API3 DAO push oracle - so there is
tight competition - something which searchers are already used to.

The existing MEV bot can utilize this off-chain open source data and make a base
feed update on-chain whenever there is OEV to be captured. Refer to
[dAPIs Reference](/dapis/reference/understand/#dapis) for more details.

One advantage of using this data is that searchers can easily simulate the data
feed update (which is permissionless for base feeds) and to more easily
determine the liquidation opportunities. This is a direct improvement over
monitoring data source values and predicting the next oracle update.

This solution is also a perfect backup in case OEV is down or in maintenance,
because dAPIs are decentralized with great uptime.

## Query Base Feed Endpoints

TODO:

## Simulate a Data Feed Update

::: info

TODO:

:::

## Capture MEV

TODO:
