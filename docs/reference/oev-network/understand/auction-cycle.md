---
title: Auction Cycle
sidebarHeader: Reference
sidebarSubHeader: OEV Network
pageHeader: Reference → OEV Network → Auction Cycle
path: /reference/oev-network/understand/auction-cycle.html
outline: deep
tags:
---

<PageHeader/>

<SearchHighlight/>

<FlexStartTag/>

# {{$frontmatter.title}}

The OEV Network uses an on-chain auction mechanism to facilitate the
distribution of conditional oracle updates. The condition embedded in the oracle
update is the value that the searcher is willing to pay to for the update to the
beneficiary of the dAPI proxy.

To fully understand the auction mechanism let's break down the auction cycle
using the following sequence diagram:

![Auction Cycle](/reference/oev-network/understand/assets/oev-auction-sequence.png)

The auction cycle consists of the following steps:

1. <b>Identifying profitable oracle updates</b>

Identifying the conditions for an oracle update that would be valuable to the
searcher eg. a liquidation event if the price of ETH falls below 2000.

2. <b> Bridging to the OEV Network</b>

In order to be first in line to trigger the liquidation event, the searcher
would bridge collateral across to the OEV Network and deposit it into the
OevAuctionHouse contract. Collateral is needed to be able to participate in the
auction.

3. <b>Submitting a bid</b>

The searcher would then submit a bid to the OevAuctionHouse contract with the
specified conditions to receive the price update i.e if the price of ETH <= 2000
, get the price update.

While submitting the bid, the searcher would also have to lock up collateral.
The collateral locked for this bid would be a percentage of the bid amount.
(less than 10% of the bid amount)

4. <b>Auction trigger</b>

Off-chain airnodes are streaming dAPI values to the auctioneer. Whenever there
is a change in the dAPI value, the auctioneer would check if the new dAPI value
satisfies the conditions of any of the bids on the OevAuctionHouse contract.

5. <b>Selecting the winning bid</b>

If the condition is satisfied, the auctioneer then groups all the bids that have
been satisfied and sorts them based on the bid amount to determine the winning
bid.

6. <b> Awarding the winning bid</b>

The winning bid is sent to the airnodes to be signed and the signatures are
returned back to the auctioneer.

The auctioneer then awards the winning bid on the OevAuctionHouse contract with
the encoded transaction which contains the signatures and conditional update.
The collateral locked for the winning bid is then deducted from the searcher's
balance.

7. <b>Triggering the oracle update</b>

The searcher can then use the encoded transaction to trigger the oracle update
on the dAPI proxy and trigger the liquidation event. The searcher can only do
the price update if they transfer the bid amount to the beneficiary of the dAPI
proxy.

8. <b> New auction cycle</b>

if a bid was just awarded for a dAPI proxy, no auctions take place for the next
15 seconds <b>for that dAPI proxy</b>, this ensures that the winning bid has
enough time to trigger the oracle update. After 15 seconds, the auction cycle
starts again.
