---
title: OEV searching
pageHeader: OEV Searchers → In Depth
outline: deep
---

<PageHeader/>

# OEV searching

We assume that a searcher has an existing MEV bot and is familiar with the OEV
Network and OEV Auctioneer. Let's glue these concepts together and detail the
steps to start OEV searching.

## Monitoring signed data

Searchers need to have a list of data feeds used by the dApp and
[obtain its beacons](/oev-searchers/in-depth/data-feeds/#dapp-sources). However,
these are the beacons of the base feed. For each of these beacons, the searcher
must derive the OEV counterpart to obtain the
[OEV beacon](/oev-searchers/in-depth/data-feeds/#oev-feed).

Once the list of OEV beacons is known, searchers should periodically call the
public [OEV endpoints](/oev-searchers/in-depth/data-feeds/#oev-endpoints) to get the
real-time values for the OEV beacons used by the dApp. It's necessary to persist
these values for a brief period of time - in case they win the auction and need
to update the data feed.

OEV auctions provide exclusivity guarantees only for signed data with timestamps
from within the bid phase. Note that using older signed data is permitted, but it's likely that such data is already exposed to the public via [base feed endpoints](/oev-searchers/in-depth/data-feeds/#base-feed-endpoints), so their use is discouraged.

## Simulating a data feed update

Compared to the base feed updates, OEV updates are permissioned - allowing only
the auction winner to update the data feed. This makes the OEV update on-chain
simulation trickier. We acknowledge this as a very important part of OEV
extraction, so we built this into the protocol.

This works via `simulateDappOevDataFeedUpdate` and `simulateExternalCall`
functions, which can be called only with `address(0)`. The only way to
impersonate a zero address is during a staticcall simulation. The intended usage
is to do a multicall that simulates some data feed update(s) and then makes an
arbitrary number of external calls.

### On-chain details

To simulate a data feed update, call the `simulateDappOevDataFeedUpdate` function with sender `address(0)`.

```solidity
function simulateDappOevDataFeedUpdate(
    uint256 dappId, // The ID of the dApp that the searcher wants to update
    bytes[] calldata signedData // The ABI encoded signed data used for updating the data feeds
)
    external
    returns (
        bytes32 baseDataFeedId, // The data feed ID that was updated
        int224 updatedValue, // The aggregated value of the update
        uint32 updatedTimestamp // The aggregated timestamp of the update
    );
```

The ABI encoded signed data are expected to be decoded to the following fields:

- `address airnode` - The address of the Airnode wallet.
- `bytes32 templateId` - The template ID of the base feed beacon - **not** the
  template ID of the OEV beacon.
- `uint256 timestamp` - The timestamp of the data.
- `bytes memory data` - The encoded value.
- `bytes memory signature` - The signature for this signed data - signed for the
  base feed beacon.

::: info ⚠️ Warning

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

### Searcher bot snippet

The following is an example code snippet demonstrating a relevant searcher bot implementation in JavaScript using the ethers library.

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

## Placing a bid

After a profitable OEV opportunity is identified, the searcher needs to place a
bid in the auction. There are two ways to
[place a bid](/oev-searchers/in-depth/oev-network/#placing-a-bid), but the
idiomatic way is to call `placeBidWithExpiration`.

It accepts the following parameters:

| Argument             | Type    | Description                                                                                                                                                                                                                  |
| -------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bidTopic             | bytes32 | The [bid topic](/oev-searchers/in-depth/oev-auctioneer#bid-topic) of the current auction.                                                                                                                                    |
| chainId              | uint256 | The chain ID of the target chain.                                                                                                                                                                                            |
| bidAmount            | uint256 | The amount of the bid in the native currency of the target chain. At award time, a respective percentage fo this amount is reserved as collateral and the winner is expected to pay the full bid amount on the target chain. |
| bidDetails           | bytes   | The [bid details](/oev-searchers/in-depth/oev-auctioneer#bid-details) of the bid.                                                                                                                                            |
| maxCollateralAmount  | uint256 | The maximum collateral amount that the bidder is willing to lock up. This is to prevent unwanted slippage in case of a large price change before the transaction is mined.                                                   |
| maxProtocolFeeAmount | uint256 | The maximum protocol fee amount that the bidder is willing to pay. This is to prevent unwanted slippage in case of a large price change before the transaction is mined.                                                     |
| expirationTimestamp  | uint32  | The timestamp until which the bid is valid. The timestamp is checked against the `block.timestamp` at the bid placement time. Minimum is 15 seconds and maximum 24 hours.                                                    |

The most intuitive way to place the bid is to follow the recommendations above
and provide a percentage of the profit as the bid amount. Note that the searcher
needs to be mindful of all the gas costs on both the target chain and OEV
Network, the paid bid amount, external risks due to liquidity changes on target chain and the respective collateral and protocol fee on OEV Network.

For a bid to be valid, it needs to use the correct arguments, most importantly the bid topic, which identifies the auction. For the bid
to be considered, the place bid transaction needs to be mined during the bid
phase. Searchers should be mindful of the block time on the OEV Network to make
sure their transaction is mined in time.

## Expediting a bid

Because OEV Auctions are short-lived and the minimum bid lifetime is 15 seconds,
there is little reason to place long-lived bids. However, in rare cases when a
bid is placed by mistake, one can expedite it manually to prevent potential
issues.

There are two ways to
[expedite a bid](/oev-searchers/in-depth/oev-network/#expediting-a-bid), but the
recommended way is to call `expediteBidExpirationMaximally`.

It accepts the following parameters:

| Argument       | Type    | Description                                                                                   |
| -------------- | ------- | --------------------------------------------------------------------------------------------- |
| bidTopic       | bytes32 | The [bid topic](/oev-searchers/in-depth/oev-auctioneer#bid-topic) of the current auction.     |
| bidDetailsHash | bytes32 | The hash of the [bid details](/oev-searchers/in-depth/oev-auctioneer#bid-details) of the bid. |

## Waiting for auction award

Immediately after the bid phase is over, Auctioneer enters the award phase,
determines the auction winner, and submits the `awardBid` transaction, which
emits an AwardedBid event. This event indexes the three most important
arguments:

- `bidder` - The auction winner
- `bidTopic` - The bid topic of the auction
- `bidId` - The bid ID of the auction

Searchers can create an event filter to query for all their awarded bids by
filtering for particular bidder(s), or they could create an event filter for a
specific auction or simply query for their bid. The most idiomatic way is to
poll the AwardedBid with a particular bid topic. After the event is received,
searchers can check the bidder to see if they are the winner or not. It's
recommended to use a small polling interval to obtain the result as soon as
possible.

Auctioneer should in practice award the bid during the award phase, but
searchers are recommended to poll longer. If Auctioneer does not respond even
within the next bid phase, there is likely something wrong. Whether the
issue is caused by Auctioneer or the searcher can be determined by looking at
the OEV Network. If the issue was caused by Auctioneer, the searcher can
[open a dispute](/oev-searchers/in-depth/oev-searching#handling-disputes).

::: info 💡 Tip

Searchers can monitor the auction in real-time and can determine the auction
winner themselves (or even attempt to increase their bid).

:::

## Capturing OEV

After the bid is awarded, the searcher needs to do the following:

1. Pay for the awarded bid
2. Update any of the dApp's data feed(s)
3. Capture any OEV opportunities exposed by the data feed update(s)

It's expected that searchers perform all of these steps atomically. However, the
contract allows searchers to repeat steps 2 and 3 as many times as they want.
However, each update must increase the timestamp of the OEV beacon(s).

The OEV capabilities are enabled by the
[Api3ServerV1OevExtension](https://github.com/api3dao/contracts/blob/main/contracts/api3-server-v1/Api3ServerV1OevExtension.sol).
This contract allows the auction winner to pay for the winning bid and update
the data feed values.

### Paying for the OEV bid

Paying for the OEV bid presents a problem. The searcher does not have funds
upfront - they only receive these once they capture OEV. This challenge has a
workaround - let the searcher use a flash-loan for the amount to be paid and
repay it via the OEV proceeds. However, searchers often need to take a loan for
the OEV recapture. This presents a problem because protocols often implement
reentrancy guards, preventing nested flash-loans. The alternative is to compute
the flash-loan amount to account for both OEV recapture and bid payment.

We expected this to degrade the UX, so we implemented the OEV payment in a way
that allows OEV recapture before paying for the OEV bid amount. This works
similarly to taking a flash-loan. The searcher calls `payOevBid` function, which
allows the `msg.sender` to update the dApp data feeds and calls the
`onOevBidPayment` callback. After the callback is executed, the function
verifies that the contract's balance increased by at least the corresponding bid
amount. In the `onOevBidPayment` callback, the searcher can capture the OEV,
swap the proceeds to native currency, and send the adequate bid amount to
Api3ServerV1OevExtension contract.

This is the signature of the `payOevBid` function:

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
guarantees, the winner is guaranteed to be the only one who can update the feed
with data from within the bid phase of the respective auction.

### Api3ServerV1OevExtensionOevBidPayer

The `onOevBidPayment` function is a required for searchers to implement. For simplicity, Api3 provides an interface searchers can use in their contracts.

```solidity
/// @title Interface that OEV bid payers (i.e., contracts that call
/// `payOevBid()` of Api3ServerV1OevExtension) must implement
interface IApi3ServerV1OevExtensionOevBidPayer {
    /// @notice Called back by Api3ServerV1OevExtension after an OEV bid payer
    /// has called `payOevBid()` of Api3ServerV1OevExtension. During the
    /// callback, the OEV bid payer will be allowed to update the OEV feeds
    /// of the respective dApp. Before returning, the OEV bid payer must ensure
    /// that at least the bid amount has been sent to Api3ServerV1OevExtension.
    /// The returndata must start with the keccak256 hash of
    /// "Api3ServerV1OevExtensionOevBidPayer.onOevBidPayment".
    /// @param bidAmount Bid amount
    /// @param data Data that is passed through the callback
    /// @return oevBidPaymentCallbackSuccess OEV bid payment callback success
    /// code
    function onOevBidPayment(
        uint256 bidAmount,
        bytes calldata data
    ) external returns (bytes32 oevBidPaymentCallbackSuccess);
}
```

### Updating the data feed

To update the data feed values for a dApp, you can use `updateDappOevDataFeed` function which has the same function signature as `simulateDappOevDataFeedUpdate`. Refer to [Simulating a data feed update](#simulating-a-data-feed-update) section for details.

::: info 💡 Tip

The auction winner can update the data feed multiple times and in multiple
transactions. However, the contract enforces tight security measures. The
timestamp of the signed data for the OEV beacon must be greater than or equal to
the timestamp of the base feed beacon. The data feed value after aggregating OEV
beacons must change the base feed - either increase the timestamp or change the
aggregated value. This enforces time monotonicity at the contract level, making
sure OEV updates provide only the freshest data.

:::

## Bidding contract

The bidder can be either an EOA or a contract. The former is simpler but has
certain drawbacks:

1. The EOA has full control over the deposit in the OevAuctionHouse contract
2. The collateral liquidity is fragmented across multiple EOAs

Both of these downsides can be mitigated by a role-based bidding contract. One
role for withdrawing the funds and the other giving bidding permissions. There
are a few important considerations to keep in mind when designing such contract:

1. The OevAuctionsHouse expects the same account to call `reportFulfillment`.
   This means the bidding contract needs to be reporting fulfillments as well.
2. Both `initiateWithdrawal`, `withdraw`, and `cancelWithdrawal` need to be
   called by the same address. The bidding contract needs to be allowed to call
   all of these. Note that withdrawal cancellation may be omitted if the
   contract doesn't need to have this capability. Access to these functions
   should be restricted. For example, a malicious actor who has access to these may
   call `initiateWithdrawal` and make the Auctioneer disregard the
   respective bids, or call `cancelWithdrawal` whenever a withdrawal is
   initiated to prevent the funds from ever being withdrawn.
3. The withdrawal recipient is specified in the `withdraw` call. Make sure the
   recipient is payable and the funds will not remain locked.

## Handling disputes

In case of a dispute, the OEV Network is considered the source of truth and can
be used to resolve it. This may include Auctioneer awarding the wrong bidder or
being inconsistent with its pre-announced rules.

Note that any dispute that cannot be proven or disproved on-chain is
non-applicable. This may include searchers' complaints about RPC connections or
similar off-chain problems.

To open a dispute, head to the
[OEV Discord channel](https://discord.com/channels/758003776174030948/1062909222347603989)
and create a post with the description of the dispute.

## Reference implementation

- [Example OEV Compound bot](https://github.com/api3dao/oev-v1-compound-bot) - You can also inspect the
  [changes](https://github.com/api3dao/oev-v1-compound-bot/compare/mev-with-signed-apis...oev)
  needed to add the OEV functionality to an existing bot supporting [MEV with Signed APIs](/oev-searchers/in-depth/mev-with-signed-apis).
