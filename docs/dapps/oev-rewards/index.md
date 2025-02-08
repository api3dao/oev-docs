---
title: Getting paid
pageHeader: dApps → OEV Rewards
outline: deep
---

<PageHeader/>

# Getting paid

dApps that use traditional data feeds are constantly exploited by MEV bots that manipulate the order of operations around individual data feed updates.
In practice, this causes dApps to suffer significant and continuous financial losses.
As the antidote, API3's OEV Network auctions off the privilege to determine the order of operations around data feed updates to OEV searchers.
The resulting auction proceeds get paid to the dApp in the form of OEV Rewards.
Assuming competitive auctions, OEV Rewards will be equal to the amount that would otherwise have been lost to the MEV bots.

API3 data feeds work identically to traditional data feeds, which means that you do not need to modify your contracts in any way to use them.
You can drop in API3 data feeds in place of your current data feeds, and immediately start earning OEV Rewards.

## How to get onboard

Use [this form](https://api3dao.typeform.com/to/FHhFIL41) to get in contact with an API3 representative who will walk you through the following steps:

1. We register your dApp for it to show up on the API3 Market [integration page.](../integration/index.md#integration-information)
2. You let us know which chains you operate on and which data feeds you want to use.
3. We purchase subscriptions for you if applicable and deploy an OEV Rewards-enabled Api3ReaderProxyV1 contract for each data feed you will use.
4. You integrate these Api3ReaderProxyV1 contracts according to [the instructions.](/dapps/integration/contract-integration)

At the end of each month, API3 will make available a report and 80% of the OEV revenue in the native gas token of the network on which your dApp is deployed, with the remainder of the auction proceeds retained as the protocol fee.

::: info 💰 Financial

API3 provides data feeds [at cost](/dapps/integration/index#pricing) and enables dApps to benefit from OEV Rewards on top.
You might ask "What's the catch?"
There is none; OEV Rewards are at the expense of the third parties that otherwise solely benefit from MEV.

:::

### DEAL

The onboarding workflow described above is temporary.
API3 is developing a protocol, DEAL, to determine the OEV Rewards beneficiary in a self-serve manner.
DEAL will provide transparent proof that you are the rightful beneficiary of your dApp's OEV Rewards.

::: info 💡 Tip

DEAL will not require any changes to your contract integration, including the Api3ReaderProxyV1 addresses.

:::

## Best practices to maximize OEV Rewards

::: info ⚠️ Warning

[Mixed oracle design](/dapps/integration/contract-integration#mixed-oracle-design) is the main culprit of lackluster OEV Rewards.
If your contract integration is faulty, the suggestions below are unlikely to help.

:::

OEV Rewards are proceeds from auctions that OEV searchers participate in.
For the bids placed at the auctions to be competitive, there needs to be multiple independent OEV searcher parties.
An OEV searcher is a blockchain developer with a specific expertise, whose time typically is quite valuable.
Therefore, for a maximum amount of OEV Rewards, searching for your dApp must be as easy as possible.

::: info 💰 Financial

Investing some resources into bootstrapping OEV searcher activity may be required to maximize OEV Rewards.

:::

OEV searchers make a simple revenue–cost estimation before deciding if they will search for your dApp.
The easiest way to tilt this equation to your favor would be to provide excellent documentation for how OEV searchers should interact with your dApp.
One step ahead of this is developing and open-sourcing an OEV bot for your dApp that anyone can use and improve upon.
An open source bot that works well and is easy to operate will find many users, which will drive searcher profit margins down and your OEV Rewards up.
Finally, you can [be your own OEV searcher](/oev-searchers/) and participate in the auctions of your dApp.

::: info 💡 Tip

If your dApp is the fork of a well-established DeFi protocol, the barrier to entry to search for your dApp will be minimal.
Since API3 is also incentivized to maximize OEV Rewards, we will provide access to a library of example open-source OEV bots.

:::

The second way to attract OEV searchers and maximize OEV Rewards is to increase the revenue.
For example, a lending platform that pays 10% of the position size as the liquidation reward will attract more attention than another one that pays 5%.
Similarly, a perpetual derivative exchange that properly uses API3 data feeds is likely to yield a significant amount of OEV Rewards.

::: info 💰 Financial

Consider treating OEV Rewards as your main source of revenue, rather than an extra one.
Do you really need to charge a protocol fee on your dApp if you are receiving enough in OEV Rewards?

:::
