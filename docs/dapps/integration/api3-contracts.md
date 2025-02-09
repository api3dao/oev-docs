---
title: api3/contracts
pageHeader: dApps → Integration
---

<PageHeader/>

# `@api3/contracts`

[`@api3/contracts`](https://www.npmjs.com/package/@api3/contracts) is an npm package that provides three basic features for API3 data feed users:

1. `@api3/contracts/interfaces/IApi3ReaderProxy.sol` is imported by contracts that call Api3ReaderProxyV1 contracts through IApi3ReaderProxy.
2. `@api3/contracts/mock/MockApi3ReaderProxy.sol` is used in tests.
3. - `computeCommunalApi3ReaderProxyV1Address()` is used to validate adresses shown by API3 Market when ["Skip OEV Rewards"](./index.md#integration-information) is selected.
   - `computeDappSpecificApi3ReaderProxyV1Address()` is used to validate adresses shown by API3 Market when ["Earn OEV Rewards"](./index.md#integration-information) is selected.

For detailed examples of how to use these features, see the [`data-feed-reader-example` repository.](https://github.com/api3dao/data-feed-reader-example)

Additionally, `@api3/contracts` provides a CLI command for printing OEV Rewards-enabled (i.e., dApp-specific) Api3ReaderProxyV1 addresses, as described [here.](./contract-integration.md#printing-api3readerproxyv1-addresses)

::: info ℹ️ Info

[AggregatorV2V3Interface](/dapps/integration/aggregatorv2v3interface.md) is not exported from this package, since contracts using this interface must have already imported it from elsewhere.

:::
