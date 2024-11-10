---
title: AggregatorV2V3Interface
pageHeader: dApps → Integration
---

<PageHeader/>

# AggregatorV2V3Interface

AggregatorV2V3Interface is intended to be used by contracts that were originally built to use Chainlink data feeds.
All considerations in the [contract integration page](/dapps/integration/contract-integration.md) still apply.

::: info ⚠️ Warning

API3 data feeds are aggregated from asynchronous data feeds for maximal availability guarantees.
As a side effect, Api3ReaderProxyV1 does not implement the round-related functionality of AggregatorV2V3Interface.
If your contract depends on these, it would not be appropriate to use Api3ReaderProxyV1 via AggregatorV2V3Interface.
We would instead recommend you to use IApi3ReaderProxy with a custom adapter that fits your specific needs.

:::

You can interact with Api3ReaderProxyV1 through AggregatorV2V3Interface if all of the below apply:

- Your contract mainly depends on the current data feed value (`latestAnswer()` of AggregatorInterface or `answer` returned by `latestRoundData()` of AggregatorV3Interface).
- If your contract uses the current data feed timestamp (`latestTimestamp()` of AggregatorInterface or `updatedAt` returned by `latestRoundData()` of AggregatorV3Interface), and it is only for a staleness check, e.g., to check if the feed has been updated in the last heartbeat interval.
- If any other values are used, they do not affect the logic of your contract or the off-chain infrastructure of your dApp.
  For example, your contract only emits `roundId` in an event, and strictly for logging purposes.
- The off-chain infrastructure of your dApp does not depend on the events defined in AggregatorInterface.

::: info 💡 Tip

Lending protocols typically satisfy the above.

:::

On the other hand, you should not interact with Api3ReaderProxyV1 through AggregatorV2V3Interface if any of the below applies:

- Your contract depends on Chainlink feed implementation details, such as the round ID increasing with every update.
- Your contract depends on being able to query past updates using `getAnswer()` or `getTimestamp()` of AggregatorInterface, or `getRoundData()` of AggregatorV3Interface.
- The off-chain infrastructure of your dApp depends on the events defined in AggregatorInterface.

::: info 💡 Tip

DeFi protocols such as perpetual derivative exchanges are typically vulnerable to MEV searchers performing time arbitrage.
The main reason Chainlink data feeds provide past round data is to address this issue, which comes with significant UX degradation by requiring some actions to take multiple transactions.
Instead, you can simply read the latest data feed value from an API3 data feed, and get paid the value extracted through time arbitrage in the form of OEV Rewards.

:::
