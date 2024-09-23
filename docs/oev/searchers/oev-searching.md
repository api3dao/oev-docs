---
title: OEV Searching
pageHeader: OEV → Searchers
outline: deep
---

<PageHeader/>

# OEV Searching

We assume that a searcher has an existing MEV bot and is familiar with API3 OEV
solution. Let's detail the steps to transition from MEV to OEV searching.

## Deposit funds

To be eligible to win OEV auctions, searchers need to have enough collateral
deposited in the OevAuctionHouse contract. See
[Bid Eligibility](/oev/overview/oev-auctioneer.html#bid-eligibility) for more
details.

We recommend using the same hot wallet for the bot on the OEV network (to
participate in auctions) and the target chain (to capture the OEV). To deposit
funds, you can use either the `deposit` or `depositForBidder` functions. The
latter allows you to deposit the collateral on behalf of another address.

## Withdraw funds

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
[Bid Eligibility](/oev/overview/oev-auctioneer.html#bid-eligibility) for
details.

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

After a profitable opportunity is identified, the searcher needs to place a bid
to obtain a signature that allows them to perform the update for real. To place
a bid, call `placeBidWithExpiration` or `placeBid`. The latter is just a
convenience function which places a bid with maximum expiration time. It's
recommended to call `placeBidWithExpiration` and set the expiration time to the
end of the next bidding phase.

The `placeBidWithExpiration` accepts the following parameters:

| Argument             | Type    | Description                                                                                                                                                                                                                  |
| -------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bidTopic             | bytes32 | The [Bid Topic](/oev/overview/oev-auctioneer.html#bid-topic) of the current auction.                                                                                                                                         |
| chainId              | uint256 | The chain ID of the target chain.                                                                                                                                                                                            |
| bidAmount            | uint256 | The amount of the bid in the native currency of the target chain. At award time, a respective percentage fo this amount is reserved as collateral and the winner is expected to pay the full bid amount on the target chain. |
| bidDetails           | bytes   | The [Bid details](./arguments.md#biddetails-bytes) of the bid.                                                                                                                                                               |
| maxCollateralAmount  | uint256 | The maximum collateral amount that the bidder is willing to lock up. This is to prevent unwanted slippage in case of a large price change before the transaction is mined.                                                   |
| maxProtocolFeeAmount | uint256 | The maximum protocol fee amount that the bidder is willing to pay. This is to prevent unwanted slippage in case of a large price change before the transaction is mined.                                                     |
| expirationTimestamp  | uint32  | The timestamp until which the bid is valid. The timestamp is checked against the `block.timestamp` at the bid placement time. Minimum is 15 seconds and maximum 24 hours.                                                    |

The most intuitive way to place the bid is follow the recommendations above and
as a bid amount provide a percentage of the profit. Note, that the searcher
needs to be mindful of all the gas costs on both the target chain and OEV
Network, the paid bid amount and the respective collateral and protocol fee.

## Waiting for auction award

https://github.com/api3dao/oev-docs/issues/57

## Capturing OEV

https://github.com/api3dao/oev-docs/issues/57
