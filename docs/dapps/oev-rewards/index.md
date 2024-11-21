---
title: Getting paid
pageHeader: dApps → OEV Rewards
outline: deep
---

<PageHeader/>

# Getting paid

dApps that use traditional data feeds are constantly exploited by MEV bots that manipulate the order of operations around individual data feed updates.
In practice, this causes dApps to suffer significant and continuous financial losses.
As the antidote, API3 auctions off the privilege to determine the order of operations around data feed updates to OEV searchers, and pays the auction proceeds to the dApp in the form of OEV Rewards.
Assuming competitive auctions, OEV Rewards will be equal to the amount that would otherwise have been lost to the MEV bots.

API3 data feeds work identically to traditional data feeds, which means that you do not need to modify your contracts in any way to use them.
You can drop in API3 data feeds in place of your current data feeds, and immediately start earning OEV Rewards.

## How to get onboard

1. Get assigned a [dApp ID.](/dapps/oev-rewards/dapp-id)
2. [Deploy](/dapps/integration/contract-integration#deployment-parameters) Api3ReaderProxyV1 contracts with this dApp ID.
3. [Integrate](/dapps/integration/contract-integration) the Api3ReaderProxyV1 contracts that you have deployed.

At the end of each month, we will send you a report and 80% of the auction proceeds in the native currency of the network that your dApp is deployed on, and keep the rest as the protocol fee.

::: info 💰 Financial

API3 provides data feeds [at cost](/dapps/integration/index#pricing) and pays OEV Rewards on top.
You might ask "What's the catch?"
There is none, we do this at the expense of the parties that benefit from MEV.

:::

### DEAL

The onboarding workflow described above is temporary.
We are working on a protocol, DEAL, to determine the OEV Rewards beneficiary in a self-serve manner.
DEAL will provide transparent proof that you are the rightful beneficiary of your dApp's OEV Rewards.

::: info 💡 Tip

DEAL will not require any changes to your contract integration, including the Api3ReaderProxyV1 addresses.

:::

## Best practices to maximize OEV Rewards

::: info ⚠️ Warning

[Mixed oracle design](/dapps/integration/contract-integration#mixed-oracle-design) is the main culprit for lackluster OEV Rewards.
If your contract integration is faulty, the suggestions below are unlikely to help.

:::

OEV Rewards are proceeds from auctions that OEV searchers participate in.
For the bids placed at the auctions to be competitive, there needs to be multiple independent OEV searcher parties.
An OEV searcher is a blockchain developer with a specific expertise, whose time typically is quite valuable.
Therefore, for a maximum amount of OEV Rewards, searching for your dApp must be as easy as possible.

::: info 💰 Financial

In most cases, investing some resources into maximizing OEV Rewards upfront will yield the best financial outcome.

:::

OEV searchers make a simple revenue–cost estimation before deciding if they will search for your dApp.
The easiest way to tilt this equation to your favor would be to provide excellent documentation for how OEV searchers should interact with your dApp.
One step ahead of this is developing and open-sourcing an OEV bot for your dApp that anyone can use and improve upon.
An open source bot that works well and is easy to operate will find many users, which will drive searcher profit margins down and your OEV Rewards up.
Finally, you can [be your own OEV searcher](/oev-searchers/) and participate in the auctions of your dApp.

::: info 💡 Tip

If your dApp is the fork of a well-established DeFi protocol, the barrier to entry to search for your dApp will be minimal.
Since API3 is also incentivized to maximize your OEV Rewards, we will maintain a library of open-source OEV bots.

:::

The second way to attract OEV searchers and maximize OEV Rewards is to increase the revenue.
For example, a lending platform that pays 10% of the position size as the liquidation reward will attract more attention than another one that pays 5%.
Similarly, a perpetual derivative exchange that uses API3 data feeds can be expected to yield a significant amount of OEV Rewards.

::: info 💰 Financial

Consider treating OEV Rewards as your main source of revenue, rather than an extra one.
Do you really need to charge a protocol fee on your dApp if you are receiving enough in OEV Rewards?

:::
