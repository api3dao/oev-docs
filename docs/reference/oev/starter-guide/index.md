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
place private bids for data feed updates. The relay fills the highest bid
meeting the specified conditions and grants the winning searcher exclusive
rights to publish the oracle update for a certain number of blocks.

Auction periods are randomized, and the relay reaches consensus between data
providers on an off-chain price. Bidders can query the relay API to check the
status of their bids. The relay stores signed bids in its database to address
potential disputes.

## Depositing USDC into PrepaymentDepository.sol

To interact with the OEV Relay API using your public/private key pair, deposit
the USDC into the PrepaymentDepository.sol contract. This will create an account
for your key combination. Authentication for API calls requiring authorization
is done through signatures with your private key.

::: info

PrepaymentDepository.sol will initially be deployed on the Ethereum mainnet, but
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
relay which will return the following response if you deposited 10 USDC:

```json
{
  "availableFunds": "10000000",
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

## Placing Bids

To place a bid, call the [place bid endpoint](../api/#post-place-bid) on the
relay which will return the id of the bid. The bid id is used to keep track of
the bid when querying the [status endpoint](../api/#post-status).

::: info

The deposit collateral is checked when a bid is filled and is reserved until the
data feed update is performed. This collateral is used to slash a searcher if
they fail to publish the data feed update within the specified time. If a
searcher is frontrun in performing the data feed update, their collateral is
freed without any cost.

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

If the searcher wins the auction, they will need to call the
[status endpoint](../api/#post-status) to get the signed message that can be
used to update the data feed.

Bids can be cancelled by calling the
[cancel-bid endpoint](../api/#post-cancel-bid) on the relay API and providing
the bid id.

Best practice for searchers is to monitor the conversion rate between the native
token they are bidding in and USDC to ensure their bids meet the minimum amount
and collateral requirements.

## Checking Status of Bids

To check the status of bids, call the [status endpoint](../api/#post-status) on
the relay API.For Example, the status endpoint will return the following
response for the bid placed in the previous section:

```json
{
  "availableFunds": "10000000",
  "withdrawalReservedFunds": "0",
  "bidReservedFunds": "0",
  "api3FeeFunds": "0",
  "slashedFunds": "0",
  "pendingWithdrawals": [],
  "bids": [
    {
      "id": "0x1",
      "bidAmount": "1000000000000000000",
      "condition": "GTE",
      "createdAt": "2021-09-01T00:00:00.000Z",
      "dAppProxyAddress": "<DAPP_PROXY_ADDRESS>",
      "dAppProxyChainId": "<DAPP_PROXY_CHAIN_ID>",
      "fulfillmentValue": "1000",
      "status": "PENDING",
      "updateTxHash": null
    }
  ],
  "executableAuctions": [],
  "pastAuctions": []
}
```

if the bid wins the auction, the status will be updated to `WON` and the
`executableAuctions` field will be populated with the signature that can be used
to update the data feed. The following is an example of the response:

```json
{
  "availableFunds": "9000000",
  "withdrawalReservedFunds": "0",
  "bidReservedFunds": "1000000",
  "api3FeeFunds": "0",
  "slashedFunds": "0",
  "pendingWithdrawals": [],
  "bids": [
    {
      "id": "0x1",
      "bidAmount": "1000000000000000000",
      "condition": "GTE",
      "createdAt": "2021-09-01T00:00:00.000Z",
      "dAppProxyAddress": "<DAPP_PROXY_ADDRESS>",
      "dAppProxyChainId": "<DAPP_PROXY_CHAIN_ID>",
      "fulfillmentValue": "1000",
      "status": "WON",
      "updateTxHash": null,
      "reservedAmount": "1000000"
    }
  ],
  "executableAuctions": [
    {
      "api3FeePercentage": "10",
      "collateralPercentage": "10",
      "decodedValue": "1000",
      "exchangeRate": "123.456",
      "updatePeriodEnd": "2021-09-01T00:00:00.000Z",
      "updateTransactionParameters": {
        "data": "0x0",
        "dataFeedId": "<DATA_FEED_ID>",
        "nativeCurrencyAmount": "500000000000000000",
        "packedOevSignatures": ["0x0"],
        "proxyAddress": "<DAPP_PROXY_ADDRESS>",
        "timestamp": "1679659672",
        "updateId": "0x1"
      }
    }
  ],
  "pastAuctions": []
}
```

## Updating the Data Feed

To update the data feed, call the `updateOevProxyDataFeedWithSignedData`
function of the `Api3ServerV1` contract with the following parameters which can
be obtained from the `updateTransactionParameters` field of the
[status endpoint](../api/#post-status) response:

- `oevProxy` the address of the OEV dApp proxy
- `dataFeedId` the id of the data feed
- `updateId` the id of the update
- `timestamp` the timestamp of the update
- `data` the data of the update (in this case, the price of the asset provided
  by the data feed)
- `packedOevUpdateSignatures` packed signatures used to verify the update

Once the update is submitted, the status of the bid will be updated to
`EXECUTED` and the `updateTxHash` field will be populated with the transaction
hash of the update. The auction will be moved to the `pastAuctions` field of the
[status endpoint](../api/#post-status) response.

```json
{
  "availableFunds": "9500000",
  "withdrawalReservedFunds": "0",
  "bidReservedFunds": "0",
  "api3FeeFunds": "500000",
  "slashedFunds": "0",
  "pendingWithdrawals": [],
  "bids": [
    {
      "id": "0x1",
      "bidAmount": "1000000000000000000",
      "condition": "GTE",
      "createdAt": "2021-09-01T00:00:00.000Z",
      "dAppProxyAddress": "<DAPP_PROXY_ADDRESS>",
      "dAppProxyChainId": "<DAPP_PROXY_CHAIN_ID>",
      "fulfillmentValue": "1000",
      "status": "EXECUTED",
      "updateTxHash": "0x1",
      "reservedAmount": "1000000",
      "api3Fee": "500000"
    }
  ],
  "executableAuctions": [],
  "pastAuctions": [
    {
      "api3FeePercentage": "10",
      "collateralPercentage": "10",
      "decodedValue": "1000",
      "exchangeRate": "123.456",
      "updatePeriodEnd": "2021-09-01T00:00:00.000Z",
      "updateTransactionParameters": {
        "data": "0x0",
        "dataFeedId": "<DATA_FEED_ID>",
        "nativeCurrencyAmount": "500000000000000000",
        "packedOevSignatures": ["0x0"],
        "proxyAddress": "<DAPP_PROXY_ADDRESS>",
        "timestamp": "1679659672",
        "updateId": "0x1"
      }
    }
  ]
}
```

## Withdrawing Funds

Deposits into PrepaymentDepository.sol can only be withdrawn to the depositor
address. To change the withdrawal address, the current withdrawal account must
call `setWithdrawalAccount` with a new address.

To withdraw funds, call the [withdraw endpoint](../api/#post-withdraw) on the
relay API and receive a signature that can be used to call the `withdraw`
function within PrepaymentDepository.sol. Note that withdrawals must be made
through an API call, as deposited amounts are stored and adjusted off-chain in a
fully programatic manner by the relay. The balances within
PrepaymentDepository.sol are only updated upon withdrawal. Withdrawal requests
must withdraw all available funds and have a 1-hour expiration.
