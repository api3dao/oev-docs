---
title: api3/contracts
pageHeader: dApps → Integration
---

<PageHeader/>

# `@api3/contracts`

[`@api3/contracts`](https://www.npmjs.com/package/@api3/contracts) is an npm package that provides three basic features that will be useful to API3 data feed users:

1. `@api3/contracts/interfaces/IApi3ReaderProxy.sol` is imported by contracts that call Api3ReaderProxyV1 contracts using IApi3ReaderProxy.
2. `@api3/contracts/mock/MockApi3ReaderProxy.sol` is used in tests.
3. `computeApi3ReaderProxyV1Address()` is used to validate the Api3ReaderProxyV1 addresses.

You can refer to [`data-feed-reader-example`](https://github.com/api3dao/data-feed-reader-example) for a demonstration of how each can be used.

::: info ℹ️ Info

Note that we do not export [AggregatorV2V3Interface](/dapps/integration/aggregatorv2v3interface.md), as contracts that are built to use it are expected to have imported it.

:::
