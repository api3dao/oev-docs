---
title: Overview
sidebarHeader: Reference
sidebarSubHeader: OEV
pageHeader: Reference → OEV -> Searchers
path: /reference/oev/overview/index.html
outline: deep
tags:
---

<PageHeader/>

<SearchHighlight/>

# {{$frontmatter.title}}

The OEV relay operates an off-chain sealed bid order book, allowing searchers to
place private bids for data feed updates. The relay fills the highest bid
meeting the specified conditions and grants the winning searcher exclusive
rights to publish the oracle update for a certain number of blocks.

Auction periods are randomized, and the relay reaches consensus between data
providers on an off-chain price. Bidders can query the relay API to check the
status of their bids. The relay stores signed bids in its database to address
potential disputes.

## Searcher Staking (Vault.sol)

To participate in an auction, searchers must stake a certain percentage
(currently 10%) of their bid amount in USDC. The staking collateral is checked
when a bid is filled and is reserved until the data feed update is performed.
This collateral is used to slash a searcher if they fail to publish the data
feed update within the specified time. If a searcher is frontrun in performing
the data feed update, their collateral is freed without any cost.

## Depositing and Withdrawing

Deposits into Vault.sol can only be withdrawn to the depositor address. To
change the withdrawal address, the current withdrawal account must call
`setWithdrawalAccount` with a new address.

To withdraw funds, call the [withdraw endpoint](../api/#withdraw) on the relay
and receive a signature that can be used to call the withdraw function within
Vault.sol. Note that withdrawals must be made through an API call, as stake
amounts are stored and adjusted off-chain. The balances within Vault.sol are
only updated upon withdrawal. Withdrawal requests must withdraw all available
funds and have a 1-hour expiration.

Vault.sol will initially be deployed on the Ethereum mainnet, but may not
necessarily be deployed on the chain you are bidding for a data feed update on.

## Placing Orders

Orders can be placed with two possible conditions:

- \>= greater than or equal to
- <= less than or equal to

Each order must include:

- A specific data feed
- A price condition (either >= or <=)
- A bid amount in the native token of the target chain

If a searcher places multiple eligible bids for a single data feed, the bid
amounts are summed and considered as one bid by the relay.

Bids can be placed by calling the [place-bid endpoint](../api/#place-bid) on the
relay API. If the searcher wins the auction, they will receive a signed message
that can be used to update the data feed.

Bids can be cancelled by calling the [cancel-bid endpoint](../api/#cancel-bid)
on the relay API.

## Executing Data Feed Updates

To execute a data feed update, searchers must call the
`updateOevProxyDataFeedWithSignedData` function. If they fail to update the data
feed within the Update Period parameter and are not frontrun by another data
feed update, they will be slashed a percentage of their bid.

## Checking Bid Status

To check the status of a bid, query the [status endpoint](../api/#status) of the
relay API. Status updates are not currently pushed to searchers automatically
and must be queried periodically.

## Addressing Disputes

Bids are signed by the bidder and stored in the relay database to address any
disputes that may occur.
