---
title: Key Parameters/Terms
sidebarHeader: Reference
sidebarSubHeader: OEV
pageHeader: Reference → OEV -> OEV Relay
path: /reference/oev/parameters/index.html
outline: deep
tags:
---

<PageHeader/>

<SearchHighlight/>

# {{$frontmatter.title}}

## Variable parameters

OEV relay parameters that can be either chain or data feed proxy specific. You
can query the [configuration endpoint](../api/#configuration) to see their
values. All time periods are in milliseconds unless specified otherwise.

### Auction Delay

::: info

This parameter is chain specific.

:::

The time period before bids are processed for the same data feed. This will be
longer than the chain's block time, but ideally as close to it as possible while
still giving searchers a reasonable time to land their transaction on-chain.

### Update Period

::: info

This parameter is data feed proxy specific.

:::

The time period searchers have to update the data feed after they won an
auction. If they do not perform the update in this period, they will be
[slashed](#slashing) (provided there was no other update that frontran them).

### Minimal Bid Amount

::: info

This parameter is data feed proxy specific.

:::

The minimal amount in native tokens for a bid. Placing a bid with lower amount
will fail.

### Minimal Block Confirmations

::: info

This parameter is chain specific.

:::

A number of blocks that must have passed for the OEV relay to acknowledge
blockchain events.

<!-- Commented out as it's currently not available via the /configuration endpoint -->
<!-- ### Bid Collateral

::: info

This parameter is data feed proxy specific.

:::

The percentage of USDC collateral relative to the bid amount that needs to be
posted in PrepaymentDepositor for a bid to win an auction. Also the amount
of funds that can be slashed upon misbehavior.

### API3 Fee

::: info

This parameter is data feed proxy specific.

:::

The amount of USDC taken from the searcher's collateral upon a successful update
to compensate data providers and the DAO. Will be smaller than or equal to the
bid collateral. No fee is taken if the searcher is frontrun by another searcher
or the oracle. Represented as a percentage of the bid amount. -->

## Fixed parameters

OEV relay parameters that are the same for the all chains.

### Withdraw Period

The time period searchers have to withdraw funds after they have been given a
signed message that allows them to do so by calling the
[`/withdraw` endpoint](../api/index.md#withdraw). **Set to 1 hour**. During this
period, the funds are reserved for withdrawal and cannot be used as collateral.

If the transaction is not made in the given timeframe, the relay will expire the
withdrawal and unreserve the funds back to the searcher.

## Other terms

### Slashing

When a searcher makes a bid and the BE has filled it (i.e., they won an
auction), a percentage of the bid amount is reserved from their available funds
as collateral for potential slashing. If no entity updates the data feed, the
searcher is slashed, and the reserved funds are not freed.