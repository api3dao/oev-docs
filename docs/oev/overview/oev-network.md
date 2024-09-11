---
title: OEV Network
pageHeader: OEV → Overview
outline: deep
---

<PageHeader/>

# OEV Network

TODO: Fix outdated content

![Auction Cycle](/oev/overview/assets/oev-network.png)

The OEV Network is an open marketplace designed to facilitate the distribution
of oracle updates. Operating on an optimistic-rollup, the system ensures
transparency and verification of transactions. In this marketplace, OEV
searchers place bids for the exclusive opportunity to update a specific dAPI
within a short window of time. This timing allows them to extract value,
especially if the dAPI’s data indicates a price that could lead to a profitable
action before the next scheduled update.

The auctions conducted on the OEV Network aim to ensure that the value extracted
by searchers is shared with the dApps responsible for creating these
opportunities, rather than being monopolized by validators through competitive
bidding.

An auction on the OEV Network signals two things: a dAPI's data suggests a
potentially valuable action (such as a liquidation in a lending dApp) that has
not yet been reflected on-chain, and an update (either scheduled or triggered by
significant price deviations) has not yet occurred. By facilitating updates
through this auction system, the OEV Network enhances the accuracy and
responsiveness of dAPIs, ensuring that updates are made when most needed.

Winners of OEV auctions must include their payment within the transaction that
updates the data feed, ensuring immediate value return to the dApp, the data
providers, and the creators of the dAPIs and the OEV Network itself, API3. This
approach not only improves the efficiency of oracle operations but also
distributes the extracted value more equitably among participants.

## Bridging to the OEV Network

OEV Network can be added as a custom network to an EVM compatible wallet.

| Details            | Value                          |
| ------------------ | ------------------------------ |
| Network            | OEV Network                    |
| Chain ID           | 4913                           |
| RPC URL (HTTP)     | https://oev.rpc.api3.org/http  |
| RPC URL (WS)       | https://oev.rpc.api3.org/ws    |
| Symbol             | ETH                            |
| Block Explorer URL | https://oev.explorer.api3.org/ |
| Bridge URL         | https://oev.bridge.api3.org/   |

### Using the Bridge

Use this link to bridge your ETH to the OEV Network
[OEV Network Bridge](https://oev.bridge.api3.org/)

Make sure you have some ETH in your wallet to use the Bridge.

![OEV Network Bridge](/oev/overview/assets/oev-bridge.png)

Clicking on `Transfer Tokens` will automatically add the OEV Network to your
Metamask wallet.

Confirm the transaction in your wallet. Wait for it to bridge and you will see
your ETH on OEV Network.
