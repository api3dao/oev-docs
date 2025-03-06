---
title: Contract integration
pageHeader: dApps → Integration
outline: deep
---

<PageHeader/>

# Contract integration

This page provides important information on how to integrate Api3 data feeds into a contract.
Please read it in its entirety before attempting an integration.

::: info ⚠️ Warning

Api3 does not authorize any members or affiliates to provide security advice.
You are solely responsible for following the instructions on this page.

:::

## Api3ReaderProxyV1

Api3ReaderProxyV1 is a contract that is used to read a specific Api3 data feed.
For example, to read ETH/USD on Blast, one can simply call the [`read()` function](https://blastscan.io/address/0x5b0cf2b36a65a6BB085D501B971e4c102B9Cd473#readProxyContract#F17) of a respective Api3ReaderProxyV1.

You can use Api3 Market to see the Api3ReaderProxyV1 address you should use for a specific data feed, as described [here.](/dapps/integration/index.md#integration-information)
To summarize, you should use the Api3ReaderProxyV1 address that appears after selecting "Earn OEV Rewards" and entering the name of your dApp.

::: info ⚠️ Warning

To be eligible for OEV Rewards, you are required to use the Api3ReaderProxyV1 contracts belonging to your dApp.

:::

### Printing Api3ReaderProxyV1 addresses

For your convenience, Api3 representatives may deploy OEV Rewards-enabled Api3ReaderProxyV1 contracts on your behalf and provide you with a list of commands that will print their addresses.
By running these commands yourself, you can ensure that you are using the correct addresses.

::: info 💡 Tip

We try to verify our contracts on all block explorers, with varying success due to their practical limitations.
Since Api3ReaderProxyV1 is deployed deterministically, the lack of verification on a block explorer does not pose a security concern.

:::

These commands should be in the following format, where the dApp alias (assigned to you by Api3 during [registration](/dapps/oev-rewards/index.md#how-to-get-onboard)), chain ID, and dAPI names match your specific case:

```sh
npx @api3/contracts@latest print-api3readerproxyv1-address \
  --dapp-alias lendle \
  --chain-id 5000 \
  --dapi-name ETH/USD
```

The command above prints:

```
dApp alias: lendle
chain: Mantle
dAPI name: ETH/USD
• Please confirm that https://market.api3.org/mantle/eth-usd points to an active feed.
• Your proxy address is https://mantlescan.xyz/address/0x776E79D916e49BBDb8FEe0F43fF148C2Ed3bE125
Please confirm that there is a contract deployed at this address before using it.
```

Note that if an Api3 representative has provided you with this command, you can expect the Market page to point to an active feed and the proxy to already be deployed.
Do not proceed with the integration until you confirm both conditions.

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
It is good practice to validate against such conditions, as in `require(value > 0)`.

:::

All Api3 data feeds have 18 decimals.
For example, if ETH/USD is `2918.5652133`, `value` will read `2918565213300000000000`.

::: info ⚠️ Warning

It is extremely risky to validate the data feed value based on practical assumptions.
An example where doing so went wrong was Chainlink requiring their LUNA/USD data feed value to be at least `0.1`.
Doing so caused them to misreport by an order of magnitude during the UST depeg, and caused a dApp to suffer more than $14MM in damages.

We do not utilize such heuristics on our end, and recommend that you be very careful if you do.

:::

#### Using `timestamp`

`timestamp` is a `uint32`, which is the median of individual on-chain data feed `timestamp`s that contribute to the aggregation.
The `timestamp` of an individual data feed represents the system timestamp that the respective API provider reported when they called their API to get the value.
Its main role is to act as a nonce that prevents data feed updates from being replayed.

::: info ⚠️ Warning

`timestamp` is not the block timestamp at the time of the update.
It is the reported system (i.e., off-chain) time.
One common mistake is using `require(timestamp <= block.timestamp)`.
This check should be avoided for two reasons:

1. If `block.timestamp` lags compared to actual time, this will revert.
   However, that is not a valid reason to avoid using the data feed, as doing so will cause unnecessary downtime for your contract.
2. Some L2 implementations use the timestamp of the latest block as `block.timestamp` (rather than the system time of the node) when a static call is made to the RPC endpoint.
   This means that the `require()` will revert during static calls even when `block.timestamp` does not actually lag.
   This prevents OEV searchers from using the intended workflow and reduces the amount of OEV Rewards you will receive in practice.

:::

In general, the only acceptable use of `timestamp` is validating whether the heartbeat interval is upheld, as in `require(timestamp + 24 hours > block.timestamp)`.
However, unless your contract design specifically relies on the data feed value being at most a day old (which is unlikely), we do not necessarily recommend this approach either.

::: info 💡 Tip

Your auditors may not be familiar with best practices in the context of Api3 data feeds.
We recommend directing them to this page.

:::

## Mixed oracle design

Some dApps choose to mix oracle solutions, either by refusing service if they are not in consensus, or by using one primarily and deferring to another in case of inconsistency.

In such setups, Api3 data feeds need to be treated differently due to OEV considerations.
Specifically, the vast majority of OEV is extracted during times of volatility, and allowing other oracle solutions interfere during such times may result in the loss of a significant amount of OEV revenue.
In practice, this will play out as an OEV searcher bidding a significant amount for a detected OEV opportunity, only to realize after the auction ends that the dApp now defers to a non-Api3 data feed and the OEV opportunity no longer exists.
Such ambiguity will deter OEV searchers from your dApp or cause them to bid much less to hedge their risk, reducing your [OEV Rewards](/dapps/oev-rewards/).

The golden standard is only using Api3 data feeds, in which case OEV searchers will be able to bid on OEV opportunities with full confidence, knowing that they will be able to extract if they win the auction.
If you must use Api3 data feeds as your primary source with another solution as a fallback, you should tolerate as much inconsistency as possible.

::: info 💡 Tip

We recommend that you tolerate at least 10% inconsistency.
Based on our analysis, any less will hinder OEV extraction during times of high volatility.

:::

Note that using Api3 data feeds for only some asset prices still counts as a mixed design.
Consider a lending platform that uses the ETH/USD Api3 data feed and the USDT/USD data feed from another oracle solution.
A user takes out a USDT loan with ETH collateral, and the following price action renders the position liquidatable once the ETH/USD data feed is updated.
Even if an OEV searcher detects the opportunity, they must consider that a rogue USDT/USD update by the other oracle solution may expose it to the public before they can claim it, leading them to avoid bidding a fair amount.

::: info 💰 Financial

It is up to you to maximize your OEV Rewards by integrating correctly.
Not maximizing OEV Rewards causes a loss of profits and therefore constitutes a security issue.

:::
