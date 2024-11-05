---
title: OEV Searching
pageHeader: OEV Searchers → In Depth
outline: deep
---

<PageHeader/>

# OEV Searching

We assume that a searcher has an existing MEV bot and is familiar with OEV
Network and OEV Auctioneer. Let's glue these concepts together and detail the
steps to start OEV searching.

## Auction schedule

OEV Auctioneer holds off auctions continuosly and these are very short lived.
This is to ensure OEV updates are performed in timely manner and the base feed
delay is minimal.

Searchers are expected to align with the auction schedule. The bidding phase
should be used to monitor the off-chain data for possible OEV. Any combination
of signed data from within the bidding phase has exclusivity guarantee so the
longer off-chain monitoring, the more data points that can be used. That said,
the bids need to be included on-chain during the Auctioneer award phase, so
searchers should place their bids reasonably close to the end of the bidding
phase.

Once a searcher wins an auction, they have the update proviledge until the next
auction winner is selected or until the data is exposed for the base feeds. The
winner is guaranteed privileges at least until the end of the next bidding
phase. Note, that on some chains, especially during peak usage it's recommended
to increase the gas costs.

## Monitoring Signed Data

Searchers need to have a list of dAPIs used by the dApp and
[obtain its beacons](/oev-searchers/in-depth/dapis/#dapp-sources). However,
these are the beacons of the base feed. For each of these beacons the searcher
must derive the OEV counterpart to obtain the
[OEV beacon](/oev-searchers/in-depth/dapis/#oev-feed). Note, that this operation
can be cached because they change only when the underlying base feed changes,
which happens only when the dAPI is reconfigured.

Once the list of OEV beacons is known, searchers should periodically call the
public [OEV Endpoints](/oev-searchers/in-depth/dapis/#oev-endpoints) to get the
real-time values for the OEV beacons used by the dApp. It's necessary to persist
these values for a brief period of time - in case they win the auction and need
to update the data feed.

OEV auctions provide exclusivity guarantees only for data points with timestamps
from within the bidding phase. Note that for older signed data, there may be
previous auction winner who can also use them to update the feed. Moreover, it's
not possible to use data fresher than the end of the bidding phase. This is to
ensure the same guarantees apply for the subsequent auction winner.

## Simulating a Data Feed Update

Compared to the base feed updates, OEV updates are permissioned - allowing only
the auction winner to update the data feed. This makes the OEV update on-chain
simulation trickier. We acknowledge this being a very important part of OEV
extraction, so we built this into the protocol.

This works via `simulateDappOevDataFeedUpdate` and `simulateExternalCall`
functions, which can be called only with `address(0)`. The only way to
impersonate a zero address is during staticcall simulation. The intended usage
is to do a multicall that simulates the data feed update(s) then makes arbitrary
number external calls.

To understand how to construct the payload for data feed simulation, refer to
[Update the Data Feed](/oev-searchers/in-depth/oev-searching#updating-the-data-feed)
section. The following is an example code snippet demonstating the expected
usage in JavaScript with ethers library.

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

After a profitable OEV opportunity is identified, the searcher needs to place a
bid in the auction. There are multiple ways to
[place a bid](/oev-searchers/in-depth/oev-network/#placing-a-bid), but the
recommended way is to call `placeBidWithExpiration`.

It accepts the following parameters:

| Argument             | Type    | Description                                                                                                                                                                                                                  |
| -------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bidTopic             | bytes32 | The [Bid Topic](/oev-searchers/in-depth/oev-auctioneer#bid-topic) of the current auction.                                                                                                                                    |
| chainId              | uint256 | The chain ID of the target chain.                                                                                                                                                                                            |
| bidAmount            | uint256 | The amount of the bid in the native currency of the target chain. At award time, a respective percentage fo this amount is reserved as collateral and the winner is expected to pay the full bid amount on the target chain. |
| bidDetails           | bytes   | The [Bid details](/oev-searchers/in-depth/oev-auctioneer#bid-details) of the bid.                                                                                                                                            |
| maxCollateralAmount  | uint256 | The maximum collateral amount that the bidder is willing to lock up. This is to prevent unwanted slippage in case of a large price change before the transaction is mined.                                                   |
| maxProtocolFeeAmount | uint256 | The maximum protocol fee amount that the bidder is willing to pay. This is to prevent unwanted slippage in case of a large price change before the transaction is mined.                                                     |
| expirationTimestamp  | uint32  | The timestamp until which the bid is valid. The timestamp is checked against the `block.timestamp` at the bid placement time. Minimum is 15 seconds and maximum 24 hours.                                                    |

The most intuitive way to place the bid is follow the recommendations above and
as a bid amount provide a percentage of the profit. Note, that the searcher
needs to be mindful of all the gas costs on both the target chain and OEV
Network, the paid bid amount, and the respective collateral and protocol fee.

For a bid to be valid, it needs to use the correct arguments. Out of these, the
most important is the bid topic, which also identifies the auction. For the bid
to be considered, the place bid transaction needs to be mined during the bidding
phase. Searchers should be mindful of the block time on the OEV Network to make
sure their transaction is mined in time.

## Expediting a bid

Because OEV Auctions are short lived and the minimum bid lifetime is 15 seconds,
there is little reason to place long live bids. However, in rare cases when a
bid is placed by mistake one can expedite it manually to prevent potential
issues.

There are multiple ways to
[expedite a bid](/oev-searchers/in-depth/oev-network/#expediting-a-bid), but the
recommended way is to call `expediteBidExpirationMaximally`.

It accepts the following parameters:

| Argument       | Type    | Description                                                                                   |
| -------------- | ------- | --------------------------------------------------------------------------------------------- |
| bidTopic       | bytes32 | The [Bid Topic](/oev-searchers/in-depth/oev-auctioneer#bid-topic) of the current auction.     |
| bidDetailsHash | bytes32 | The hash of the [Bid details](/oev-searchers/in-depth/oev-auctioneer#bid-details) of the bid. |

## Waiting for Auction Award

Immediately after the bidding phase is over, Auctioneer enters the award phase
and determines the auction winner and submits the `awardBid` transaction, which
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
searchers are recommended to poll longer. In case Auctioneer does not respond
even within the next bidding phase - there is likely something wrong. Whether
the issue is caused by Auctioneer or the searcher can be determined by looking
at the OEV Network. In case, the issue was caused by Auctioneer, the searcher
can [open a dispute](/oev-searchers/in-depth/oev-searching#handling-disputes).

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

The OEV capabilities are enabled by the
[Api3ServerV1OevExtension](https://github.com/api3dao/contracts-qs/blob/main/contracts/api3-server-v1/Api3ServerV1OevExtension.sol).
This contract allows the auction winner to pay for the winning bid and update
the data feed values.

### Paying for the OEV Bid

Paying for the OEV bid presents a problem. The searcher does not have funds
upfront, they only receive these once they capture OEV. This challenge has a
workaround - let the searcher flashloan the amount to be paid and they repay it
via the OEV proceeds. However, searchers need to often take a loan for the OEV
recapture. This presents a problem, because protocols often implement reentrancy
guards, preventing nested flashloans. The alternative is to compute the
flashloan amount to account for both OEV recapture and bid payment.

We've expected this to degrade the UX, so we implemented the OEV payment in a
way which allows OEV recapture before paying for the OEV bid amount. This works
similarly to a taking a flashloan. Searcher calls `payOevBid` function, which
allows the `msg.sender` to update the dApp data feeds and calls
`onOevBidPayment` callback. After the callback is executed, the function
verifies that the contract's balance increased by at least the corresponding bid
amount. In the `onOevBidPayment` callback, the searcher can capture the OEV and
swap the proceeds to native currency and send the adequate bid amount to to
Api3ServerV1OevExtension contract.

This is the signature of the function:

```solidity
function payOevBid(
    uint256 dappId, // The ID of the dApp that the searcher wants to update (the same value that was used in bid topic)
    uint256 bidAmount, // The bid amount that is to be paid for winning the auction
    uint32 signedDataTimestampCutoff, // The signed data timestamp cutoff period (the same value that was used in bid topic)
    bytes calldata signature, // The signature that the auction winner received via award details
    bytes calldata data // Data that will be passed through the callback
) external;
```

The signature is crafted for a specific dApp ID and signed data timestamp
cutoff. If the searcher provides incorrect values, the signature verification
will fail, causing the transaction to revert. If the signature is valid, the
contract allows the sender to update the data feed(s). Due to exclusivity
guarantees, the winner is guaranteed to be who can update the feed with the data
from within the bidding phase of the respective auction.

### Updating the Data Feed

To update the data feed values, call the `updateDappOevDataFeed` function. This
requires the sender to be whitelisted by paying for the OEV bid first.

```solidity
function updateDappOevDataFeed(
    uint256 dappId, // The ID of the dApp that the searcher wants to update
    bytes[] calldata signedData // The ABI encoded signed data that the searcher wants to update the dAPI with
)
    external
    returns (
        bytes32 baseDataFeedId,
        int224 updatedValue,
        uint32 updatedTimestamp
    );
```

The ABI encoded signed data are expected to be decoded to the following fields:

- `address airnode` - The address of the Airnode wallet.
- `bytes32 templateId` - The template ID of the base beacon - **not** the
  template ID of the OEV beacon.
- `uint256 timestamp` - The timestamp of the data.
- `bytes memory data` - The encoded value.
- `bytes memory signature` - The signature for this signed data - signed for the
  base beacon.

::: info

**Important**

It might be a bit surprising to pass the template ID of the base feed beacon,
because the data and the signature are supplied for the OEV beacon. However, the
contract needs to know both. While hashing the base feed template ID to obtain
the template ID of the OEV beacon is possible - "un-hashing" the base feed
template ID from the OEV template ID is not.

Say the searcher wants to update the value of base feed beacon with template ID
`0x1bb9efc88ac9d910a9edc28e8cad8959d196a551e15c9af3af21247f1605873f` and they
want to use the following signed data for the OEV beacon:

```json
"0x154ca7c81eb1ed9ce151d5b6ad894c5ab79d19bee20d89eb061aaf24f788221f": {
  "airnode": "0xc52EeA00154B4fF1EbbF8Ba39FDe37F1AC3B9Fd4",
  "encodedValue": "0x000000000000000000000000000000000000000000000000003f9c9ba19d0d78",
  "signature": "0xf5f454722652215823cb868fd53b7a0c63090dff46e65ba7cdd5fb120df3a520522b80b1fa41f2599c429daa0e48c4f42f60f25b41dab3a8a9be1d2547ebe9811b",
  "templateId": "0xbc7896315bfd4b1186a05f219ec71a95def0d038617e7ae534075317866bfd1b",
  "timestamp": "1726474901"
}
```

they would encode the signed data as follows:

```solidity
abi.encode(
  address(0xc52EeA00154B4fF1EbbF8Ba39FDe37F1AC3B9Fd4),
  bytes32(0x1bb9efc88ac9d910a9edc28e8cad8959d196a551e15c9af3af21247f1605873f),
  uint256(1726474901),
  hex"000000000000000000000000000000000000000000000000003f9c9ba19d0d78",
  hex"f5f454722652215823cb868fd53b7a0c63090dff46e65ba7cdd5fb120df3a520522b80b1fa41f2599c429daa0e48c4f42f60f25b41dab3a8a9be1d2547ebe9811b"
)
```

:::

The auction winner can update the data feed multiple times and in multiple
transactions. However, the contract enforces tight security measures. The
timestamp of the signed data for OEV beacon must be greater or equal to the
timestamp of the base feed beacon. The data feed value after aggregating OEV
beacons must change the base feed - either increase the timestamp or change the
aggregated value. This enforces time monotonicity at the contract level, making
sure OEV updates provide only the freshest data.

### Api3ServerV1OevExtensionOevBidPayer

As part `payOevBid` function, the Api3ServerV1OevExtension contract assumes
`msg.sender` is a contract that implements the
IApi3ServerV1OevExtensionOevBidPayer interface. It calls the `onOevBidPayment`
callback and requires the return value to equal:

```solidity
keccak256("Api3ServerV1OevExtensionOevBidPayer.onOevBidPayment")
```

## Bidding Contract

The bidder can be either EoA or a contract. The former is simpler, but has
certain drawbacks. Imagine a searcher firm, where individual developers work on
the searcher bots. Each bot has a dedicated EoA to interact with OEV Network and
capture OEV on the target chain. The product owner only provides liquidity to
each EoA for the OEV collateral. There are a few immediate drawbacks:

1. The EoA needs has full control over the deposit in OevAuctionHouse contract.
2. The collateral liquidity is fragmented across multiple EoA.

Both of these downsides can be mitigated by a role-based bidding contract. One
can imagine the product owner being the only one who can withdraw the funds and
give bidding permissions to other accounts. These accounts can be used to place
bids through the contract. The contract can have other use cases based on the
use cases needed, but there are a few important consiederations to keep in mind
when designing the contract:

1. The OevAuctionsHouse expects the same account to call `reportFulfillment`.
   This means the bidding contract needs to be reporting fulfillments as well.
2. Both `initiateWithdrawal`, `withdraw` and `cancelWithdrawal` need to be
   called by the the same address. The bidding contract need to be allowed to
   call of this. Note that withdrawal cancelation may be omitted if the contract
   doesn't need to have this capability. Access to these functions should be
   limited. For example, a malicious actor that has access to it may call
   `initiateWithdrawal` so that the auctioneer bots disregard the respective
   bids, or call `cancelWithdrawal` whenever a withdrawal is initiated to
   prevent the funds from ever being withdrawn.
3. The withdrawal recipient is specified in the `withdraw` call. Make sure the
   recipient is payable and the funds will not remain locked.

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
