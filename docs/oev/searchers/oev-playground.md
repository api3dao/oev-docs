---
title: OEV Playground
pageHeader: OEV → Searchers
outline: deep
---

<PageHeader/>

# OEV Playground

For the previous OEV version we had developed an OEV playground that explained
the auction process through an interactive UI. While this provided a great intro
to the auction process, it only scratched the surface of OEV. To provide a full
playground for OEV liquidations, we've decided to launch our own dApp built with
API3 OEV proxies. This allows us to build a fully functional OEV bot and share
that as a reference.

## The dApp

::: warning

The dApp is using real assets to allow for a more realistic experience. The dApp
is meant to serve as a playground for OEV bots. If you're just looking to
borrow/lend assets, use the real Compound dApp or other platform instead.

:::

The dApp is a Compound3 fork launched on a Base network with real assets,
serving as an OEV playground. The dApp offers a very basic UI for borrowing and
lending assets. It mirrors the
[real USDC Comet on Base](https://app.compound.finance/markets/usdc-basemainnet)
and allows for borrowing USDC by supplying and of the ETH, cbETH, wstETH as
collateral.

Refer to this table for dApp's details:

| Name                                                                                           | Description                             |
| ---------------------------------------------------------------------------------------------- | --------------------------------------- |
| [API3 Compound](https://oev-v1-compound.vercel.app/markets)                                    | Link to the OEV playground dApp.        |
| [USDC Comet address](https://basescan.org/address/0xa193bcE4554663FECde688D5921dF38D4D41AA96)  | The address of the USDC Comet contract. |
| [USDC address](https://basescan.org/address/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913#code)   | The address of the USDC token.          |
| [WETH address](https://basescan.org/address/0x4200000000000000000000000000000000000006#code)   | The address of the WETH token.          |
| [cbETH address](https://basescan.org/address/0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22#code)  | The address of the cbETH token.         |
| [wstETH address](https://basescan.org/address/0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452#code) | The address of the wstETH token.        |

## The OEV Bot

See the [GitHub implementation](https://github.com/api3dao/oev-v1-compound-bot)
for details.
