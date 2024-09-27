---
title: OEV Network
pageHeader: OEV → Overview
outline: deep
---

<PageHeader/>

# OEV Auctioneer

OEV Auctioneer is the off-chain system managed by the API3 DAO to process
auctions that happen on the OEV network. This off-chain component is necessary,
because hosting auctions fully on-chain would be extremely gas intensive and
wouldn't scale performance wise. The correctness and honesty of OEV Auctioneer
can be verified on-chain, because the logic is based solely on the
[OevAuctionHouse](/oev/overview/oev-network#oevauctionhouse) contract state and
events at a given time.

OEV Auctioneer has two main responsibilities:

1. Resolve auctions and award the winner.
2. Confirm or contradict fulfillments.

Each dApp which uses OEV feeds is served by some Auctioneer instance.
Internally, API3 DAO may run multiple Auctioneers as a form of horizontal
scaling to ensure auctions can be processed in a timely manner.

## Enforced Conventions

Auctioneer enforces a few conventions. These are important for searchers to
understand and comply with in order to successfully participate in auctions.

### Constants

| Name                                  | Value | Description                                                                                        |
| ------------------------------------- | ----- | -------------------------------------------------------------------------------------------------- |
| AUCTION_LENGTH_SECONDS                | 30    | How long does an auction last.                                                                     |
| OEV_AUCTIONS_MAJOR_VERSION            | 1     | Increased when we release any breaking change relevant to OEV auctions.                            |
| COLLATERAL_REQUIREMENT_BUFFER_PERCENT | 5     | The additional percentage of the bidder's collateral to mitigate against price changes.            |
| BIDDING_PHASE_LENGTH_SECONDS          | 25    | The length of the bidding phase during which searchers can place their bids.                       |
| REPORT_FULFILLMENT_PERIOD_SECONDS     | 86400 | The fulfillment period, during which the auction winner is able to report payment for the OEV bid. |
| MINIMUM_BID_EXPIRING_SECONDS          | 15    | The minimum expiring time for a bid to be considered eligible for award.                           |
| PLACED_BIDS_BLOCK_RANGE               | 300   | The number of blocks queried for placed bids during award phase.                                   |

### Auction Offset

Auctions repeat indefinitely and take a fixed amount of time. The first auction
starts at the UNIX timestamp 0 (midnight UTC on 1st of January 1970) plus an
offset based on the the dApp ID.

```solidity
uint256(keccak256(abi.encodePacked(uint256(dAppId)))) % AUCTION_LENGTH_SECONDS;
```

::: info

**Example:**

Say there is a dApp with ID `13` and `AUCTION_LENGTH_SECONDS=30`

- When we encode and hash the dApp ID, we get
  `0xd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb5`.
- When we convert it to a decimal number, we get
  `97569884605916225051403212656556507955018248777258318895762758024193532305077n`.
- When we modulo the number by `30`, we get `17`.

So the first auction starts at UNIX timsetamp `17` and repeats every 30s. The
second auction starts at timestamp `47`, the third at `77`, and so on...

:::

### Bid Topic

Auctioneer uses the following convention for the bid topic:

```solidity
keccak256(
  abi.encodePacked(
    uint256(majorVersion),
    uint256(dappId),
    uint32(auctionLength),
    uint32(signedDataTimestampCutoff)
  )
);
```

Let's break down the components of the bid topic:

1. `majorVersion` - The major version of OEV Auctions. Any change resulting in
   auction behaviour changing, such as changes in auction rules or off-chain
   protocol specs, is denoted by this major version being incremented. Refer to
   the current value of `OEV_AUCTIONS_MAJOR_VERSION` constant.
2. `dappId` - The dApp ID for which the auction is being held.
3. `auctionLength` - The length of the auction. This parameter must to be set to
   `AUCTION_LENGTH_SECONDS`. It is one of the most important parameters, so
   we're explicitly including it in the bid topic to highlight its importance.
4. `signedDataTimestampCutoff` - The cutoff timestamp of the signed data. Only
   signed data with timestamp smaller or equal to this value are permitted to
   update the data feed. It is equal to the end of the bidding phase of the
   auction, that is `startTimestamp + BIDDING_PHASE_LENGTH_SECONDS`.

::: info

Auctions repeat continuously and indefinitely. To calculate the
`signedDataTimestampCutoff` that is to be specified in the bid topic, one needs
to calculate the `startTimestamp` of the auction. This depends on the auction
offset and `BIDDING_PHASE_LENGTH_SECONDS`.

For example, dApp with ID `13` has an auction offset of `17`. With
`AUCTION_LENGTH_SECONDS=30` and `BIDDING_PHASE_LENGTH_SECONDS=25` this gives the
following sequence of auctions:

| `startTimestamp` | `signedDataTimestampCutoff` | End of award phase |
| ---------------- | --------------------------- | ------------------ |
| 17               | 42                          | 47                 |
| 47               | 72                          | 77                 |
| 77               | 102                         | 107                |

and so on...

:::

### Bid Details

The bid details have the following convention:

```solidity
abi.encode(
  address(updateSenderAddress),
  bytes32(nonce)
);
```

The arguments are:

1. `updateSenderAddress` - The address that is going to pay for the OEV bid and
   update the data feed, if the bid wins the auction.
2. `nonce` - A random nonce to prevent bid ID conflicts.

### Award Details

The award details contain a
[signature](https://github.com/api3dao/contracts-qs/blob/a5a11d929d8dae54fd586986d65513f8bc5a14b4/contracts/api3-server-v1/Api3ServerV1OevExtension.sol#L106)
that the auction winner uses to pay the OEV bid, which allows them to update the
price feeds.

### Fulfillment Details

The fulfillment details is a single `bytes32` value that represents the
transaction hash on the target chain in which the auction winner paid for the
OEV bid.

## Bid Eligibility

Auctions are open for everyone. Searchers interact with the OevAuctionHouse
contract when placing a bid, which enforces a few restrictions. Apart from the
on-chain restrictions, Auctioneer adds a few more:

1. Ignore all bids that expired or are expiring within the next
   `MINIMUM_BID_EXPIRING_SECONDS` period. This ensures that the awarded bid will
   still be active when the transaction is mined.
2. Ensure the bidder has enough collateral to cover the bid amount along with
   extra `COLLATERAL_REQUIREMENT_BUFFER_PERCENT` percent to account for price
   fluctuations. This ensures that enough collateral can be reserved at award
   time.
3. Ensure the bidder has not initiated a withdrawal. This prevents withdrawing
   the deposit just before the bid award. Note that it does not matter if the
   bid was placed before the withdrawal - if there is a withdraw initiated all
   bidder's bids are ignored.

Auctioneer fetches the required information from the OevAuctionHouse contract.
In a rare case when Auctioneer fails to fetch eligibility for a bidder, it will
abort awarding the current auction.

## Auction Resolution

Each auction is split into two phases:

1. Bidding phase - During this phase, searchers are free to submit their bids.
   This phase takes `BIDDING_PHASE_LENGTH_SECONDS`.
2. Awarding phase - During this phase, Auctioneer determines and awards the
   winner. Bids placed during this period are ignored. This phase takes the
   remainder of the auction length, which is
   `AUCTION_LENGTH_SECONDS - BIDDING_PHASE_LENGTH_SECONDS`.

As soon as the bidding phase is over, Auctioneer attempts to resolve the auction
as soon as possible. The following happens under the hood:

1. Compute the bid topic for the current auction.
2. Fetch the current block on the OEV Network.
3. Fetch the bids for the bid topic from the last `PLACED_BIDS_BLOCK_RANGE`.
4. Discard all ineligible bids.
5. Select the bidder with highest bid amount. In case there are multiple
   eligible bids with the same amount, the bidder with the earliest bid is
   selected.
6. Prepare and submit the award for the auction winner on OEV network.

Under rare circumstances, when Auctioneer is unable to fetch the block on the
OEV Network, the auction will be aborted and no winner is chosen. Similarly, if
the auction award transaction fails, there will be no retry. Retrying in the
case of an award failure would be unsafe, because the award signature was
already exposed publicly.

### Bidding Phase Guarantee

Auctioneer guarantees that any bid placed during the bidding phase will be
processed. The timestamp of the placed bid is determined by the block timestamp
in which the transaction is included. Searchers need to be mindful of that and
of the block time of OEV Network and make sure to place their bids in time.

That said, Auctioneer may also include bids placed before or slightly after the
bidding phase. That is because Auctioneer fetches the logs from OEV Network some
time in the award phase. It fetches logs from sufficient block range with some
buffer to ensure the full bidding phase is included. This behaviour might change
in time and searchers should not rely on it.

## Processing Fulfillments

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
   ContradictedFulfillment fetch the PlacedBid event to determine which chain
   was the bid for.

4. Verify that the reported fulfillment is valid. It needed to be paid through
   the correct contract, with the correct amount and on the correct target
   chain.

In case there is a failure during any of the steps above, the Auctioneer tries
to process the fulfillment later. Its upmost priority is to avoid slashing
honest searchers. That said, once the Auctioneer disproves the fulfillment, it
will promptly slash. Auction winners are advised to wait sufficient time for the
transaction to reach enough finality on the target chain.

::: info

Note that the auction winner may choose not to update the price feed when they
pay for the awarded bid. This is an allowed way to withhold the updates, because
the auction winner is losing money by being slashed, making it financially
infeasible. As a note, the data feed security remains unchanged, because it will
be eventually updated by an API3 push oracle when its deviation exceeds the
threshold.

:::

## Maintenance

Auctioneer is maintained by the API3 DAO, which is responsible for its uptime
and reliable auction processing. In case of a planned migration or maintenance,
there will be an announcement shared in advance. It's expected that maintenance
periods will be very rare and short.
