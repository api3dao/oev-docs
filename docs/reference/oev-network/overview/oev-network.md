---
title: OEV Network
sidebarHeader: Reference
sidebarSubHeader: OEV Network
pageHeader: Reference → OEV Network
path: /reference/oev-network/overview/oev-network.html
outline: deep
tags:
---

<PageHeader/>

<SearchHighlight/>

<FlexStartTag/>

# {{$frontmatter.title}}

OEV Network is an open marketplace that facilitates the distribution of oracle
updates. This system operates on an optimistic-rollup, ensuring transparency and
verification of transactions. In this setup, OEV searchers place bids to gain
the first opportunity to update a specific dAPI within a short window of time.
This is because the timing of such an update could allow them to extract value,
particularly if the dAPI’s data indicates a price that could lead to a
profitable action before the next scheduled update.

Auctions conducted via the OEV Network aim to ensure that the value extracted by
searchers is shared with the dApps responsible for generating this opportunity,
instead of being monopolized by the validators through competitive bidding.

An auction on the OEV Network indicates two things: a dAPI's data suggests a
potential valuable action (like a liquidation in a lending dApp) that has not
yet been reflected on-chain, and an update (either scheduled or triggered by
significant price deviations) has not yet occurred. By allowing updates through
this auction system, the OEV Network enhances the accuracy and responsiveness of
dAPIs, ensuring that updates are made when they are most needed.

Winners of OEV auctions are required to include their payment within the
transaction that updates the data feed, ensuring immediate value return to the
dApp, the data providers, and the creators of the dAPIs and the OEV Network
itself, API3. This approach not only improves the efficiency of oracle
operations but also distributes the extracted value more equitably among the
participants.
