---
title: AggregatorV2V3Interface
pageHeader: dApps → Integration
---

<PageHeader/>

# AggregatorV2V3Interface

AggregatorV2V3Interface is intended for use by contracts that were originally built to use Chainlink data feeds.
All considerations from the [contract integration page](/dapps/integration/contract-integration.md) still apply.

::: info ⚠️ Warning

API3 data feeds are aggregated from asynchronous data feeds to provide maximal availability guarantees, which means they are not updated in rounds.
As a side effect, Api3ReaderProxyV1 does not implement the round-related functionality of AggregatorV2V3Interface.
If your contract depends on round-related functionality, it would not be appropriate to use Api3ReaderProxyV1 via AggregatorV2V3Interface.
Instead, we recommend using IApi3ReaderProxy with a custom adapter that fits your specific needs.

:::

You can interact with Api3ReaderProxyV1 through AggregatorV2V3Interface if all of the following conditions apply:

- Your contract primarily relies on the current data feed value (`latestAnswer()` of AggregatorInterface or `answer` returned by `latestRoundData()` of AggregatorV3Interface).
- If your contract uses the current data feed timestamp (`latestTimestamp()` of AggregatorInterface or `updatedAt` returned by `latestRoundData()` of AggregatorV3Interface), it must be used only for staleness checks (e.g., to verify if the feed has been updated within the last heartbeat interval).
- Any other values used must not affect your contract's logic or your dApp's off-chain infrastructure.
  For example, your contract may emit `roundId` in an event strictly for logging purposes.
- Your dApp's off-chain infrastructure does not depend on events defined in AggregatorInterface.

::: info 💡 Tip

Lending protocols typically satisfy these conditions.

:::

On the other hand, you should not interact with Api3ReaderProxyV1 through AggregatorV2V3Interface if any of the following conditions applies:

- Your contract depends on Chainlink feed implementation details, such as the round ID increasing with every update.
- Your contract depends on querying past updates using `getAnswer()` or `getTimestamp()` of AggregatorInterface, or `getRoundData()` of AggregatorV3Interface.
- Your dApp's off-chain infrastructure depends on events defined in AggregatorInterface.

::: info 💡 Tip

DeFi protocols such as perpetual derivative exchanges are typically vulnerable to MEV searchers performing time arbitrage.
Chainlink data feeds provide past round data primarily to address this issue, but this solution significantly degrades UX by requiring multiple transactions for certain actions.
Instead, you can simply read the latest data feed value from an API3 data feed and receive compensation for time arbitrage value extraction through [OEV Rewards.](/dapps/oev-rewards/)

:::

If you have any doubts about interacting with Api3ReaderProxyV1 through AggregatorV2V3Interface, you can refer to the [Api3ReaderProxyV1 implementation](https://github.com/api3dao/contracts/blob/main/contracts/api3-server-v1/proxies/Api3ReaderProxyV1.sol) to see exactly how these functions behave.
