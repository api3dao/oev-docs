---
title: Auctions
pageHeader: OEV Searchers → In Depth
outline: deep
---

<PageHeader/>

# Auctions

The key component of OEV are permissionless auctions, taking place on [OEV Network](/oev-searchers/in-depth/oev-network/). These auctions are open for everyone, repeat continuosly and indefinitely. Each dApp has it's own auctions and the auction winner is able to update data feeds only for the dApp for which the auction was held.

<!-- NOTE: Source = https://excalidraw.com/#json=VHSz5AhV0HA88hUvabVJv,AhhEkjO7HE_4MOqbkrBGsw -->
<img src="./auctions-overview.svg" />

In this section, we're going to walk through the entire auction process to provide a mental model for searchers before continuing with the next sections.

## Bid phase

Auctions run in two phases - the bid phase and the award phase. During the
bid phase, searchers look for OEV opportunities for the particular dApp
by monitoring the off-chain data. When an opportunity is detected, they
place their bid based on its value.

It is important to understand that bids must be placed before the end of the bid phase, which establishes a cutoff period. The auction winner is able to use only price feed data with timestamp up to this cutoff period.

## Award Phase

The award phase starts immediately after the end of the bid phase. All bids placed during the bid phase are evaluated and the eligible bid with highest amount is selected as winner and provided a cryptographic signature allowing them to make the price feed updates up to the cutoff period. This signature is usable only by the auction winner. A requirement for updating the price feed is paying the announced bid amount in the same transaction.

## Fulfillment

Auction winner is required to make use of the auction data and pay for the winning bid to fulfill the purpose of the auction. After paying for the auction, they are required to report the fulfillment to the auction platform with the transaction hash of the update.

The fulfillment is verified and provided the update was correct, the auction winner's collateral is released. If the fulfillment is not reported or incorrect information is submitted, the collateral is slashed.
