---
title: OEV Auctioneer
pageHeader: OEV Searchers → In Depth
outline: deep
---

<PageHeader/>

# OEV Auctioneer

OEV Auctioneer is the off-chain system managed by the Api3 DAO to process
auctions hosted on the OEV network. The honesty of OEV Auctioneer
can be verified on-chain because the logic is based solely on the
[OevAuctionHouse](/oev-searchers/in-depth/oev-network/#oevauctionhouse) contract
state.

OEV Auctioneer has two main responsibilities:

1. Resolve auctions and award the winner
2. Confirm or contradict fulfillments

Each dApp that uses OEV feeds is served by an Auctioneer instance. Internally,
Api3 DAO may run multiple Auctioneers as a form of horizontal scaling to ensure
auctions can be processed in a timely manner.

## How it works?

Auctioneer processes logs emitted by the OevAuctionHouse contract and responds
back by interacting with the same contract. Auctioneer is deployed on AWS with
well-established security. It has an Auctioneer wallet that is given the rights
to resolve the auctions and confirm/contradict fulfillments.

The only cross-chain communication happens during fulfillment verification - all
other operations are performed solely on OEV Network. This minimizes latency and improves the resiliency.

## Enforced conventions

Auctioneer enforces a few conventions. These are important for searchers to
understand and comply with in order to successfully participate in auctions.

### Constants

| Name                                  | Value | Description                                                                                        |
| ------------------------------------- | ----- | -------------------------------------------------------------------------------------------------- |
| AUCTION_LENGTH_SECONDS                | 30    | How long an auction lasts.                                                                         |
| OEV_AUCTIONS_MAJOR_VERSION            | 1     | Increased when we release any breaking change relevant to OEV auctions.                            |
| COLLATERAL_REQUIREMENT_BUFFER_PERCENT | 5     | The additional percentage of the bidder's collateral to mitigate against price changes.            |
| BID_PHASE_LENGTH_SECONDS              | 25    | The length of the bid phase during which searchers can place their bids.                           |
| REPORT_FULFILLMENT_PERIOD_SECONDS     | 86400 | The fulfillment period, during which the auction winner is able to report payment for the OEV bid. |
| MINIMUM_BID_EXPIRING_SECONDS          | 15    | The minimum expiring time for a bid to be considered eligible for award.                           |
| PLACED_BIDS_BLOCK_RANGE               | 300   | The number of blocks queried for placed bids during award phase.                                   |

### Auction offset

Auctions repeat indefinitely and take a fixed amount of time. The first auction
starts at the UNIX timestamp 0 (midnight UTC on 1st of January 1970) plus an
offset based on the dApp ID.

```solidity
uint256(keccak256(abi.encodePacked(uint256(dAppId)))) % AUCTION_LENGTH_SECONDS;
```

::: info ℹ️ Example

Say there is a dApp with ID `13` and `AUCTION_LENGTH_SECONDS=30`

- When we encode and hash the dApp ID, we get
  `0xd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb5`.
- When we convert it to a decimal number, we get
  `97569884605916225051403212656556507955018248777258318895762758024193532305077n`.
- When we modulo the number by `30`, we get `17`.

So the first auction starts at UNIX timestamp `17` and repeats every 30s. The
second auction starts at timestamp `47`, the third at `77`, and so on...

:::

### Bid topic

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
   auction behavior changing, such as changes in auction rules or off-chain
   protocol specs, is denoted by this major version being incremented. Refer to
   the current value of `OEV_AUCTIONS_MAJOR_VERSION` constant.
2. `dappId` - The dApp ID for which the auction is being held.
3. `auctionLength` - The length of the auction. This parameter must be set to
   `AUCTION_LENGTH_SECONDS`. It is one of the most important parameters, so
   we're explicitly including it in the bid topic to highlight its importance.
4. `signedDataTimestampCutoff` - The cutoff timestamp of the signed data. The auction winner is permitted to only use signed data with timestamps smaller than or equal to this. It is equal to the end of the bid phase of the
   auction.

::: info ℹ️ Info

Auctions repeat continuously and indefinitely. To calculate the
`signedDataTimestampCutoff` that is to be specified in the bid topic, one needs
to calculate the `startTimestamp` of the next auction. This depends on the auction
offset, `BID_PHASE_LENGTH_SECONDS` and the current time.

For example, dApp with ID `13` has an auction offset of `17`. With
`AUCTION_LENGTH_SECONDS=30` and `BID_PHASE_LENGTH_SECONDS=25` this gives the
following sequence of auctions:

| `startTimestamp` | `signedDataTimestampCutoff` | End of award phase |
| ---------------- | --------------------------- | ------------------ |
| 17               | 42                          | 47                 |
| 47               | 72                          | 77                 |
| 77               | 102                         | 107                |

and so on...

:::

### Bid details

The bid details follow this convention:

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

### Award details

The award details contain a signature that the auction winner uses to pay the
OEV bid, which allows them to update the price feeds.

### Fulfillment details

The fulfillment details are a single `bytes32` value that represents the
transaction hash on the target chain in which the auction winner paid for the
OEV bid.

## Bid eligibility

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
   bid was placed before the withdrawal - if there is a withdrawal initiated,
   all bidder's bids are ignored.

Auctioneer fetches the required information from the OevAuctionHouse contract.
In a rare case when Auctioneer fails to fetch eligibility for a bidder, it will
abort awarding the current auction.

::: info ⚠️ Warning

If a bidder places multiple bids across different dApps in quick succession,
with only enough collateral to cover a subset of the bids, then Auctioneer may
attempt to award a bid when the bidder does not have enough collateral.

Let's say we have:

- two dApps (D1 and D2) whose award phases start one second from each other
- a bidder with only enough collateral to cover one bid for either dApp

If the bidder places 2 winning bids (B1 and B2), one for each dApp, Auctioneer
can end up executing this sequence:

- run auction for dApp D1 and fetch the bidder's current collateral
- run auction for dApp D2 and fetch the bidder's current collateral
- award bid B1 for dApp D1
- award bid B2 for dApp D2, but the transaction fails because the bidder no
  longer has enough collateral after bid B1 was awarded

In this scenario, Auctioneer will not try to award another bidder, as the
awarded signature will already have been exposed in the reverting award
transaction.

:::

## Auction resolution

Each auction is split into two phases:

1. Bid phase - During this phase, searchers are free to submit their bids.
   This phase takes `BID_PHASE_LENGTH_SECONDS`.
2. Award phase - During this phase, Auctioneer determines and awards the winner.
   Bids placed during this period are ignored.

As soon as the bid phase is over, Auctioneer attempts to resolve the auction
as soon as possible. The following happens under the hood:

1. Compute the bid topic for the current auction
2. Fetch the current block on the OEV Network
3. Fetch the bids for the bid topic from the last `PLACED_BIDS_BLOCK_RANGE`
4. Discard all ineligible bids
5. Select the bidder with the highest bid amount. In case there are multiple
   eligible bids with the same amount, the bidder with the earliest bid is
   selected
6. Prepare and submit the award for the auction winner on the OEV Network

Under rare circumstances, when Auctioneer is unable to fetch the block or the
logs from the OEV Network, the auction will be aborted and no winner is chosen.
Similarly, if the auction award transaction fails, there will be no retry,
because the award signature was already exposed publicly.

### Bid guarantees

Auctioneer guarantees that any bid placed during the bid phase will be
processed. The timestamp of the placed bid is determined by the block timestamp
in which the transaction is included. Searchers need to be mindful of that and
consider practical limitations like the OEV Network block time and make sure their bids are placed in time.

::: info ⚠️ Warning

Auctioneer may also include bids placed before or slightly after the
bid phase. This is because Auctioneer fetches the logs from the OEV Network
some time in the award phase. It fetches logs from a sufficient block range with
some buffer to ensure the full bid phase is included. This behavior might
change in time and searchers should not rely on it.

:::

## Processing fulfillments

After the auction winner is awarded, they are expected to fulfill their duties
by paying for the awarded OEV bid. After they've made the transaction on the
target chain, they are expected to report the fulfillment back to the OEV
Network to get their collateral released. Auction winners are advised to wait a
sufficient time for the transaction to reach enough finality on the target
chain.

Auctioneer periodically queries the OEV Network logs for such events and performs the following operations:

1. Fetch all logs regarding fulfillments for a sufficient time period -
   AwardedBid, ReportedFulfillment, ConfirmedFulfillment and
   ContradictedFulfillment.

<!-- NOTE: Being intentionally vague here, because it's not important to mention what block/time range we're fetching exactly.-->

2. Contradict all AwardedBid events that are `REPORT_FULFILLMENT_PERIOD_SECONDS`
   old without a matching reported fulfillment. Make no action for other
   AwardedBid events that are within the fulfillment period.

3. For all ReportedFulfillment events without a matching ConfirmedFulfillment or
   ContradictedFulfillment, fetch the PlacedBid event to determine which chain
   the bid was for.

4. Verify that the reported fulfillment is valid. It must be paid through the
   correct contract, with the correct amount and on the correct target chain.

In case there is a failure during any of the steps above, the Auctioneer tries
to process the fulfillment later. Its utmost priority is to avoid slashing
honest searchers. That said, once the Auctioneer disproves the fulfillment, it
will promptly slash.

::: info ℹ️ Info

Note that the auction winner may choose not to update the price feed when they
pay for the awarded bid. This is an allowed way to withhold the updates because
the auction winner is losing money by being slashed, making it financially
infeasible. As a note, the data feed security remains unchanged because it will
be eventually updated by an Api3 push oracle when the deviation exceeds its
threshold.

:::

## Auctioneer addresses

OEV Auctioneers use dedicated wallets to award auctions and process
fulfillments. These addresses are granted the respective privileges on the
OevAuctionHouse contract on the OEV Network and Api3ServerV1OevExtension
contract on all target chains.

Internally, Api3 DAO uses multiple wallets for resolving auctions and processing
fulfillments. The table below displays the addresses of currently whitelisted
Auctioneer wallets.

| Address                                    | Description           |
| ------------------------------------------ | --------------------- |
| 0x0350178E8E8731415287E6DbE1f0746A46510868 | Auction resolver      |
| 0xfaf0490A34036a3FE2b740545D67b81b8d3ADfB8 | Fulfillment processor |

## Maintenance

Auctioneer is maintained by the Api3 DAO, which is responsible for its uptime
and reliable auction processing. In case of a planned migration or maintenance,
there will be an announcement shared in advance. It's expected that maintenance
periods will be very rare and short.

::: info 💡 Tip

In fact, ever since we launched OEV Network, there was not a single period of time that resulted in a downtime.

:::
