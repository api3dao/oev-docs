---
title: Getting paid
pageHeader: dApps → OEV Rewards
---

<PageHeader/>

# Getting paid

dApps that use traditional data feeds are constantly exploited by MEV bots that manipulate the order of operations around individual data feed updates.
In practice, this causes dApps to suffer significant and continuous financial losses.
As the antidote, Api3's OEV Network auctions off to OEV searchers the privilege to determine the order of operations around data feed updates.
80% of the [resulting revenue](#breaking-down-oev-rewards) is paid to the dApp in the form of OEV Rewards.

::: info 💰 Financial

Api3 provides data feeds [at cost](/dapps/integration/index#pricing) and enables dApps to benefit from OEV Rewards on top.
You might ask, "What's the catch?"
There is none; OEV Rewards come at the expense of third parties who would otherwise solely benefit from MEV.

:::

Api3 data feeds work identically to traditional data feeds, which means that you do not need to modify your contracts in any way to use them.
You can drop in Api3 data feeds to replace your current data feeds and immediately start earning OEV Rewards.
If you want to maximize your OEV Rewards, make sure to check out our [guide for best practices.](/dapps/oev-rewards/best-practices)

## How to get onboard

Use [this form](https://api3dao.typeform.com/to/FHhFIL41) to get in contact with an Api3 representative who will walk you through the following steps:

1. We register your dApp for it to show up on the Api3 Market [integration page.](/dapps/integration/index.md#integration-information)
2. You let us know which chains you operate on so we can start running the respective auctions.
   ::: info 💡 Tip
   Don't forget to notify us if you expand to new chains later on.
   :::
3. You let us know which data feeds you will use.
   If a gas grant is applicable, we purchase subscriptions for you and deploy an OEV Rewards-enabled Api3ReaderProxyV1 contract for each data feed.
   ::: info 💡 Tip
   Alternatively, you can complete this step on your own using [Api3 Market.](https://market.api3.org/)
   :::
4. You let us know an address where to receive the OEV Rewards.
   ::: info 💡 Tip
   OEV Rewards are paid in the native currency of your dApp's chain.
   The receiving address must be an EOA you control or a contract capable of receiving native currency payments.
   :::
5. You [integrate](/dapps/integration/contract-integration) the OEV Rewards-enabled Api3ReaderProxyV1 contracts.

At the end of each month, Api3 will make available a report and 80% of the OEV revenue in the native gas token of the network where your dApp is deployed, with the remainder retained as the protocol fee.

## Breaking down OEV Rewards

dApps receive 80% of the OEV revenue in the form of OEV Rewards.
This revenue can be broken down into three parts:

1. Proceeds of the auctions held on OEV Network
2. Revenue from OEV searching activity facilitated by Api3 to ensure a baseline level of competition in the auctions (e.g., with a 20% profit margin, which should be easily beaten by organic searchers)
3. Revenue from MEV searching activity facilitated by Api3 as a failsafe for the above

::: info ℹ️ Info

The OEV and MEV searching activity facilitated by Api3 is strictly limited to using data that is already available to the public, as documented in the [OEV searcher docs.](/oev-searchers/)
This can be audited retrospectively by referring to data on OEV Network and the chain that the dApp is on.

A side-effect of the above is that once organic searcher activity takes hold for a dApp, Api3 will no longer be able to generate searcher revenue, and the auction proceeds will constitute the entirety of the OEV Rewards.
This will result in more efficient and robust capturing of OEV, and thus is a desirable outcome for the dApp.

:::
