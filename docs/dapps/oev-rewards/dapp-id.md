---
title: dApp ID
pageHeader: dApps → OEV Rewards
---

<PageHeader/>

# dApp ID

API3 uses a dApp ID to identify a dApp on a specific chain, similar to how chain IDs are used to identify networks.
It is a 256-bit unsigned integer, and is assigned to dApps by API3 in an incremented way with no specific order.
The dApp ID of a dApp is static, it never changes.

## dApp ID list

| dApp ID | dApp alias            | Network            |
| ------- | --------------------- | ------------------ |
| 1       | API3 Market (default) | All networks       |
| 2       | MyPlaceholderDapp     | Ethereum (1)       |
| 3       | MyPlaceholderDapp     | Gnosis Chain (100) |

## Getting assigned a dApp ID

Send an email to `XXX@api3.org`, specifying

- The URL of your dApp,
- The chain IDs of the networks that your dApp is deployed on,
- The address of the account that will receive the OEV Rewards on each network,
- The list of data feeds that your dApp will use on each network.

::: info 💡 Tip

We will need to confirm that you represent the dApp.

:::

## Usage by the dApp

While reading API3 data feeds, dApps must use the Api3ReaderProxyV1 contracts [deployed](/dapps/integration/contract-integration#deployment-parameters) with their own dApp ID.

::: info ⚠️ Warning

dApps that use Api3ReaderProxyV1 contracts deployed with dApp IDs that do not belong to them are not eligible for OEV Rewards.
They will not receive auction proceeds even if there has been any.

:::

## Usage by the OEV searcher

OEV searchers need to know the dApp ID of the dApp they are searching for to place and pay for bids.
