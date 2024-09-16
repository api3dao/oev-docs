---
title: Searchers
pageHeader: OEV → Searchers
outline: deep
---

<PageHeader/>

## Searcher Prerequisites

Before, we dive into the auction cycle, let's quickly recap the searcher's
prerequisites to participate in the auctions. Most of this complexity is
inherent to the MEV, such as monitoring the dApp for interesting positions.
However, OEV adds a few more steps to the process.

### Bridge funds to the OEV Network

To be able to send transactions on the OEV Network, the wallet must possess ETH
on the OEV Network. See
[Bridging ETH](/oev/overview/oev-network.html#bridging-eth) for more details.

### Deposit collateral to the OevAuctionHouse

For a searcher's bid to be eligible to win an auction, the bidder needs to have
enough collateral at the award time in the OevAuctionHouse contract. See
[Collateral and Protocol Fee](/oev/searchers/collateral-protocol-fee.html) for
more details.

### Periodically query the Signed APIs

TODO:

### Identify profitable opportunities

TODO:

### Place a bid to the OevAuctionHouse

TODO:
