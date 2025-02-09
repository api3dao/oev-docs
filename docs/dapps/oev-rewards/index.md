---
title: Getting paid
pageHeader: dApps → OEV Rewards
outline: deep
---

<PageHeader/>

# Getting paid

dApps that use traditional data feeds are constantly exploited by MEV bots that manipulate the order of operations around individual data feed updates.
In practice, this causes dApps to suffer significant and continuous financial losses.
As the antidote, API3's OEV Network auctions off to OEV searchers the privilege to determine the order of operations around data feed updates.
The resulting auction proceeds are paid to the dApp in the form of OEV Rewards.
Assuming competitive auctions, OEV Rewards will be equal to the amount that would otherwise have been lost to the MEV bots.

API3 data feeds work identically to traditional data feeds, which means that you do not need to modify your contracts in any way to use them.
You can drop in API3 data feeds to replace your current data feeds and immediately start earning OEV Rewards.

## How to get onboard

Use [this form](https://api3dao.typeform.com/to/FHhFIL41) to contact an API3 representative who will walk you through the following steps:

1. We register your dApp so it appears on the API3 Market [integration page.](../integration/index.md#integration-information)
2. You let us know which chains you operate on and which data feeds you want to use.
3. We purchase subscriptions for you (if applicable) and deploy an OEV Rewards-enabled Api3ReaderProxyV1 contract for each data feed you will use.
4. You integrate these Api3ReaderProxyV1 contracts according to the [instructions.](/dapps/integration/contract-integration)

At the end of each month, API3 will make available a report and 80% of the OEV revenue in the native gas token of the network where your dApp is deployed, with the remaining auction proceeds retained as the protocol fee.

::: info 💰 Financial

API3 provides data feeds [at cost](/dapps/integration/index#pricing) and enables dApps to benefit from OEV Rewards on top.
You might ask, "What's the catch?"
There is none; OEV Rewards come at the expense of third parties who would otherwise solely benefit from MEV.

:::

## Best practices to maximize OEV Rewards

::: info ⚠️ Warning

[Mixed oracle design](/dapps/integration/contract-integration#mixed-oracle-design) is the main culprit behind lackluster OEV Rewards.
If your contract integration is faulty, the suggestions below are unlikely to help.

:::

OEV Rewards are proceeds from auctions in which OEV searchers participate.
For the auction bids to be competitive, there must be multiple independent OEV searcher parties.
An OEV searcher is a blockchain developer with specific expertise whose time is typically quite valuable.
Therefore, for a maximum amount of OEV Rewards, searching for your dApp must be as easy as possible.

::: info 💰 Financial

Investing resources in bootstrapping OEV searcher activity may be required to maximize OEV Rewards.

:::

OEV searchers make a simple revenue–cost estimation before deciding whether to search for your dApp.
The easiest way to tilt this equation in your favor is to provide excellent documentation on how OEV searchers should interact with your dApp.
Going one step further is developing and open-sourcing an OEV bot for your dApp that anyone can use and improve upon.
An open-source bot that works well and is easy to operate will attract many users, driving searcher profit margins down and your OEV Rewards up.
Finally, you can [be your own OEV searcher](/oev-searchers/) and participate in the auctions of your dApp.

::: info 💡 Tip

If your dApp is a fork of a well-established DeFi protocol, the barrier to entry for searching your dApp will be minimal.
Since API3 is also incentivized to maximize OEV Rewards, we will provide access to a library of example open-source OEV bots.

:::

The second way to attract OEV searchers and maximize OEV Rewards is to increase revenue.
For example, a lending platform that pays 10% of the position size as a liquidation reward will attract more attention than one that pays 5%.
Similarly, a perpetual derivative exchange that properly uses API3 data feeds is likely to yield a significant amount of OEV Rewards.

::: info 💰 Financial

Consider treating OEV Rewards as your main source of revenue rather than an extra source.
Do you really need to charge a protocol fee for your dApp if you're receiving sufficient OEV Rewards?

:::
