---
title: Auction Cycle
sidebarHeader: Reference
sidebarSubHeader: OEV Network
pageHeader: Reference → OEV Network → Auction Cycle
path: /reference/oev-network/overview/auction-cycle.html
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

![Auction Cycle](/reference/oev-network/overview/assets/oev-auction-sequence.png)

The auction cycle consists of the following steps:

1. <b>Identifying profitable oracle updates</b>

Identifying the conditions for an oracle update that would be valuable to the
searcher eg. a liquidation event if the price of ETH falls below 2000.

2. <b> Bridging to the OEV Network</b>

In order to be first in line to trigger the liquidation event, the searcher
would bridge ETH across to the OEV Network

3. <b> Deposit Collateral into OevAuctionHouse </b>

Once bridged the searcher needs to deposit into the OevAuctionHouse contract.
Collateral is needed to be able to participate in the auction. The amount of
Collateral that needs to be deposited is a percentage of the bid amount.

4. <b>Submitting a bid</b>

The searcher would then submit a bid to the OevAuctionHouse contract with the
specified conditions to receive the price update i.e if the price of ETH
<= 2000. In order to be eligible to submit a bid, the searcher must have
sufficient ETH deposited in the OevAuctionHouse contract, the amount of ETH
required is a percentage of the bid amount.

Note: The collateral doesn't get locked until the bid is awarded.

5. <b>Start of a new Auction Round</b>

An auction rounds starts when the auctioneer receives a dAPI value update from
Airnodes. (eg: ETH/USD = 2000).

:::info Auction Rounds

Off-chain airnodes are streaming dAPI values to the auctioneer. Whenever there
is a change in the dAPI value, the auctioneer would check if the new dAPI value
satisfies the conditions of any of the bids on the OevAuctionHouse contract. If
no bids are satisfied, the auctioneer waits for the next dAPI value. If a bid
has just won an auction, the auctioneer waits for 60 seconds before starting the
next auction cycle for that dAPI proxy.

:::

6. <b>Check for bid conditions </b>

The auctioneer queries the OevAuctionHouse contract to check if any of the bids
are satisfied by the new dAPI.

7. <b>Finding the winning bid</b>

If there are multiple bids that are satisfied, the auctioneer finds the winning
bid by selecting the bid with the highest locked collateral. More details on how
the auctioneer selects the winning bid can be found in the
[Understanding Auctioneer](/reference/oev-network/searchers/understanding-auctioneer.html#parallel-auctions)
page.

8. <b> Sign the winning bid</b>

The winning bid is sent to the airnodes to be encoded into the oracle update
transaction. Once encoded, the transaction is also signed by the private key of
the airnodes for on-chain signature verification of the oracle update.

9. <b> Fetch the encoded transaction from the airnodes</b>

The auctioneer fetches the encoded transaction and signatures from the airnodes

10. <b> Award the winning bid</b>

The auctioneer publishes the winning bid along with the encoded transaction and
signatures to the OevAuctionHouse contract.

11. <b> Locking the collateral</b>

The collateral of the winning bid is locked in the OevAuctionHouse contract in
the same transaction that the winning bid is awarded.

12. <b> Fetch the awarded bid transaction</b>

The searcher fetches the awarded bid transaction from the OEV Network. This
transaction contains the encoded transaction and signatures that the searcher
can use to trigger the oracle update. The searcher has 60 second window of
exclusivity to trigger the oracle update.

13. <b>Triggering the oracle update</b>

The searcher can then use the encoded transaction to trigger the oracle update
on the dAPI proxy and trigger the liquidation event. The searcher can only do
the price update if they transfer the bid amount to the beneficiary of the dAPI
proxy.

14. <b> Submit fulfillment txhash to OevAuctionHouse</b>

The searcher submits the fulfillment transaction hash to the OevAuctionHouse
contract to confirm that the oracle update has been triggered. The searcher has
a 24 hour window to submit the fulfillment transaction hash. In the event that
the searcher does not submit the fulfillment transaction hash, the collateral of
the winning bid is slashed.

15. <b> Release collateral and charge protocol fee</b>

Once the fulfillment transaction hash is submitted, the collateral of the
winning bid is released and the protocol fee is charged.