---
title: Overview
pageHeader: dApps
---

<PageHeader/>

# "Oracles that pay you"

API3 provides data feeds and pays dApps for using them.

1. [API3 Market](#api3-market) serves a large and dynamic catalog of data feeds on all major EVM networks.

2. API3 enables the Oracle Extractable Value (OEV) resulting from the usage of these data feeds to be captured, and pays it to the respective dApps in the form of [OEV Rewards.](#oev-rewards)

## API3 Market

Liquidity is increasingly shifting to newly launched L2 networks, and dApps that are able to branch out to these faster are at a significant competitive advantage.
For dApps that utilize data feeds, this is only possible with a data feed provider that has recognized this fact and designed their solutions accordingly.

Our answer to this is [API3 market](https://market.api3.org/), a B2B SaaS marketplace that serves data feeds.
Without speaking to a representative or signing a contract, it enables a dApp developer to purchase a plan for the data feed they need, and integrate it within minutes.
Furthermore, the whole system is designed to streamline the addition of support for new networks and data feed types, resulting in a large and dynamic catalog.

## OEV Rewards

The state of a blockchain can only be updated in a discrete manner, with a confirmed block or a sequenced transaction.
Practical limits (such as block size and block time) apply to this process, which implies that these updates will invariably lag.
Since data feeds are also updated by updating the chain state, every data feed is at least slightly out of date at all times.
This fact can often be exploited to extract funds from the users of the data feed by rent-seeking third parties in the form of Maximal Extractable Value (MEV).

[Oracle Extractable Value (OEV)](https://medium.com/api3/oracle-extractable-value-oev-13c1b6d53c5b) is a subset of MEV that oracles have priority on extracting by batching additional operations with their updates.
Furthermore, instead of searching for such OEV opportunities themselves, oracles can auction off this privilege.
API3 holds transparent and permissionless auctions for OEV opportunities on OEV Network, and [pays](/dapps/oev-rewards) the auction proceeds to the respective dApps.
OEV Rewards is effectively a new and sustainable revenue stream for dApps.
