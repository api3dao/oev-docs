---
title: OEV Network
pageHeader: OEV → Searchers
outline: deep
---

<PageHeader/>

# OEV Network

![OEV Network image](./oev-network.png)

The OEV Network operates as an standard Arbitrum Nitro L2 optimistic-rollup, the
system ensures transparency and allows verification of the auction process. In
this marketplace, OEV searchers place bids for the exclusive opportunity to
update a dAPIs for a short period of time.

By hosting auctions on on-chain, we address two big issues:

1. Scalability - The OEV network hosts auctions across different dApps across
   multiple chains. The system needs to scale up with demand, especially during
   periods of market volatility where the activity is the highest. This is a
   long-solved problem in blockchains through gas fees.
2. Transparency - Auctions are awarded via an off-chain system, called OEV
   Auctioneer, so it's important to be able to reason about the correctness of
   auction outcomes. Blockchains are the perfect tool for this, as all the data
   is public and verifiable.

To participate in auctions, searchers need to have a sufficient amount of ETH
bridged to the OEV network and interact with the
[OevAuctionHouse](#oevauctionhouse) contract.

## Using the OEV Network

OEV Network can be added as a custom network to an EVM compatible wallet.

| Details            | Value                          |
| ------------------ | ------------------------------ |
| Network            | OEV Network                    |
| Chain ID           | 4913                           |
| RPC URL (HTTP)     | https://oev.rpc.api3.org/http  |
| RPC URL (WS)       | https://oev.rpc.api3.org/ws    |
| Symbol             | ETH                            |
| Block Explorer URL | https://oev.explorer.api3.org/ |
| Bridge URL         | https://oev.bridge.api3.org/   |

## Properties

Here are some of the key properties of the OEV Network:

1. Block time - Under high load, the block time of the network can be as fast as
   250ms. Note that the OEV Network only produces blocks when there are
   transactions.
2. Gas fees - The gas fees are paid in ETH, and because the network is an
   optimistic L2 rollup the gas fees are low.
3. Using Anytrust - By using AnyTrust DAC, the OEV Network achieves further cost
   decrease.

See [Arbitrum Nitro details](https://docs.caldera.xyz/about/nitro#benefits) and
[AnyTrust details](https://docs.caldera.xyz/about/nitro#anytrust) for more
information.

## Bridging ETH

Use the [OEV Network Bridge](https://oev.bridge.api3.org/) to bridge your ETH to
the OEV Network. Bridging is only possible from ETH mainnet.

![OEV Network Bridge](./oev-bridge.png)

Clicking on `Transfer Tokens` will automatically add the OEV Network to your
Metamask wallet. To bridge, confirm the transaction in your wallet and wait for
confirmation. After the transaction is confirmed, you should see your ETH on the
OEV Network.

## Api3ServerV1

The implementation of the audited Api3ServerV1 contract is publicly available
[here](https://github.com/api3dao/contracts/blob/main/contracts/api3-server-v1/Api3ServerV1.sol).

The Api3ServerV1 contract powers dAPIs on the OEV Network, which are used in
OevAuctionHouse contract to compute collateral and protocol fee from the bid
amount. Note that this chain is not listed on the API3 market, because the OEV
Network is primarily intended to be used for the OEV auctions.

## OevAuctionHouse

The implementation of the audited OevAuctionHouse contract is publicly available
[here](https://github.com/api3dao/contracts/blob/main/contracts/api3-server-v1/OevAuctionHouse.sol).

The OevAuctionHouse contract is a general purpose auction platform designed to
work together with an off-chain component (OEV Auctioneer) that auctions off
data in a transparent and and retrospectively verifiable manner.

To support OEV auctions in the least privileged way, the contract defines a few
special roles allowed to interact with the contract in an authorized way. These
roles are:

1. Proxy setter - This role allows the caller to change the dAPI proxy used for
   collateral and protocol fee conversion to the native OEV network currency.
2. Auctioneer - This role allows the caller to award winning bid, and confirm or
   contradict fulfillments.
3. Withdrawer - This role allows the caller to withdraw the protocol fee and
   slashed amount collected by the contract.

The interactions with this contract include:

1. Searchers depositing collateral
2. Searchers withdawing collateral
3. Searchers placing or expediting bids
4. Auctioneer resolving auction winner
5. Auctioneer confirming or contracting fulfillment
6. API3 DAO updating protocol and collateral fee
7. API3 DAO updating the price feed proxies

Tech savvy users can refer to the contract's source for details. The logic of
the OevAuctionHouse contract is especially important for searchers, for which we
have a dedicated section [OEV Searching](/oev/searchers/index.md).

### Depositing Collateral

To be eligible to win OEV auctions, searchers need to have enough collateral
deposited in the OevAuctionHouse contract. See
[Bid Eligibility](/oev/searchers/oev-auctioneer.html#bid-eligibility) for more
details.

We recommend using the same hot wallet for the bot on the OEV network (to
participate in auctions) and the target chain (to capture the OEV). To deposit
funds, you can use either the `deposit` or `depositForBidder` functions. The
latter allows you to deposit the collateral on behalf of another address.

```solidity
function deposit() external payable returns (uint256 bidderBalance);
```

```solidity
function depositForBidder(
    address bidder // The address of the bidder to deposit on behalf of
) external payable returns (uint256 bidderBalance);
```

For an advanced usage where the bidder is a contract, refer to
[Bidding Contract](/oev/searchers/oev-searching#bidding-contract).

### Withdrawing Collateral

Withdrawal of deposited collateral is implemented as a two-way process to
prevent denying service by frontrunning the award transaction by withdrawing the
collateral.

To withdraw the deposited collateral from OevAuctionHouse contract, the searcher
needs to do the following:

1. Call `initiateWithdrawal` function on the OevAuctionHouse contract.

```solidity
function initiateWithdrawal()
    external
    returns (uint256 earliestWithdrawalTimestamp);
```

2. Wait for the withdrawal period to pass. The period is 15 seconds.
3. Call `withdraw` function on the OevAuctionHouse contract. You need to specify
   the recipeint and amount to be withdrawn.

```solidity
function withdraw(
    address payable recipient, // The address of the recipient of the withdrawal
    uint256 amount // The amount to be withdrawn
) external;
```

### Collateral and Protocol Fee

For a searcher to win an auction, they are required to have enough ETH deposited
in the OevAuctionHouse contract. Similarly, the value the searcher can win is
limited by the amount they have deposited. Refer to
[Bid Eligibility](/oev/searchers/oev-auctioneer.html#bid-eligibility) for
details.

The collateral and protocol fee rates are configurable parameters within the
OevAuctionHouse contract and are configured by the API3 DAO. These values are
set in "basis points", which are 1/100th of a percentage point. For example, a
value of 1000 is equivalent to 10%. The current values are set to the following:

| Parameter                | Value |
| ------------------------ | ----- |
| collateralInBasisPoints  | 1000  |
| protocolFeeInBasisPoints | 0     |

The collateral and the protocol fee are calculated using the price feed values
at the time of the bid placement. However, the collateral is reserved at award
time. This allows the bidder to place multiple bids for different dApps, even if
their collateral doesn't allow them to win all. This allows for greater
flexibility.

If the auction winner pays for the bid on the OEV Network and report the
fulfillment, their collateral is released and the protocol fee is deducted. If
the auction winner doesn't pay for the award or fails to report the fulfillment,
their collateral is slashed.

### Placing a bid

There are two ways to place a bid, either by calling `placeBidWithExpiration` or
by `placeBid`. The latter is merely a convenience function that places a bid
with maximum expiration timestamp.

```solidity
function placeBidWithExpiration(
    bytes32 bidTopic, // The bid topic is an identifier of the auction
    uint256 chainId, // The chain ID of the dApp
    uint256 bidAmount, // The amount the searcher is willing pay for the auction
    bytes calldata bidDetails, // Bid details according to the off-chain system specification
    uint256 maxCollateralAmount, // The maximum collateral amount the searcher is willing to pay
    uint256 maxProtocolFeeAmount, // The maximum protocol fee amount the searcher is willing to pay
    uint32 expirationTimestamp // The expiration timestamp of the bid
) external returns (uint104 collateralAmount, uint104 protocolFeeAmount);
```

Or the similar `placeBid` function:

```solidity
function placeBid(
    bytes32 bidTopic, // The bid topic is an identifier of the auction
    uint256 chainId, // The chain ID of the dApp
    uint256 bidAmount, // The amount the searcher is willing pay for the auction
    bytes calldata bidDetails, // Bid details according to the off-chain system specification
    uint256 maxCollateralAmount, // The maximum collateral amount the searcher is willing to pay
    uint256 maxProtocolFeeAmount // The maximum protocol fee amount the searcher is willing to pay
)
    external
    returns (
        uint32 expirationTimestamp,
        uint104 collateralAmount,
        uint104 protocolFeeAmount
    );
```

The OevAuctionHouse contract is designed in a generic way. To fully understand
how to use this function, we need to understand how
[OEV Auctioneer](/oev/searchers/oev-auctioneer.html) works. Refer to
[Placing a Bid](/oev/searchers/oev-searching.html#placing-a-bid) section for
more details.

### Expediting a bid

Once a bid is placed, it can no longer be cancelled - only expedited. This is to
prevent griefing by repeatedly placing a bid and cancelling it shortly after.
The contract defines a constant `MINIMUM_BID_LIFETIME` set to 15 seconds.
Searchers can use `expediteBidExpiration` or `expediteBidExpirationMaximally`
for this purpose.

```solidity
function expediteBidExpiration(
    bytes32 bidTopic, // The bid topic is an identifier of the auction
    bytes32 bidDetailsHash, // The keccak256 hash of the bid details
    uint32 expirationTimestamp // The new expiration timestamp of the bid
) external;
```

or

```solidity
function expediteBidExpirationMaximally(
    bytes32 bidTopic, // The bid topic is an identifier of the auction
    bytes32 bidDetailsHash // The keccak256 hash of the bid details
) external returns (uint32 expirationTimestamp);
```

The OevAuctionHouse contract is designed in a generic way. To fully understand
how to use this function, we need to understand how
[OEV Auctioneer](/oev/searchers/oev-auctioneer.html) works. Refer to
[Expediting a bid](/oev/searchers/oev-searching.html#expediting-a-bid) section
for more details.

## Deployed Contracts

These are the relevant contracts deployed on the OEV Network:

| Contract name   | Address                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Api3ServerV1    | [0x709944a48cAf83535e43471680fDA4905FB3920a](https://oev.explorer.api3.org/address/0x709944a48cAf83535e43471680fDA4905FB3920a) |
| OevAuctionHouse | [0x34f13A5C0AD750d212267bcBc230c87AEFD35CC5](https://oev.explorer.api3.org/address/0x34f13A5C0AD750d212267bcBc230c87AEFD35CC5) |
