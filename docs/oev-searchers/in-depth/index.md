---
title: Getting started
pageHeader: OEV Searchers → In Depth
outline: deep
---

<PageHeader/>

# Getting started

This is a good starting place for searchers. It includes the list of good dApp candidates for searching, details how OEV auctions
work and explains basic OEV searching strategy to simplify the onboarding of
existing MEV searchers to OEV.

## OEV dApps catalog

Api3 feeds are used across many dApps, but not all are suitable for OEV searching. This catalog includes those dApps that are generating large OEV amounts and are open for searchers to participate.

<!-- NOTE: Make sure these are sorted alphabetically; title matches information in @api3/contracts; homepage points to the dApp market (can differ from dApp landing page) -->

1. [dTRINITY on Fraxtal](https://dtrinity.org/)
2. [INIT Capital on Mantle](https://app.init.capital/?chain=5000)
3. [Lendle on Mantle](https://lendle.xyz/)
4. [MachFi on Sonic](https://www.machfi.xyz/)
5. [Vicuna Finance on Sonic](https://vicunafinance.com/)
6. [Yei Finance on Sei](https://www.yei.finance/)

### Legacy integrations

Some dApps are still using the legacy design of oracle proxies, which do not support OEV auctions. It's expected these will migrate the OEV supported ones soon. That said, searchers can already
perform [MEV with Signed APIs](/oev-searchers/in-depth/mev-with-signed-apis)
extraction.

<!-- NOTE: Make sure these are sorted alphabetically; title matches information in @api3/contracts; homepage points to the dApp market (can differ from dApp landing page) -->

1. [Compound Finance USDe market on Mantle](https://app.compound.finance/markets/usde-mantle)
2. [Hana Finance on Taiko](https://www.hana.finance/)
3. [INIT Capital on Blast](https://app.init.capital/?chain=81457)
4. [Orbit Protocol on Blast](https://orbitlending.io/)
5. [Silo Finance RDNT market](https://app.silo.finance/silo/0x19d3F8D09773065867e9fD11716229e73481c55A)

## From MEV searching

MEV searching has a well-established community and expertise in securing health
and stability across many dApps and chains. We want to motivate this community
to join OEV searching by outlining the steps to transition from MEV to OEV.

OEV can be considered an extension of MEV that searchers can capitalize on. While traditional searching prioritizes low latency, OEV searchers can secure guaranteed profits through exclusive priority access for updating data feeds.

The following is a short list of requirements to upgrade an existing MEV
bot to participate in OEV searching:

1. Bridge funds to the OEV network
2. Deposit funds to the OevAuctionHouse contract
3. Monitor off-chain signed data for dAPIs used by the dApp
4. Simulate the data feed update on-chain to determine OEV opportunities
5. Place a bid on the OEV Network
6. Wait for the auction to end
7. Provided the auction is won, use the award to update the on-chain data feed on target chain and capture
   the OEV

Most of these steps require small additions to the existing MEV bot, but it is
required to understand the mental model behind OEV and our
[dAPIs](#/oev-searchers/in-depth/dapis/). Because of this, we recommend starting
with an in-between solution we call
[MEV with Signed APIs](/oev-searchers/in-depth/mev-with-signed-apis).
