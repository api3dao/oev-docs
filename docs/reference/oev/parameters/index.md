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

Monitor these OEV Relay parameters by querying the
[status endpoint](../api/#status) of the API. All periods are in seconds unless
specified otherwise.

## Auction Delay

::: info

This parameter is chain specific.

:::

The minimum time before bids are processed for the same data feed. This should
be longer than the chain's block time, but ideally as close to it as possible
while still giving searchers a reasonable time to land their transaction
on-chain.

## Update Period

::: info

This parameter is data feed proxy specific.

:::

The time period searchers have to update the data feed after their bid is
filled. If they do not perform the update in this period, they will be
[slashed](#slashing) (provided there was no other update that frontran them).
This period should be longer than the Configured Auction Delay.

## Withdraw Period

::: info

This parameter is chain specific.

:::

The time period searchers have to withdraw funds after they have been given a
signed message that allows them to do so from the BE. Currently hardcoded to 1
hour.

## Bid Collateral % Requirement

::: info

This parameter is data feed proxy specific.

:::

The amount of USDC collateral relative to the bid amount that needs to be posted
in the vault contract for a bid to win an auction, also the amount of funds that
can be slashed upon misbehavior. This will be represented as a % of the bid
amount and initially set to 10%.

## API3 Fee %

::: info

This parameter is data feed proxy specific.

:::

The amount of USDC taken from the searcher's collateral upon a successful update
to compensate data providers and the DAO. Initially set to 10% of a bid amount
and must be smaller than or equal to the bid collateral % requirement. No fee is
taken if the searcher is frontrun by another searcher or the oracle.

## Minimum Bid Amount

::: info

This parameter is data feed proxy specific.

:::

The minimum amount in native tokens a searcher must bid to be eligible in that
auction.

## Slashing

When a searcher makes a bid and the BE has filled it (i.e., they won an
auction), 10% of the bid amount is reserved from their available funds as
collateral for potential slashing. If no entity updates the data feed, the
searcher is slashed, and the reserved funds are not freed.
