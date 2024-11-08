---
title: Overview
pageHeader: OEV Searchers
outline: deep
---

<PageHeader/>

# Overview

Oracle Extractable Value (OEV) is a subset of Maximal Extractable Value (MEV)
that occurs as a result of an oracle update. Traditional oracle solutions update
data feeds blindly, exposing dApps to significant value loss and providing
suboptimal data feed resolution. For searchers, these updates start latency wars
over who captures the MEV first.

OEV updates are an addition to these push oracle updates that improve the
efficiency of price feeds. The idea is that not all oracle updates are the same.
Some oracle updates expose opportunities in the market that can be captured by
searchers. Searchers monitor the market for profitable opportunities and compete
with each other to realize them first - paying the majority of the exposed value
to block validators in the process. This dynamic is unhealthy, because the
majority of the value should be split between the dApp and the searcher that
realizes the opportunity.

OEV solves this problem by auctioning off the exclusive rights to execute the
oracle update(s), allowing searchers to atomically update the price feed(s) used
by the dApps and capture opportunities in the market. The exclusive update
rights guarantee no competition and searchers avoid paying premiums on gas fees.
Additionally, the auction proceeds are distributed back to the dApp that created
this opportunity, thus generating a completely new revenue stream.

With OEV, searchers announce their intent to perform oracle updates along with
the amount they are willing to pay. The process is facilitated by open auctions,
bound by rules enforced on-chain. The auction winner must pay the announced
amount, which in return allows them to use the oracle update and capture
profitable opportunities.

## Example

Imagine an overcollateralized lending platform that uses API3 price feeds.
Borrowers in the protocol can be liquidated with an incentive whenever their
position becomes unhealthy to ensure the protocol remains solvent. Say
liquidations can occur if the loan-to-value ratio exceeds 90%. Let's look at
what happens with the protocol's health over time.

Assume that initially there are no unhealthy positions. Many of the price feed
updates that happen are "unnecessary" because they don't expose any unhealthy
positions and the protocol remains healthy. However, over time there may be a
price drop that causes many positions using that asset as collateral to approach
the 90% liquidation threshold.

In this scenario, the next price update that causes a position to become
unhealthy has intrinsic value. From the protocol's perspective, this affects its
solvency and presents a threat. For a searcher, however, this presents a
profitable opportunity. The intrinsic value of the price update equals the
profit the searcher can make. The profit is simply the liquidation incentive
minus the operational gas costs.

A searcher monitors the dApp and sees that a position will become unhealthy
using the oracle data. They announce that they want to purchase exclusive
priority for updating the price feeds and pay X in return. They win the auction,
pay X to the dApp, and execute the price feed updates and liquidation
atomically.

The concept of OEV is not limited to liquidations but can occur anywhere where
price feed updates potentially expose profitable opportunities, such as
arbitrage and many others.

## OEV Proceeds Distribution

To update the data feed, the auction winner must pay the bid amount they
announced during the auction. In return, they get exclusive rights to capture
the OEV. Searchers are compensated for this activity through the remaining OEV
proceeds. Thus, the majority of the OEV is distributed to the dApp and the
searchers.

## How do Auctions Work?

API3 has developed a specialized on-chain Order Flow Auction (OFA) similar to
the one you might be familiar with from Flashbots and MEV-Boost.

We use a combination of the [OEV Network](#oev-network) and the
[OEV Auctioneer](#oev-auctioneer) to power the OEV auctions in a secure and
transparent way.

At a high level, auctions repeat continuously and indefinitely. There is a
separate auction for each dApp. Each auction takes a fixed amount of time.
Searchers place bids during the auction and announce a bid amount they're
willing to pay. When the auction ends, the highest eligible bidder is declared
the winner and provided a cryptographic signature. The signature gives them
exclusive rights to update any price feed(s) for the dApp for a limited period
of time. Each time an auction ends, a new one begins and the same process
repeats.

After an auction winner fulfills their duties by paying for the winning bid,
they need to report this back to the OEV network. If they fail to do so, part of
their collateral is slashed. This is an important security measure to prevent
denial of OEV recapture through withheld auction payments.

### OEV Network

The OEV Network hosts auctions transparently, ensuring that any disputes can be
resolved by analyzing the on-chain data. Searchers submit their bids on-chain,
where the winner is announced and given exclusive rights to execute the oracle
update.

### OEV Auctioneer

A key component of OEV is an off-chain auction system that processes the
auctions taking place on the OEV network. We call this system OEV Auctioneer,
and it is managed by the API3 DAO. The integrity of OEV Auctioneer is ensured by
using the OEV Network for all important actions, such as announcing the auction
winner.

## Auction Cycle

In this section, we're going to walk through the entire auction cycle at a high
level, explaining the steps involved in the auction process. This section aims
to provide a basic mental model for searchers before reading the in-depth
[Searchers documentation](/oev-searchers/in-depth/).

### Start of the Bidding Phase

Auctions run in two phases - the bidding phase and the award phase. During the
bidding phase, searchers can look for OEV opportunities for the particular dApp
by monitoring the off-chain data. When an opportunity is detected, they can
place their bid.

### Find an OEV Opportunity

Searchers compare data from off-chain Signed APIs to the on-chain values of
dAPIs. This process often involves taking the off-chain data, simulating the
dAPI updates, and inspecting the state changes of the dApp.

### Bid Submission

The searcher submits a bid via the OevAuctionHouse contract on the OEV Network.
The auction is dApp-specific. For their bid to be eligible, they need to have
enough collateral locked in the OevAuctionHouse contract at the time of award.

### Start of the Award Phase

The award phase starts immediately after the end of the bidding phase.
Auctioneer determines the auction winner and awards them a signature providing
them with exclusive update rights.

Performance is critical here because the longer it takes to award the bid, the
less time the auction winner has to capture the OEV before the data becomes
public. Both bidding phase and award phase periods are chosen with this in mind,
allowing both Auctioneer and the auction winner sufficient time.

### Finding the Winning Bid

If there are multiple eligible bids, Auctioneer selects the one with the highest
bid amount.

### Awarding the Winning Bid

After the winning bid is determined, Auctioneer creates a cryptographic
signature and submits it on the OEV Network. The signature is to be used on the
target chain while capturing the OEV opportunity by the auction winner. This
signature is only usable by the auction winner.

### Polling for Awarded Bid

Searchers should monitor the OEV Network for the winning bid transaction to make
use of the award as soon as possible.

### Capturing the OEV Opportunity

The auction winner uses the award signature to pay for the OEV bid on the target
chain and pays the bid amount announced in the bid submission. In return, they
are allowed to perform data feed updates.

Finally, after updating the data feed values, the searcher is able to capture
the OEV opportunity. It is assumed that the searcher performs all of these steps
atomically in a single transaction.

### Reporting Fulfillment

After paying for the OEV bid, the searcher needs to report the fulfillment back
to the OEV network. They do so by submitting the transaction hash in which
they've paid for the winning bid.

The searcher is given a sufficiently long period to report the fulfillment. It's
advised to submit the fulfillment only once the transaction on the target chain
has reached sufficient finality.

### Fulfillment Verification

Once the fulfillment is submitted, Auctioneer verifies it, and there are two
possible outcomes:

1. The fulfillment is confirmed - The collateral for this bid is released and
   the protocol fee is charged.
2. The fulfillment is contradicted - The full collateral for this bid is
   slashed.

## Get Involved with OEV

Here are resources to help you get started with OEV:

1. Dive deeper into OEV by reading the
   [OEV Litepaper](https://raw.githubusercontent.com/api3dao/oev-litepaper/main/oev-litepaper.pdf).
2. Check out our detailed [Searchers guide](/oev-searchers/in-depth/) to see how
   to start searching.
3. Connect with other developers and OEV enthusiasts in our
   [OEV Discord channel](https://discord.com/channels/758003776174030948/1062909222347603989).
4. Follow API3 on [Twitter](https://twitter.com/API3DAO) for the latest news and
   updates on OEV.
