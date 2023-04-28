---
title: Relay API Specification
sidebarHeader: Reference
sidebarSubHeader: OEV
pageHeader: Reference → OEV -> OEV Relay
path: /reference/oev/api/index.html
outline: deep
tags:
---

<PageHeader/>

<SearchHighlight/>

# {{$frontmatter.title}} Version: 1.0.0

## Path Table

| Method | Path                                 | Description |
| ------ | ------------------------------------ | ----------- |
| GET    | [/configuration](#get-configuration) |             |
| POST   | [/cancel-bid](#post-cancel-bid)      |             |
| POST   | [/place-bid](#post-place-bid)        |             |
| POST   | [/withdraw](#post-withdraw)          |             |
| POST   | [/status](#post-status)              |             |

## Reference Table

| Name                  | Path                                                                                    | Description |
| --------------------- | --------------------------------------------------------------------------------------- | ----------- |
| ErrorResponse         | [#/components/schemas/ErrorResponse](#components-schemas-errorresponse)                 |             |
| ConfigurationResponse | [#/components/schemas/ConfigurationResponse](#components-schemas-configurationresponse) |             |
| CancelBidRequest      | [#/components/schemas/CancelBidRequest](#components-schemas-cancelbidrequest)           |             |
| CancelBidResponse     | [#/components/schemas/CancelBidResponse](#components-schemas-cancelbidresponse)         |             |
| PlaceBidRequest       | [#/components/schemas/PlaceBidRequest](#components-schemas-placebidrequest)             |             |
| PlaceBidResponse      | [#/components/schemas/PlaceBidResponse](#components-schemas-placebidresponse)           |             |
| WithdrawRequest       | [#/components/schemas/WithdrawRequest](#components-schemas-withdrawrequest)             |             |
| WithdrawResponse      | [#/components/schemas/WithdrawResponse](#components-schemas-withdrawresponse)           |             |
| StatusRequest         | [#/components/schemas/StatusRequest](#components-schemas-statusrequest)                 |             |
| ExposableAuction      | [#/components/schemas/ExposableAuction](#components-schemas-exposableauction)           |             |
| StatusResponse        | [#/components/schemas/StatusResponse](#components-schemas-statusresponse)               |             |

## Path Details

---

### [GET]/configuration

- Description  
  Displays current values of the parameters which are configured by the relay
  operators for each individual OEV data feed. Searchers should regularly
  monitor these values to validate that they are complying with the OEV Relay
  rules.

#### Responses

- 200 Operation successful

`application/json`

```ts
{
  proxies: {
    address: string;
    chainId: integer;
    auctionDelayTime: integer;
    updatePeriod: integer;
    minimalBidValue: string;
    minimalConfirmations: integer;
  }
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: string;
}
```

---

### [POST]/cancel-bid

- Description  
  Cancel individual bids for your account.

#### RequestBody

- application/json

```ts
{
  id: string
  searcherAddress: string
  validUntilTimestamp: integer
  prepaymentDepositoryChainId: integer
  prepaymentDepositoryAddress: string
  signature: string
  requestType: enum[API3 OEV Relay, cancel-bid]
}
```

#### Responses

- 200 Bid successfully canceled

`application/json`

```ts
{
  id: string;
}
```

- 400 Bid cannot be canceled

`application/json`

```ts
{
  error: string;
}
```

- 404 Bid or searcher not found

`application/json`

```ts
{
  error: string;
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: string;
}
```

---

### [POST]/place-bid

- Description  
  Place orders along with a bid amount in anticipation of an OEV opportunity on
  a specific data feed/chain. These bids function similarly to an orderbook,
  with the difference being that when bid conditions are met, only the highest
  bid amount is filled.

#### RequestBody

- application/json

```ts
{
  searcherAddress: string
  validUntilTimestamp: integer
  prepaymentDepositoryChainId: integer
  prepaymentDepositoryAddress: string
  requestType: enum[API3 OEV Relay, place-bid]
  dAppProxyAddress: string
  dAppProxyChainId: integer
  condition: enum[GTE, LTE]
  fulfillmentValue: string
  bidAmount: string
  signature: string
  updateExecutorAddress: string
}
```

#### Responses

- 200 Bid successfully placed

`application/json`

```ts
{
  id: string;
}
```

- 400 Bid cannot be placed

`application/json`

```ts
{
  error: string;
}
```

- 404 dApp proxy or searcher not found

`application/json`

```ts
{
  error: string;
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: string;
}
```

---

### [POST]/withdraw

- Description  
  Request a withdrawal from a specific prepayment depository contract and its
  chain ID. Note that the returned signature that can be used to withdraw will
  only be valid for a certain amount of time.

#### RequestBody

- application/json

```ts
{
  searcherAddress: string
  validUntilTimestamp: integer
  prepaymentDepositoryChainId: integer
  prepaymentDepositoryAddress: string
  requestType: enum[API3 OEV Relay, withdraw]
  signature: string
}
```

#### Responses

- 200 Withdrawal request successful

`application/json`

```ts
{
  withdrawalHash: string;
  amount: string;
  signature: string;
  expirationTimestamp: string;
  signer: string;
}
```

- 400 Withdrawal cannot be requested

`application/json`

```ts
{
  error: string;
}
```

- 404 dApp proxy or searcher not found

`application/json`

```ts
{
  error: string;
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: string;
}
```

---

### [POST]/status

- Description  
  This endpoint can be used to query all necessary info about a searcher's
  account. To verify if your bids or withdrawals will be valid you should be
  querying this regularly to check on the status of your collateral. If you have
  active bids you will also want to consistently poll this endpoint to be aware
  of when your bids have been fulfilled or cancelled.

#### RequestBody

- application/json

```ts
{
  searcherAddress: string
  validUntilTimestamp: integer
  prepaymentDepositoryChainId: integer
  prepaymentDepositoryAddress: string
  requestType: enum[API3 OEV Relay, status]
  signature: string
}
```

#### Responses

- 200 Request successful

`application/json`

```ts
{
  availableFunds: string
  withdrawalReservedFunds: string
  bidReservedFunds: string
  api3FeeFunds: string
  slashedFunds: string
  pendingWithdrawals: {
    withdrawalHash: string
    amount: string
    signature: string
    expirationTimestamp: string
    signer: string
  }[]
  bids: {
    id: string
    dAppProxyAddress: string
    dAppProxyChainId: number
    bidAmount: string
    reservedAmount?: string
    api3Fee?: string
    condition: enum[GTE, LTE]
    fulfillmentValue: string
    status: enum[PENDING, WON, EXECUTED, SLASHED, SEARCHER_CANCELED, RELAY_CANCELED, FRONTRUN, EXPIRED]
    updateTxHash: string
    createdAt: string
    updateExecutorAddress: string
  }[]
  executableAuctions: {
    updateTransactionParameters: {
      proxyAddress: string
      dataFeedId: string
      updateId: string
      timestamp: string
      data: string
      packedOevSignatures?: string[]
      nativeCurrencyAmount: string
    }
    decodedValue: string
    updatePeriodEnd: string
    collateralPercentage: number
    api3FeePercentage: number
    exchangeRate: number
    updateExecutorAddress: string
  }[]
  pastAuctions:#/components/schemas/ExposableAuction[]
}
```

- 400 Status cannot be retrieved

`application/json`

```ts
{
  error: string;
}
```

- 404 Searcher not found

`application/json`

```ts
{
  error: string;
}
```

- 500 Internal server error

`application/json`

```ts
{
  error: string;
}
```

## References

### #/components/schemas/ErrorResponse

```ts
{
  error: string;
}
```

### #/components/schemas/ConfigurationResponse

```ts
{
  proxies: {
    address: string;
    chainId: integer;
    auctionDelayTime: integer;
    updatePeriod: integer;
    minimalBidValue: string;
    minimalConfirmations: integer;
  }
}
```

### #/components/schemas/CancelBidRequest

```ts
{
  id: string
  searcherAddress: string
  validUntilTimestamp: integer
  prepaymentDepositoryChainId: integer
  prepaymentDepositoryAddress: string
  signature: string
  requestType: enum[API3 OEV Relay, cancel-bid]
}
```

### #/components/schemas/CancelBidResponse

```ts
{
  id: string;
}
```

### #/components/schemas/PlaceBidRequest

```ts
{
  searcherAddress: string
  validUntilTimestamp: integer
  prepaymentDepositoryChainId: integer
  prepaymentDepositoryAddress: string
  requestType: enum[API3 OEV Relay, place-bid]
  dAppProxyAddress: string
  dAppProxyChainId: integer
  condition: enum[GTE, LTE]
  fulfillmentValue: string
  bidAmount: string
  signature: string
  updateExecutorAddress: string
}
```

### #/components/schemas/PlaceBidResponse

```ts
{
  id: string;
}
```

### #/components/schemas/WithdrawRequest

```ts
{
  searcherAddress: string
  validUntilTimestamp: integer
  prepaymentDepositoryChainId: integer
  prepaymentDepositoryAddress: string
  requestType: enum[API3 OEV Relay, withdraw]
  signature: string
}
```

### #/components/schemas/WithdrawResponse

```ts
{
  withdrawalHash: string;
  amount: string;
  signature: string;
  expirationTimestamp: string;
  signer: string;
}
```

### #/components/schemas/StatusRequest

```ts
{
  searcherAddress: string
  validUntilTimestamp: integer
  prepaymentDepositoryChainId: integer
  prepaymentDepositoryAddress: string
  requestType: enum[API3 OEV Relay, status]
  signature: string
}
```

### #/components/schemas/ExposableAuction

```ts
{
  updateTransactionParameters: {
    proxyAddress: string
    dataFeedId: string
    updateId: string
    timestamp: string
    data: string
    packedOevSignatures?: string[]
    nativeCurrencyAmount: string
  }
  decodedValue: string
  updatePeriodEnd: string
  collateralPercentage: number
  api3FeePercentage: number
  exchangeRate: number
  updateExecutorAddress: string
}
```

### #/components/schemas/StatusResponse

```ts
{
  availableFunds: string
  withdrawalReservedFunds: string
  bidReservedFunds: string
  api3FeeFunds: string
  slashedFunds: string
  pendingWithdrawals: {
    withdrawalHash: string
    amount: string
    signature: string
    expirationTimestamp: string
    signer: string
  }[]
  bids: {
    id: string
    dAppProxyAddress: string
    dAppProxyChainId: number
    bidAmount: string
    reservedAmount?: string
    api3Fee?: string
    condition: enum[GTE, LTE]
    fulfillmentValue: string
    status: enum[PENDING, WON, EXECUTED, SLASHED, SEARCHER_CANCELED, RELAY_CANCELED, FRONTRUN, EXPIRED]
    updateTxHash: string
    createdAt: string
    updateExecutorAddress: string
  }[]
  executableAuctions: {
    updateTransactionParameters: {
      proxyAddress: string
      dataFeedId: string
      updateId: string
      timestamp: string
      data: string
      packedOevSignatures?: string[]
      nativeCurrencyAmount: string
    }
    decodedValue: string
    updatePeriodEnd: string
    collateralPercentage: number
    api3FeePercentage: number
    exchangeRate: number
    updateExecutorAddress: string
  }[]
  pastAuctions:#/components/schemas/ExposableAuction[]
}
```
