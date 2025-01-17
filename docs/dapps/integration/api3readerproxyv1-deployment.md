---
title: Contract integration
pageHeader: dApps → Integration
outline: deep
---

<PageHeader/>

# Api3ReaderProxyV1 deployment

Api3ReaderProxyV1 is designed to be deployed by calling the `deployApi3ReaderProxyV1()` function of Api3ReaderProxyV1Factory.
Purchasing a plan for a data feed on API3 Market deploys a communal Api3ReaderProxyV1 for it automatically, whose address is displayed on the [integration page.](https://market.api3.org/blast/eth-usd/integrate)
Alternatively, [`data-feed-reader-example`](https://github.com/api3dao/data-feed-reader-example) provides [instructions](https://github.com/api3dao/data-feed-reader-example/blob/main/scripts/README.md#deploying-proxy-contracts-programmatically) for how (communal and dApp-specific) Api3ReaderProxyV1 contracts can be deployed programmatically.

::: info 💡 Tip

In short, if your dApp has a [dApp alias](/dapps/oev-rewards/dapp-alias) assigned, deploy your own Api3ReaderProxyV1 contracts by referring to the [instructions in `data-feed-reader-example`.](https://github.com/api3dao/data-feed-reader-example/blob/main/scripts/README.md#deploying-proxy-contracts-programmatically)
Otherwise, use the communal Api3ReaderProxyV1 addresses displayed on the integration pages of the respective data feeds.

With either option, we recommended you to validate the Api3ReaderProxyV1 addresses using [`@api3/contracts`.](/dapps/integration/api3-contracts.md)

:::

## Parameters

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
