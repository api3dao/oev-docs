---
title: Glossary
pageHeader: OEV Searchers
outline: deep
---

<PageHeader/>

# Glossary

Below are brief descriptions of commonly used terms within the documentation.

<!-- NOTE: We intentionally use triple hash to make the titles stand out a bit less. -->

### Airnode

[Airnode](https://github.com/api3dao/airnode) is a
[first-party oracle](#first-party-oracles) node designed to be operated by
[API providers](#api-provider). For [dAPIs](#dapi) specifically, an
[Airnode feed](#airnode-feed) is used instead.

The key concept is that an API provider uses an
[Airnode wallet](#airnode-wallet) to sign its data. In the context of smart
contracts, `airnode` refers to the [Airnode address](#airnode-address) of this
wallet.

### Airnode ABI

To decode a bytes string that was encoded with contract ABI, one needs to know
the schema used while encoding.
[Airnode ABI](https://github.com/api3dao/airnode/tree/master/packages/airnode-abi)
is a specification built on contract ABI to allow encoding without knowing the
schema.

### Airnode Address

All [API providers](#api-provider) [sign their data](#signed-data) with an EOA
wallet. The address of this wallet is announced by the respective API provider
in the DNS records of the base URL of their API.

### Airnode Feed

[Airnode feed](https://github.com/api3dao/signed-api/tree/main/packages/airnode-feed)
is an iteration on [Airnode](#airnode) that is optimized to power data feeds.
Airnode feeds are hosted by [API providers](#api-provider) themselves and are
identified by the respective [Airnode address](#airnode-address). The
[wallet](#airnode-wallet) of this account is used to cryptographically
[sign the data](#signed-data) to prove the validity of the data.

### Airnode Wallet

A secret wallet only known to the [API provider](#api-provider) who deploys the
[Airnode](#airnode) or [Airnode feed](#airnode-feed) used to sign its data.

### Airseeker

[Airseeker](https://github.com/api3dao/airseeker) is an application that
periodically fetches [signed data](#signed-data) from [Signed APIs](#signed-api)
to update [data feeds](#data-feed) whenever the conditions specified by the
[update parameters](#update-parameters) are satisfied.

### AirseekerRegistry Contract

[AirseekerRegistry contract](https://github.com/api3dao/contracts/blob/main/contracts/api3-server-v1/AirseekerRegistry.sol)
serves as an on-chain configuration file for [Airseeker](#airseeker). It
provides a source of truth for [dAPIs](#dapi) and can be used to obtain which
[data feed](#data-feed) a dAPI points to and what its sources are.

### API Provider

An API provider is a business that has productized their services in the form of
an API.

### Api3 Market

[Api3 Market](https://market.api3.org/) is a [dApp](#dapp) where users can
purchase [dAPI](#dapi) plans, which get reflected on-chain immediately.

### Api3ServerV1 Contract

[Api3ServerV1 contract](https://github.com/api3dao/contracts/blob/main/contracts/api3-server-v1/Api3ServerV1.sol)
is the main contract for [dAPIs](#dapi). It is used by [Airseekers](#airseeker)
to update [base feeds](#base-feed).

### Api3ServerV1OevExtension Contract

[Api3ServerV1OevExtension contract](https://github.com/api3dao/contracts/blob/main/contracts/api3-server-v1/Api3ServerV1OevExtension.sol)
is an extension of the [Api3ServerV1 contract](#api3serverv1-contract). It is
used by [searchers](#searcher) for [OEV feed](#oev-feed) updates.

### Auctioneer

Short term for [OEV Auctioneer](#oev-auctioneer).

### Award Phase

Award phase is the second phase of an [OEV auction](#oev-auction) where
[OEV Auctioneer](#oev-auctioneer) resolves the auction and awards the winner. It
is preceded by the [bid phase](#bid-phase).

### Base Feed

In the context of OEV extraction, the base feed refers to a
[data feed](#data-feed) behind a particular [dAPI](#dapi). An update of this
data feed is reflected across all [OEV proxies](#oev-proxy) that read from this
dAPI.

### Beacon

A beacon is a single-source [data feed](#data-feed). A beacon is identified by
the respective [Airnode address](#airnode-address) and [template](#template) ID.

```solidity
beaconId = keccak256(abi.encodePacked(airnode, templateId));
```

### Beacon Set

A beacon set is an on-chain aggregation of [beacons](#beacon). A beacon set is
identified by the hash of the constituting beacon IDs.

```solidity
beaconSetId = keccak256(abi.encode(beaconIds));
```

### Bid

[Searchers](#searcher) place bids on [OEV Network](#oev-network) to participate
in [OEV auctions](#oev-auction) to obtain exclusive rights to capture
[OEV](#oev).

### Bid Amount

The amount a [searcher](#searcher) is willing to pay for winning the
[OEV auction](#oev-auction).

### Bid Phase

Bid phase is the first phase of an [OEV auction](#oev-auction) where
[searchers](#searcher) are supposed to place their [bids](#bid). It is followed
by the [award phase](#award-phase).

### Collateral

Also referred to as collateral amount.

When [Auctioneer](#auctioneer) awards a bid, the OevAuctionHouse contract
reserves a portion of the [bid amount](#bid-amount) as collateral. This
collateral, with the exception of [protocol fee](#protocol-fee), is released
once the Auctioneer confirms the fulfillment reported by the auction winner
after they've paid the bid amount.

### dAPI

The
[Api3 whitepaper](https://github.com/api3dao/api3-whitepaper/blob/master/api3-whitepaper.pdf)
definition of a dAPI is a [first-party oracle](#first-party-oracles)-based data
feed that is managed decentrally.

In practice, a dAPI is mapped to a particular [data feed](#data-feed). The
mapping is managed by Api3 DAO.

### dApp

An application that uses smart contracts. Usually referred to as a source of
[OEV](#oev). Each dApp eligible for [OEV proceeds](#oev-proceeds) has a
[dApp ID](#dapp-id) assigned and uses [OEV proxies](#oev-proxy).

### dApp ID

Api3 holds separate [OEV auctions](#oev-auction) for different [dApps](#dapp) to
keep their [proceeds](#oev-proceeds) isolated. In this scheme, dApps are
identified by IDs that are assigned by Api3 DAO.

### Data Feed

The common term used to refer to a [beacon](#beacon) or a
[beacon set](#beacon-set). Each [data feed](#data-feed) has a
[base version](#base-feed) that lives in
[Api3ServerV1 contract](#api3serverv1-contract), and an [OEV version](#oev-feed)
that lives in [Api3ServerV1OevExtension](#api3serverv1oevextension-contract).

Data feeds are powered by [Airseekers](#airseeker).

### Deviation

Deviation is the difference between the on-chain value of a
[data feed](#data-feed) and its off-chain value based on the data served by
[Signed APIs](#signed-api). It is measured as a percentage value, and an update
needs to be made when the value exceeds the deviation threshold. A deviation
reference value is used as the reference value according to which the percentage
value will be calculated.

### Endpoint

In the context of data feeds, an endpoint represents a distinct type of oracle
service provided by an [Airnode feed](#airnode-feed), which can be parameterized
by [Airnode ABI](#airnode-abi)-encoded parameters.

An endpoint is identified by the respective
[OIS](https://github.com/api3dao/ois) title and endpoint name.

```solidity
endpointId = keccak256(abi.encode(oisTitle, endpointName));
```

### First-party Oracles

An [API provider](#api-provider) that provides oracle services without the use
of any middlemen is a first-party oracle.

Our first-party oracles are powered by [Airnode feeds](#airnode-feed).

### Fulfillment

The [searcher](#searcher) that has won an [OEV auction](#oev-auction) is
expected to pay their [bid amount](#bid-amount). This payment is referred to as
a fulfillment in the context of [OevAuctionHouse](#oev-auction-house).

### Heartbeat

A heartbeat is a [data feed](#data-feed) update that was made to uphold a
maximum period of time between two consecutive updates, which is called the
heartbeat interval.

### MEV

Maximal extractable value (MEV) is a superset of [OEV](#oev) that can be
extracted by including, excluding or reordering any interaction.

### OEV

Oracle extractable value (OEV) is a subset of [MEV](#mev) that can be extracted
by guaranteeing a specific relative order of oracle updates and related
interactions within a transaction.

Api3 monetizes its [dAPI](#dapi) services by holding
[OEV auctions](#oev-auction) and forwarding the [proceeds](#oev-proceeds) to the
respective [dApps](#dapp). This is both a net gain for the dApps (which
otherwise would have bled these funds to [MEV](#mev) bots and validators) and a
fair and scalable business model for Api3 DAO.

### OEV Auction

Api3 periodically holds [OEV](#oev) auctions on [OEV Network](#oev-network)
where [searchers](#searcher) [bid](#bid) to receive exclusive update rights to
update the data feeds for a specific [dApp](#dapp) for a limited amount of time.

### OEV Auctioneer

OEV Auctioneer, or simply Auctioneer, is the off-chain component powering the
[OEV Auctions](#oev-auction).

### OEV Beacon

Each [base feed](#base-feed) beacon has a corresponding OEV beacon, which is
derived from the original one by hashing the [template](#template) ID using
`keccak256`. These beacons are needed for [OEV searchers](#searcher) to query
[Signed APIs](#signed-api) for their real-time values.

### OEV Feed

In the context of OEV extraction, the OEV feed refers to a
[data feed](#data-feed) used by [OEV proxy](#oev-proxy). This feed is proxy
specific and can be updated by a searcher who won the
[OEV auction](#oev-auction).

### OEV Network

OEV Network is an Arbitrum Nitro L2. Its chain ID is 4913 and it uses ETH as the
gas token. Its purpose is to hold [OEV auctions](#oev-auction) in a transparent
and retrospectively verifiable way.

### OEV Proceeds

We refer to OEV proceeds in two contexts:

1. As the revenue from capturing the OEV opportunities.
2. As the amount paid to the [dApps](#dapp) as a result of
   [bid amount](#bid-amount) payments of [OEV auction](#oev-auction) winners.

### OEV Proxy

An OEV proxy is a proxy contract that reads a value from both
[base feed](#base-feed) and [OEV feed](#oev-feed) and prefers the fresher out of
the two. Our implementation is called `Api3ReaderProxyV1` and partially supports
Chainlink's AggregatorV2V3Interface for convenience.

### Protocol Fee

When [Auctioneer](#auctioneer) confirms a [fulfillment](#fulfillment) and
releases the [collateral amount](#collateral), it deducts a protocol fee which
is kept by Api3 DAO. The protocol fee is currently set to 0.

### Searcher

A searcher is an entity that searches for profitable MEV or OEV opportunities in
the market. While searching is typically performed by automated bots, we choose
to refer to searchers as people.

### Signed API

A
[Signed API](https://github.com/api3dao/signed-api/tree/main/packages/signed-api)
receives signed data from [Airnode feeds](#airnode-feed) and serves it to the
public through an API. For example, an [Airseeker](#airseeker) depends on Signed
APIs to update [data feeds](#data-feed).

### Signed Data

Refers to the data signed by [Airnode feeds](#airnode-feed), served by
[Signed APIs](#signed-api) and used by [Airseekers](#airseeker) to update
[data feeds](#data-feed).

### Target Chain

Target chain is the chain where the
[Api3ServerV1 contract](#api3serverv1-contract),
[Api3ServerV1OevExtension contract](#api3serverv1oevextension-contract) and the
dApp contracts are deployed. This is the chain where the MEV/OEV extraction
happens.

### Template

In the context of [data feeds](#data-feed), a template represents an
[endpoint](#endpoint) and some [Airnode ABI](#airnode-abi)-encoded parameters. A
template is identified by the respective endpoint ID and Airnode ABI-encoded
parameters.

```solidity
templateId = keccak256(abi.encode(endpointID, parameters));
```

### Update Parameters

Parameters that specify when an [Airseeker](#airseeker) should update a
[data feed](#data-feed). Typically, there are two aspects that require an
update:

- [Deviation](#deviation): Defined by the deviation threshold and deviation
  reference
- [Heartbeat](#heartbeat): Defined by the heartbeat interval
