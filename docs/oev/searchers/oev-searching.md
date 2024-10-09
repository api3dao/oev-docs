---
title: OEV Searching
pageHeader: OEV → Searchers
outline: deep
---

<PageHeader/>

# OEV Searching

We assume that a searcher has an existing MEV bot and is familiar with API3 OEV
solution. Let's detail the steps to transition from MEV to OEV searching.

## Depositing Funds

To be eligible to win OEV auctions, searchers need to have enough collateral
deposited in the OevAuctionHouse contract. See
[Bid Eligibility](/oev/overview/oev-auctioneer.md#bid-eligibility) for more
details.

We recommend using the same hot wallet for the bot on the OEV network (to
participate in auctions) and the target chain (to capture the OEV). To deposit
funds, you can use either the `deposit` or `depositForBidder` functions. The
latter allows you to deposit the collateral on behalf of another address.

## Withdrawing Funds

To withdraw the deposited collateral from OevAuctionHouse contract, the searcher
needs to do the following:

1. Call `initiateWithdrawal` function on the OevAuctionHouse contract.
2. Wait for the withdrawal period to pass. The period is 15 seconds.
3. Call `withdraw` function on the OevAuctionHouse contract.

The withdrawal process is implemented this way to prevent denying service by
frontrunning the award transaction by withdrawing the collateral.

## Collateral and Protocol Fee

For a searcher to win an auction, they are required to have enough ETH deposited
in the OevAuctionHouse contract. Similarly, the value the searcher can win is
limited by the amount they have deposited. Refer to
[Bid Eligibility](/oev/overview/oev-auctioneer.md#bid-eligibility) for details.

The collateral and protocol fee rates are configurable parameters within the
OevAuctionHouse contract and are configured by the API3 DAO. These values are
set in "basis points", which are 1/100th of a percentage point. For example, a
value of 1000 is equivalent to 10%.

| Parameter                | Value |
| ------------------------ | ----- |
| collateralInBasisPoints  | 1000  |
| protocolFeeInBasisPoints | 0     |

The collateral and the protocol fee are calculated using the price feed values
at the time of the bid placement. However, the collateral is reserved at award
time. This allows the bidder to place multiple bids for different dApps, even if
their collateral doesn't allow them to win all. This allows for greater
flexibility.

If the auction winner pays for the bid on the OEV Network and report the
fulfillment, their collateral is released and the protocol fee is deducted. If
the auction winner doesn't pay for the award or fails to report the fulfillment,
their collateral is slashed.

## Monitoring Signed Data

Searchers should periodically call the public
[OEV Endpoints](/oev/overview/target-chain.md#oev-endpoints) to get the
real-time values for the dAPIs used by the dApp. The dApp will use a proxy to
read the dAPI value, which prefers the fresher out of the base feed updates and
OEV updates.

### Querying Signed APIs

For each tracked beacon, searchers need to derive the corresponding
[OEV Beacon](/oev/overview/target-chain.md#oev-beacons).

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

### Simulating a Data Feed Update

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
[Update the Data Feed](/oev/overview/target-chain.md#updating-the-data-feed)
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

## Placing a Bid

After a profitable opportunity is identified, the searcher needs to place a bid
to obtain a signature that allows them to perform the update for real. To place
a bid, call `placeBidWithExpiration` or `placeBid`. The latter is just a
convenience function which places a bid with maximum expiration time. It's
recommended to call `placeBidWithExpiration` and set the expiration time to the
end of the next bidding phase.

The `placeBidWithExpiration` accepts the following parameters:

| Argument             | Type    | Description                                                                                                                                                                                                                  |
| -------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bidTopic             | bytes32 | The [Bid Topic](/oev/overview/oev-auctioneer.md#bid-topic) of the current auction.                                                                                                                                           |
| chainId              | uint256 | The chain ID of the target chain.                                                                                                                                                                                            |
| bidAmount            | uint256 | The amount of the bid in the native currency of the target chain. At award time, a respective percentage fo this amount is reserved as collateral and the winner is expected to pay the full bid amount on the target chain. |
| bidDetails           | bytes   | The [Bid details](/oev/overview/oev-auctioneer.md#bid-details) of the bid.                                                                                                                                                   |
| maxCollateralAmount  | uint256 | The maximum collateral amount that the bidder is willing to lock up. This is to prevent unwanted slippage in case of a large price change before the transaction is mined.                                                   |
| maxProtocolFeeAmount | uint256 | The maximum protocol fee amount that the bidder is willing to pay. This is to prevent unwanted slippage in case of a large price change before the transaction is mined.                                                     |
| expirationTimestamp  | uint32  | The timestamp until which the bid is valid. The timestamp is checked against the `block.timestamp` at the bid placement time. Minimum is 15 seconds and maximum 24 hours.                                                    |

The most intuitive way to place the bid is follow the recommendations above and
as a bid amount provide a percentage of the profit. Note, that the searcher
needs to be mindful of all the gas costs on both the target chain and OEV
Network, the paid bid amount and the respective collateral and protocol fee.

For a bid to be valid, it needs to use the correct arguments. Out of these, the
most important is the bid topic, which also identifies the auction. For the bid
to be considered, the place bid transaction needs to be mined during the bidding
phase. Searchers should be mindful of the block time on the OEV Network to make
sure their transaction is mined in time. Refer to
[OEV Network Properties](/oev/overview/oev-network.md#properties) for details.

## Waiting for Auction Award

Immediately after the bidding phase is over, Auctioneer enters the award phase
and determines the highest bidder and submits the `awardBid` transaction, which
emits AwardedBid event. This event indexes the the three most important
arguments:

- `bidder` - The auction winner.
- `bidTopic` - The bid topic of the auction.
- `bidId` - The bid ID of the auction.

Searchers can create an event filter to query for all their awarded bids by
filtering for particular bidder(s) or they could create event filter for
specific auction or simply query for their bid. The most idiomatic way is to
poll the AwardedBid with a particular bid topic. After the event is received,
searchers can check the bidder to see if they are the winner or not. It's
recommended to use a small polling interval to obtain the result as soon as
possible.

Auctioneer should in practice award the bid during the award phase, but
searchers are recommended to poll longer. In case Auctioneer does not even
within the next bidding phase - there is likely something wrong. Whether the
issue is caused by Auctioneer or the searcher can be determined by looking at
the OEV Network. In case, the issue was caused by Auctioneer, the searcher can
open a dispute.

::: info

Searchers can monitor the auction in real-time and can determine the auction
winner themselves (or even attempt to increase their bid).

:::

## Capturing OEV

After the bid is awarded, the searcher needs to do the following:

1. Pay for the awarded bid.
2. Update any of the dApp's data feed(s).
3. Capture any OEV opportunities exposed by the data feed update(s).

It's expected that searchers do all of these steps atomically. However, the
contract allows searcher to repeat steps 2. and 3. as many times as they want.
However, each update has to increase the timestamp of the OEV Beacon(s).

Refer to
[Using an Auction Award](/oev/overview/target-chain.md#using-an-auction-award)
for details how to execute the first two steps. To execute the OEV capture,
searchers can use the same calldata they've used during simulation.

## Handling Disputes

In case of a dispute, the OEV Network is considered source-of-truth and can be
used to resolve it. This may include Auctioneer awarding the wrong bidder or
being inconsistent to its pre-announced rules.

Note, that any dispute that can't be proven or disproved on-chain is
non-applicable. This may include searchers complaints about the RPC connection
or similar off-chain problems.

To open a dispute head out to the
[OEV Discord Channel](https://discord.com/channels/758003776174030948/1062909222347603989)
and create a post with the description of the dispute.
