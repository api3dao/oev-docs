---
title: OEV
pageHeader: OEV → Overview
outline: deep
---

<PageHeader/>

# What is OEV?

Oracle Extractable Value (OEV) is a subset of Maximal Extractable Value (MEV)
that occurs as a result of an oracle update. Traditional oracle solutions update
data feeds blindly, which is wasteful and provides poor granularity.

OEV is an addition to these regular oracle updates to improve efficiency and
granularity of the price feeds. The idea is that not all oracle updates are the
same. Some oracle updates expose opportunities on the market which can be
captured by "searchers". Searchers monitor the market for profitable
opportunities and compete with each other to realize them the first - paying the
majority of the exposed value to block validators in the process. This dynamics
is unhealthy, because the majority of the value should be split between the dApp
and the searcher who realized the the opportunity.

OEV aims to solve this problem by auctioning off the exclusive right to execute
the oracle update(s), allowing the winner to atomically update the price feed(s)
and capture the opportunity on the market. The searcher can pay small gas fees,
because they are guaranteed the exclusive update rights. On the other hand, the
auction proceeds are distributed back to the dApp which created this
opportunity.

With OEV the searcher can announce the the desire for a particular oracle update
along with the amount willing to pay for it. There is an open auction, bound by
certain rules, which selects the winner. The winner must pay the announced
amount and as a result is able to use the oracle update to capture the
opportunity.

For an in-depth understanding of OEV we suggest to read the
[OEV Litepaper](https://raw.githubusercontent.com/api3dao/oev-litepaper/main/oev-litepaper.pdf).

::: info

**Basic Example**

Imagine a basic overcollateralized lending platform, which uses an oracle for
it's price feeds to ensure the price remains up-to-date. Borrowers of the
protocol can be liquidated with some incentive if their position becomes
unhealthy to ensure the protocol remains solvent. Say liquidations can occur if
the loan-to-value ration is over 90%. Let's look what happens with protocol's
health in time.

Assume that initially there are no unhealthy positions. Many of the price feed
updates that happen are "unnecessary", because they don't expose and unhealthy
positions and the protocol remains healthy. However, say in time there a price
drop, that causes many of the positions which used that asset as collateral to
get close to the 90% liquidation threshold.

The price update that causes a position to become unhealthy has some intrinsic
value. From the protocol's perspective, this affects it's solvency and presents
a threat. On the other hand, for searcher this poses a profitable opportunity.
The intrinsic value of the price update is equal to the profit the searcher can
make - the liquidation incentive minus the operational gas costs.

Searcher monitors the dApp and sees that this opportunity is soon to become
unhealthy. They announce that they want to execute the price feed update and pay
X in return. They win the auction, pay X and make the oracle update and
liquidation atomically.

The concept of OEV is not tailored to liquidations only, but can occur anywhere
where price feed updates such as arbitrage and many more.

:::

## Leveraging OEV alongside dAPIs

The prerequisite to leveraging OEV is to use API3’s decentralized APIs (dAPIs).
To learn more about how dAPIs work, please refer to the
[dAPIs documentation](/dapis/).

Integrating OEV dAPIs requires no code changes to the protocol. This is
accomplished by a [proxy contract](/oev/dapps/#proxy-contract). Searchers who
win the auction are able to update the data feed to the up-to-date value, which
will can be read by the dApp through this proxy. There is distinction between
regular updates (performed by API3 push oracle) and the OEV updates (performed
by the searcher).

### Capturing OEV proceeds

For a searcher to be able to update the data feed, they must pay the adequate
bid amount, which they announced in the auction. In return, they get exclusive
rights to capture the OEV. Searchers are compensated for this activity by the
liquidation incentive, which is proven to be enough.

In API3, we believe those operating the protocol should be compensated much
more - after all, they are the ones who created the opportunity. As such, all of
the bid amounts paid are distributed back to the dApp.

The bid amount payments happens on the target chain of the protocol. The
accumulated payment amount can be easily computed from on-chain events, so there
is absolute transparency in the process. The funds are withdrawable by API3 DAO,
which will be responsible for distributing the funds.

<!-- TODO: Document auto BD here -->

## The OEV Network

API3 has delivered a specialized Order Flow Auction (OFA) that maximizes the
value returned to your dApp from OEV through a sealed bid on-chain auction
process similar to the one you might be familiar with from Flashbots and
MEV-Boost.

The OEV Network is an Arbitrum Nitro L2 hosting these auctions in a transparent
way, ensuring any disputes can be resolved by looking at the on-chain data. All
participants submit their bids on-chain, where the winner is announced and given
the exclusive rights to execute the oracle update. All of the auction steps can
be verified by looking at the on-chain data, ensuring honest and transparent
auctions.

A key component to OEV is an off-chain auction system that processes the
auctions happening on the OEV network. We call this system the OEV Auctioneer,
which is managed by the API3 DAO. The honesty of OEV Auctioneer is ensured by
using OEV Network for all important actions, such as announcing the winner and
the bid amount.

To learn more about the OEV Network, refer to the
[OEV Network documentation](/oev/overview/oev-network).
