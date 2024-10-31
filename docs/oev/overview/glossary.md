---
title: Glossary
pageHeader: OEV → Overview
outline: deep
---

<PageHeader/>

# Glossary

Here are the common terms referred to throughout the documentation with a brief
description. This section is not indended to explain the terms in details, but
to serve as a reminder or provide small clarification.

<!-- TODO: Make sure these are sorted alphabetically -->
<!-- TODO: Compare with glossary from Burak -->
<!-- TODO: Link to the glossary in the contracts -->

<!-- NOTE: We intentionally use triple hash to make the titles stand out a bit less. -->

### Airnode ABI

To decode a bytes string that was encoded with contract ABI, one needs to know
the schema used while encoding.
[Airnode ABI](https://github.com/api3dao/airnode/tree/master/packages/airnode-abi)
is a specification built on contract ABI to allow encoding without knowing the
schema.

### API provider

An API provider is a business that has productized their services in the form of
an API.

### Airnode feed

[Airnode feed](https://github.com/api3dao/signed-api/tree/main/packages/airnode-feed)
is an iteration on Airnode that is optimized to power data feeds. Airnode feeds
are hosted by [API providers](#api-provider) themselves and are identified by
the respective [Airnode address](#airnode-address). The wallet of this account
is used to cryptographically [sign the data](#signed-data) to prove the validity
of the data.

### Airnode address

All [API providers](#api-provider) [sign their data](#signed-data) with an EOA
wallet. The address of this wallet is announced by the respective API provider
in the DNS records of the base URL of their API.

### Airseeker

[Airseeker](https://github.com/api3dao/airseeker) is an application that
periodically fetches [signed data](#signed-data) from [signed APIs](#signed-api)
to update [data feeds](#data-feed) whenever the conditions specified by the
[update parameters](#update-parameters) are satisfied.

### Base feed

In the context of OEV extraction, the base feed refers to a
[data feed](#data-feed) behind a particular dAPI. Update of this data feed is
reflected across all [OEV proxies](#oev-proxy) that read from this dAPI.

### OEV feed

In the context of OEV extraction, the OEV feed refers to a
[data feed](#data-feed) used by [OEV proxy](#oev-proxy). This feed is proxy
specific and can be updated by searcher who won the [OEV auction](#oev-auction).

### Beacon

A Beacon is a single-source [data feed](#data-feed). A Beacon is identified by
the respective [Airnode address](#airnode-address) and [template](#template) ID.

```solidity
beaconId = keccak256(abi.encodePacked(airnode, templateId));
```

### Beacon set

A Beacon set is an on-chain aggregation of [Beacons](#beacon). A Beacon set is
identified by the hash of the constituting Beacon IDs.

```solidity
beaconSetId = keccak256(abi.encode(beaconIds));
```

### Deviation

Deviation is the difference between the on-chain value of a
[data feed](#data-feed) and its off-chain value based on the data served by
[signed APIs](#signed-api). It is measured as a percentage value, and an update
needs to be made when the value exceeds the deviation threshold. A deviation
reference value is used as the reference value according to which the percentage
value will be calculated.

### Endpoint

In the context of the data feeds, an endpoint represents a distinct type of
oracle service provided by an [Airnode feed](#airnode-feed), which can be
parameterized by [Airnode ABI](#airnode-abi)-encoded parameters.

An endpoint is identified by the respective
[OIS](https://github.com/api3dao/ois) title and endpoint name.

```solidity
endpointId = keccak256(abi.encode(oisTitle, endpointName));
```

### First-party oracles

An [API provider](#api-provider) that provides oracle services without the use
of any middlemen is a first-party oracle.

Our first-party oracles are powered by [Airnode feeds](#airnode-feed).

### dAPI

The
[API3 whitepaper](https://github.com/api3dao/api3-whitepaper/blob/master/api3-whitepaper.pdf)
definition of a dAPI is a [first-party oracle](#first-party-oracles)-based data
feed that is managed decentrally.

In practice, a dAPI is mapped to a particular [data feed](#data-feed). The
mapping is managed by API3 DAO.

### Data feed

The common term used for referring to a [Beacon](#beacon) or a
[Beacon set](#beacon-set). Each [data feed](#data-feed) has a
[base version](#base-feed) that lives in
[Api3ServerV1 contract](#api3serverv1-contract), and an [OEV version](#oev-feed)
that lives in [Api3ServerV1OevExtension](#api3serverv1oevextension-contract).

Data feeds are powered by [Airseekers](#airseeker).

### AirseekerRegistry contract

TODO: Used to obtain beacons for a particular dApp

### Auctioneer

Auctioneer is the off-chain component powering the OEV Auctions.

### Heartbeat

A heartbeat is a [data feed](#data-feed) update that was made to uphold a
maximum period of time between two consecutive updates, which is called the
heartbeat interval.

### OEV Proxy

TODO:

### OEV beacon

Each base feed beacon has a corresponding OEV beacon, which is derived from the
original one by hashing the template ID using `keccak256`.

TODO: complete

### Searcher

A searcher is an entity that searches for profitable MEV or OEV opportunities in
the market. While searching is typically performed by automated bots, we choose
to refer to searchers as people.

<!-- TODO: Make sure we refer to them as people -->

### Target chain

Target chain is the chain where the
[Api3ServerV1 contract](#api3serverv1-contract),
[Api3ServerV1OevExtension contract](#api3serverv1oevextension-contract) and the
dApp contracts are deployed. This is the chain where the MEV/OEV extraction
happens.

### Template

In the context of the [data feeds](#data-feed), a template represents an
[endpoint](#endpoint) and some [Airnode ABI](#airnode-abi)-encoded parameters. A
template is identified by the respective endpoint ID and Airnode ABI-encoded
parameters.

```solidity
templateId = keccak256(abi.encode(endpointID, parameters));
```

### Update parameters

Parameters that specify when an [Airseeker](#airseeker) should update a
[data feed](#data-feed). Typically, there are two aspects that require an
update:

- [Deviation](#deviation): Defined by the deviation threshold and deviation
  reference
- [Heartbeat](#heartbeat): Defined by the heartbeat interval
