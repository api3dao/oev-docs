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
system ensures transparency and allows verification of the auction process. In
this marketplace, OEV searchers place bids for the exclusive opportunity to
update a dAPIs for a short period of time.

By hosting auctions on on-chain, we address two big issues:

1. Scalability - The OEV network hosts auctions across different dApps across
   multiple chains. The system needs to scale up with demand, especially during
   periods of market volatility where the activity is the highest. This is a
   long-solved problem in blockchains through the gas fees.
2. Transparency - Auctions are awarded via an off-chain system, called OEV
   Auctioneer, so it's important to be able to reason about the correctness of
   auction outcomes. Blockchains are the perfect tool for this, as all the data
   is public and verifiable.

To participate in auctions, you need to have a sufficient amount of ETH bridged
to the OEV network and interact with the [OevAuctionHouse](#oevauctionhouse)
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

## Properties

Here are some of the key properties of the OEV Network:

1. Block time - Under high load, the block time of the network can be as fast as
   250ms. Note that the OEV Network only produces blocks when there are
   transactions.
2. Gas fees - The gas fees are paid in ETH, and because the network is an
   optimistic L2 rollup the gas fees are low.
3. Using Anytrust - By using AnyTrust DAC, the OEV Network achieves further cost
   decrease.

See [Arbitrum Nitro details](https://docs.caldera.xyz/about/nitro#benefits) and
[AnyTrust details](https://docs.caldera.xyz/about/nitro#anytrust) for more
information.

## Bridging ETH

Use the [OEV Network Bridge](https://oev.bridge.api3.org/) to bridge your ETH to
the OEV Network. Bridging is only possible from ETH mainnet.

![OEV Network Bridge](/oev/overview/assets/oev-bridge.png)

Clicking on `Transfer Tokens` will automatically add the OEV Network to your
Metamask wallet. To bridge, confirm the transaction in your wallet and wait for
confirmation. After the transaction is confirmed, you should see your ETH on the
OEV Network.

## Contracts

These are the relevant contracts deployed on the OEV Network:

| Contract name   | Address                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Api3ServerV1    | [0x709944a48cAf83535e43471680fDA4905FB3920a](https://oev.explorer.api3.org/address/0x709944a48cAf83535e43471680fDA4905FB3920a) |
| OevAuctionHouse | [0x34f13A5C0AD750d212267bcBc230c87AEFD35CC5](https://oev.explorer.api3.org/address/0x34f13A5C0AD750d212267bcBc230c87AEFD35CC5) |

### Api3ServerV1

The implementation of the audited Api3ServerV1 contract is publicly available
[here](https://github.com/api3dao/contracts/blob/main/contracts/api3-server-v1/Api3ServerV1.sol).

The Api3ServerV1 contract powers dAPIs on the OEV Network, which are used in
OevAuctionHouse to compute collateral and protocol fees from the bid amounts. N
that this chain is not listed on the API3 market, because the OEV Network is
primarily intended to be used for the OEV auctions.

### OevAuctionHouse

The implementation of the audited OevAuctionHouse contract is publicly available
[here](https://github.com/api3dao/contracts/blob/main/contracts/api3-server-v1/OevAuctionHouse.sol).

Winners of OEV auctions must submit their payment before updating the data feed
and capturing OEV. In practice, searchers are expected to do these steps
atomically, ensuring immediate value return to the dApp.

After making the payment, the winner needs to post a proof of doing so (the
transaction hash) to the OEV Network. This proof is then validated and the
reserved collateral of the searcher is released, while the
[protocol fee](/oev/searchers/oev-searching.md#collateral-and-protocol-fee) is
deducted.

The contract is designed to work together with an off-chain component that can
enforce particular data encodings. This allows for great flexibility and an
easier migration process in case of an upgrade.

This contract is the key component that powers OEV auctions. This includes the
following:

1. Deposit and withdraw collateral
2. Place or expedite bid
3. Award winning bid
4. Confirm or contract fulfillment
5. Update protocol and collateral fee
6. Update the price feed proxies

Refer to the [Auction Cycle](/oev/overview/auction-cycle) and
[OEV Auctioneer](/oev/overview/oev-auctioneer) for details.

To support OEV auctions in the least privileged way, the contract defines a few
special roles allowed to interact with the contract in an authorized way. These
roles are:

1. Proxy setter - This role allows the caller to change the dAPI proxy used for
   collateral and protocol fee conversion to the native OEV network currency.
2. Auctioneer - This role allows the caller to award winning bid, and confirm or
   contradict fulfillments.
3. Withdrawer - This role allows the caller to withdraw the protocol fee and
   slashed amount collected by the contract.

For tech savvy users, it's recommended to take a look at the contract's source.
The logic of the OevAuctionHouse contract is especially important for searchers,
for which we have a dedicated section [OEV Searching](/oev/searchers/index.md).
