---
title: OEV
pageHeader: OEV → Overview
outline: deep
---

<PageHeader/>

# What is OEV?

Oracle Extractable Value (OEV) is a subset of Maximal Extractable Value (MEV)
that occurs as a result of an oracle update. The idea is that not all oracle
updates are the same. Some oracle updates expose opportunities on the market
which can be captured by "searchers". Searchers monitor the market for
profitable opportunities and compete with each other to realize them the first -
paying the majority of the exposed value to block validators in the process.
This dynamics is unhealthy, because the majority of the value should be split
between the dApp and the searcher who realized the the opportunity.

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

Learn more about OEV in a summary of the
[OEV Litepaper](https://medium.com/api3/oracle-extractable-value-oev-13c1b6d53c5b).

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

<!-- TODO: Refactor this section -->

Integrating OEV-enabled data feeds can turn this fee previously being imposed on
your users into a powerful economic incentive for your protocol. With the OEV
Network, fees typically extracted through liquidation bots will be recaptured
and be able to be used for more productive means. API3 has delivered a
specialized Order Flow Auction (OFA) that maximizes the value returned to your
dApp from OEV through a sealed bid auction process similar to the one you might
be familiar with from Flashbots and MEV-Boost.

Instead of overpaying for liquidations with a fixed incentive, that during large
liquidation opportunities can be much much higher than it needs to be, a sealed
bid auction hosted at the oracle can minimize the value being paid out and
return most of it back to the dApp. The liquidations will also be able to occur
in a more timely manner because you do not have to wait for a deviation
threshold to trigger oracle updates, creating a lower latency and more robust
liquidation process.

## Re-directing MEV to dApps

Within certain DeFi protocols the arbitrage created due to oracle latency can
undermine the ability for an LPs ability to be profitable. In turn this forces
protocols, particularly derivatives, to impose higher fees on users. Capturing
OEV at the data feed level can help improve LP profitability by auctioning off
the arbitrage opportunities and returning the corresponding value to dApps. More
accurate data and value capture from the auction can be used to increase
profitability and sustainability of liquidity provision, allowing for a more
optimal market making protocol for apps that use oracles. Better market making
from a dApps LPs creates a flywheel effect of drawing more liquidity to the
application while being able to lower fees and list more assets, which then
attracts more users and volume.

## Understanding the problem

Traditional oracle solutions update data feeds blindly, which is wasteful and
provides poor granularity. Introducing the ability for OEV auctions to
contribute to oracle updates, alongside push-updates, results in maximally
accurate data feeds alongside an opportunity to recapture MEV currently leaked
around liquidation processes.

For an in-depth understanding of Oracle Extractable Value we suggest to read the
[OEV Litepaper](https://raw.githubusercontent.com/api3dao/oev-litepaper/main/oev-litepaper.pdf).

## The OEV Network

The OEV Network is a ZK-rollup to capture the OEV from all dApps that use API3
data feeds. The OEV Network is powered by Polygon CDK, a framework for creating
custom ZK-rollups.

You can consider the OEV Network to be a specialized order flow auction platform
that sells the rights to execute data feed updates for specific dApps to the
highest bidder. The winner pays while executing the data feed update, allowing
the dApp to immediately receive the proceeds on their native chain. This all
runs as a sidecar to our regular data feeds, meaning that a dApp that uses API3
data feeds will be able to simply enable OEV Network and start earning.

## Returning value to DeFi protocols

It’s common to see that it’s the block producer (and not the liquidator)
capturing 99.9% of the liquidation revenue. These liquidation rewards are often
in the 5-10% range of the users collateral, which is a relatively large fee to
impose on users of lending protocols. These liquidations represent a small over
% of the millions extracted within the MEV supply chain.

API3 believe this value should go back to those operating the protocol. As such
90% of recaptured OEV will be given to those consuming the price feed. 10% will
be shared between API3, the searcher and the API Provider.

::: info

Recapturing OEV requires no technical implementation (if you're already using
dAPIs)

:::
