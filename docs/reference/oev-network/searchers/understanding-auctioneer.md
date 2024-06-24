---
title: Understanding Auctioneer
sidebarHeader: Reference
sidebarSubHeader: OEV Network
pageHeader: Reference → OEV Network → Searchers → Understanding Auctioneer
path: /reference/oev-network/searchers/understanding-auctioneer.html
outline: deep
tags:
---

<PageHeader/>

<SearchHighlight/>

<FlexStartTag/>

# {{$frontmatter.title}}

## Auctioneer State

Both Searchers and Auctioneers use the OEV Network as the state of truth and the
use of blockchain events is crucial to both in the operation of the auction
cycle.

The process of computing the state is done as follows:

### Initial State Computation

The design of Auctioneer only requires logs from a limited time frame to be
computed. This is because the validity of a bid is at most
[1 day](https://github.com/api3dao/contracts/blob/d3c7dc6683445df14bf5f43b07e6ad9cc2813cc5/contracts/api3-server-v1/OevAuctionHouse.sol#L68)
meaning that the state of the auctioneer can be computed using the logs from the
last 24 hours.

All relevant OevAuctionHouse logs are fetched ordered chronologically and
processed in sequence. For each PlacedBid event, the bid details are decoded and
stored. If the bid is for an unknown chain/proxy combination it is ignored.
Similarly, the bid is ignored if the bid details cannot be decoded.

Each ExpeditedBidExpiration decreases the expiration of an already stored bid.
If the bid to expedite is not stored, the event is ignored, because it can be assumed it's too old and would be expired even without the expedition.

The auctioneer state initialization is required if the auctioneer is restarted
or there is downtime period. Once the auctioneer is initialized, the auctioneer
can continue to compute the state based on incoming logs.

### Signed Data Fetching

Auctioneer periodically fetches the latest off-chain data point from signed APIs
for each airnode that belongs to a dAPI. Parallel Auctions are triggered every
time the auctioneer fetches a new off-chain data point of a dAPI.

### Parallel Auctions

The Auctioneer run parallel auctions for each proxy address and chain listed on
the [API3 Market](https://market.api3.org/).

For each proxy there is a separate auction round that takes place. The auction
round is documented in the
[Auction Cycle](/reference/oev-network/overview/auction-cycle.html) page but
there are some nuances in the auctioneer state that can be discussed here.

For each proxy the following checks are done by auctioneer during an auction
round to filter out non-qualifying bids:

- If there is no transaction count in the state, drop all the bids
- if the bid was recently awarded. All bids placed in `exclusiveAuctionSeconds`
  window following the awarded bid are dropped.
- Drop all inactive bids. These are bids that are already awarded.
- Drop all bids that do not satisfy the condition based on the latest off-chain
  data point of the dAPI.
- Drop all bids that have expired or soon to expire.

Qualifying bids across **all proxies** are merged together, the auctioneer then
selects the winning bids based on the following criteria:

- Fetch bidder details for each unique bidder. If this fetch fails for a bidder,
  the bid is dropped.
- Sort the bids based on required collateral (this is not the same as sorting by
  bid amount because of price movements in time).
- Evaluate the bids in order of descending collateral based on:

  - The bidder does not have a pending withdrawal
  - The bidder has enough collateral including COLLATERAL_REQUIREMENT_BUFFER.
  - A different bid has not been awarded in this auction round.

  As a note, if there are multiple bids with the same collateral requirement,
  the Auctioneer does not specify which bid will be considered first.

The first bid that satisfies all the above criteria for an auction round is
awarded the bid. The bidder's collateral balance is deducted and the bid is
marked as "awarded" for that auction round.

The auctioneer then prepares the encoded OEV update transaction for each awarded bid by
having the airnodes of the dAPIs sign the winning bid and returning the
signature. Auctioneer verifies the signatures and ensures that there is strict
majority of beacon responses. It then creates the encoded function data for
`updateOevProxyDataFeedWithSignedData` contract call in `Api3ServerV1` for
searchers to use.

Auctioneer award all of the winning bids using a single transaction using the
persisted transaction count (a single `awardbid` call if only a single bid is
awarded and multicall otherwise). The auctioneer also sets the award expiration
for all the awarded bids, currently set to 60 seconds.

The auctioneer caches the bids and timestamp for all the auction rounds at the
end of the run. This is used to filter out the bids that have already been
awarded in the next auction round and to ensure that the auction only starts
after the required delay has passed.

::: tip  
While awarding the bid, Auctioneer enforces an upper bound on the number of
awarded bids in a single run. Currently, the limit is set to 30, which should be
enough for practical purposes.

:::
