---
title: Overview
pageHeader: Auction cycle
outline: deep
---

<PageHeader/>

# Auction cycle

In this section, we're going to walk through the entire auction cycle at a high
level, explaining the steps involved in the auction process. This section aims
to provide a basic mental model for searchers before reading the in-depth
[Getting started](/oev-searchers/in-depth/).

## Start of the bid phase

Auctions run in two phases - the bid phase and the award phase. During the
bid phase, searchers can look for OEV opportunities for the particular dApp
by monitoring the off-chain data. When an opportunity is detected, they can
place their bid.

<!-- TODO: Reword this section, the blow should be "finding" -->

## Find an OEV opportunity

Searchers compare data from off-chain Signed APIs to the on-chain values of
dAPIs. This process often involves taking the off-chain data, simulating the
dAPI updates, and inspecting the state changes of the dApp.

## Bid submission

The searcher submits a bid via the OevAuctionHouse contract on the OEV Network.
The auction is dApp-specific. For their bid to be eligible, they need to have
enough collateral locked in the OevAuctionHouse contract at the time of award.

## Start of the award Phase

The award phase starts immediately after the end of the bid phase.
Auctioneer determines the auction winner and awards them a signature providing
them with exclusive update rights.

Performance is critical here because the longer it takes to award the bid, the
less time the auction winner has to capture the OEV before the data becomes
public. Both bid phase and award phase periods are chosen with this in mind,
allowing both Auctioneer and the auction winner sufficient time.

## Finding the winning Bid

If there are multiple eligible bids, Auctioneer selects the one with the highest
bid amount.

## Awarding the winning Bid

After the winning bid is determined, Auctioneer creates a cryptographic
signature and submits it on the OEV Network. The signature is to be used on the
target chain while capturing the OEV opportunity by the auction winner. This
signature is only usable by the auction winner.

## Polling for awarded Bid

Searchers should monitor the OEV Network for the winning bid transaction to make
use of the award as soon as possible.

## Capturing the OEV opportunity

The auction winner uses the award signature to pay for the OEV bid on the target
chain and pays the bid amount announced in the bid submission. In return, they
are allowed to perform data feed updates.

Finally, after updating the data feed values, the searcher is able to capture
the OEV opportunity. It is assumed that the searcher performs all of these steps
atomically in a single transaction.

## Reporting fulfillment

After paying for the OEV bid, the searcher needs to report the fulfillment back
to the OEV network. They do so by submitting the transaction hash in which
they've paid for the winning bid.

The searcher is given a sufficiently long period to report the fulfillment. It's
advised to submit the fulfillment only once the transaction on the target chain
has reached sufficient finality.

## Fulfillment verification

Once the fulfillment is submitted, Auctioneer verifies it, and there are two
possible outcomes:

1. The fulfillment is confirmed - The collateral for this bid is released and
   the protocol fee is charged.
2. The fulfillment is contradicted - The full collateral for this bid is
   slashed.
