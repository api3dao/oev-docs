---
title: OEV Searching
pageHeader: OEV → Searchers
outline: deep
---

<PageHeader/>

# OEV Searching

We assume that a searcher has an MEV bot and is familiar with API3 OEV solution.
Let's detail the steps to transition from MEV to OEV searching.

## Deposit funds

To be eligible to win OEV auctions, searchers need to have enough collateral
deposited in the OevAuctionHouse contract. See
[Bid Eligibility](/oev/overview/oev-auctioneer.html#bid-eligibility) for more
details.

We recommend using the same hot wallet for the bot on the OEV network (to
participate in auctions) and the target chain (to capture the OEV). To deposit
funds, you can use either the `deposit` or `depositForBidder` functions. The
latter allows you to deposit the collateral on behalf of another address.

## Monitor signed data

Searchers should periodically call the public
[OEV Endpoints](/oev/overview/target-chain.html#oev-endpoints) to get the
real-time values for the dAPIs used by the dApp. The dApp will use a proxy to
read the dAPI value, which prefers the fresher out of the base feed updates and
OEV updates.

### Query Signed APIs

For each tracked beacon, searchers need to derive the corresponding
[OEV Beacon](/oev/overview/target-chain.html#oev-beacons).

Then, simply call the OEV Signed API endpoints for the various Airnodes and pick
the signed data for the required OEV beacons. It's necessary to persist these
values for a brief period of time - in case they win the auction and need to
update the data feed.

OEV auctions provide exclusivity guarantees only for data points with timestamps
within the bidding phase. Note, that for older signed data, there may be
previous auction winner who can also use them to update the feed. Moreover, it's
not possible to use data fresher than the end of the bidding phase. This is to
ensure the same guarantees apply for the subsequent auction winner. This means
that there is little reason to store data for longer than a single auction.

### Simulate a Data Feed Update

Compared to the base feed updates, OEV updates are permissioned - allowing only
the auction winner to update the data feed. This makes the OEV updates
impossible to simulate on-chain. However, simulating the data feed updates on
chain is a really powerful concept because searchers don't need to replicate
complex on-chain logic off-chain, but instead attempt to update the feed(s) and
see how it affects the dApp (without actually making any state changes).

This is built in to the protocol and works via `simulateDappOevDataFeedUpdate`
and `simulateExternalCall` functions, which can be called only with
`address(0)`. The only way to impersonate a zero address is during staticcall
simulation. The intended usage is to do a multicall that simulates the data feed
update(s) then makes arbitrary number external calls.

To understand how to construct the payload for data feed simulation, refer to
[Update the Data Feed](/oev/overview/target-chain.html#update-the-data-feed)
section.

```js
const signedDataCollection = [...] // Assume we have the signed data for the beacons.

// 1. Create the calldata for the dApp OEV data feed updates.
const dAppOevDataFeedUpdateCalldata = []
for (const signedData of signedDataCollection) {
  dAppOevDataFeedUpdateCalldata.push(
    api3ServerV1OevExtension.interface.encodeFunctionData(
      'simulateDappOevDataFeedUpdate',
      [dAppId, signedData]
    )
  );
}

// 2. Create the calldata for the external calls.
const externalCallsCalldata = [...] // E.g. Liquidation calls.

// 3. Impersonate the zero address and simulate the data feed update.
const api3ServerV1OevExtensionImpersonated = api3ServerV1OevExtension.connect(
  ethers.constants.AddressZero
);

// 4. Simulate the data feed update and external calls.
const simulationResult = await api3ServerV1OevExtensionImpersonated.multicall.staticcall(
  ...dAppOevDataFeedUpdateCalldata,
  ...externalCallsCalldata
);
```

## Placing bid

<!-- TODO: Link to http://localhost:5173/oev/overview/oev-network.html#properties -->

https://github.com/api3dao/oev-docs/issues/57

## Waiting for auction award

https://github.com/api3dao/oev-docs/issues/57

## Capturing OEV

https://github.com/api3dao/oev-docs/issues/57
