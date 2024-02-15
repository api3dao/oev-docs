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

## Deposit testETH into OEV Auction House Contract

you will need to deposit testETH into the OEV Auction House Contract to start
placing bids.

```javascript
const { JsonRpcProvider, Wallet, Contract } = require('ethers');
const provider = new JsonRpcProvider(
  'https://oev-network-sepolia-testnet-rpc.eu-north-2.gateway.fm'
);
const wallet = new Wallet('<your_private_key>', provider);
const auctionHouse = new Contract(
  '0x7597985630674dA4D62Ae60ad4D10E40bb619B08',
  ['function deposit() external payable returns (uint256 bidderBalance)'],
  wallet
);

const deposit = async () => {
  const tx = await auctionHouse.deposit({
    value: ethers.utils.parseEther('1'),
  });
  console.log(tx.hash);
  await tx.wait();
  console.log('Deposited');
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
| bidTopic             | bytes32 | [Bid topic](./arguments.md#bidtopic)                                                         |
| chainId              | uint256 | Chain ID                                                                                     |
| bidAmount            | uint256 | Bid amount in the native currency of the chain where the proxy is deployed                   |
| bidDetails           | bytes   | [Bid details](./arguments.md#biddetails---bytes)                                             |
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
} = require('ethers');

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
    ['address', 'uint8', 'uint256', 'address'],
    [proxyAddress, conditionIndex, conditionValue, updaterAddress]
  );
};

const provider = new JsonRpcProvider(
  'https://oev-network-sepolia-testnet-rpc.eu-north-2.gateway.fm'
);
const wallet = new Wallet('<your_private_key>', provider);

const auctionHouse = new Contract(
  '0x7597985630674dA4D62Ae60ad4D10E40bb619B08',
  [
    'function placeBidWithExpiration(bytes32 bidTopic, uint256 chainId, uint256 bidAmount, bytes bidDetails, uint256 maxCollateralAmount, uint256 maxProtocolFeeAmount, uint32 expirationTimestamp) external',
  ],
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
    ethers.utils.parseEther('1'),
    bidDetails,
    ethers.utils.parseEther('0'), // Collateral Basis Points is 0 on testnet
    ethers.utils.parseEther('0'), // Protocol Fee Basis Points is 0 on testnet
    Math.floor(Date.now() / 1000) + 60 * 60 * 12 // 12 hours from now
  );
  console.log(tx.hash);
  await tx.wait();
  console.log('Bid Placed');
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

```javascript
const provider = new JsonRpcProvider(
  'https://oev-network-sepolia-testnet-rpc.eu-north-2.gateway.fm'
);
const wallet = new Wallet('<your_private_key>', provider);

const auctionHouse = new Contract(
  '0x7597985630674dA4D62Ae60ad4D10E40bb619B08',
  [
    'function placeBid(bytes32 bidTopic, uint256 chainId, uint256 bidAmount, bytes bidDetails, uint256 maxCollateralAmount, uint256 maxProtocolFeeAmount) external',
  ],
  wallet
);

const placeBid = async () => {
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
  const tx = await auctionHouse.placeBid(
    bidTopic,
    11155111,
    ethers.utils.parseEther('1'),
    bidDetails,
    ethers.utils.parseEther('0'), // Collateral Basis Points is 0 on testnet
    ethers.utils.parseEther('0') // Protocol Fee Basis Points is 0 on testnet
  );
  console.log(tx.hash);
  await tx.wait();
  console.log('Bid Placed');
};
```

### Checking Bid Status and Listening for Awarded Bids

Searchers can check the status of their bids by quering the bidId using the
`Bids` getter function of the OEV Auction House Contract.

```javascript
const { JsonRpcProvider, Contract, keccak256, AbiCoder } = require('ethers');

const abiCoder = new AbiCoder();

const provider = new JsonRpcProvider(
  'https://oev-network-sepolia-testnet-rpc.eu-north-2.gateway.fm'
);
const auctionHouse = new Contract(
  '0x7597985630674dA4D62Ae60ad4D10E40bb619B08',
  [
    'function bids(bytes32 bidId) external view returns (uint8, uint32, uint104, uint104)',
  ],
  provider
);

bytes32 bidId = keccak256(
    abiCoder.encode(
        ['address', 'bytes32', 'bytes'],
        ['<searcher address doing the update>', bidTopic, bidDetails]
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
    console.log('Bid is awarded');
  }
};

```

Searchers need to listen for awarded bids using the `AwardedBid` event of the
OEV Auction House Contract.

```javascript
const { JsonRpcProvider, Contract } = require('ethers');

const provider = new JsonRpcProvider(
  'https://oev-network-sepolia-testnet-rpc.eu-north-2.gateway.fm'

    const auctionHouse = new Contract(
        '0x7597985630674dA4D62Ae60ad4D10E40bb619B08',
        [
            'event AwardedBid(address indexed bidder, bytes32 indexed bidTopic, bytes32 indexed bidId, bytes awardDetails, uint256 bidderBalance)',
        ],
        provider
    );

    auctionHouse.on('AwardedBid', (bidder, bidTopic, bidId, awardDetails, bidderBalance) => {
        if (bidder === '<searcher address doing the update>') {
            console.log('Bid is awarded');
            // perform the oracle update using the awarded bid
        }
    });

```

### Performing the oracle update using the awarded bid

Once the bid is awarded, the searcher can perform the oracle update by using the
`awardDetails` directly via a multicall to the Api3ServerV1 contract.

```javascript
const { JsonRpcProvider, Contract, keccak256, AbiCoder } = require('ethers');

const abiCoder = new AbiCoder();

const awardDetails = '0x';

const provider = new JsonRpcProvider(
  'https://oev-network-sepolia-testnet-rpc.eu-north-2.gateway.fm'
);

const multicall3 = new Contract(
  '0xcA11bde05977b3631167028862bE2a173976CA11',
  [
    'function aggregate3Value(Call3Value[] calldata calls) public payable returns (Result[] memory returnData)',
  ],
  provider
);

const performOracleUpdate = async () => {
  const tx = await multicall3.aggregate3Value(
    [
      {
        target: '0x709944a48cAf83535e43471680fDA4905FB3920a', // Api3ServerV1 contract address
        allowFailure: false,
        value: bidAmount,
        callData: awardDetails,
      },
    ],
    {
      value: bidAmount,
    }
  );
};
```

<FlexEndTag />
