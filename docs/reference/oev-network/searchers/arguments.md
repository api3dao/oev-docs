---
title: Argument Reference
sidebarHeader: Reference
sidebarSubHeader: OEV Network
pageHeader: Reference → OEV Network → Searchers → Argument Reference
path: /reference/oev-network/searchers/arguments.html
outline: deep
tags:
---

<PageHeader/>

<SearchHighlight/>

<FlexStartTag/>

# {{$frontmatter.title}}

### Proxy Address

dAPPs use a proxy address to read the latest data point from the dAPI. OEV
Network enabled proxies can be deployed using the [API3 Market](market.api3.org)
(soon)

### Condition and Condition Value

The condition is the execution condition for the bid. Bids fulfill the condition
when the latest off-chain data point from the dAPI satisfies the condition when
compared to the condition value.

For example, if the condition is `LTE` (less than or equal to) and the condition
value is `50000`, the bid will be fulfilled if the latest off-chain data point
from the dAPI is less than or equal to `50000`.

### bidTopic - Bytes32

The bid topic is an identifier for the type of bid. it can be derived using the
hash of the chainId and the [proxy address](#proxy-address).

```javascript
const { keccak256, solidityPacked } = require('ethers');
const chainId = 11155111;
const proxyAddress = '0xa8cea58ab9060600e94bb28b2c8510b73171b55c';
const bidTopic = keccak256(
  solidityPacked(['uint256', 'address'], [BigInt(chainId), proxyAddress])
);
```

### bidDetails - Bytes

The bid details are the encoded parameters for the bid. The parameters are
[proxy address](#proxy-address), [condition](#condition-and-condition-value),
[condition value](#condition-and-condition-value) and updater address.

```javascript
const { AbiCoder } = require('ethers');
const abiCoder = new AbiCoder();

const BID_CONDITIONS = [
  { onchainIndex: 0n, description: 'LTE' },
  { onchainIndex: 1n, description: 'GTE' },
];

const conditionValue = 50000;
const updaterAddress = '<searcher address doing the update>';
const condition = BID_CONDITIONS.find((c) => c.description === 'LTE');
const bidDetails = abiCoder.encode(
  ['address', 'uint256', 'int224', 'address'],
  [proxyAddress, condition.onchainIndex, conditionValue, updaterAddress]
);
```

<FlexEndTag />;
