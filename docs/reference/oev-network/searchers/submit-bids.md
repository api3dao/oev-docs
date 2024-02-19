---
title: Submitting Bids for Oracle updates
sidebarHeader: Reference
sidebarSubHeader: OEV Network
pageHeader:
  Reference → OEV Network → Searchers → Submitting Bids for Oracle updates
path: /reference/oev-network/searchers/submit-bids.html
outline: deep
tags:
---

<PageHeader/>

<SearchHighlight/>

<FlexStartTag/>

# {{$frontmatter.title}}

To submit a bid for a price update, you need to first
[bridge your testETH](../understand/bridge-oev-network.md) to the OEV Network
Sepolia Testnet.

## Prerequisites

install the following packages:

```bash
yarn add "ethers" "@api3/contracts@2.0.0-beta5"
```

## Deposit testETH into OEV Auction House Contract

you will need to deposit testETH into the OEV Auction House Contract to start
placing bids.

```javascript
const { JsonRpcProvider, Wallet, Contract, parseEther } = require('ethers');
const {
  abi: OevAuctionHouseAbi,
} = require('@api3/contracts/artifacts/contracts/api3-server-v1/OevAuctionHouse.sol/OevAuctionHouse.json');

const provider = new JsonRpcProvider(
  'https://oev-network-sepolia-testnet-rpc.eu-north-2.gateway.fm'
);
const wallet = new Wallet('<your_private_key>', provider);
const auctionHouse = new Contract(
  '0x7597985630674dA4D62Ae60ad4D10E40bb619B08', // OevAuctionHouse contract address
  OevAuctionHouseAbi,
  wallet
);

const deposit = async () => {
  const tx = await auctionHouse.deposit({
    value: parseEther('1'),
  });
};
```

## Submitting a Bid

There are two ways to submit a bid for an oracle update:

- With an Expiration Timestamp
- Without an Expiration Timestamp

### With an Expiration Timestamp

Searchers place a bid with an expiration timestamp using the
`placeBidWithExpiration` function of the OEV Auction House Contract. This
function is used when searchers expect the OEV opportunity to disappear at a
specific time before the maximum bid lifetime. The searcher should determine the
maximum collateral and protocol fees that they will tolerate and specify them in
the arguments.

#### Arguments for `placeBidWithExpiration`

| Argument             | Type    | Description                                                                                  |
| -------------------- | ------- | -------------------------------------------------------------------------------------------- |
| bidTopic             | bytes32 | [Bid topic](./arguments.md#bidtopic-bytes32)                                                 |
| chainId              | uint256 | Chain ID                                                                                     |
| bidAmount            | uint256 | Bid amount in the native currency of the chain where the proxy is deployed                   |
| bidDetails           | bytes   | [Bid details](./arguments.md#biddetails-bytes)                                               |
| maxCollateralAmount  | uint256 | Maximum collateral amount in the currency of the chain that OevAuctionHouse is deployed on   |
| maxProtocolFeeAmount | uint256 | Maximum protocol fee amount in the currency of the chain that OevAuctionHouse is deployed on |
| expirationTimestamp  | uint32  | Expiration timestamp after which the bid cannot be awarded, min - 15 seconds, max 24 hours   |

```javascript
const {
  Wallet,
  Contract,
  JsonRpcProvider,
  keccak256,
  solidityPacked,
  AbiCoder,
  parseEther,
  hexlify,
  randomBytes,
} = require('ethers');
const {
  abi: OevAuctionHouseAbi,
} = require('@api3/contracts/artifacts/contracts/api3-server-v1/OevAuctionHouse.sol/OevAuctionHouse.json');

const getBidTopic = (chainId, proxyAddress) => {
  return keccak256(
    solidityPacked(['uint256', 'address'], [BigInt(chainId), proxyAddress])
  );
};

const getBidDetails = (
  proxyAddress,
  condition,
  conditionValue,
  updaterAddress
) => {
  const abiCoder = new AbiCoder();
  const BID_CONDITIONS = [
    { onchainIndex: 0n, description: 'LTE' },
    { onchainIndex: 1n, description: 'GTE' },
  ];
  const conditionIndex = BID_CONDITIONS.findIndex(
    (c) => c.description === condition
  );
  return abiCoder.encode(
    ['address', 'uint8', 'uint256', 'address', 'bytes32'],
    [
      proxyAddress,
      conditionIndex,
      conditionValue,
      updaterAddress,
      hexlify(randomBytes(32)),
    ]
  );
};

const provider = new JsonRpcProvider(
  'https://oev-network-sepolia-testnet-rpc.eu-north-2.gateway.fm'
);
const wallet = new Wallet('<your_private_key>', provider);

const auctionHouse = new Contract(
  '0x7597985630674dA4D62Ae60ad4D10E40bb619B08', // OevAuctionHouse contract address
  OevAuctionHouseAbi,
  wallet
);

const placeBidWithExpiration = async () => {
  const bidTopic = getBidTopic(
    11155111,
    '0xa8cea58ab9060600e94bb28b2c8510b73171b55c'
  );
  const bidDetails = getBidDetails(
    '0xa8cea58ab9060600e94bb28b2c8510b73171b55c',
    'LTE',
    50000,
    '<searcher address doing the update>'
  );
  const tx = await auctionHouse.placeBidWithExpiration(
    bidTopic,
    11155111,
    parseEther('0.1'),
    bidDetails,
    parseEther('0'), // Collateral Basis Points is 0 on testnet
    parseEther('0'), // Protocol Fee Basis Points is 0 on testnet
    Math.floor(Date.now() / 1000) + 60 * 60 * 12 // 12 hours from now
  );
};
```

### Without an Expiration Timestamp

Searchers place a bid without an expiration timestamp using the `placeBid`
function of the OEV Auction House Contract. This function is used when searchers
expect the OEV opportunity to persist for the maximum bid lifetime. The searcher
should determine the maximum collateral and protocol fees that they will
tolerate and specify them in the arguments.

#### Arguments for `placeBid`

| Argument             | Type    | Description                                                                                  |
| -------------------- | ------- | -------------------------------------------------------------------------------------------- |
| bidTopic             | bytes32 | [Bid topic](./arguments.md#bidtopic)                                                         |
| chainId              | uint256 | Chain ID                                                                                     |
| bidAmount            | uint256 | Bid amount in the native currency of the chain where the proxy is deployed                   |
| bidDetails           | bytes   | [Bid details](./arguments.md#biddetails---bytes)                                             |
| maxCollateralAmount  | uint256 | Maximum collateral amount in the currency of the chain that OevAuctionHouse is deployed on   |
| maxProtocolFeeAmount | uint256 | Maximum protocol fee amount in the currency of the chain that OevAuctionHouse is deployed on |

The code snippet is similar to above, except `expirationTimestamp` is excluded
as an argument to the `placeBid` function.

## Checking Bid Status and Listening for Awarded Bids

Searchers can check the status of their bids by quering the bidId.

```javascript
const {
  JsonRpcProvider,
  Contract,
  keccak256,
  AbiCoder,
  solidityPacked,
} = require('ethers');
const {
  abi: OevAuctionHouseAbi,
} = require('@api3/contracts/artifacts/contracts/api3-server-v1/OevAuctionHouse.sol/OevAuctionHouse.json');

const provider = new JsonRpcProvider(
  'https://oev-network-sepolia-testnet-rpc.eu-north-2.gateway.fm'
);
const auctionHouse = new Contract(
  '0x7597985630674dA4D62Ae60ad4D10E40bb619B08', // OevAuctionHouse contract address
  OevAuctionHouseAbi,
  provider
);

const bidId = keccak256(
  solidityPacked(
    ['address', 'bytes32', 'bytes32'],
    ['<bidder address>', bidTopic, keccak256(bidDetails)]
  )
);

const getBidStatus = async () => {
  // solidity enum BidStatus {
  //     None,
  //     Placed,
  //     Awarded,
  //     FulfillmentReported,
  //     FulfillmentConfirmed,
  //     FulfillmentContradicted
  // }
  const bid = await auctionHouse.bids(bidId);
  // check if the bid is awarded
  if (bid[0] === 2) {
    // fetch the awarded bid details from the Awarded Bid event logs
  }
};
```

Searchers can listen to the `AwardedBid` event of the OEV Auction House
Contract.

```javascript
const { JsonRpcProvider, Contract } = require('ethers');
const {
  abi: OevAuctionHouseAbi,
} = require('@api3/contracts/artifacts/contracts/api3-server-v1/OevAuctionHouse.sol/OevAuctionHouse.json');

const provider = new JsonRpcProvider(
  'https://oev-network-sepolia-testnet-rpc.eu-north-2.gateway.fm'
);

const auctionHouse = new Contract(
  '0x7597985630674dA4D62Ae60ad4D10E40bb619B08', // OevAuctionHouse contract address
  OevAuctionHouseAbi,
  provider
);

const bidId = keccak256(
  solidityPacked(
    ['address', 'bytes32', 'bytes32'],
    ['<bidder address>', bidTopic, keccak256(bidDetails)]
  )
);

const awardedTransaction = await new Promise((resolve, reject) => {
  OevAuctionHouse.on(
    'AwardedBid',
    (bidder, bidTopic, awardBidId, awardDetails, bidderBalance) => {
      if (bidId === awardBidId) {
        OevAuctionHouse.removeAllListeners('AwardedBid');
        resolve(awardDetails);
      }
    }
  );
});

// awardedTransaction is the oracle update that the searcher
// can use to perform the oracle update
```

## Performing the oracle update using the awarded bid

Once the bid is awarded, the searcher can perform the oracle update by using the
encoded awardTransaction on the `updateOevProxyDataFeedWithSignedData` function
of [Api3ServerV1 contract](https://docs.api3.org/reference/dapis/chains/).

```javascript
const {
  JsonRpcProvider,
  Contract,
  keccak256,
  AbiCoder,
  parseEther,
} = require('ethers');
const {
  abi: Api3ServerV1Abi,
} = require('@api3/contracts/artifacts/contracts/api3-server-v1/Api3ServerV1.sol/Api3ServerV1.json');

const abiCoder = new AbiCoder();

const awardedTransaction = '0x'; // refer to Checking Bid Status and Listening for Awarded Bids

const provider = new JsonRpcProvider(
  'https://gateway.tenderly.co/public/sepolia'
);

const wallet = new Wallet('<your_private_key>', provider);

const api3ServerV1 = new Contract(
  '0x709944a48cAf83535e43471680fDA4905FB3920a', // Api3ServerV1 contract address
  Api3ServerV1Abi,
  wallet
);

const performOracleUpdate = async () => {
  const awardDetails = api3ServerV1.interface.decodeFunctionData(
    'updateOevProxyDataFeedWithSignedData',
    awardedTransaction
  );

  const tx = await api3ServerV1.updateOevProxyDataFeedWithSignedData(
    awardDetails[0], // oevProxy
    awardDetails[1], // dataFeedId
    awardDetails[2], // updateId
    awardDetails[3], // timestamp
    awardDetails[4], // data
    awardDetails[5], // packedOevUpdateSignatures
    {
      value: parseEther('0.1'), // bid amount
    }
  );
};

performOracleUpdate();
```

## Performing the oracle update using the awarded bid via Multicall

Multicall is a contract that allows you to batch multiple calls in a single
transaction. This can be useful when you want to perform multiple calls in a
single transaction eg. perform the oracle update and liquidation event in a
single transaction. To use multicall you will need to deploy the
[OevSearcherMulticallV1 contract](https://github.com/api3dao/airnode-protocol-v1/blob/main/contracts/utils/OevSearcherMulticallV1.sol)
and specify the OevSearcherMulticallV1 contract address as the updater address
in [bidDetails](./arguments.md#biddetails-bytes).

```javascript
const { JsonRpcProvider, Contract, keccak256, AbiCoder } = require('ethers');

const provider = new JsonRpcProvider(
  'https://gateway.tenderly.co/public/sepolia'
);

const wallet = new Wallet('<your_private_key>', provider);

const OevSearcherMulticallV1 = new Contract(
  '<OevSearcherMulticallV1 address>', // OevSearcherMulticallV1 contract address
  [
    'function externalMulticallWithValue(address[] calldata targets, bytes[] calldata data, uint256[] calldata values) external payable returns (bytes[] memory returndata)',
  ],
  wallet
);

const awardedTransaction = '0x'; // refer to Checking Bid Status and Listening for Awarded Bids

const performOracleUpdate = async () => {
  const tx = await OevSearcherMulticallV1.externalMulticallWithValue(
    [
      '0x709944a48cAf83535e43471680fDA4905FB3920a', // Api3ServerV1 contract address
      '<liquidationEventContractAddress>',
    ],
    [
      awardedTransaction, // oracle update encoded transaction
      '<liquidationEventEncodedTransaction>',
    ],
    [
      parseEther('0.1'), // bid to beneficiary
      '<liquidationEventValue>',
    ],
    {
      value: parseEther('0.1'), // bid amount
    }
  );
};
```

<FlexEndTag />
