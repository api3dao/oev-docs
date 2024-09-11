---
title: OEV Network
pageHeader: OEV → Overview
outline: deep
---

<PageHeader/>

# OEV Network

![OEV Network image](/oev/overview/assets/oev-network.png)

The OEV Network is an open marketplace designed to facilitate the distribution
of oracle updates. Operating as an optimistic-rollup, the system ensures
transparency and allows verification of auction process. In this marketplace,
OEV searchers place bids for the exclusive opportunity to update a dAPIs for a
short period of time.

An auction on the OEV Network signals two things: a dAPI's data suggests a
potentially valuable action (such as a liquidation in a lending dApp) that has
not yet been reflected on-chain, and an update has not yet occurred. By
facilitating updates through this auction system, the OEV Network enhances the
accuracy and responsiveness of dAPIs, ensuring that updates are made when most
needed.

To participate in auctions, you need to have sufficient amount of ETH bridged to
the OEV network and interact with the [OevAuctionHouse](#oevauctionhouse)
contract.

## Using the OEV Network

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

## Bridging ETH

Use the [OEV Network Bridge](https://oev.bridge.api3.org/) to bridge your ETH to
the OEV Network. Bridging is only possible from ETH mainnet.

![OEV Network Bridge](/oev/overview/assets/oev-bridge.png)

Clicking on `Transfer Tokens` will automatically add the OEV Network to your
Metamask wallet.

Confirm the transaction in your wallet. Wait for it to bridge and you will see
your ETH on OEV Network.

## OevAuctionHouse

The implementation of the audited OevAuctionHouse contract is publicly available
[here](https://github.com/api3dao/contracts/blob/main/contracts/api3-server-v1/OevAuctionHouse.sol).

Winners of OEV auctions must include their payment within the transaction that
updates the data feed, ensuring immediate value return to the dApp. After the
feed is updated, the winner needs to post a proof of doing so (the transaction
hash) to the OEV Network. This proof is then validated and the reserved
collateral of the searcher is released, while the
[protocol fee](/oev/searchers/collateral-protocol-fee) is deducted.

This contract is the key component that powers OEV auctions. These include the
following:

1. Deposit and withdraw collateral
2. Place or expedite bid
3. Award winning bid
4. Confirm or contract fulfillment
5. Update protocol and collateral fee
6. Update the price feed proxies

Refer to the [Auction Cycle](/oev/overview/auction-cycle) for details.

The support OEV auctions in the least privileged way, the contract defines a few
special roles allowe to interact with the contract in an authorized way. These
roles are:

1. Proxy setter - This role allows the caller to change the dAPI proxy used for
   collateral and protocol fee conversion to the native OEV network currency.
2. Auctioneer - This role allows the caller to award winning bid, and confirm or
   contradict fulfillments.
3. Withdrawer - This role allows the caller to withdraw the protocol fee and
   slashed amount collected by the contract.
