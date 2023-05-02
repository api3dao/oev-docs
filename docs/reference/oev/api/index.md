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

Displays current values of the parameters which are configured by the relay
operators for each individual OEV proxy. Searchers should regularly monitor
these values to validate that they are complying with the OEV relay rules.

#### Responses

- 200 Operation successful

`application/json`

```json
{
  "proxies": [
    {
      "address": "0x9E53700c4D0AC80eEc58Eaf381e2C11400C92989",
      "chainId": 6999,
      "auctionDelayTime": 3000,
      "updatePeriod": 300000,
      "minimalBidValue": "50000000000000000",
      "minimalConfirmations": 5
    }
  ]
}
```

- 500 Internal server error

`application/json`

```json
{
  "error": "There was an unexpected internal error"
}
```

---

### [POST]/cancel-bid

Cancel individual bids for your account.

#### RequestBody

- application/json

```json
{
  "searcherAddress": "0xf20e5d27690078c102FDbDe117a990a337820A51",
  "validUntilTimestamp": 1682680404,
  "prepaymentDepositoryChainId": 7000,
  "prepaymentDepositoryAddress": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "id": "1adbe8db-c5da-4f0b-908d-873a60fc7cf4",
  "requestType": "API3 OEV Relay, cancel-bid",
  "signature": "0x21940805289d45833e2e589f41be30d5044c8bfa50060d43b69a3bebf5102264687a4d1c78386f8c519d2eb7b9b30868a8c1a600b80da0bc7978bfdfb52799b11b"
}
```

#### Responses

- 200 Bid successfully canceled

`application/json`

```json
{
  "id": "1adbe8db-c5da-4f0b-908d-873a60fc7cf4"
}
```

- 400 Bid cannot be canceled

`application/json`

```json
{
  "error": "error description"
}
```

- 404 Bid or searcher not found

`application/json`

```json
{
  "error": "error description"
}
```

- 500 Internal server error

`application/json`

```json
{
  "error": "There was an unexpected internal error"
}
```

---

### [POST]/place-bid

Place orders along with a bid amount in anticipation of an OEV opportunity on a
specific data feed/chain.

#### RequestBody

- application/json

```json
{
  "searcherAddress": "0xf20e5d27690078c102FDbDe117a990a337820A51",
  "validUntilTimestamp": 1682679190,
  "prepaymentDepositoryChainId": 7000,
  "prepaymentDepositoryAddress": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "bidAmount": "50000000000000000",
  "dAppProxyAddress": "0x9E53700c4D0AC80eEc58Eaf381e2C11400C92989",
  "dAppProxyChainId": 6999,
  "condition": "GTE",
  "fulfillmentValue": "3000000000000000",
  "requestType": "API3 OEV Relay, place-bid",
  "updateExecutorAddress": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  "signature": "0xe45fb77fb3ed472280dc625cf5984e900e9343756b5361d4b4d6b5a78399f38a119cf117b11ce11fdc565603a38d01958e3c9a27afb620ca011536bcc8cdf0231b"
}
```

#### Responses

- 200 Bid successfully placed

`application/json`

```json
{
  "id": "1adbe8db-c5da-4f0b-908d-873a60fc7cf4"
}
```

- 400 Bid cannot be placed

`application/json`

```json
{
  "error": "error description"
}
```

- 404 dApp proxy or searcher not found

`application/json`

```json
{
  "error": "error description"
}
```

- 500 Internal server error

`application/json`

```json
{
  "error": "There was an unexpected internal error"
}
```

---

### [POST]/withdraw

Request a withdrawal from a specific prepayment depository contract. Note that
the returned signature that can be used to withdraw will only be valid for a
certain amount of time.

#### RequestBody

- application/json

```json
{
  "searcherAddress": "0xf20e5d27690078c102FDbDe117a990a337820A51",
  "validUntilTimestamp": 1682680878,
  "prepaymentDepositoryChainId": 7000,
  "prepaymentDepositoryAddress": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "requestType": "API3 OEV Relay, withdraw",
  "signature": "0x641b10b5bd5ff415e3048e369b323b4d4e09bc4092f91a1d78b6388d6f8312926fbb171d31cafac8e8c4cd918cf161b73d86b03c0e2479e290ce7e8b31f4c7e71c"
}
```

#### Responses

- 200 Withdrawal request successful

`application/json`

```json
{
  "amount": "94014418",
  "withdrawalHash": "0x8ca0c0f398d7cb09c117d21f768db9af62388eb7812b888bdcd6a9317995637b",
  "expirationTimestamp": "1682684178",
  "signer": "0xb9dA7d8153daD327656c65791E894ffD317D8dC1",
  "signature": "0x060c83e0c74a3278b86499895932abf24ebe699675430d74ab59af2a5b910d6d3b3db96470c5647f2de56d81d6640e6935e2b3c6c9e80d583d24391f2714da9e1b"
}
```

- 400 Withdrawal cannot be requested

`application/json`

```json
{
  "error": "error description"
}
```

- 404 dApp proxy or searcher not found

`application/json`

```json
{
  "error": "error description"
}
```

- 500 Internal server error

`application/json`

```json
{
  "error": "There was an unexpected internal error"
}
```

---

### [POST]/status

This endpoint can be used to query all necessary info about a searcher's
account. To verify if your bids or withdrawals will be valid you should be
querying this regularly to check on the status of your collateral. If you have
active bids you will also want to consistently poll this endpoint to be aware of
when your bids have been fulfilled or cancelled.

#### RequestBody

- application/json

```json
{
  "searcherAddress": "0xf20e5d27690078c102FDbDe117a990a337820A51",
  "validUntilTimestamp": 1682681061,
  "prepaymentDepositoryChainId": 7000,
  "prepaymentDepositoryAddress": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "requestType": "API3 OEV Relay, status",
  "signature": "0xfcd11f492ec6e4312e7ad4d0d831340d87c1cd4555fe423cb8e4048f8707a11060a13a9b1c4fcc64e033f6b02a4a1dd1a8bc441a3719799e40e5790a08c98e701b"
}
```

#### Responses

- 200 Request successful

`application/json`

```json
{
  "availableFunds": "0",
  "withdrawalReservedFunds": "94014418",
  "bidReservedFunds": "0",
  "api3FeeFunds": "5985582",
  "slashedFunds": "0",
  "pendingWithdrawals": [
    {
      "amount": "94014418",
      "withdrawalHash": "0x8ca0c0f398d7cb09c117d21f768db9af62388eb7812b888bdcd6a9317995637b",
      "expirationTimestamp": "1682684178",
      "signature": "0x060c83e0c74a3278b86499895932abf24ebe699675430d74ab59af2a5b910d6d3b3db96470c5647f2de56d81d6640e6935e2b3c6c9e80d583d24391f2714da9e1b",
      "signer": "0xb9dA7d8153daD327656c65791E894ffD317D8dC1"
    }
  ],
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

- 400 Status cannot be retrieved

`application/json`

```json
{
  "error": "error description"
}
```

- 404 Searcher not found

`application/json`

```json
{
  "error": "error description"
}
```

- 500 Internal server error

`application/json`

```json
{
  "error": "There was an unexpected internal error"
}
```

## References

### #/components/schemas/ErrorResponse

```json
{
  "error": "error description"
}
```

### #/components/schemas/ConfigurationResponse

```json
{
  "proxies": [
    {
      "address": "0x9E53700c4D0AC80eEc58Eaf381e2C11400C92989",
      "chainId": 6999,
      "auctionDelayTime": 3000,
      "updatePeriod": 300000,
      "minimalBidValue": "50000000000000000",
      "minimalConfirmations": 5
    }
  ]
}
```

### #/components/schemas/CancelBidRequest

```json
{
  "searcherAddress": "0xf20e5d27690078c102FDbDe117a990a337820A51",
  "validUntilTimestamp": 1682680404,
  "prepaymentDepositoryChainId": 7000,
  "prepaymentDepositoryAddress": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "id": "1adbe8db-c5da-4f0b-908d-873a60fc7cf4",
  "requestType": "API3 OEV Relay, cancel-bid",
  "signature": "0x21940805289d45833e2e589f41be30d5044c8bfa50060d43b69a3bebf5102264687a4d1c78386f8c519d2eb7b9b30868a8c1a600b80da0bc7978bfdfb52799b11b"
}
```

### #/components/schemas/CancelBidResponse

```json
{
  "id": "1adbe8db-c5da-4f0b-908d-873a60fc7cf4"
}
```

### #/components/schemas/PlaceBidRequest

```json
{
  "searcherAddress": "0xf20e5d27690078c102FDbDe117a990a337820A51",
  "validUntilTimestamp": 1682679190,
  "prepaymentDepositoryChainId": 7000,
  "prepaymentDepositoryAddress": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "bidAmount": "50000000000000000",
  "dAppProxyAddress": "0x9E53700c4D0AC80eEc58Eaf381e2C11400C92989",
  "dAppProxyChainId": 6999,
  "condition": "GTE",
  "fulfillmentValue": "3000000000000000",
  "requestType": "API3 OEV Relay, place-bid",
  "updateExecutorAddress": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  "signature": "0xe45fb77fb3ed472280dc625cf5984e900e9343756b5361d4b4d6b5a78399f38a119cf117b11ce11fdc565603a38d01958e3c9a27afb620ca011536bcc8cdf0231b"
}
```

### #/components/schemas/PlaceBidResponse

```json
{
  "id": "1adbe8db-c5da-4f0b-908d-873a60fc7cf4"
}
```

### #/components/schemas/WithdrawRequest

```json
{
  "searcherAddress": "0xf20e5d27690078c102FDbDe117a990a337820A51",
  "validUntilTimestamp": 1682680878,
  "prepaymentDepositoryChainId": 7000,
  "prepaymentDepositoryAddress": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "requestType": "API3 OEV Relay, withdraw",
  "signature": "0x641b10b5bd5ff415e3048e369b323b4d4e09bc4092f91a1d78b6388d6f8312926fbb171d31cafac8e8c4cd918cf161b73d86b03c0e2479e290ce7e8b31f4c7e71c"
}
```

### #/components/schemas/WithdrawResponse

```json
{
  "amount": "94014418",
  "withdrawalHash": "0x8ca0c0f398d7cb09c117d21f768db9af62388eb7812b888bdcd6a9317995637b",
  "expirationTimestamp": "1682684178",
  "signer": "0xb9dA7d8153daD327656c65791E894ffD317D8dC1",
  "signature": "0x060c83e0c74a3278b86499895932abf24ebe699675430d74ab59af2a5b910d6d3b3db96470c5647f2de56d81d6640e6935e2b3c6c9e80d583d24391f2714da9e1b"
}
```

### #/components/schemas/StatusRequest

```json
{
  "searcherAddress": "0xf20e5d27690078c102FDbDe117a990a337820A51",
  "validUntilTimestamp": 1682681061,
  "prepaymentDepositoryChainId": 7000,
  "prepaymentDepositoryAddress": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "requestType": "API3 OEV Relay, status",
  "signature": "0xfcd11f492ec6e4312e7ad4d0d831340d87c1cd4555fe423cb8e4048f8707a11060a13a9b1c4fcc64e033f6b02a4a1dd1a8bc441a3719799e40e5790a08c98e701b"
}
```

### #/components/schemas/ExposableAuction

```json
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
```

### #/components/schemas/StatusResponse

```json
{
  "availableFunds": "0",
  "withdrawalReservedFunds": "94014418",
  "bidReservedFunds": "0",
  "api3FeeFunds": "5985582",
  "slashedFunds": "0",
  "pendingWithdrawals": [
    {
      "amount": "94014418",
      "withdrawalHash": "0x8ca0c0f398d7cb09c117d21f768db9af62388eb7812b888bdcd6a9317995637b",
      "expirationTimestamp": "1682684178",
      "signature": "0x060c83e0c74a3278b86499895932abf24ebe699675430d74ab59af2a5b910d6d3b3db96470c5647f2de56d81d6640e6935e2b3c6c9e80d583d24391f2714da9e1b",
      "signer": "0xb9dA7d8153daD327656c65791E894ffD317D8dC1"
    }
  ],
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
