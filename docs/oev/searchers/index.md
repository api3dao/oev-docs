---
title: Searchers
pageHeader: OEV → Searchers
outline: deep
---

<PageHeader/>

# OEV Searching

This part of the docs is dedicated to searchers. We've already covered how OEV
works and scratched the surface behind the complexity of searching. We aim to
provide basic searching strategies to simplify onboarding of the existing MEV
searching community to OEV.

## OEV dApps Catalog

We maintain an open source list with all dApps which integrated API3 feeds as
part of [dApp Registry](https://github.com/api3dao/dapp-registry). However, not
all dApps opted-in to OEV yet, so we provide a separate list of OEV dApps are
currently good candidates for searching:

1. [Lendle](https://lendle.xyz/)
2. [Hana Finance](https://www.hana.finance/)
3. [Init Capital](https://init.capital/)

## From MEV Searching

MEV searching has a huge community and expertize securing health and stability
across many dApps and chains. We want to motivate this community to join OEV by
outlining the steps to transition from MEV to OEV searching.

::: info

MEV searching is the the recommended starting point for OEV integration. With
MEV bot you can verify the understanding of the protocol and liquidation logic.

:::

Let's emphasize that the MEV searchers can still use their existing
infrastructure and searching bots even when opting in OEV. OEV should be treated
as an optional extension that searchers can capitalize on. Integrating OEV
increases their profits by outperforming the competition and paying less to
block validators.

All of the searching logic related to position tracking, using flashloans and
swapping assets remains the same. What's left is:

1. [Bridge funds](/oev/overview/oev-network.md#bridging-eth) to the OEV network.
2. Deposit funds to the OevAuctionHouse contract.
3. Monitor off-chain signed data for dAPIs used by the dApp.
4. (Optional) Simulate the data feed update on-chain to determine liquidation
   opportunities.
5. Place bid on the OEV Network.
6. Wait for auction award.
7. Use the award to update the on-chain data feed on target chain and capture
   the OEV.

Most of these steps require small additions to the existing MEV bot, but it's
required to understand the mental model behind OEV. Because of that, we
recommend starting with an in-between solution we call "MEV with Signed APIs".

Follow-up with the next chapters to learn more about how to boost the MEV bots
with Signed APIs and OEV to maximize the profits.
