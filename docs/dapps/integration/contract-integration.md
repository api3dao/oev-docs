---
title: Contract integration
pageHeader: dApps → Integration
outline: deep
---

<PageHeader/>

# Contract integration

This page provides important information on how to integrate API3 data feeds to a contract.
Please read it in its entirety before attempting an integration.

::: info 💡 Tip

Your auditors may not be familiar with the best practices in the context of API3 data feeds.
It is a good idea to direct them to this page.

:::

## Api3ReaderProxyV1

Api3ReaderProxyV1 is a contract that is used to read a specific API3 data feed.
For example, to read ETH/USD on Blast, one can simply call the `read()` function of the respective [Api3ReaderProxyV1.](https://blastscan.io/address/0x5b0cf2b36a65a6BB085D501B971e4c102B9Cd473#readProxyContract#F17)

The Api3ReaderProxyV1 addresses displayed on API3 Market are communal—they do not belong to a specific dApp.
Alternatively, an Api3ReaderProxyV1 can belong to a specific dApp, which is required for [OEV Rewards](/dapps/oev-rewards/) support.

### Deployment

Api3ReaderProxyV1 is designed to be deployed by calling the `deployApi3ReaderProxyV1()` function of Api3ReaderProxyV1Factory.
Purchasing a plan for a data feed on API3 Market deploys a communal Api3ReaderProxyV1 for it automatically, whose address is displayed on the [integration page.](https://market.api3.org/blast/eth-usd/integrate)
Alternatively, [`data-feed-reader-example`](https://github.com/api3dao/data-feed-reader-example) provides [instructions](https://github.com/api3dao/data-feed-reader-example/blob/main/scripts/README.md#deploying-proxy-contracts-programmatically) for how (communal and dApp-specific) Api3ReaderProxyV1 contracts can be deployed programmatically.

::: info 💡 Tip

In short, if your dApp has a [dApp alias](/dapps/oev-rewards/dapp-alias) assigned, deploy your own Api3ReaderProxyV1 contracts by referring to the [instructions in `data-feed-reader-example`.](https://github.com/api3dao/data-feed-reader-example/blob/main/scripts/README.md#deploying-proxy-contracts-programmatically)
Otherwise, use the communal Api3ReaderProxyV1 addresses displayed on the integration pages of the respective data feeds.

With either option, we recommended you to validate the Api3ReaderProxyV1 addresses using [`@api3/contracts`.](/dapps/integration/api3-contracts.md)

:::

#### Parameters

Deploying Api3ReaderProxyV1 by calling Api3ReaderProxyV1Factory requires three parameters:

- `dapiName` is the name of the data feed in `bytes32` string form.
  For example, `dapiName` for the ETH/USD data feed is [`0x4554482f55534400000000000000000000000000000000000000000000000000`.](https://blastscan.io/address/0x5b0cf2b36a65a6BB085D501B971e4c102B9Cd473#readProxyContract#F4)
  ::: info ℹ️ Info

  The term dAPI can be traced back to the [API3 whitepaper](https://github.com/api3dao/api3-whitepaper/blob/master/api3-whitepaper.pdf), and refers to a DAO-governed data feed that is built out of first-party oracles.
  For the purposes of this page, you can think of the terms dAPI and data feed to be interchangeable.

  :::

- `dappId` is a `uint256` that API3 has assigned to a specific dApp on a specific chain.
  It is similar to a chain ID in function.
  In Solidity, it can be derived as

  ```solidity
  uint256(keccak256(abi.encodePacked(keccak256(abi.encodePacked(dappAliasAsString)), block.chainid)));
  ```

  For the communal Api3ReaderProxyV1 deployments, `dappId` is [`1`.](https://blastscan.io/address/0x5b0cf2b36a65a6BB085D501B971e4c102B9Cd473#readProxyContract#F5)

- While deploying an Api3ReaderProxyV1, a `bytes`-type `metadata` is specified, whose hash is used as the CREATE2 salt.
  It should be left [empty](https://blastscan.io/tx/0x0e98bc849985df6d5489396d66b766019c547fedfe3c3fb881276d7fb76ef26e#eventlog#17), i.e., as `0x`.

### Reading the data feed

Api3ReaderProxyV1 implements IApi3ReaderProxy, which you can import from [`@api3/contracts`](/dapps/integration/api3-contracts.md) to use in your contract.

```solidity
interface IApi3ReaderProxy {
    function read() external view returns (int224 value, uint32 timestamp);
}
```

::: info 💡 Tip

Api3ReaderProxyV1 also implements Chainlink's AggregatorV2V3Interface, which enables it to be used as a drop-in replacement for Chainlink data feeds.
Refer to the [AggregatorV2V3Interface page](/dapps/integration/aggregatorv2v3interface.md) for details.

:::

#### Using `value`

`value` is an `int224`, which is the median of individual on-chain data feed `value`s that contribute to the aggregation.

::: info 💡 Tip

Note that `value` has a signed type.
However, in the context of a data feed that reports the price of an asset, non-positive values do not make sense.
It is good practice to validate such conditions, as in `require(value > 0)`.

:::

All API3 data feeds have 18 decimals.
For example, if ETH/USD is `2918.5652133`, `value` will read `2918565213300000000000`.

::: info ⚠️ Warning

It is extremely risky to validate the data feed value based on practical assumptions.
An example where doing so went wrong was Chainlink requiring their LUNA/USD data feed value to be at least `0.1`.
Doing so caused them to misreport by an order or magnitude during the UST depeg, and caused a dApp to suffer more than $14MM in damages.

We do not utilize such practical assumptions at our end, and recommend you to be very careful if you do.

:::

#### Using `timestamp`

`timestamp` is a `uint32`, which is the median of individual on-chain data feed `timestamp`s that contribute to the aggregation.
The `timestamp` of an individual data feed is what the respective API provider reported their system timestamp to be at the time they called their API to get the value.
Its main role is to act as a nonce that prevents data feed updates from being replayed.

::: info ⚠️ Warning

`timestamp` is not the block timestamp at the time of the update.
It is reported system (i.e., off-chain) time.
A common mistake is using `require(timestamp <= block.timestamp)`.
This should be avoided for two reasons:

1. If `block.timestamp` lags compared to actual time, this will revert.
   However, that is not a valid reason to avoid using the data feed, and will cause unnecessary downtime.
2. Some L2 implementations use the timestamp of the latest block as `block.timestamp` (rather than the system time of the node) when a static call is made to the RPC endpoint.
   This means that this `require()` will revert during static calls even when `block.timestamp` does not actually lag.
   This disables OEV searchers from using the intended workflow, and will reduce the amount of OEV Rewards you will receive as a result.

:::

In general, the only acceptable use of `timestamp` is validating if the heartbeat interval is upheld, as in `require(timestamp + 24 hours > block.timestamp)`.
However, unless your contract design specifically relies on the data feed value being at most a day old (which is unlikely), we do not necessarily recommend this either.

## Mixed oracle design

Some dApps choose to mix oracle solutions, either by denying service if they are not in consensus, or by using one primarily and deferring to another in case of inconsistency.

In such setups, API3 data feeds need to be treated differently due to OEV considerations.
Specifically, the vast majority of OEV is extracted during times of volatility, and letting other oracle solutions interfere during such times may result in losing out on a significant amount of OEV revenue.
In practice, this will play out as an OEV searcher bidding a significant amount for a detected OEV opportunity, only to realize after the auction ends that the dApp now defers to a non-API3 data feed and the OEV opportunity no longer exists.
Such ambiguity will put off OEV searchers from your dApp, or cause them to bid much less to hedge the risk, reducing your OEV Rewards.

The golden standard is only using API3 data feeds, in which case OEV searchers will be able to bid on OEV opportunities with full confidence, knowing that they will be able to extract if they win the auction.
If you must use API3 data feeds as your primary source with another solution as fallback, you should tolerate as much inconsistency as possible.

::: info 💡 Tip

We recommend you to tolerate at least 10% inconsistency.
Based on our analysis, any less will hinder OEV extraction during times of high volatility.

:::

Note that using API3 data feeds for only some asset prices still counts as a mixed design.
Say a lending platform uses the ETH/USD API3 data feed, and the USDT/USD data feed of another oracle solution.
A user takes out a USDT loan with ETH collateral.
Even if an OEV searcher detects an opportunity that they want to bid on, they must consider that a rogue USDT/USD update may expose it to the public before they can claim it, which causes them to avoid bidding a large amount.

::: info 💰 Financial

It is up to you to maximize your OEV Rewards by integrating correctly.

:::
