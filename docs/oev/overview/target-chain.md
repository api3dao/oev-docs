---
title: Target chain
pageHeader: OEV → Overview
outline: deep
---

<PageHeader/>

# Target chain

We've already explained how OEV works by using a combination of the OEV Network
and the OEV Auctioneer. The last piece to explain is how OEV extraction works on
a target chain. We need to understand:

1. How dAPIs work in combination with OEV.
2. How to use the auction award to update the dAPIs.
3. How does a dApp read the updated OEV value.

This section is more technical and mainly intended for dApp developers and
searchers.

## dAPIs

We assume the reader is already familiar with API3 [dAPIs](/dapis/). This
section is dedicated to the role of the dAPIs in OEV extraction.

Searchers need a way to monitor real-time off-chain prices to find profitable
opportunities. Normally, searchers need to buy API subscriptions of the
underlying oracle sources, creating additional friction in the process. API3
simplifies this process by providing the same data that is used for updating the
dAPIs to the searchers publicly - and without cost.

### Signed APIs

The heart of dAPIs are the first-party data feeds, powered by the owners of the
data themselves. These data source owners operate an Airnode - a small
abstraction that takes their data and cryptographically signs it. The signer
wallet never leaves the owner's control, and anyone can verify that a particular
signed data was signed by the respective data source. Airnodes periodically push
the signed data to Signed APIs.

Signed APIs store the data pushed by Airnodes and expose them to the public via
an API. This allows for various use cases, out of which the two most important
are:

1. Regular dAPI updates
2. OEV dAPI updates

Both the Airnode and Signed API implementations are
[open source](https://github.com/api3dao/signed-api) to increase the
transparency and security of the process.

#### Regular dAPI updates

dAPIs are updated via Airseeker, a push oracle that updates the dAPIs based on
deviation treshold parameters and heartbeat parameters. This tool is also
[open source](https://github.com/api3dao/airseeker) to increase the transparency
and security of the process.

To support OEV seamlessly, these regular (or "base feed") updates use a Signed
API endpoint that provides data with a small delay. This delay is negligible in
practice, because the OEV searchers will keep the dAPIs up-to-date when it
matters. This activity also increases the decentralization of the data source.

#### OEV Signed Data

OEV signed data provide the real-time dAPI values for the searchers. This data
is useless for base feed updates. Only the OEV auction winner can effectively
use this data, by updating the dAPIs provided they present the correct
signature.

#### OEV Beacons

Beacons used for dAPIs (base beacons) consist of two important fields:

1. `Airnode address` - Identifies the data source of the data - e.g. Nodary.
2. `Template ID` - Identifies the data feed - e.g. ETH/USD.

Each base feed beacon has a corresponding OEV beacon, which is derived from the
original one by hashing the template ID using `keccak256`. Each Airnode signs
two beacon values - one for the base feed beacon and one for the OEV one.

The OEV beacons will have different beacon IDs and are essentially unused
(because there is no dAPI using them), but they are valuable to searchers for
monitoring the real-time, off-chain data feed values. The auction winner can use
this data to update the dAPI value for a particular dApp.

::: info

**Example:**

Say we have the following base feed beacon:

```json
"0xfe395743aff41835420d109be4bf98b93e9d9670f5539fc6392578b4626ecedf": {
  "airnode": "0xc52EeA00154B4fF1EbbF8Ba39FDe37F1AC3B9Fd4",
  "templateId": "0x1bb9efc88ac9d910a9edc28e8cad8959d196a551e15c9af3af21247f1605873f",
}
```

To derive the template ID of the OEV beacon, we hash it's template ID:

```solidity
keccak256(abi.encodePacked(bytes32(0x1bb9efc88ac9d910a9edc28e8cad8959d196a551e15c9af3af21247f1605873f)))
// Output: 0xbc7896315bfd4b1186a05f219ec71a95def0d038617e7ae534075317866bfd1b
```

Which gives us the following OEV beacon:

```json
"0x154ca7c81eb1ed9ce151d5b6ad894c5ab79d19bee20d89eb061aaf24f788221f": {
  "airnode": "0xc52EeA00154B4fF1EbbF8Ba39FDe37F1AC3B9Fd4",
  "templateId": "0xbc7896315bfd4b1186a05f219ec71a95def0d038617e7ae534075317866bfd1b",
}
```

Notice that the beacon ID is different, but the Airnode address is the same.

:::

#### Endpoints

Signed APIs are also open sourced for anyone to use. This is yet another step
towards more decentralization, because even if API3 oracle service is down,
anyone can use these existing Signed APIs to do the updates instead.

API3 runs Signed APIs deployed on AWS, ensuring maximum uptime and reliability.

The endpoint path of a Signed API has the following shape:

```md
<BASE_URL>/<ENDPOINT_NAME>/<AIRNODE_ADDRESS>
```

To break it down:

1. `BASE_URL` - The base URL of the Signed API.
2. `ENDPOINT_NAME` - The name of the endpoint. This is a human-readable name
   that describes the data that is being served.
3. `AIRNODE_ADDRESS` - The address of the Airnode. To see the data feed sources
   refer to the [API3 market](https://market.api3.org).

##### Base Feed Endpoints

The following are the endpoints that are publicly available:

1. `https://signed-api.api3.org/public/<AIRNODE_ADDRESS>` - The official API3
   Signed APIs used by the push oracle to update the base feeds.

For example, see the
[API3 response for Nodary Airnode](https://signed-api.api3.org/public/0xc52EeA00154B4fF1EbbF8Ba39FDe37F1AC3B9Fd4).

##### OEV Endpoints

The following are the endpoints that are publicly available:

1. `https://signed-api.api3.org/public-oev/<AIRNODE_ADDRESS>`

For example, see the
[API3 response for Nodary Airnode](https://signed-api.api3.org/public-oev/0xc52EeA00154B4fF1EbbF8Ba39FDe37F1AC3B9Fd4).

#### Response

The response of the Signed API is a JSON object with the following fields:

1. `count` - The number of signed data entries.
2. `data` - An object with the signed data entries. The keys are the beacon IDs
   and the values are the signed data objects for the particular beacon(s).

For example:

```json
{
  "count": 2,
  "data": {
    "0xcdaf3ecba9e3f1457b64b1dd33dd6dbd5d3a0d43dbcb6b94fbf755ca8a64f1c2": {
      "airnode": "0x31C7db0e12e002E071ca0FF243ec4788a8AD189F",
      "encodedValue": "0x0000000000000000000000000000000000000000000000000f710eec75e16680",
      "signature": "0x5d382d6636f6b87642db580586bac7f57609f47d30e133dbb6bedede233a6d58065cb4aefbe2d2db1bd61ee9734a8671c05a5f2f79a0192ef491662ba3e390ac1c",
      "templateId": "0x174bd80b61ec8451784391df43c8c4ffc4ae82216a65cc15107bfdf4c29f6ca1",
      "timestamp": "1727085105"
    },
    "0x4048c53a7e6d4b857fb04bd4f496691e526f1de8f38880469ec834bc46021cd4": {
      "airnode": "0x31C7db0e12e002E071ca0FF243ec4788a8AD189F",
      "encodedValue": "0x0000000000000000000000000000000000000000000000000210a4cfc6940000",
      "signature": "0x00b84c978f9bab8639a8931990aede93ce34b8f9564ced755499bac503a39d7e7dad882dd1be77954bbbf152b436912204a29a1260283dda863cf489f631a17b1c",
      "templateId": "0xee8d0cab5281c59547d4ae9021121df9aec759d457c51b905296610fbef58bed",
      "timestamp": "1727085103"
    }
  }
}
```

## Using an Auction Award

The logic for the base feed updates is dictated by the
[Api3ServerV1](https://github.com/api3dao/contracts-qs/blob/main/contracts/api3-server-v1/Api3ServerV1.sol)
contract. Specifically, anyone can use the signed data and call
`updateBeaconWithSignedData` function. Similarly, anyone can call
`updateBeaconSetWithBeacons` function to aggregate the beacon values and update
the dAPIs.

The OEV capabilities are enabled by the
[Api3ServerV1OevExtension](https://github.com/api3dao/contracts-qs/blob/main/contracts/api3-server-v1/Api3ServerV1OevExtension.sol).
This contract allows the auction winner to pay for the winning bid and update
the data feed values.

### Paying for the OEV Bid

To pay for the winning bid, call the `payOevBid` function. This function
requires the following parameters:

1. `uint256 dappId` - The ID of the dApp that the searcher wants to update. This
   is the same value which they've used in the bid topic.
2. `uint32 signedDataTimestampCutoff` - The signed data timestamp cutoff period.
   This is the same value, which they've used in the bid topic.
3. `bytes calldata signature` - The signature that the auction winner received
   as an award. This is obtained from the event emitted on the OEV Network after
   Auctioneer awarded the bid.

The signature is crafted for a specific dApp ID and signed data timestamp
cutoff. If the searcher provides incorrect values, the signature verification
will fail, causing the transaction to revert. If the signature is valid, the
contract allows the sender to update the data feed. Due to exclusivity
guarantees, the winner is guaranteed to be who can update the feed with the data
from within the bidding phase of the respective auction.

### Updating the Data Feed

To update the data feed values, call the `updateDappOevDataFeed` function. This
requires the sender to be whitelisted by paying for the OEV bid first. The
function requires the following parameters:

1. `uint256 dappId` - The ID of the dApp that the searcher wants to update.
2. `bytes[] calldata signedData` - The ABI encoded signed data that the searcher
   wants to update the dAPI with. The contract decodes the following fields:
   - `address airnode` - The address of the Airnode.
   - `bytes32 templateId` - The template ID of the base beacon - **not** the
     template ID of the OEV beacon.
   - `uint256 timestamp` - The timestamp of the data.
   - `bytes memory data` - The encoded value.
   - `bytes memory signature` - The signature for this signed data - signed for
     the base beacon.

::: info

**Important**

It might be a bit surprising to pass the template ID of the base feed beacon,
because the data and the signature are supplied for the OEV beacon. However, the
contract needs to know both. While hashing the base feed template ID to obtain
the template ID of the OEV beacon is possible - "un-hashing" the base feed
template ID from the OEV template ID is not.

Say the searcher wants to update the value of base feed beacon with template ID
`0x1bb9efc88ac9d910a9edc28e8cad8959d196a551e15c9af3af21247f1605873f` and they
want to use the following signed data for the OEV beacon:

```json
"0x154ca7c81eb1ed9ce151d5b6ad894c5ab79d19bee20d89eb061aaf24f788221f": {
  "airnode": "0xc52EeA00154B4fF1EbbF8Ba39FDe37F1AC3B9Fd4",
  "encodedValue": "0x000000000000000000000000000000000000000000000000003f9c9ba19d0d78",
  "signature": "0xf5f454722652215823cb868fd53b7a0c63090dff46e65ba7cdd5fb120df3a520522b80b1fa41f2599c429daa0e48c4f42f60f25b41dab3a8a9be1d2547ebe9811b",
  "templateId": "0xbc7896315bfd4b1186a05f219ec71a95def0d038617e7ae534075317866bfd1b",
  "timestamp": "1726474901"
}
```

they would encode the signed data as follows:

```solidity
abi.encode(
  address(0xc52EeA00154B4fF1EbbF8Ba39FDe37F1AC3B9Fd4),
  bytes32(0x1bb9efc88ac9d910a9edc28e8cad8959d196a551e15c9af3af21247f1605873f),
  uint256(1726474901),
  hex"000000000000000000000000000000000000000000000000003f9c9ba19d0d78",
  hex"f5f454722652215823cb868fd53b7a0c63090dff46e65ba7cdd5fb120df3a520522b80b1fa41f2599c429daa0e48c4f42f60f25b41dab3a8a9be1d2547ebe9811b"
)
```

:::

The auction winner can update the data feed multiple times and in multiple
transactions. However, the contract enforces tight security measures. The
timestamp of the signed data for OEV beacon must be greater or equal to the
timestamp of the base feed beacon. The data feed value after aggregating OEV
beacons must change the base feed - either increase the timestamp or change the
aggregated value. This enforces time monotonicity at the contract level, making
sure OEV updates provide only the freshest data.

### Api3ReaderProxyV1

The
[Api3ReaderProxyV1](https://github.com/api3dao/contracts-qs/blob/main/contracts/api3-server-v1/proxies/Api3ReaderProxyV1.sol)
contract is a ChainLink compatible proxy with OEV built-in internally. There are
no changes required from the dApp's perspective to integrate OEV, which reads
the value via the `read` function.

Internally, this proxy uses the `Api3ServerV1` and `Api3ServerV1OevExtension`
contracts to read the base feed and OEV value respectively, with a preference
for the fresher out of the two.
