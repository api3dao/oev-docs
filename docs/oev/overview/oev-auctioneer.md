---
title: OEV Network
pageHeader: OEV → Overview
outline: deep
---

<!-- TODO: Update all pageHeader -->

<PageHeader/>

# OEV Auctioneer

OEV Auctioneer is the off-chain system managed by API3 DAO to process auctions
that happen on the OEV network. This off-chain component is necessary, because
hosting auctions fully on-chain would be extremely gas intensive and not scale
performance wise. The correctness and honesty of OEV Auctioneer can be verified
on-chain, because the logic is based solely on the
[OevAuctionHouse](/oev/overview/oev-network#oevauctionhouse) contract state at a
given time.

OEV auctioneer has two main responsibilities:

1. Resolve auctions and award the winner.
2. Confirm or contradict fulfillments.

Each dApp which uses OEV feeds is served by some Auctioneer instance.
Internally, API3 DAO may run multiple Auctioneers as a form of horizontal
scaling to ensure auctions can be processed in a timely manner.

## Enforced conventions

Auctioneer enforces a few conventions. These are important for auction
participants to understand and comply with in order to successfully participate
in the auctions.

### Constants

| Name                                  | Value | Description                                                                             |
| ------------------------------------- | ----- | --------------------------------------------------------------------------------------- |
| AUCTION_LENGTH_SECONDS                | 30    | How long does an auction last.                                                          |
| MAJOR_VERSION                         | 1     | Increased when the Auctioneer releases a breaking change.                               |
| COLLATERAL_REQUIREMENT_BUFFER_PERCENT | 5     | The additional percentage of the bidder's collateral to mitigate against price changes  |
| BIDDING_PHASE_LENGTH_SECONDS          | 25    | The length of the bidding phase during which participants can place their bids.         |
| REPORT_FULFILLMENT_PERIOD_SECONDS     | 86400 | The fulfillment period, during which the auction winner is able to report paid OEV bid. |
| MINIMUM_BID_EXPIRING_SECONDS          | 15    | The minimum expiring time for a bid to be considered eligible for award.                |

### Auction offset

Auctions repeat indefinitely and take a fixed amount of time. The first auction
starts at the UNIX timestamp 0 (midnight UTC on 1st of January 1970) plus an
offset based on the the dApp ID.

```js
const offset = ethers.BigNumber.from(
  ethers.utils.keccak256(ethers.utils.solidityPack(['uint32'], [dAppId]))
).mod(AUCTION_LENGTH_SECONDS);
```

::: info

**Example:**

Say there is a dApp with ID `13` and `AUCTION_LENGTH_SECONDS=30`

- When we encode and hash the dApp ID, we get
  `0x0e814ac3d2697269bfdc5233432fb2cedebd80e0d22aa486feb679ad45c168b8`
- When we convert it to a decimal number, we get
  `6560819160100363211601641299258035429214555763785895604957504684595601303736`
- When we modulo the number we get `6`

So the first auction starts at UNIX timsetamp `6` and repeats every 30s. The
second auction starts at timestamp 36, the third at 66, and so on...

:::

### Bid Topic

Auctioneer uses the following convention for the bid topic:

```js
ethers.utils.keccak256(
  ethers.utils.solidityPack(
    ['uint256', 'uint256', 'uint256', 'uint256'],
    [majorVersion, dappId, startTimestamp, endTimestamp]
  )
);
```

Let's break down the components of the bid topic:

1. `majorVersion` - The major version of the auctioneer. Refer to the current
   value of `MAJOR_VERSION` constant.
2. `dappId` - The dApp ID for which the auction is being held.
3. `startTimestamp` - The timestamp at which the auction starts.
4. `endTimestamp` - The timestamp at which the auction ends. This should be set
   to `startTimestamp + AUCTION_LENGTH_SECONDS`.

### Bid details

The details have the following convention:

```js
ethers.utils.defaultAbiCoder.encode(
  ['address', 'bytes32'],
  [updateSenderAddress, ethers.utils.hexlify(ethers.utils.randomBytes(32))]
);
```

The arguments are:

1. `updateSenderAddress` - The address that is going to pay for the OEV bid and
   update the data feed, if the bid wins the auction.
2. `nonce` - A random nonce to prevent bid ID conflicts.

### Award details

The award details contains a
[signature](https://github.com/api3dao/contracts-qs/blob/a5a11d929d8dae54fd586986d65513f8bc5a14b4/contracts/api3-server-v1/Api3ServerV1OevExtension.sol#L106)
that the auction winner uses to pay the OEV bid, which allows them to update the
price feeds.

### Fulfillment details

The fulfillment details is a single the `bytes32` value that represents the
transaction hash on the target chain after their price feed transaction reached
adequate finality.

## Bid eligibility

Auctions are open for everyone. Participants interact with the OevAuctionHouse
contract when placing a bid, which enforces a few restrictions. Apart from the
on-chain restrictions, Auctioneer adds a few other ones:

1. Ignore all bids that expired or are expiring within the next
   `MINIMUM_BID_EXPIRING_SECONDS` period - This ensures that the awarded bid
   will still be active when the transaction is submitted.
2. Ensure the bidder has enough collateral to cover the bid amount along with
   extra `COLLATERAL_REQUIREMENT_BUFFER_PERCENT` percent to account for price
   fluctuations - This ensures that enough collateral can be reserved at award
   time.
3. Ensure the bidder has no active withdrawal - Prevents withdrawing the deposit
   just before awarding the bid.

Auctioneer checks the collateral and withdrawals by fetching this information
from the OevAuctionHouse contract. In a rare case when Auctioneer fails to fetch
eligibility for a bidder it will abort awarding the current auction.

::: info

Notice, that the collateral is reserved at award time, not at bid time. However,
the collateral and protocol fee is computed from the rates from the bid time.
This allows the bidder to place multiple bids for different dApps, even if their
collateral doesn't allow them to win all. This allows for greater flexibility.

:::

## Auction resolution

Each auction is split into two phases:

1. Bidding phase - During this phase, auction participants are free to submit
   their bids. This phase takes `BIDDING_PHASE_LENGTH_SECONDS`.
2. Awarding phase - During this phase, Auctioneer determines and awards the
   winner. Bids placed during this period are ignored. This phase takes the
   remainder of the auction length, that is
   `AUCTION_LENGTH_SECONDS - BIDDING_PHASE_LENGTH_SECONDS`.

As soon as the bidding phase is over, Auctioneer attempts to determine and award
the winner as soon as possible. The following happens under the hood:

1. Compute the bid topic for the current auction.
2. Fetch the current block on the OEV Network. Under rare circumstances when the
   OEV Network block can't be fetched - abort awarding this auction.
3. Fetch the bids placed during the bidding phase up to the given block.
4. Filter out all eligible bids and select the bidder with highest bid amount.
5. Prepare and submit the award for the auction winner on OEV network.

::: info

There is a theoretical possibility that before we fetch the OEV Network block a
new bid is placed, after the bidding phase is over. In that case Auctioneer will
also consider this bid. Auction participants should not rely on this behaviour.

:::

## Processing fulfillments

After the auction winner is awarded, they are expected to fulfill their duties
by paying for the awarded OEV bid. After they've made the transaction on the
target chain, they are expected to report the fulfillment back to the OEV
network to get part of their collateral released. Auctioneer periodically
queries the OEV Network logs for such events, by doing the following:

1. Fetch all logs regarding fulfillments for sufficient time period -
   AwardedBid, ReportedFulfillment, ConfirmedFulfillment and
   ContradictedFulfillment.

<!-- NOTE: Being intentionally vague here, because it's not important to mention what block/time range we're fetching exactly.-->

2. Contradict all AwardedBid events that are `REPORT_FULFILLMENT_PERIOD_SECONDS`
   old without a matching reported fulfillment. Make no action for other
   AwardedBid events, because they are within the fulfillment period.

3. For all ReportedFulfillment events without a matching ConfirmedFulfillment or
   ContradictedFulfillment fetch the PlacedBid event to determine which chain ID
   was the bid for.

4. Verify that the reported fulfillment is valid. It needed to be paid through
   the correct contract, correct amount on the correct target chain.

In case there is a failure during the any of the steps above, the Auctioneer
tries to process the fulfillment later. Its upmost priority is to avoid slashing
honest auction participants. That said, once the Auctioneer disproves the
fulfillment, it will promptly slash. Auction winners are advised to wait
sufficient time for the transaction to reach enough finality on the target
chain.

::: info

Note, that the auction winner may choose not to update the price feed when they
pay for the awarded bid. This is an allowed way to withhold the updates, because
the dApp is getting paid each time this happens, while the auction winner is
losing money. As a note, the data feed security remains unchanged, because it
will be eventually updated by a API3 push oracle if it's deviation exceeds the
threshold.

:::
