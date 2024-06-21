---
title: Auctioneer Reference
sidebarHeader: Reference
sidebarSubHeader: OEV Network
pageHeader: Reference → OEV Network → Searchers → Auctioneer Reference
path: /reference/oev-network/searchers/auctioneer-reference.html
outline: deep
tags:
---

<PageHeader/>

<SearchHighlight/>

<FlexStartTag/>

# {{$frontmatter.title}}

The Auctioneer has several configuration parameters that determine the behavior
of the auction. Some of the key parameters are:

| Parameter                                         | Value    | Description                                                                                                |
| ------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| REFRESH_LOGS_LOOP_INTERVAL_MS                     | 1000     | How frequently the auctioneer fetches logs from the OEV Network                                            |
| exclusiveAuctionSeconds                           | 60       | Time period during which no other auctions can take place for a proxy                                      |
| COLLATERAL_REQUIREMENT_BUFFER                     | 5%       | Extra collateral percentage that searchers need to have in order for the Auctioneer to award a bid to them |
| FETCH_SIGNED_DATA_INTERVAL_MS                     | 2000     | Defines the frequency of the signed data fetching and auctions loop.                                       |
| AUCTION_CREATOR_REQUIRED_LOGS_TIME_WINDOW_SECONDS | 24*60*60 | Defines the time period of the logs which are considered by the Auctioneer for fetching eligible bids      |
| AUCTION_COP_REQUIRED_LOGS_TIME_WINDOW_SECONDS     | 48*60*60 | Defines the time period of the logs which are considered by the Auctioneer for fulfillments                |
