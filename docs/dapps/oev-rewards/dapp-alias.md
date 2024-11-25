---
title: dApp alias
pageHeader: dApps → OEV Rewards
---

<PageHeader/>

# dApp alias

API3 uses aliases to identify dApps.
If you are planning to use API3 data feeds and receive OEV Rewards, you want to have a dApp alias assigned to your dApp.
You can see the current list of dApps with aliases [here.](https://github.com/api3dao/contracts/tree/main/data/dapps)

## Why do you need to be assigned a dApp alias?

While reading API3 data feeds, dApps must use the Api3ReaderProxyV1 contracts [deployed](/dapps/integration/contract-integration#deployment) with their own dApp alias.

::: info ⚠️ Warning

Only the dApps that use Api3ReaderProxyV1 contracts deployed with their own dApp aliases are eligible for OEV Rewards.
dApps that use any

- communal Api3ReaderProxyV1 contracts (whose addresses are displayed on API3 Market)
- dApp-specific Api3ReaderProxyV1 contracts that are deployed with the alias of another dApp

are not eligible for OEV Rewards.
They will not receive auction proceeds even if there has been any.

:::

## How to get assigned a dApp alias

Fill in [this form](https://c3pu3z1tpiz.typeform.com/to/XfNSSjKE), specifying

- The URL of your dApp,
- The networks that your dApp is deployed on,
- Your Telegram handle.

We will create a Telegram group to guide you along the rest of the way.
