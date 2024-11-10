---
title: Verify Airnode addresses
pageHeader: dApps → Integration
outline: deep
---

<PageHeader/>

# Verify Airnode addresses

API providers announce their Airnode addresses in the form of a DNS `TXT` record.
This page explains how the Airnode address of an API provider can be verified by referring to this record.

::: info ℹ️ Info

Airnode is a first-party oracle node designed to be operated by API providers.
The on-chain counterpart of Airnode is referred to as the Airnode protocol.

The Airnode protocol involves the API provider signing their data with an EOA wallet.
The address of this wallet is referred to as the Airnode address in the contracts.
An API provider's Airnode address is the same for all chains.

:::

The key for the `TXT` record is `chainapi-verification-keys` and is an array of Airnode addresses owned by the API provider.
You can use any DNS lookup tool to check the records of an API provider.
Below is a list of hyperlinks that allows you to do so through DigitalOcean:

- [Alchemy](https://www.digitalocean.com/community/tools/dns?domain=alchemy.com#TXT-Records)
- [Ankr](https://www.digitalocean.com/community/tools/dns?domain=ankr.com#TXT-Records)
- [Blast API](https://www.digitalocean.com/community/tools/dns?domain=blastapi.io#TXT-Records)
- [CoinGecko](https://www.digitalocean.com/community/tools/dns?domain=coingecko.com#TXT-Records)
- [Coin Metrics](https://www.digitalocean.com/community/tools/dns?domain=coinmetrics.io#TXT-Records)
- [CoinPaprika](https://www.digitalocean.com/community/tools/dns?domain=coinpaprika.com#TXT-Records)
- [dRPC](https://www.digitalocean.com/community/tools/dns?domain=drpc.org#TXT-Records)
- [dxFeed](https://www.digitalocean.com/community/tools/dns?domain=dxfeed.com#TXT-Records)
- [Finage](https://www.digitalocean.com/community/tools/dns?domain=finage.co.uk#TXT-Records)
- [Kaiko](https://www.digitalocean.com/community/tools/dns?domain=kaiko.io#TXT-Records)
- [NCFX](https://www.digitalocean.com/community/tools/dns?domain=newchangefx.com#TXT-Records)
- [Nodary](https://www.digitalocean.com/community/tools/dns?domain=nodary.io#TXT-Records)
- [Twelve Data](https://www.digitalocean.com/community/tools/dns?domain=twelvedata.com#TXT-Records)
