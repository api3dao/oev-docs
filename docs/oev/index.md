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
opportunities and compete with each other to realize them first - paying the
majority of the exposed value to block validators in the process. This dynamic
is unhealthy, because the majority of the value should be split between the dApp
and the searcher who realized the opportunity.

OEV aims to solve this problem by auctioning off the exclusive rights to execute
the oracle update(s), allowing the searcher to atomically update the price
feed(s) and capture the opportunity on the market. Because of the exclusive
update rights, searchers pay smaller gas fees, because there is no competition.
On the other hand, the auction proceeds are distributed back to the dApp which
created this opportunity.

With OEV, searchers announce the desire to do the oracle updates themselves
along with the amount they are willing to pay for it. The process is facilitated
by open auctions, bound by certain rules. The winner of an auction must pay the
winning bid amount, which allows them to use the oracle update and capture
profitable opportunities.

::: info

**Basic Example**

Imagine an overcollateralized lending platform, which uses an oracle for its
price feeds to ensure prices remains up-to-date. Borrowers of the protocol can
be liquidated with some incentive whenever their position becomes unhealthy to
ensure the protocol remains solvent. Say liquidations can occur if the
loan-to-value ratio is over 90%. Let's look at what happens with the protocol's
health over time.

Assume, that initially there are no unhealthy positions. Many of the price feed
updates that happen are "unnecessary", because they don't expose any unhealthy
positions and the protocol remains healthy. However, say in time there is a
price drop that causes many of the positions which used that asset as collateral
to get close to the 90% liquidation threshold.

In this scenario, the next price update that causes a position to become
unhealthy has some intrinsic value. From the protocol's perspective, this
affects its solvency and presents a threat. On the other hand, for a searcher
this poses a profitable opportunity. The intrinsic value of the price update is
equal to the profit the searcher can make. The profit is simply the liquidation
incentive minus the operational gas costs.

A searcher monitors the dApp and sees that this opportunity is soon to become
unhealthy. They announce that they want to execute the price feed update and pay
X in return. They win the auction, pay X to the dApp and make the oracle update
and liquidation atomically.

The concept of OEV is not tailored only to liquidations, but can occur anywhere
where price feed updates potentially expose profitable opportunities, such as
arbitrage and many more.

:::

## Security

Because OEV is an extension of API3 feeds, it inherits the same guarantees that
the base feeds provide. Furthermore, our contracts and off-chain components
undergone multiple security audits from multiple auditors. Refer to the
[contract's security on GitHub](https://github.com/api3dao/contracts/blob/main/README.md#security)
for details.

## Benefits of OEV

OEV offers advantages to various stakeholders in the ecosystem:

1. For dApps and their users:

   - Receive a major share of the value generated from their protocol's oracle
     updates.
   - Improved efficiency, granularity and decentralization of price feeds.

2. For searchers:

   - Lower gas fees and in general, higher profits.
   - Guaranteed exclusive update rights.

### OEV Proceeds Distribution

To be able to update the data feed, the auction winner must pay the bid amount
of the winning bid, which they've announced during the auction. In return, they
get exclusive rights to capture the OEV. Searchers are compensated for this
activity by the liquidation incentive.

At API3, we believe that those operating the protocol should be compensated much
more - after all, they are the ones who created the opportunity. As such, all of
the bid amounts paid are distributed back to the dApp.

As the bid amount payments are made on the target chain of the protocol, the
accumulated payment amount can be easily computed from on-chain events, so there
is absolute transparency in the process. The funds are withdrawable by API3 DAO,
which will be responsible for distributing the funds back to the dApps.

## How do Auctions Work?

API3 has delivered a specialized Order Flow Auction (OFA) that maximizes the
value returned to your dApp from OEV through a sealed bid on-chain auction
process similar to the one you might be familiar with from Flashbots and
MEV-Boost.

We use a combination of the OEV Network and the OEV Auctioneer to power the OEV
auctions in a secure and transparent way. The contracts and the auction flow
have been audited by Quantstamp.

At a high level, auctions repeat continuously and indefinitely. There is a
separate auction for each dApp. Each auction takes a fixed amount of time.
Searchers place bids during an auction and announce a bid amount they're willing
to pay. When the auction ends, the highest bidder is announced as the winner and
provided a cryptographic signature. The signature gives them exclusive rights to
update any price feed(s) for the dApp for a limited amount of time. Each time an
auction ends, a new one is started and the same process repeats.

After an auction winner fulfills their duties by paying for the winning bid,
they need to report this back to OEV network. If they fail to do so, part of
their collateral gets slashed. This is an important security aspect to prevent
denying OEV recapture by withholding auction payments.

### dApp IDs

Each dApp that uses OEV feeds is assigned a unique ID, called the "dApp ID". The
granularity of auctions is at the dApp level. All of the dApp proxies use the
same dApp ID.

::: info

The auction winner may update single, multiple or all proxies associated with
the same dApp ID before capturing the OEV opportunity. The ID has no other
meaning other than to group proxies of the same dApp together.

:::

### OEV Network

The OEV Network hosts auctions in a transparent way, ensuring that any disputes
can be resolved by analyzing the on-chain data. Searchers submit their bids
on-chain, where the winner is announced and given the exclusive rights to
execute the oracle update.

To learn more about the OEV Network, refer to the
[OEV Network documentation](/oev/overview/oev-network).

### OEV Auctioneer

A key component of OEV is an off-chain auction system that processes the
auctions taking place on the OEV network. We call this system OEV Auctioneer,
and it is managed by the API3 DAO. The honesty of OEV Auctioneer is ensured by
using the OEV Network for all important actions, such as announcing the auction
winner.

To learn more about OEV Auctioneer, refer to the
[OEV Auctioneer documentation](/oev/overview/oev-auctioneer).

## Get Involved with OEV

Ready to optimize your dApp's oracle updates and capture more value? Or looking
to utilize OEV network to searching? Here's how you can get started with OEV:

1. Dive deeper into OEV by reading the
   [OEV Litepaper](https://raw.githubusercontent.com/api3dao/oev-litepaper/main/oev-litepaper.pdf).
2. Check out our [dApp onboarding guide](/oev/dapps/) to see how you can
   implement OEV in your dApp.
3. Check out our [Searchers guide](/oev/searchers/) to see how to start
   searching.
4. Connect with other developers and OEV enthusiasts in our
   [Discord channel](https://discord.com/channels/758003776174030948/1062909222347603989).
5. Follow API3 on [Twitter](https://twitter.com/API3DAO) for the latest news and
   updates on OEV.
