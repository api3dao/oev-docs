---
title: Integrating existing MEV bots with OEV auctions
sidebarHeader: Reference
sidebarSubHeader: OEV
pageHeader: Reference → OEV -> Searchers
path: /reference/oev/searchers/index.html
outline: deep
tags:
---

<PageHeader/>

<SearchHighlight/>

# {{$frontmatter.title}}

When integrating OEV auctions into your existing MEV bots, it is important to
ensure the continued functionality of your old bots as a backup or fallback.
This section discusses how to integrate OEV data feeds while maintaining the
ability to execute opportunities such as liquidations or arbitrage using your
old searcher bots.

## Running Existing Bots as Backup

Continue running your old MEV bots in parallel with the OEV Relay integration.
In case the OEV Relay experiences downtime, your old searcher bots will still be
able to execute opportunities as it did before integrating OEV data feeds.

## Adapting to OEV Auction Integration

Integrating OEV auctions may require a different approach compared to the
current MEV architecture. The OEV integration expects searchers to be aware of
off-chain prices that trigger MEV opportunities and the value these prices
create on-chain, rather than reacting to oracle updates in the mempool and
simulating MEV opportunities based on the current blockchain state.

### Simulating MEV Opportunities with OEV Auctions

To integrate OEV auctions in a similar way to reacting to mempool oracle
updates, you can use an API like Coingecko as a substitute for the mempool and
simulate current prices against the blockchain state. Follow these steps:

1. Simulate a valid MEV opportunity using the latest Coingecko price.
2. Place bids with the OEV relay, expecting that the off-chain price will be
   similar.
3. Continuously simulate for the presence of opportunities while your bid is
   open, so you can cancel it if the opportunity disappears.

This approach allows you to maintain the ability to react to MEV opportunities
while integrating OEV auctions into your existing MEV bots.
