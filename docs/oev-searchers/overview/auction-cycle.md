---
title: Auction Cycle
pageHeader: OEV Searchers → Overview
outline: deep
---

<PageHeader/>

# Auction Cycle

In this section, we're going to walk through the whole auction cycle at a high
level, explaining the steps involved in the auction process. This sections aims
to provide a basic mental model for searchers before reading out in-depth
[Searchers' documentation](/oev-searchers/in-depth/).

Searchers need a funded account on OEV Network and deposit collateral on its
behalf inside OevAuctionHouse contract. They need to monitor the off-chain
[Signed APIs](/oev-searchers/in-depth/dapis/#public-signed-apis) and monitor the
dApp's state for profitable opportunities. For the purposes of this overview, we
assume there is a searcher that implemented all of the above and knows how to
capture the OEV once they've won an auction.

## Start of the Bidding Phase

Auctions run in two phases. The bidding phase and the award phase. During the
bidding phase, searchers can look for OEV opportunities for the particular dApp
and place their bids.

## Find an OEV Opportunity

Say a searcher identifies a possible OEV opportunity with the data from the
off-chain Signed APIs. The searcher wants to obtain exclusive rights to update
the data feed(s) with this data, before this data is opened to the public.

## Bid Submission

The searcher submits a bid via the OevAuctionHouse contract on the OEV Network.
The auction is identified solely by the bid topic. As part of the bid details,
the searcher specifies the bid amount they are willing to pay in order to obtain
the exclusive update rights. For their bid to be eligible, they need to have
enough collateral locked in the OevAuctionHouse contract at the time of award.

## Start of the Award Phase

The award phase starts immediately after the end of the bidding phase.
Auctioneer determines the auction winner and awards them a signature giving them
the exclusive rights.

Performance is critical here because the longer it takes to award the bid, the
less time the auction winner has to capture the OEV before the data becomes
public. Both bidding periods are chosen with this in mind, allowing both
Auctioneer and the auction winner enough time.

## Finding the Winning Bid

If there are multiple eligible bids, Auctioneer selects the one with the highest
bid amount. More details on how Auctioneer selects the winning bid can be found
in the
[Auction resolution](/oev-searchers/in-depth/oev-auctioneer#auction-resolution)
section.

## Awarding the Winning Bid

After the winning bid is determined, Auctioneer creates a cryptographic
signature and submits it in on the OEV Network. The signature is to be used on
the target chain when capturing the OEV opportunity by the auction winner. This
signature is only usable by the auction winner.

## Polling for Awarded Bid

Searchers should monitor the OEV Network for the winning bid transaction to make
use of the award as soon as possible.

## Capturing the OEV Opportunity

The searcher can use the winning signature to pay for the OEV bid on the target
chain by making a transaction. They need to pay the bid amount announced in the
bid submission. This payment will be forwarded to the dApp.

After they've made the payment, the contract allows them to perform the data
feed updates with exclusive rights. Note that API3 feeds guarantee very strong
properties via on-chain aggregation and timestamp checks so the searcher is
forced to use valid and up-to-date data.

Finally, the after updating the data feed values, the searcher is able to
capture the OEV opportunity. It is assumed that the searcher does all of these
steps atomically in a single transaction.

## Reporting Fulfillment

After paying for the OEV bid, the searcher needs to report the fulfillment back
to the OEV network. They do so by submitting the transaction hash in which
they've paid for the winning bid.

The searcher is given a sufficiently long period to report the fulfillment. It's
advised to submit the fulfillment only once the transaction on the target chain
has reached enough finality.

## Fulfillment Verification

Once the fulfillment is submitted, Auctioneer verifies it and there are two
possibilities on what can happen:

1. The fulfillment is confirmed - The collateral for this bid is released and
   the protocol fee is charged.
2. The fulfillment is contradicted - The full collateral for this bid is
   slashed.
