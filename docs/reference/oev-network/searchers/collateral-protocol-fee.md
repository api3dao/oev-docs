---
title: Collateral And Protocol Fee
sidebarHeader: Reference
sidebarSubHeader: OEV Network
pageHeader: Reference → OEV Network → Collateral And Protocol Fee
path: /reference/oev-network/searchers/collateral-protocol-fee.html
outline: deep
tags:
---

<PageHeader/>

<SearchHighlight/>

<FlexStartTag/>

# {{$frontmatter.title}}

In the context of the OEV Network's auction mechanism, collateral plays a
critical role in ensuring that oracle updates get triggered upon being awarded.

For a searcher to participate in an auction for conditional oracle updates, they
are required to deposit ETH into the OevAuctionHouse contract. The value the
searcher can bid is limited by the amount they have deposited. On placing a bid,
the searcher locks up a percentage of the bid amount as collateral. Upon winning
a bid, the collateral is locked until the oracle update is confirmed to be
fulfilled.

In the event that the oracle update is fulfilled, the searcher is refunded the
collateral and is charged a protocol fee. The protocol fee is also a percentage
of the bid amount.

If the oracle update is not fulfilled, the collateral is slashed and the
protocol fee is refunded.

The `Collateral Rate in basis points` and the `Protocol Fee in basis points` are
parameters configured within the OevAuctionHouse contract. Searchers can query
the `getCurrentCollateralAndProtocolFeeAmounts` function to get the current
collateral and protocol fee rates for the specified `bidAmount` and `chainId`
before placing a bid.

::: tip

The `Collateral Rate in basis points` and the `Protocol Fee in basis points` are
0 on oev-sepolia-testnet. Therefore, no collateral is locked and no protocol fee
is charged.

:::
