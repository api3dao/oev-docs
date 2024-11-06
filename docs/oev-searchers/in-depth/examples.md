---
title: Examples
pageHeader: OEV Searchers → In Depth
outline: deep
---

<PageHeader/>

# Examples

We've decided to launch our own dApp built with API3 OEV proxies with minimal
liquidity. This allows us to build a fully functional OEV bot and share it as a
reference without promoting a particular dApp. Because of the small liquidity,
we expect very little competition, making it an ideal way to start with OEV.

## Compound3 Fork

::: warning

The dApp uses real assets to allow for a more realistic experience, but the goal
is to allow testing of the OEV flow. If you're just looking to borrow/lend
assets, use the real Compound dApp or another platform instead.

:::

The dApp is a Compound3 fork launched on the Base network. The dApp offers a
very basic UI for borrowing and lending assets. It mirrors the
[real USDC Comet on Base](https://app.compound.finance/markets/usdc-basemainnet)
and allows for borrowing USDC by supplying any of ETH, cbETH, or wstETH as
collateral.

Refer to this table for dApp details:

| Name                                                                                           | Description              |
| ---------------------------------------------------------------------------------------------- | ------------------------ |
| [API3 Compound](https://oev-v1-compound.vercel.app/markets)                                    | The OEV dApp.            |
| [USDC Comet address](https://basescan.org/address/0xa193bcE4554663FECde688D5921dF38D4D41AA96)  | The USDC Comet contract. |
| [USDC address](https://basescan.org/address/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913#code)   | The USDC token.          |
| [WETH address](https://basescan.org/address/0x4200000000000000000000000000000000000006#code)   | The WETH token.          |
| [cbETH address](https://basescan.org/address/0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22#code)  | The cbETH token.         |
| [wstETH address](https://basescan.org/address/0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452#code) | The wstETH token.        |

## The OEV Bot

See the
[OEV v1 Compound example bot](https://github.com/api3dao/oev-v1-compound-bot)
for details.
