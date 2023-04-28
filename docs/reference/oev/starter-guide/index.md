---
title: Starter Guide
sidebarHeader: Reference
sidebarSubHeader: OEV
pageHeader: Reference → OEV -> Searchers -> Starter Guide
path: /reference/oev/starter-guide/index.html
outline: deep
tags:
---

<PageHeader/>

<SearchHighlight/>

# {{$frontmatter.title}}

The OEV relay operates an off-chain sealed bid order book, allowing searchers to
place private bids for data feed updates. The relay fills the highest bid(s)
meeting the specified conditions and grants the winning searcher exclusive
rights to publish the oracle update for a given period of time.

The relay periodically reaches consensus between data providers on an off-chain
price and creates an auction for this data. Bidders can query the relay API to
check the status of their bids. The relay stores signed bids in its database to
address potential disputes.

## Depositing USDC into PrepaymentDepository

To interact with the OEV Relay API using your public/private key pair, deposit
USDC into the `PrepaymentDepository` contract. Relay will wait until there are
sufficient block confirmations and then automatically creates an account for
your account and chain combination. Authentication for API calls requiring
authorization is done through signatures with your private key.

::: info

`PrepaymentDepository` will initially be deployed on the Ethereum mainnet, but
may not necessarily be deployed on the chain you are bidding for a data feed
update on.

:::

### Deposit Function

Call the deposit function with the desired USDC amount to deposit. The deposit
function utilizes ERC20Permit to enable deposits without prior contract
approval. You can follow the steps below to deposit USDC via the frontend.

### Deposit Procedure (Frontend)

To deposit USDC, follow the steps below:

- Using the frontend at `<TODO>`, connect your wallet to the frontend.
- Specify the USDC amount for deposit, which will be used for bidding.
- Provide the deposit address which will be used for bidding.
- The frontend will automatically prompt you to sign the deposit transaction.

### Check Balance

To check your balance, query the [status endpoint](../api/#post-status) on the
relay which will return the following response if you deposited 100 USDC:

```json
{
  "availableFunds": "100000000",
  "withdrawalReservedFunds": "0",
  "bidReservedFunds": "0",
  "api3FeeFunds": "0",
  "slashedFunds": "0",
  "pendingWithdrawals": [],
  "bids": [],
  "executableAuctions": [],
  "pastAuctions": []
}
```

## Get Configurations

Before placing bids, you need to get the configurations of the OEV proxies you
want to bid on. The configurations can be fetched from the
[configuration endpoint](../api/#get-configuration).

## Placing Bids

To place a bid, call the [place bid endpoint](../api/#post-place-bid) on the
relay which will return the ID of the bid. The bid ID is used to keep track of
the bid when querying the [status endpoint](../api/#post-status).

::: info

The deposit collateral is checked when a bid is filled (not placed) and is
reserved until the data feed update is performed. This collateral is used to
slash a searcher if they fail to publish the data feed update within the
specified time. If a searcher is frontrun in performing the data feed update,
their collateral is freed without any cost.

:::

The following is an example of a bid that will be fulfilled if the price is
greater than or equal to 1000:

```javascript
const unsignedPayload = {
  searcherAddress: '<SEARCHER_ADDRESS>',
  // Make sure the timestamp is in the future and sufficiently random
  validUntilTimestamp: getUnixTime(
    addSeconds(Date.now(), 100 + Math.random() * 10_000)
  ),
  prepaymentDepositoryChainId: '<PREPAYMENT_DEPOSITORY_CHAIN_ID>',
  prepaymentDepositoryAddress: '<PREPAYMENT_DEPOSITORY_ADDRESS>',
  requestType: RequestTypes.PLACE_BID,
  dAppProxyAddress: '<DAPP_PROXY_ADDRESS>',
  dAppProxyChainId: '<DAPP_PROXY_CHAIN_ID>',
  condition: '<GTE>', // GTE or LTE
  bidAmount: '<1000000000000000000>', // use ethers.utils.parseEther
  fulfillmentValue: '1000',
  updateExecutorAddress: '<UPDATE_EXECUTOR_ADDRESS>',
};

// sign the payload with the searcher's private key
const signedPayload = await signPayload(unsignedPayload, signer);
// use the payload to call the place-bid endpoint
const payload = {
  ...unsignedPayload,
  signature: signedPayload.signature,
};
```

Orders can be placed with two possible conditions:

- `GTE` greater than or equal to
- `LTE` less than or equal to

If the searcher wins the auction, they need to call the
[status endpoint](../api/#post-status) to get the encoded transaction that can
be used to update the data feed.

Bids can be cancelled by calling the
[cancel-bid endpoint](../api/#post-cancel-bid) on the relay API and providing
the bid ID.

Best practice for searchers is to monitor the conversion rate between the native
token they are bidding in and USDC to ensure their bids meet the minimum amount
and collateral requirements.

## Checking Status of Bids

To check the status of bids, call the [status endpoint](../api/#post-status) on
the relay API. For Example, the status endpoint will return the following
response for the bid placed in the previous section:

```json
{
  "availableFunds": "100000000",
  "withdrawalReservedFunds": "0",
  "bidReservedFunds": "0",
  "api3FeeFunds": "0",
  "slashedFunds": "0",
  "pendingWithdrawals": [],
  "bids": [
    {
      "id": "5babb665-0e97-43ba-b355-63553cddb033",
      "dAppProxyAddress": "0x9E53700c4D0AC80eEc58Eaf381e2C11400C92989",
      "dAppProxyChainId": 6999,
      "bidAmount": "50000000000000000",
      "reservedAmount": "5985582",
      "condition": "GTE",
      "fulfillmentValue": "3000",
      "status": "PENDING",
      "updateTxHash": null,
      "createdAt": "1682677875",
      "updateExecutorAddress": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    }
  ],
  "executableAuctions": [],
  "pastAuctions": []
}
```

if the bid wins the auction, the status will be updated to `WON` and the
`executableAuctions` field will be populated with the encoded transaction that
can be used to update the data feed. This transaction needs to be submitted
on-chain by the executor. The executor is chosen from the winning bids. The
following is an example of the response:

```json
{
  "availableFunds": "94014418",
  "withdrawalReservedFunds": "0",
  "bidReservedFunds": "5985582",
  "api3FeeFunds": "0",
  "slashedFunds": "0",
  "pendingWithdrawals": [],
  "bids": [
    {
      "id": "5babb665-0e97-43ba-b355-63553cddb033",
      "dAppProxyAddress": "0x9E53700c4D0AC80eEc58Eaf381e2C11400C92989",
      "dAppProxyChainId": 6999,
      "bidAmount": "50000000000000000",
      "reservedAmount": "5985582",
      "condition": "GTE",
      "fulfillmentValue": "3000",
      "status": "WON",
      "updateTxHash": null,
      "createdAt": "1682677875",
      "updateExecutorAddress": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    }
  ],
  "executableAuctions": [
    {
      "winningBidIds": ["5babb665-0e97-43ba-b355-63553cddb033"],
      "nativeCurrencyAmount": "50000000000000000",
      "encodedUpdateTransaction": "0xe6ec76ac0000000000000000000000009e53700c4d0ac80eec58eaf381e2c11400c9298959a9a65cde2e07d241e9c6256e41ab5ea0420f56b4bb4993a1e48d32ced39c0d87e84db0e1ed32e09014ca66c728cb58643f044ece7e726bfe184f4d43ed2b1600000000000000000000000000000000000000000000000000000000644ba07400000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000006bd991fe0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000008009ccf21cd961e6f39152bc5e50cb5c78692d40ff6d0c81da86440389baedc8943ab0d2a3b4deb5cba51f7be0433117832e3c41000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000417e72aa05cf8854bba7a303facffe5885e17d08d90f156fb68a794a94426012f427b5005f6dc9fe415e8ba961bf06b143ff43340feee2fe73f4dd9f6ea6d32eff1b00000000000000000000000000000000000000000000000000000000000000",
      "decodedValue": "1809420798",
      "updatePeriodEnd": "Fri Apr 28 2023 12:36:16 GMT+0200 (Central European Summer Time)",
      "collateralPercentage": 10,
      "api3FeePercentage": 10,
      "exchangeRate": 11971164620063,
      "updateExecutorAddress": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    }
  ],
  "pastAuctions": []
}
```

## Capturing OEV

To capture the OEV, you should use a multicall contract that lets you update the
data feed and the capture the OEV atomically. You can find the encoded update
transaction data in the [status endpoint](../api/#post-status) response.

<!-- TODO: This should be more descriptive and refer to some Multicall contract. Or at least mention how to deploy one. -->

Once the update is confirmed, the status of the bid will be updated to
`EXECUTED` and the `updateTxHash` field will be populated with the transaction
hash of the update. The auction will be moved to the `pastAuctions` field of the
[status endpoint](../api/#post-status) response.

```json
{
  "availableFunds": "94014418",
  "withdrawalReservedFunds": "0",
  "bidReservedFunds": "0",
  "api3FeeFunds": "5985582",
  "slashedFunds": "0",
  "pendingWithdrawals": [],
  "bids": [
    {
      "id": "5babb665-0e97-43ba-b355-63553cddb033",
      "dAppProxyAddress": "0x9E53700c4D0AC80eEc58Eaf381e2C11400C92989",
      "dAppProxyChainId": 6999,
      "bidAmount": "50000000000000000",
      "reservedAmount": "5985582",
      "api3Fee": "5985582",
      "condition": "GTE",
      "fulfillmentValue": "3000",
      "status": "EXECUTED",
      "updateTxHash": "0xeec81c7fd9fd7d5a79a029b4c9df8296fa86176aa040c8041cde873e9609cb0e",
      "createdAt": "1682677875",
      "updateExecutorAddress": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    }
  ],
  "executableAuctions": [],
  "pastAuctions": [
    {
      "winningBidIds": ["5babb665-0e97-43ba-b355-63553cddb033"],
      "nativeCurrencyAmount": "50000000000000000",
      "encodedUpdateTransaction": "0xe6ec76ac0000000000000000000000009e53700c4d0ac80eec58eaf381e2c11400c9298959a9a65cde2e07d241e9c6256e41ab5ea0420f56b4bb4993a1e48d32ced39c0d87e84db0e1ed32e09014ca66c728cb58643f044ece7e726bfe184f4d43ed2b1600000000000000000000000000000000000000000000000000000000644ba07400000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000006bd991fe0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000008009ccf21cd961e6f39152bc5e50cb5c78692d40ff6d0c81da86440389baedc8943ab0d2a3b4deb5cba51f7be0433117832e3c41000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000417e72aa05cf8854bba7a303facffe5885e17d08d90f156fb68a794a94426012f427b5005f6dc9fe415e8ba961bf06b143ff43340feee2fe73f4dd9f6ea6d32eff1b00000000000000000000000000000000000000000000000000000000000000",
      "decodedValue": "1809420798",
      "updatePeriodEnd": "Fri Apr 28 2023 12:36:16 GMT+0200 (Central European Summer Time)",
      "collateralPercentage": 10,
      "api3FeePercentage": 10,
      "exchangeRate": 11971164620063,
      "updateExecutorAddress": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    }
  ]
}
```

## Withdrawing Funds

Deposits into `PrepaymentDepository` can only be withdrawn to the depositor
address. To change the withdrawal address, the current withdrawal account must
call `setWithdrawalAccount` with a new address.

To withdraw funds, call the [withdraw endpoint](../api/#post-withdraw) on the
relay API and receive a signature that can be used to call the `withdraw`
function within `PrepaymentDepository`. Note that withdrawals must be made
through an API call, as deposited amounts are stored and adjusted off-chain in a
fully programatic manner by the relay. The balances within
`PrepaymentDepository` are only updated upon withdrawal. Withdrawal requests
must withdraw all available funds and have a 1-hour expiration.
