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

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="oev-relay-api">OEV relay API v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a
> language for code samples from the tabs above or the mobile navigation menu.

The API for making requests to OEV relay.

Base URLs:

- <a href="https://api-oev.api3.org/api">https://api-oev.api3.org/api</a>

<h1 id="oev-relay-api-api">API</h1>

## \GET configuration

> Code samples

```javascript
const headers = {
  Accept: 'application/json',
};

fetch('https://api-oev.api3.org/api/configuration', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```shell
# You can also use wget
curl -X GET https://api-oev.api3.org/api/configuration \
  -H 'Accept: application/json'

```

`GET /configuration`

_Returns the OEV relay configuration._

Returns the present values of settings that are determined by relay operators
for every distinct OEV proxy. It is essential for searchers to frequently
observe these values to ensure compliance with the OEV relay guidelines.

> Example responses

> 200 Response

```json
{
  "proxies": [
    {
      "address": "string",
      "chainId": 1,
      "auctionDelayTime": 10000,
      "updatePeriod": 10000,
      "minimalBidValue": "50000000000000000",
      "minimalConfirmations": 10
    }
  ]
}
```

<h3 id="\GET configuration-responses">Responses</h3>

| Status | Meaning                                                                    | Description            | Schema                                                |
| ------ | -------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                    | Operation successful.  | [ConfigurationResponse](#schemaconfigurationresponse) |
| 500    | [Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1) | Internal server error. | [ErrorResponse](#schemaerrorresponse)                 |

<aside class="success">
This operation does not require authentication
</aside>

## \POST place-bid

> Code samples

```javascript
const inputBody = '{
  "requestType": "API3 OEV Relay, place-bid",
  "bidAmount": "string",
  "dAppProxyAddress": "string",
  "dAppProxyChainId": 1,
  "condition": "GTE",
  "fulfillmentValue": "string",
  "updateExecutorAddress": "string",
  "searcherAddress": "string",
  "validUntil": "2023-06-03T16:43:39.000Z",
  "prepaymentDepositoryChainId": 1,
  "prepaymentDepositoryAddress": "string",
  "signature": "0x21940805289d45833e2e589f41be30d5044c8bfa50060d43b69a3bebf5102264687a4d1c78386f8c519d2eb7b9b30868a8c1a600b80da0bc7978bfdfb52799b11b"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://api-oev.api3.org/api/place-bid',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```shell
# You can also use wget
curl -X POST https://api-oev.api3.org/api/place-bid \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

`POST /place-bid`

_Places a bid._

Places a bid in anticipation of an OEV opportunity on a specific data
feed/chain.

> Body parameter

```json
{
  "requestType": "API3 OEV Relay, place-bid",
  "bidAmount": "string",
  "dAppProxyAddress": "string",
  "dAppProxyChainId": 1,
  "condition": "GTE",
  "fulfillmentValue": "string",
  "updateExecutorAddress": "string",
  "searcherAddress": "string",
  "validUntil": "2023-06-03T16:43:39.000Z",
  "prepaymentDepositoryChainId": 1,
  "prepaymentDepositoryAddress": "string",
  "signature": "0x21940805289d45833e2e589f41be30d5044c8bfa50060d43b69a3bebf5102264687a4d1c78386f8c519d2eb7b9b30868a8c1a600b80da0bc7978bfdfb52799b11b"
}
```

<h3 id="\POST place-bid-parameters">Parameters</h3>

| Name | In   | Type                                      | Required | Description |
| ---- | ---- | ----------------------------------------- | -------- | ----------- |
| body | body | [PlaceBidRequest](#schemaplacebidrequest) | false    | none        |

> Example responses

> 200 Response

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08"
}
```

<h3 id="\POST place-bid-responses">Responses</h3>

| Status | Meaning                                                                    | Description                  | Schema                                      |
| ------ | -------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                    | Bid successfully placed.     | [PlaceBidResponse](#schemaplacebidresponse) |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)           | Bid cannot be placed.        | [ErrorResponse](#schemaerrorresponse)       |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)             | Proxy or searcher not found. | [ErrorResponse](#schemaerrorresponse)       |
| 500    | [Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1) | Internal server error.       | [ErrorResponse](#schemaerrorresponse)       |

<aside class="success">
This operation does not require authentication
</aside>

## \POST cancel-bid

> Code samples

```javascript
const inputBody = '{
  "requestType": "API3 OEV Relay, cancel-bid",
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "searcherAddress": "string",
  "validUntil": "2023-06-03T16:43:39.000Z",
  "prepaymentDepositoryChainId": 1,
  "prepaymentDepositoryAddress": "string",
  "signature": "0x21940805289d45833e2e589f41be30d5044c8bfa50060d43b69a3bebf5102264687a4d1c78386f8c519d2eb7b9b30868a8c1a600b80da0bc7978bfdfb52799b11b"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://api-oev.api3.org/api/cancel-bid',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```shell
# You can also use wget
curl -X POST https://api-oev.api3.org/api/cancel-bid \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

`POST /cancel-bid`

_Cancels bid._

Cancels specific bid request associated with the bid ID.

> Body parameter

```json
{
  "requestType": "API3 OEV Relay, cancel-bid",
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "searcherAddress": "string",
  "validUntil": "2023-06-03T16:43:39.000Z",
  "prepaymentDepositoryChainId": 1,
  "prepaymentDepositoryAddress": "string",
  "signature": "0x21940805289d45833e2e589f41be30d5044c8bfa50060d43b69a3bebf5102264687a4d1c78386f8c519d2eb7b9b30868a8c1a600b80da0bc7978bfdfb52799b11b"
}
```

<h3 id="\POST cancel-bid-parameters">Parameters</h3>

| Name | In   | Type                                        | Required | Description |
| ---- | ---- | ------------------------------------------- | -------- | ----------- |
| body | body | [CancelBidRequest](#schemacancelbidrequest) | false    | none        |

> Example responses

> 200 Response

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08"
}
```

<h3 id="\POST cancel-bid-responses">Responses</h3>

| Status | Meaning                                                                    | Description                | Schema                                        |
| ------ | -------------------------------------------------------------------------- | -------------------------- | --------------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                    | Bid successfully canceled. | [CancelBidResponse](#schemacancelbidresponse) |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)           | Bid cannot be canceled.    | [ErrorResponse](#schemaerrorresponse)         |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)             | Bid or searcher not found. | [ErrorResponse](#schemaerrorresponse)         |
| 500    | [Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1) | Internal server error.     | [ErrorResponse](#schemaerrorresponse)         |

<aside class="success">
This operation does not require authentication
</aside>

## \POST withdraw

> Code samples

```javascript
const inputBody = '{
  "requestType": "API3 OEV Relay, withdraw",
  "searcherAddress": "string",
  "validUntil": "2023-06-03T16:43:39.000Z",
  "prepaymentDepositoryChainId": 1,
  "prepaymentDepositoryAddress": "string",
  "signature": "0x21940805289d45833e2e589f41be30d5044c8bfa50060d43b69a3bebf5102264687a4d1c78386f8c519d2eb7b9b30868a8c1a600b80da0bc7978bfdfb52799b11b"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://api-oev.api3.org/api/withdraw',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```shell
# You can also use wget
curl -X POST https://api-oev.api3.org/api/withdraw \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

`POST /withdraw`

_Requests a withdrawal._

Initiates a withdrawal from a designated prepayment depository contract and its
associated chain ID. Be aware that the provided signature for withdrawal will
only remain valid for a limited period.

> Body parameter

```json
{
  "requestType": "API3 OEV Relay, withdraw",
  "searcherAddress": "string",
  "validUntil": "2023-06-03T16:43:39.000Z",
  "prepaymentDepositoryChainId": 1,
  "prepaymentDepositoryAddress": "string",
  "signature": "0x21940805289d45833e2e589f41be30d5044c8bfa50060d43b69a3bebf5102264687a4d1c78386f8c519d2eb7b9b30868a8c1a600b80da0bc7978bfdfb52799b11b"
}
```

<h3 id="\POST withdraw-parameters">Parameters</h3>

| Name | In   | Type                                      | Required | Description |
| ---- | ---- | ----------------------------------------- | -------- | ----------- |
| body | body | [WithdrawRequest](#schemawithdrawrequest) | false    | none        |

> Example responses

> 200 Response

```json
{
  "withdrawalHash": "0x8ca0c0f398d7cb09c117d21f768db9af62388eb7812b888bdcd6a9317995637b",
  "amount": "94014418",
  "signature": "0x060c83e0c74a3278b86499895932abf24ebe699675430d74ab59af2a5b910d6d3b3db96470c5647f2de56d81d6640e6935e2b3c6c9e80d583d24391f2714da9e1b",
  "expirationTimestamp": "1682684178",
  "signer": "0x7a9f3cd060ab180f36c17fe6bdf9974f577d77aa"
}
```

<h3 id="\POST withdraw-responses">Responses</h3>

| Status | Meaning                                                                    | Description                     | Schema                                      |
| ------ | -------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                    | Withdrawal request successful.  | [WithdrawResponse](#schemawithdrawresponse) |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)           | Withdrawal cannot be requested. | [ErrorResponse](#schemaerrorresponse)       |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)             | Proxy or searcher not found.    | [ErrorResponse](#schemaerrorresponse)       |
| 500    | [Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1) | Internal server error.          | [ErrorResponse](#schemaerrorresponse)       |

<aside class="success">
This operation does not require authentication
</aside>

## \POST status

> Code samples

```javascript
const inputBody = '{
  "requestType": "API3 OEV Relay, status",
  "searcherAddress": "string",
  "validUntil": "2023-06-03T16:43:39.000Z",
  "prepaymentDepositoryChainId": 1,
  "prepaymentDepositoryAddress": "string",
  "signature": "0x21940805289d45833e2e589f41be30d5044c8bfa50060d43b69a3bebf5102264687a4d1c78386f8c519d2eb7b9b30868a8c1a600b80da0bc7978bfdfb52799b11b"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://api-oev.api3.org/api/status',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```shell
# You can also use wget
curl -X POST https://api-oev.api3.org/api/status \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

`POST /status`

_Returns information about searcher._

Returns essential information regarding a searcher's account. To confirm the
validity of your bids or withdrawals, regularly query this endpoint to monitor
the status of your collateral. If you have active bids, consistently polling
this endpoint will keep you informed about the fulfillment or cancellation of
your bids.

> Body parameter

```json
{
  "requestType": "API3 OEV Relay, status",
  "searcherAddress": "string",
  "validUntil": "2023-06-03T16:43:39.000Z",
  "prepaymentDepositoryChainId": 1,
  "prepaymentDepositoryAddress": "string",
  "signature": "0x21940805289d45833e2e589f41be30d5044c8bfa50060d43b69a3bebf5102264687a4d1c78386f8c519d2eb7b9b30868a8c1a600b80da0bc7978bfdfb52799b11b"
}
```

<h3 id="\POST status-parameters">Parameters</h3>

| Name | In   | Type                                  | Required | Description |
| ---- | ---- | ------------------------------------- | -------- | ----------- |
| body | body | [StatusRequest](#schemastatusrequest) | false    | none        |

> Example responses

> 200 Response

```json
{
  "availableFunds": "string",
  "withdrawalReservedFunds": "94014418",
  "bidReservedFunds": "0",
  "api3FeeFunds": "5985582",
  "slashedFunds": "0",
  "pendingWithdrawals": [
    {
      "withdrawalHash": "0x8ca0c0f398d7cb09c117d21f768db9af62388eb7812b888bdcd6a9317995637b",
      "amount": "94014418",
      "signature": "0x060c83e0c74a3278b86499895932abf24ebe699675430d74ab59af2a5b910d6d3b3db96470c5647f2de56d81d6640e6935e2b3c6c9e80d583d24391f2714da9e1b",
      "expirationTimestamp": "1682684178",
      "signer": "0x7a9f3cd060ab180f36c17fe6bdf9974f577d77aa"
    }
  ],
  "bids": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "dAppProxyAddress": "string",
      "dAppProxyChainId": 1,
      "bidAmount": "50000000000000000",
      "reservedAmount": "5985582",
      "api3Fee": "5985582",
      "condition": "GTE",
      "fulfillmentValue": "1000000000000000000",
      "status": "PENDING",
      "updateTxHash": "0xeec81c7fd9fd7d5a79a029b4c9df8296fa86176aa040c8041cde873e9609cb0e",
      "createdAt": "2023-04-26T10:31:15.000Z",
      "updateExecutorAddress": "string"
    }
  ],
  "executableAuctions": [
    {
      "winningBidIds": ["497f6eca-6276-4993-bfeb-53cbbbba6f08"],
      "nativeCurrencyAmount": "50000000000000000",
      "encodedUpdateTransaction": "0xe6ec76ac0000000000000000000000009e53700c4d0ac80eec58eaf381e2c11400c9298959a9a65cde2e07d241e9c6256e41ab5ea0420f56b4bb4993a1e48d32ced39c0d87e84db0e1ed32e09014ca66c728cb58643f044ece7e726bfe184f4d43ed2b1600000000000000000000000000000000000000000000000000000000644ba07400000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000006bd991fe0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000008009ccf21cd961e6f39152bc5e50cb5c78692d40ff6d0c81da86440389baedc8943ab0d2a3b4deb5cba51f7be0433117832e3c41000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000417e72aa05cf8854bba7a303facffe5885e17d08d90f156fb68a794a94426012f427b5005f6dc9fe415e8ba961bf06b143ff43340feee2fe73f4dd9f6ea6d32eff1b00000000000000000000000000000000000000000000000000000000000000",
      "decodedValue": "1809420798",
      "updatePeriodEnd": "2023-04-28T10:36:16.000Z",
      "collateralPercentage": 10,
      "api3FeePercentage": 10,
      "exchangeRate": 1197.1164620063,
      "updateExecutorAddress": "string"
    }
  ],
  "pastAuctions": [
    {
      "winningBidIds": ["497f6eca-6276-4993-bfeb-53cbbbba6f08"],
      "nativeCurrencyAmount": "50000000000000000",
      "encodedUpdateTransaction": "0xe6ec76ac0000000000000000000000009e53700c4d0ac80eec58eaf381e2c11400c9298959a9a65cde2e07d241e9c6256e41ab5ea0420f56b4bb4993a1e48d32ced39c0d87e84db0e1ed32e09014ca66c728cb58643f044ece7e726bfe184f4d43ed2b1600000000000000000000000000000000000000000000000000000000644ba07400000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000006bd991fe0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000008009ccf21cd961e6f39152bc5e50cb5c78692d40ff6d0c81da86440389baedc8943ab0d2a3b4deb5cba51f7be0433117832e3c41000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000417e72aa05cf8854bba7a303facffe5885e17d08d90f156fb68a794a94426012f427b5005f6dc9fe415e8ba961bf06b143ff43340feee2fe73f4dd9f6ea6d32eff1b00000000000000000000000000000000000000000000000000000000000000",
      "decodedValue": "1809420798",
      "updatePeriodEnd": "2023-04-28T10:36:16.000Z",
      "collateralPercentage": 10,
      "api3FeePercentage": 10,
      "exchangeRate": 1197.1164620063,
      "updateExecutorAddress": "string"
    }
  ]
}
```

<h3 id="\POST status-responses">Responses</h3>

| Status | Meaning                                                                    | Description                 | Schema                                  |
| ------ | -------------------------------------------------------------------------- | --------------------------- | --------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                    | Request successful.         | [StatusResponse](#schemastatusresponse) |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)           | Status cannot be retrieved. | [ErrorResponse](#schemaerrorresponse)   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)             | Searcher not found.         | [ErrorResponse](#schemaerrorresponse)   |
| 500    | [Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1) | Internal server error.      | [ErrorResponse](#schemaerrorresponse)   |

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_ErrorResponse">ErrorResponse</h2>
<!-- backwards compatibility -->
<a id="schemaerrorresponse"></a>
<a id="schema_ErrorResponse"></a>
<a id="tocSerrorresponse"></a>
<a id="tocserrorresponse"></a>

```json
{
  "error": "Validation error",
  "context": "<valid-json-with-any-structure>"
}
```

### Properties

| Name    | Type   | Required | Restrictions | Description                                                                |
| ------- | ------ | -------- | ------------ | -------------------------------------------------------------------------- |
| error   | string | true     | none         | Brief description of the error.                                            |
| context | any    | false    | none         | Optional additional context for the error - for example validation errors. |

<h2 id="tocS_ConfigurationResponse">ConfigurationResponse</h2>
<!-- backwards compatibility -->
<a id="schemaconfigurationresponse"></a>
<a id="schema_ConfigurationResponse"></a>
<a id="tocSconfigurationresponse"></a>
<a id="tocsconfigurationresponse"></a>

```json
{
  "proxies": [
    {
      "address": "string",
      "chainId": 1,
      "auctionDelayTime": 10000,
      "updatePeriod": 10000,
      "minimalBidValue": "50000000000000000",
      "minimalConfirmations": 10
    }
  ]
}
```

### Properties

| Name                   | Type     | Required | Restrictions | Description                                                                                                                       |
| ---------------------- | -------- | -------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| proxies                | [object] | true     | none         | none                                                                                                                              |
| » address              | string   | true     | none         | The address of the proxy.                                                                                                         |
| » chainId              | integer  | true     | none         | The chain ID associated with the proxy's chain.                                                                                   |
| » auctionDelayTime     | integer  | true     | none         | The minimum delay, in milliseconds, between the end of an auction and the start of the next one.                                  |
| » updatePeriod         | integer  | true     | none         | The maximum duration, in milliseconds, a searcher has after winning an auction to execute an update. Otherwise, they are slashed. |
| » minimalBidValue      | string   | true     | none         | The minimum native currency amount required for bids created for this proxy.                                                      |
| » minimalConfirmations | integer  | true     | none         | The minimum number of block confirmations needed to process events on the chain associated with this proxy.                       |

<h2 id="tocS_CancelBidRequest">CancelBidRequest</h2>
<!-- backwards compatibility -->
<a id="schemacancelbidrequest"></a>
<a id="schema_CancelBidRequest"></a>
<a id="tocScancelbidrequest"></a>
<a id="tocscancelbidrequest"></a>

```json
{
  "requestType": "API3 OEV Relay, cancel-bid",
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "searcherAddress": "string",
  "validUntil": "2023-06-03T16:43:39.000Z",
  "prepaymentDepositoryChainId": 1,
  "prepaymentDepositoryAddress": "string",
  "signature": "0x21940805289d45833e2e589f41be30d5044c8bfa50060d43b69a3bebf5102264687a4d1c78386f8c519d2eb7b9b30868a8c1a600b80da0bc7978bfdfb52799b11b"
}
```

### Properties

| Name                        | Type         | Required | Restrictions | Description                                                                            |
| --------------------------- | ------------ | -------- | ------------ | -------------------------------------------------------------------------------------- |
| requestType                 | string       | true     | none         | The type of request, which is used to identify the specific operation being performed. |
| id                          | string(uuid) | true     | none         | Bid ID to cancel.                                                                      |
| searcherAddress             | string       | true     | none         | Address of the searcher.                                                               |
| validUntil                  | string       | true     | none         | The serialized date time (ISO 8601 format) until which the authentication is valid.    |
| prepaymentDepositoryChainId | integer      | true     | none         | The chain ID associated with the chain of the prepayment depository.                   |
| prepaymentDepositoryAddress | string       | true     | none         | Address of the prepayment depository contract.                                         |
| signature                   | string       | true     | none         | Signature of the authentication request using EIP-191.                                 |

#### Enumerated Values

| Property    | Value                      |
| ----------- | -------------------------- |
| requestType | API3 OEV Relay, cancel-bid |

<h2 id="tocS_CancelBidResponse">CancelBidResponse</h2>
<!-- backwards compatibility -->
<a id="schemacancelbidresponse"></a>
<a id="schema_CancelBidResponse"></a>
<a id="tocScancelbidresponse"></a>
<a id="tocscancelbidresponse"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08"
}
```

### Properties

| Name | Type         | Required | Restrictions | Description                  |
| ---- | ------------ | -------- | ------------ | ---------------------------- |
| id   | string(uuid) | true     | none         | The ID of the cancelled bid. |

<h2 id="tocS_PlaceBidRequest">PlaceBidRequest</h2>
<!-- backwards compatibility -->
<a id="schemaplacebidrequest"></a>
<a id="schema_PlaceBidRequest"></a>
<a id="tocSplacebidrequest"></a>
<a id="tocsplacebidrequest"></a>

```json
{
  "requestType": "API3 OEV Relay, place-bid",
  "bidAmount": "string",
  "dAppProxyAddress": "string",
  "dAppProxyChainId": 1,
  "condition": "GTE",
  "fulfillmentValue": "string",
  "updateExecutorAddress": "string",
  "searcherAddress": "string",
  "validUntil": "2023-06-03T16:43:39.000Z",
  "prepaymentDepositoryChainId": 1,
  "prepaymentDepositoryAddress": "string",
  "signature": "0x21940805289d45833e2e589f41be30d5044c8bfa50060d43b69a3bebf5102264687a4d1c78386f8c519d2eb7b9b30868a8c1a600b80da0bc7978bfdfb52799b11b"
}
```

### Properties

| Name                        | Type    | Required | Restrictions | Description                                                                                                       |
| --------------------------- | ------- | -------- | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| requestType                 | string  | true     | none         | The type of request, which is used to identify the specific operation being performed.                            |
| bidAmount                   | string  | true     | none         | The amount to bid in the native currency.                                                                         |
| dAppProxyAddress            | string  | true     | none         | The address of the proxy.                                                                                         |
| dAppProxyChainId            | integer | true     | none         | The chain ID associated with the proxy's chain.                                                                   |
| condition                   | string  | true     | none         | Specifies the condition of which the bid should be filled.                                                        |
| fulfillmentValue            | string  | true     | none         | The target fulfillment value of the request. This value is used to determine whether the bid is filled.           |
| updateExecutorAddress       | string  | true     | none         | The address of the update executor that must be used to submit the data feed update in case the bid is fulfilled. |
| searcherAddress             | string  | true     | none         | Address of the searcher.                                                                                          |
| validUntil                  | string  | true     | none         | The serialized date time (ISO 8601 format) until which the authentication is valid.                               |
| prepaymentDepositoryChainId | integer | true     | none         | The chain ID associated with the chain of the prepayment depository.                                              |
| prepaymentDepositoryAddress | string  | true     | none         | Address of the prepayment depository contract.                                                                    |
| signature                   | string  | true     | none         | Signature of the authentication request using EIP-191.                                                            |

#### Enumerated Values

| Property    | Value                     |
| ----------- | ------------------------- |
| requestType | API3 OEV Relay, place-bid |
| condition   | GTE                       |
| condition   | LTE                       |

<h2 id="tocS_PlaceBidResponse">PlaceBidResponse</h2>
<!-- backwards compatibility -->
<a id="schemaplacebidresponse"></a>
<a id="schema_PlaceBidResponse"></a>
<a id="tocSplacebidresponse"></a>
<a id="tocsplacebidresponse"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08"
}
```

### Properties

| Name | Type         | Required | Restrictions | Description                         |
| ---- | ------------ | -------- | ------------ | ----------------------------------- |
| id   | string(uuid) | true     | none         | The ID assigned to the created bid. |

<h2 id="tocS_WithdrawRequest">WithdrawRequest</h2>
<!-- backwards compatibility -->
<a id="schemawithdrawrequest"></a>
<a id="schema_WithdrawRequest"></a>
<a id="tocSwithdrawrequest"></a>
<a id="tocswithdrawrequest"></a>

```json
{
  "requestType": "API3 OEV Relay, withdraw",
  "searcherAddress": "string",
  "validUntil": "2023-06-03T16:43:39.000Z",
  "prepaymentDepositoryChainId": 1,
  "prepaymentDepositoryAddress": "string",
  "signature": "0x21940805289d45833e2e589f41be30d5044c8bfa50060d43b69a3bebf5102264687a4d1c78386f8c519d2eb7b9b30868a8c1a600b80da0bc7978bfdfb52799b11b"
}
```

### Properties

| Name                        | Type    | Required | Restrictions | Description                                                                            |
| --------------------------- | ------- | -------- | ------------ | -------------------------------------------------------------------------------------- |
| requestType                 | string  | true     | none         | The type of request, which is used to identify the specific operation being performed. |
| searcherAddress             | string  | true     | none         | Address of the searcher.                                                               |
| validUntil                  | string  | true     | none         | The serialized date time (ISO 8601 format) until which the authentication is valid.    |
| prepaymentDepositoryChainId | integer | true     | none         | The chain ID associated with the chain of the prepayment depository.                   |
| prepaymentDepositoryAddress | string  | true     | none         | Address of the prepayment depository contract.                                         |
| signature                   | string  | true     | none         | Signature of the authentication request using EIP-191.                                 |

#### Enumerated Values

| Property    | Value                    |
| ----------- | ------------------------ |
| requestType | API3 OEV Relay, withdraw |

<h2 id="tocS_WithdrawResponse">WithdrawResponse</h2>
<!-- backwards compatibility -->
<a id="schemawithdrawresponse"></a>
<a id="schema_WithdrawResponse"></a>
<a id="tocSwithdrawresponse"></a>
<a id="tocswithdrawresponse"></a>

```json
{
  "withdrawalHash": "0x8ca0c0f398d7cb09c117d21f768db9af62388eb7812b888bdcd6a9317995637b",
  "amount": "94014418",
  "signature": "0x060c83e0c74a3278b86499895932abf24ebe699675430d74ab59af2a5b910d6d3b3db96470c5647f2de56d81d6640e6935e2b3c6c9e80d583d24391f2714da9e1b",
  "expirationTimestamp": "1682684178",
  "signer": "0x7a9f3cd060ab180f36c17fe6bdf9974f577d77aa"
}
```

### Properties

| Name                | Type   | Required | Restrictions | Description                                                                  |
| ------------------- | ------ | -------- | ------------ | ---------------------------------------------------------------------------- |
| withdrawalHash      | string | true     | none         | The hash of the withdrawal transaction.                                      |
| amount              | string | true     | none         | The USDC amount to withdraw.                                                 |
| signature           | string | true     | none         | The signature associated with the withdrawal transaction.                    |
| expirationTimestamp | string | true     | none         | The timestamp after which the withdrawal transaction becomes invalid.        |
| signer              | string | true     | none         | The address of the OEV relay account that signed the withdrawal transaction. |

<h2 id="tocS_StatusRequest">StatusRequest</h2>
<!-- backwards compatibility -->
<a id="schemastatusrequest"></a>
<a id="schema_StatusRequest"></a>
<a id="tocSstatusrequest"></a>
<a id="tocsstatusrequest"></a>

```json
{
  "requestType": "API3 OEV Relay, status",
  "searcherAddress": "string",
  "validUntil": "2023-06-03T16:43:39.000Z",
  "prepaymentDepositoryChainId": 1,
  "prepaymentDepositoryAddress": "string",
  "signature": "0x21940805289d45833e2e589f41be30d5044c8bfa50060d43b69a3bebf5102264687a4d1c78386f8c519d2eb7b9b30868a8c1a600b80da0bc7978bfdfb52799b11b"
}
```

### Properties

| Name                        | Type    | Required | Restrictions | Description                                                                            |
| --------------------------- | ------- | -------- | ------------ | -------------------------------------------------------------------------------------- |
| requestType                 | string  | true     | none         | The type of request, which is used to identify the specific operation being performed. |
| searcherAddress             | string  | true     | none         | Address of the searcher.                                                               |
| validUntil                  | string  | true     | none         | The serialized date time (ISO 8601 format) until which the authentication is valid.    |
| prepaymentDepositoryChainId | integer | true     | none         | The chain ID associated with the chain of the prepayment depository.                   |
| prepaymentDepositoryAddress | string  | true     | none         | Address of the prepayment depository contract.                                         |
| signature                   | string  | true     | none         | Signature of the authentication request using EIP-191.                                 |

#### Enumerated Values

| Property    | Value                  |
| ----------- | ---------------------- |
| requestType | API3 OEV Relay, status |

<h2 id="tocS_StatusResponse">StatusResponse</h2>
<!-- backwards compatibility -->
<a id="schemastatusresponse"></a>
<a id="schema_StatusResponse"></a>
<a id="tocSstatusresponse"></a>
<a id="tocsstatusresponse"></a>

```json
{
  "availableFunds": "string",
  "withdrawalReservedFunds": "94014418",
  "bidReservedFunds": "0",
  "api3FeeFunds": "5985582",
  "slashedFunds": "0",
  "pendingWithdrawals": [
    {
      "withdrawalHash": "0x8ca0c0f398d7cb09c117d21f768db9af62388eb7812b888bdcd6a9317995637b",
      "amount": "94014418",
      "signature": "0x060c83e0c74a3278b86499895932abf24ebe699675430d74ab59af2a5b910d6d3b3db96470c5647f2de56d81d6640e6935e2b3c6c9e80d583d24391f2714da9e1b",
      "expirationTimestamp": "1682684178",
      "signer": "0x7a9f3cd060ab180f36c17fe6bdf9974f577d77aa"
    }
  ],
  "bids": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "dAppProxyAddress": "string",
      "dAppProxyChainId": 1,
      "bidAmount": "50000000000000000",
      "reservedAmount": "5985582",
      "api3Fee": "5985582",
      "condition": "GTE",
      "fulfillmentValue": "1000000000000000000",
      "status": "PENDING",
      "updateTxHash": "0xeec81c7fd9fd7d5a79a029b4c9df8296fa86176aa040c8041cde873e9609cb0e",
      "createdAt": "2023-04-26T10:31:15.000Z",
      "updateExecutorAddress": "string"
    }
  ],
  "executableAuctions": [
    {
      "winningBidIds": ["497f6eca-6276-4993-bfeb-53cbbbba6f08"],
      "nativeCurrencyAmount": "50000000000000000",
      "encodedUpdateTransaction": "0xe6ec76ac0000000000000000000000009e53700c4d0ac80eec58eaf381e2c11400c9298959a9a65cde2e07d241e9c6256e41ab5ea0420f56b4bb4993a1e48d32ced39c0d87e84db0e1ed32e09014ca66c728cb58643f044ece7e726bfe184f4d43ed2b1600000000000000000000000000000000000000000000000000000000644ba07400000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000006bd991fe0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000008009ccf21cd961e6f39152bc5e50cb5c78692d40ff6d0c81da86440389baedc8943ab0d2a3b4deb5cba51f7be0433117832e3c41000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000417e72aa05cf8854bba7a303facffe5885e17d08d90f156fb68a794a94426012f427b5005f6dc9fe415e8ba961bf06b143ff43340feee2fe73f4dd9f6ea6d32eff1b00000000000000000000000000000000000000000000000000000000000000",
      "decodedValue": "1809420798",
      "updatePeriodEnd": "2023-04-28T10:36:16.000Z",
      "collateralPercentage": 10,
      "api3FeePercentage": 10,
      "exchangeRate": 1197.1164620063,
      "updateExecutorAddress": "string"
    }
  ],
  "pastAuctions": [
    {
      "winningBidIds": ["497f6eca-6276-4993-bfeb-53cbbbba6f08"],
      "nativeCurrencyAmount": "50000000000000000",
      "encodedUpdateTransaction": "0xe6ec76ac0000000000000000000000009e53700c4d0ac80eec58eaf381e2c11400c9298959a9a65cde2e07d241e9c6256e41ab5ea0420f56b4bb4993a1e48d32ced39c0d87e84db0e1ed32e09014ca66c728cb58643f044ece7e726bfe184f4d43ed2b1600000000000000000000000000000000000000000000000000000000644ba07400000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000006bd991fe0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000008009ccf21cd961e6f39152bc5e50cb5c78692d40ff6d0c81da86440389baedc8943ab0d2a3b4deb5cba51f7be0433117832e3c41000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000417e72aa05cf8854bba7a303facffe5885e17d08d90f156fb68a794a94426012f427b5005f6dc9fe415e8ba961bf06b143ff43340feee2fe73f4dd9f6ea6d32eff1b00000000000000000000000000000000000000000000000000000000000000",
      "decodedValue": "1809420798",
      "updatePeriodEnd": "2023-04-28T10:36:16.000Z",
      "collateralPercentage": 10,
      "api3FeePercentage": 10,
      "exchangeRate": 1197.1164620063,
      "updateExecutorAddress": "string"
    }
  ]
}
```

### Properties

| Name                       | Type         | Required | Restrictions | Description                                                                                                       |
| -------------------------- | ------------ | -------- | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| availableFunds             | string       | true     | none         | The USDC amount available for evaluating bids.                                                                    |
| withdrawalReservedFunds    | string       | true     | none         | The USDC amount reserved for currently pending withdrawals.                                                       |
| bidReservedFunds           | string       | true     | none         | The USDC amount reserved for unexecuted pending auctions.                                                         |
| api3FeeFunds               | string       | true     | none         | The USDC amount reserved for API3 fees.                                                                           |
| slashedFunds               | string       | true     | none         | The USDC amount for slashed bids.                                                                                 |
| pendingWithdrawals         | [object]     | true     | none         | none                                                                                                              |
| » withdrawalHash           | string       | true     | none         | The hash of the withdrawal transaction.                                                                           |
| » amount                   | string       | true     | none         | The USDC amount to withdraw.                                                                                      |
| » signature                | string       | true     | none         | The signature associated with the withdrawal transaction.                                                         |
| » expirationTimestamp      | string       | true     | none         | The timestamp after which the withdrawal transaction becomes invalid.                                             |
| » signer                   | string       | true     | none         | The address of the OEV relay account that signed the withdrawal transaction.                                      |
| bids                       | [object]     | true     | none         | none                                                                                                              |
| » id                       | string(uuid) | true     | none         | The ID of the bid.                                                                                                |
| » dAppProxyAddress         | string       | true     | none         | The address of the proxy.                                                                                         |
| » dAppProxyChainId         | integer      | true     | none         | The chain ID associated with the proxy's chain.                                                                   |
| » bidAmount                | string       | true     | none         | The native currency amount of the bid.                                                                            |
| » reservedAmount           | string       | false    | none         | The USDC amount reserved for this bid. Present only if the bid is filled.                                         |
| » api3Fee                  | string       | false    | none         | The USDC amount reserved as a service fee for the API3 DAO. Present only when the bid is filled.                  |
| » condition                | string       | true     | none         | Specifies the condition under which the bid should be filled.                                                     |
| » fulfillmentValue         | string       | true     | none         | The target fulfillment value of the request. This value is used to determine whether the bid is filled.           |
| » status                   | string       | true     | none         | The status of the bid.                                                                                            |
| » updateTxHash             | string¦null  | true     | none         | The hash of the update transaction. Present only if the update transaction is executed.                           |
| » createdAt                | string       | true     | none         | The serialized date time (ISO 8601 format) of the bid creation.                                                   |
| » updateExecutorAddress    | string       | true     | none         | The address of the update executor that must be used to submit the data feed update in case the bid is fulfilled. |
| executableAuctions         | [object]     | true     | none         | none                                                                                                              |
| » winningBidIds            | [string]     | true     | none         | none                                                                                                              |
| » nativeCurrencyAmount     | string       | true     | none         | The total native currency amount of all filled bids in this auction.                                              |
| » encodedUpdateTransaction | string       | true     | none         | The encoded update transaction that updates the data feed.                                                        |
| » decodedValue             | string       | true     | none         | The decoded value of the data feed used for informational purposes.                                               |
| » updatePeriodEnd          | string       | true     | none         | The serialized date time (ISO 8601 format) of the end of the update period.                                       |
| » collateralPercentage     | integer      | true     | none         | The percentage of the accumulated bid amount that is reserved for auction as collateral.                          |
| » api3FeePercentage        | integer      | true     | none         | The percentage of the accumulated bid amount that is paid to the API3 as service fee.                             |
| » exchangeRate             | number       | true     | none         | The exchange rate of the native currency to USDC.                                                                 |
| » updateExecutorAddress    | string       | true     | none         | The address of the update executor that must be used to submit the data feed update in case the bid is fulfilled. |
| pastAuctions               | [object]     | true     | none         | none                                                                                                              |
| » winningBidIds            | [string]     | true     | none         | none                                                                                                              |
| » nativeCurrencyAmount     | string       | true     | none         | The total native currency amount of all filled bids in this auction.                                              |
| » encodedUpdateTransaction | string       | true     | none         | The encoded update transaction that updates the data feed.                                                        |
| » decodedValue             | string       | true     | none         | The decoded value of the data feed used for informational purposes.                                               |
| » updatePeriodEnd          | string       | true     | none         | The serialized date time (ISO 8601 format) of the end of the update period.                                       |
| » collateralPercentage     | integer      | true     | none         | The percentage of the accumulated bid amount that is reserved for auction as collateral.                          |
| » api3FeePercentage        | integer      | true     | none         | The percentage of the accumulated bid amount that is paid to the API3 as service fee.                             |
| » exchangeRate             | number       | true     | none         | The exchange rate of the native currency to USDC.                                                                 |
| » updateExecutorAddress    | string       | true     | none         | The address of the update executor that must be used to submit the data feed update in case the bid is fulfilled. |

#### Enumerated Values

| Property  | Value             |
| --------- | ----------------- |
| condition | GTE               |
| condition | LTE               |
| status    | PENDING           |
| status    | WON               |
| status    | EXECUTED          |
| status    | SLASHED           |
| status    | SEARCHER_CANCELED |
| status    | RELAY_CANCELED    |
| status    | FRONTRUN          |
| status    | EXPIRED           |
