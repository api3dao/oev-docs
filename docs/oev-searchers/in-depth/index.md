---
title: Searchers
pageHeader: OEV Searchers → In Depth
outline: deep
---

<PageHeader/>

# OEV Searching

This part of the docs is dedicated to searchers. It details how OEV auctions
work and explains basic searching strategies to simplify onboarding of the
existing MEV searchers to OEV.

## OEV dApps Catalog

We maintain an open source list with all dApps which integrated API3 feeds as
part of [dApp Registry](https://github.com/api3dao/dapp-registry). However, not
all of the dApps are suitable for OEV extraction, so we provide a list of dApps
are currently suitable candidates for OEV searching.

<!-- NOTE: Make sure these are sorted alphabetically. -->

1. [Hana protocol on Taiko](https://www.hana.finance/)
2. [Lendle protocol on Mantle](https://lendle.xyz/)
3. [Orbit protocol on Blast](https://orbitlending.io/)
4. [Silo protocol on Arbitrum](https://app.silo.finance/)
5. [Yei protocol on Sei](https://www.yei.finance/)

Currently, these protocols use outdated API3 proxies, which support the previous
version of OEV auctions, which is no longer supported. Searchers can still
perform [MEV with Signed APIs](/in-depth/mev-with-signed-apis) extraction.

## From MEV Searching

MEV searching has a well established community and expertize securing health and
stability across many dApps and chains. We want to motivate this community to
join OEV by outlining the steps to transition from MEV to OEV searching.

Let's emphasize that the MEV searchers can still use their existing
infrastructure and searching bots even when opting in OEV. OEV should be treated
as an optional extension that searchers can capitalize on. Integrating OEV
increases their profits by outperforming the competition and paying less to
block validators.

Most of the searching logic related to position tracking and liquidating remains
the same. What's left is:

1. [Bridge funds](/oev-searchers/in-depth/oev-network/#bridging-eth) to the OEV
   network.
2. Deposit funds to the OevAuctionHouse contract.
3. Monitor off-chain signed data for dAPIs used by the dApp.
4. Simulate the data feed update on-chain to determine liquidation
   opportunities.
5. Place bid on the OEV Network.
6. Wait for auction award.
7. Use the award to update the on-chain data feed on target chain and capture
   the OEV.

Most of these steps require small additions to the existing MEV bot, but it's
required to understand the mental model behind OEV. Because of that, we
recommend starting with an in-between solution we call
[MEV with Signed APIs](/oev-searchers/in-depth/mev-with-signed-apis).
