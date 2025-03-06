---
title: Overview
pageHeader: dApps
---

<PageHeader/>

# "Oracles that pay you"

Api3 provides data feeds and pays dApps for using them.

1. [Api3 Market](#api3-market) serves a large and dynamic catalog of data feeds on all major EVM networks.

2. Api3 enables the Oracle Extractable Value (OEV) resulting from the usage of these data feeds to be captured, and pays it to the respective dApps in the form of [OEV Rewards.](#oev-rewards)

## Api3 Market

Liquidity is increasingly shifting to newly launched L2 networks, and dApps that are able to branch out to these more quickly are at a significant competitive advantage.
For dApps that utilize data feeds, this is only possible with a data feed provider that has recognized this fact and designed their solutions accordingly.

Our answer to this is [Api3 Market,](https://market.api3.org/) which enables a dApp developer to purchase a plan for the data feed they need and integrate it within minutes, without speaking to a representative or signing a contract.
Furthermore, the whole system is designed to streamline the addition of support for new networks and data feed types, resulting in a large and dynamic catalog.

## OEV Rewards

The state of a blockchain can only be updated in a discrete manner, with a confirmed block or a sequenced transaction.
Practical limits (such as block size and block time) apply to this process, which implies that these updates will invariably lag.
Since data feeds are also updated by updating the chain state, every data feed is at least slightly out of date at all times.
Rent-seeking third parties can exploit this fact to extract funds from data feed users in the form of Maximal Extractable Value (MEV).

[Oracle Extractable Value (OEV)](https://medium.com/api3/oracle-extractable-value-oev-13c1b6d53c5b) is a subset of MEV that oracles have priority in extracting by batching additional operations with their updates.
Furthermore, instead of searching for such OEV opportunities themselves, oracles can auction off this privilege.
Api3 holds transparent and permissionless auctions for OEV opportunities on OEV Network, and [pays](/dapps/oev-rewards/) the auction proceeds to the respective dApps.
OEV Rewards serves as a new and sustainable revenue stream for dApps.

::: info ⚠️ Disclaimer

We refer you to the Api3 [terms and conditions](https://api3.org/terms-and-conditions/), which apply to all services and software provided by Api3 (including but not limited to data feeds, OEV Network, and any example OEV bots).
Nothing in this documentation nor related materials should be interpreted as financial, business, nor professional advice.

:::
