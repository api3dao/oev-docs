---
title: Best practices
pageHeader: dApps → OEV Rewards
---

<PageHeader/>

# Best practices

::: info ⚠️ Warning

[Mixed oracle design](/dapps/integration/contract-integration#mixed-oracle-design) is the main culprit behind lackluster OEV Rewards.
If your contract integration is faulty, the suggestions below are unlikely to help.

:::

For OEV auctions to be competitive, there must be multiple independent OEV searcher parties.
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
Since Api3 is also incentivized to maximize OEV Rewards, we will provide access to a library of example open-source OEV bots.

:::

The second way to attract OEV searchers and maximize OEV Rewards is to increase incentives.
For example, a lending platform that pays 10% of the position size as a liquidation reward will attract more attention than one that pays 5%.
Similarly, a perpetual derivative exchange that uses Api3 data feeds as intended is likely to yield a significant amount of OEV Rewards.

::: info 💰 Financial

Consider treating OEV Rewards as your main source of revenue rather than an extra source.
Do you really need to charge a protocol fee for your dApp if you're receiving sufficient OEV Rewards?

:::
