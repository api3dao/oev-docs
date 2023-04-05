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

## /configuration

#### GET

##### Description

Configuration for individual OEV data feed proxy contracts

##### Response

| Name    | Type                   | Description                    |
| ------- | ---------------------- | ------------------------------ |
| proxies | [ [ object ] ](#proxy) | a list of proxy configurations |

##### Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Operation successful  |
| 500  | Internal server error |

## /cancel-bid

#### POST

##### Description

Cancels an existing bid

##### Request Body

| Name                | Type    | Description                                                   | Required |
| ------------------- | ------- | ------------------------------------------------------------- | -------- |
| id                  | string  | id of the bid                                                 | Yes      |
| searcherAddress     | string  | address of the searcher that made the bid                     | Yes      |
| validUntilTimestamp | integer |                                                               | Yes      |
| vaultChainId        | integer | chainId of the vault contract on which the bid was made       | Yes      |
| vaultAddress        | string  | address of the vault contract on which the bid was made       | Yes      |
| requestType         | string  | specified as "API3 OEV Relay, cancel-bid" for cancelling bids | Yes      |

##### Response

| Name | Type   | Description                 |
| ---- | ------ | --------------------------- |
| id   | string | The id of the cancelled bid |

##### Status Codes

| Code | Description               |
| ---- | ------------------------- |
| 200  | Bid successfully canceled |
| 400  | Bid cannot be canceled    |
| 404  | Bid or searcher not found |
| 500  | Internal server error     |

## /place-bid

#### POST

##### Description

Place a bid for a given dAPP Proxy at a given fulfillment value and condition

##### Request Body

| Name                | Type    | Description                                                      | Required |
| ------------------- | ------- | ---------------------------------------------------------------- | -------- |
| searcherAddress     | string  | address of the searcher that will make the bid                   | Yes      |
| validUntilTimestamp | integer | time until the bid is valid before it expires                    | Yes      |
| vaultChainId        | integer | chainId of the vault contract on which the bid will be made      | Yes      |
| vaultAddress        | string  | address of the vault contract on which the bid will be made      | Yes      |
| requestType         | string  | specified as "API3 OEV Relay, place-bid" for making bids         | Yes      |
| dAppProxyAddress    | string  | The dAPP proxy address for which the bid will be made            | Yes      |
| dAppProxyChainId    | integer | The chainId for which the bid will be made                       | Yes      |
| condition           | string  | Condition for the bid fulfillment, can be "LTE"(<=) or "GTE"(>=) | Yes      |
| fulfillmentValue    | string  | The fulfillment value (of given data feed) for the bid.          | Yes      |

##### Response

| Name | Type   | Description              |
| ---- | ------ | ------------------------ |
| id   | string | The id of the placed bid |

##### Status Codes

| Code | Description                      |
| ---- | -------------------------------- |
| 200  | Bid successfully placed          |
| 400  | Bid cannot be placed             |
| 404  | dApp proxy or searcher not found |
| 500  | Internal server error            |

## /withdraw

#### POST

##### Description

Request a withdrawal

##### Request Body

| Name                | Type    | Description                                                          | Required |
| ------------------- | ------- | -------------------------------------------------------------------- | -------- |
| searcherAddress     | string  | withdrawal address of the user making the withdrawal                 | Yes      |
| validUntilTimestamp | integer | time until the withdrawal signature is valid                         | Yes      |
| vaultChainId        | integer | chainId of the vault contract from which the withdrawal will be made | Yes      |
| vaultAddress        | string  | address of the vault contract from which the withdrawal will be made | Yes      |
| requestType         | string  | specified as "API3 OEV Relay, withdraw" for withdrawals              | Yes      |

##### Response

| Name                | Type   | Description                                       |
| ------------------- | ------ | ------------------------------------------------- |
| withdrawalHash      | string | hash used to verify the withdrawal                |
| amount              | string | amount to withdraw from the withdrawal address    |
| signature           | string | signature used to verify the withdrawal           |
| expirationTimestamp | string | timestamp until the withdrawal signature is valid |
| signer              | string | OEV Relay wallet which signs the withdrawal       |

##### Status Codes

| Code | Description                      |
| ---- | -------------------------------- |
| 200  | Withdrawal request successful    |
| 400  | Bid cannot be placed             |
| 404  | dApp proxy or searcher not found |
| 500  | Internal server error            |

## /status

#### POST

##### Description:

status information for a searcher, for more information about the parameters see
[here](../parameters/)

##### Request Body

| Name                | Type    | Description                                                  | Required |
| ------------------- | ------- | ------------------------------------------------------------ | -------- |
| searcherAddress     | string  | address of the searcher                                      | Yes      |
| validUntilTimestamp | integer |                                                              | Yes      |
| vaultChainId        | integer | chainId of the vault contract                                | Yes      |
| vaultAddress        | string  | address of the vault contract                                | Yes      |
| requestType         | string  | specified as "API3 OEV Relay, status" for getting the status | Yes      |

##### Response

| Name                    | Type                                      | Description                              |
| ----------------------- | ----------------------------------------- | ---------------------------------------- |
| availableFunds          | string                                    | available funds of the searcher          |
| withdrawalReservedFunds | string                                    | funds reserved for pending withdrawals   |
| bidReservedFunds        | string                                    | funds reserved for bids                  |
| api3FeeFunds            | string                                    | funds transferred to the api3            |
| slashedFunds            | string                                    | funds slashed for failed bid fulfilments |
| pendingWithdrawals      | [ object ]                                | pending withdrawals of the searcher      |
| bids                    | [ object ]                                | bids placed by the searcher              |
| executableAuctions      | [ [ExposableAuction](#exposableauction) ] | executable auctions of the searcher      |
| pastAuctions            | [ [ExposableAuction](#exposableauction) ] | past auctions of the searcher            |

##### Status Codes

| Code | Description                |
| ---- | -------------------------- |
| 200  | Request successful         |
| 400  | Status cannot be retrieved |
| 404  | Searcher not found         |
| 500  | Internal server error      |

## Models

#### ErrorResponse

| Name  | Type   | Description |
| ----- | ------ | ----------- |
| error | string |             |

#### Proxy

| Name                 | Description                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| address              | Address of the proxy                                                                                                   |
| chainId              | The chainId of the chain the proxy is deployed on                                                                      |
| auctionDelayTime     | The minimum delay in seconds between the end of an auction and the start of the next one                               |
| updatePeriod         | The maximum time in seconds that a searcher has to execute an update after winning an auction before they get slashed. |
| minimalBidValue      | The minimum bid amount that a searcher has to bid                                                                      |
| minimalConfirmations | The minimal confirmations necessary for a transaction to be accepted                                                   |

#### ExposableAuction

| Name                        | Type   | Description | Required |
| --------------------------- | ------ | ----------- | -------- |
| updateTransactionParameters | object |             | Yes      |
| decodedValue                | string |             | Yes      |
| updatePeriodEnd             | string |             | Yes      |
| collateralPercentage        | number |             | Yes      |
| api3FeePercentage           | number |             | Yes      |
| exchangeRate                | number |             | Yes      |
