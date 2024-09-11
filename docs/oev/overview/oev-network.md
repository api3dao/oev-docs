---
title: OEV Network
pageHeader: OEV → Overview
outline: deep
---

<PageHeader/>

# OEV Network

![OEV Network image](/oev/overview/assets/oev-network.png)

The OEV Network is an open marketplace designed to facilitate the distribution
of oracle updates. Operating as an Arbitrum Nitro L2 optimistic-rollup, the
system ensures transparency and allows verification of auction process. In this
marketplace, OEV searchers place bids for the exclusive opportunity to update a
dAPIs for a short period of time.

By hosting the auctions on the on-chain, we address two of big issues:

1. Scalability - The OEV network hosts auctions across different dApps across
   multiple chains. The system needs to scale up with demand, especially during
   the times of volatile markets where the activity is the highest. This is a
   long-solved problem in blockchain through the gas fee.
2. Transparency - Auctions are awarded via OEV Auctioneer off-chain, so it's
   important to be able to reason about the correctness of auction outcomes.
   Blockchains are the perfect tool for this, as all the data is public and
   verifiable.

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

The contract is designed to work together with an off-chain component that can
enforce a particular data encodings. This allows for great flexibility and
easier migration process in case of an upgrade.

This contract is the key component that powers OEV auctions. These include the
following:

1. Deposit and withdraw collateral
2. Place or expedite bid
3. Award winning bid
4. Confirm or contract fulfillment
5. Update protocol and collateral fee
6. Update the price feed proxies

Refer to the [Auction Cycle](/oev/overview/auction-cycle) and
[OEV Auctioneer](/oev/overview/oev-auctioneer) for details.

The support OEV auctions in the least privileged way, the contract defines a few
special roles allowe to interact with the contract in an authorized way. These
roles are:

1. Proxy setter - This role allows the caller to change the dAPI proxy used for
   collateral and protocol fee conversion to the native OEV network currency.
2. Auctioneer - This role allows the caller to award winning bid, and confirm or
   contradict fulfillments.
3. Withdrawer - This role allows the caller to withdraw the protocol fee and
   slashed amount collected by the contract.
