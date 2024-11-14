---
title: Security considerations
pageHeader: dApps → Integration
---

<PageHeader/>

# Security considerations

A data feed is an on-chain service that is driven by off-chain components.
Therefore, as long as you continue to use it, there will be ongoing security considerations that you should be aware of.

::: info 💡 Tip

API3 data feeds have never misreported or experienced an outage.
This page merely discusses theoretical scenarios, which apply to all data feeds.

:::

## Smart contract risk

Imperfections in a smart contract implementation may cause it to behave unexpectedly.
This may cause interacting parties to lose funds, which is referred to as the smart contract risk.
As with any smart contract, interacting with Api3ReaderProxyV1 will subject you to a smart contract risk.

We propose three methods to assess the smart contract risk.
Firstly, you can refer to the related [audit reports.](https://github.com/api3dao/contracts?tab=readme-ov-file#security)
A more practical method is to refer to [our historical TVS](https://defillama.com/oracles/API3) to get a general idea of the _battle-testedness_ of our data feeds.
Finally, you are welcome to review the contracts behind [Api3ReaderProxyV1](/dapps/integration/contract-integration.md#api3readerproxyv1), specifically [Api3ServerV1](https://github.com/api3dao/contracts/blob/main/contracts/api3-server-v1/Api3ServerV1.sol) and [Api3ServerV1OevExtension](https://github.com/api3dao/contracts/blob/main/contracts/api3-server-v1/Api3ServerV1OevExtension.sol).
Note that our [contract developer docs](https://github.com/api3dao/contracts/tree/main/docs) may be helpful in interpreting the design decisions made for these contracts.

## Privileged accounts

Api3ReaderProxyV1 is a [UUPS-upgradeable](https://eips.ethereum.org/EIPS/eip-1822) contract, which can be upgraded by [a 4-of-8 multisig](https://github.com/api3dao/contracts/blob/main/data/manager-multisig-metadata.json#L2) that is owned by members of the API3 technical team.
This upgradeability feature is intended to be used only in exceptional occasions to:

- Respond to newly discovered compiler, library or contract vulnerabilities,
- Migrate users to potential new versions of the contracts.

[A 4-of-4 multisig,](https://github.com/api3dao/contracts/blob/main/data/dapi-management-metadata.json#L2) which again is owned by members of the API3 technical team, approves the root of a Merkle tree that contains the data feed configurations.
In other words, adding, removing or replacing API providers that contribute to the aggregation of data feeds requires signatures from all owners of this multisig.

::: info ℹ️ Info

The configuration of data feed sources depends on various factors such as uptime, accuracy, response time to incidents and qualitative considerations.
The signers of the multisig have access to these data and are responsible to verify them.

:::

## Update parameters

Once a plan has been purchased on API3 Market, the respective data feed will be updated with the advertised deviation threshold and heartbeat interval until the expiration of the plan.
This depends on the API3 technical team to keep the wallets that will send the update transactions funded, and maintain the infrastructure that will use these wallets to send the update transactions.
This operation is supported by dedicated monitoring personnel, automated alerting systems, and multiple redundant infrastructure layers.

::: info ℹ️ Info

We have been providing oracle services as early as [2019](https://etherscan.io/txs?a=0x78e76126719715eddf107cd70f3a31dddf31f85a&p=1029), and were listed as the [best responding oracle](/assets/reputation-link.CxhU2iIj.png) among all Chainlink oracles by [`reputation.link`](https://www.google.com/search?q=%22reputation.link%22+chainlink) as of September 2020, which is when we published the [API3 whitepaper](https://github.com/api3dao/api3-whitepaper) and requested to be removed from Chainlink data feeds.
We had the opportunity to design our architecture and operations from scratch with the hindsight of what works well and what does not, and have come an even longer way since then.

<img src="./images/reputation-link.png" style="display: none;">

:::

Note that we get the API provider-signed data that we use to update data feeds from publicly accessible APIs.
This is similar to the [Coinbase price oracle](https://www.coinbase.com/en-tr/blog/introducing-the-coinbase-price-oracle), but done by many API providers using the same standard that API3 has created, which makes aggregation feasible.
This means that us not updating a data feed does not necessarily prevent further updates.
For example, MEV searchers can be expected to use this API to execute updates that are financially relevant.
Furthermore, our OEV implementation utilizes an equivalent mechanism, which implies that OEV updates will continue going through even if we stop updating the data feed according to the update parameters.

## Correctness of data

The [API3 whitepaper](https://github.com/api3dao/api3-whitepaper) poses that all data that is served in an oracle service comes from API providers in practice, and the trust-minimized way to receive data from an API provider is for there to be no third-party intermediaries.
We have coined the term _first-party oracle_ to refer to this architecture, where API providers provide oracle services without needing third parties to facilitate.

API3 data feeds are on-chain aggregations of data feeds that are powered by individual first-party oracles.
In other words, each API provider powers a single-source data feed on-chain, and the API3 data feed is an on-chain median of the these individual data feeds, which provides the strongest security guarantees (for example, compared to off-chain aggregation.)

::: info ⚠️ Warning

Other oracle solutions, such as Pyth, wrongly claim that their oracles are first party.
This is not true in two important ways:

- An API provider is a business that provides an API as a service.
  Most Pyth oracles are not API providers to begin with.
- Even in the case that a Pyth oracle is an API provider, their data gets aggregated and served through Wormhole, which is a third party point of failure.

In general, serving an oracle service through an intermediary blockchain or state channel renders it third party.
Whether this blockchain or state channel is decentralized or not is not a factor in this.
The main issue is that when a dApp uses Pyth data on Ethereum, their users will pay Ethereum gas fees while the dApp will not be more secure than Wormhole.

:::

API3 maintains a roster of first-party oracle partners and curates data feeds based on continuous analysis of their performance.
We consider the resulting aggregation to be superior to alternatives that aggregate a large number of downstream oracle service providers.

## Oracle Extractable Value (OEV)

OEV updates provide the exact same guarantees as regular updates—they are an on-chain aggregations of API provider-signed data—and thus from a data integrity point of view, OEV does not introduce any additional risk.
However, the OEV auction mechanism favors winners by letting them frontrun the updates of an artifically delayed base feed, which is intended to be a tradeoff that is ultimately beneficial to the dApp.

Let us provide more detail about how this works.
In general terms, the lifetime of a data point has three phases:

1. While the data point is 0–30 seconds-old, OEV searchers browse it and place bids if it enables OEV opportunities.
2. While the data point 30–60 seconds-old and if at least one valid bid has been placed, the OEV searcher that has won the auction can use the data point to update the data feed to capture the respective OEV opportunities.
3. While the data point is at least 60 seconds-old, the public can use the data point to update the data feed (and this is also when we update the data feed based on update parameters.)

This means that dApps can expect their data feed to operate with a 30–60 second delay.
Some are concerned about this, which may be warranted.
Let us propose a framework for assessing such situations.
Say your dApp generates `X1` revenue with your current oracle solution.
It would have generated `X2` revenue if you have used API3 data feeds (where `X2` may be smaller than `X1` due to the delay) and an additional `Y` in the form of OEV Rewards.
If `X1 < X2 + Y`, which is the case more often than not, using API3 feeds is the more secure option.

::: info 💡 Tip

An underrated perspective here is that the traditional oracle solutions that do not allow OEV capture are simply vulnerable.
They caused their users to be exploited for hundreds of millions of dollars over the years without anyone realizing that this was avoidable.
Therefore, auditors should start flagging dApps that do not make use of an effective OEV capture mechanism, and the dApps that continue using the traditional solutions with the now-known vulnerability should have to justify their position.

:::
