---
title: OEV Network
pageHeader: OEV → Overview
outline: deep
---

<PageHeader/>

# OEV Auctioneer

OEV Auctioneer is the off-chain system managed by the API3 DAO to process
auctions that happen on the OEV network. This off-chain component is necessary,
because hosting auctions fully on-chain would be extremely gas intensive and
wouldn't scale performance wise. The correctness and honesty of OEV Auctioneer
can be verified on-chain, because the logic is based solely on the
[OevAuctionHouse](/oev/overview/oev-network#oevauctionhouse) contract state and
events at a given time.

OEV Auctioneer has two main responsibilities:

1. Resolve auctions and award the winner.
2. Confirm or contradict fulfillments.

Each dApp which uses OEV feeds is served by some Auctioneer instance.
Internally, API3 DAO may run multiple Auctioneers as a form of horizontal
scaling to ensure auctions can be processed in a timely manner.

## How it works?

Auctioneer processes logs emitted by the OevAuctionHouse contract and responds
back by transacting with the same contract. Auctioneer is deployed on AWS with
well established security. It holds a wallet, which is given the rights to
resolve the auctions and confirm/contradict fulfillments.

The only cross chain communication happens during fulfillment verification - all
other operations are performed solely on OEV Network or the target chain of the
dApp. This minimizes the latency incurred and improves the resiliency.

## Additional constraints

Auctioneer also adds additional constraints which are not enforced at the
contract level. These impact the searchers and are detailed in the
[searchers' OEV Auctioneer documentation](/oev/searchers/oev-auctioneer).

## Maintenance

Auctioneer is maintained by the API3 DAO, which is responsible for its uptime
and reliable auction processing. In case of a planned migration or maintenance,
there will be an announcement shared in advance. It's expected that maintenance
periods will be very rare and short.
