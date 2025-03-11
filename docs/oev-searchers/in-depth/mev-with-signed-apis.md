---
title: MEV with Signed APIs
pageHeader: OEV Searchers → In Depth
outline: deep
---

<PageHeader/>

# MEV with Signed APIs

An intermediate step towards OEV searching is to extend MEV bots to utilize the
public
[base feed endpoints](/oev-searchers/in-depth/data-feeds/#base-feed-endpoints). This data is delayed compared to data in the [OEV endpoints](/oev-searchers/in-depth/data-feeds/#oev-endpoints), so it's expected searchers won't be able to extract much value this way. That said, it is a good backup in case OEV auctions are paused or encountering unexpected technical issues. It also the only way to extract value for [legacy integrations](/oev-searchers/in-depth/#legacy-integrations).

The existing MEV bot can utilize the off-chain open-source data and make a base
feed update on-chain whenever there is OEV to be captured. Refer to
[updating data feed value](/oev-searchers/in-depth/data-feeds/#updating-data-feed-value)
section for more details.

One advantage of using this data is that searchers can easily simulate the data
feed update (which is permissionless for base feeds) to determine OEV
opportunities more easily. This is a direct improvement over monitoring data
source values and predicting the next oracle update.

::: info 💰 Financial

This improvement on its own provides a major competitive advantage over existing MEV competition and leads to a significant increase in profits. That said, this strategy will not work when the competition is doing OEV searching.

:::

## Monitor signed data

First, searchers need to have a list of data feeds used by the dApp and
[obtain its beacons](/oev-searchers/in-depth/data-feeds/#dapp-sources). Note that
this can be cached because beacons change only when the
underlying base feed dAPI changes, which happens rarely, only when a dAPI is reconfigured.

Once the list of base feed beacons is known, searchers should periodically call
the public
[base feed endpoints](/oev-searchers/in-depth/data-feeds/#base-feed-endpoints) to get
the real-time values for the base feed beacons used by the dApp. This data may
be used immediately to look for OEV opportunities.

## Simulate a data feed update

Assuming a searcher called the Signed APIs and has valid data to update the base
feed, they can use them to simulate the data feed update on-chain followed by a
call to check for OEV opportunities.

The code below demonstrates how this process can be implemented in JavaScript
with the `ethers` library for an imaginary liquidation protocol. Note that this
code makes use of variables that are not defined in the context of the code snippet for brevity. Their
purpose can be understood from the context. The snippet makes use of a well-known [Multicall3 contract](https://www.multicall3.com/).

```javascript
const beaconsIds = []; // Assume the data feed is a beacon set with these beacons
const dataFeedSignedData = []; // Assume we have some signed data to update

// 1. Create the calldata for updating the base feed beacons
const dataFeedUpdateCalldata = dataFeedSignedData.map((signedData) => ({
  target: api3ServerAddress,
  allowFailure: true,
  callData: api3ServerV1.interface.encodeFunctionData(
    'updateBeaconWithSignedData',
    [airnode, templateId, timestamp, encodedValue, signature]
  ),
}));
dataFeedUpdateCalldata.push({
  target: api3ServerAddress,
  allowFailure: true,
  callData: api3ServerV1.interface.encodeFunctionData(
    'updateBeaconSetWithBeacons',
    [beaconsIds.map((beaconsId) => beaconId)]
  ),
});

// 2. Create calldata to simulate liquidation opportunity
const liquidationOpportunityCalldata = {
  target: liquidatorContract,
  callData: liquidatorContract.interface.encodeFunctionData('liquidate', [
    borrower,
  ]),
  allowFailure: false,
};

// 3. Merge the calldata for updating the feeds and capturing the liquidation
const calldata = [...dataFeedUpdateCalldata, liquidationOpportunityCalldata];

// 4. Execute the staticcall multicall, using a standard Multicall3 contract
const result = await multicall3.aggregate3.staticCall(calls);
```

## Capture MEV

If a searcher successfully simulates a profitable MEV opportunity, they can use
the same data feed calldata and submit the transaction instead of using a
staticcall.

Note that the signed data for base feeds is delayed to ensure OEV searchers have
exclusive priority for OEV extraction.

## Reference implementation

- [Example OEV Compound bot](https://github.com/api3dao/oev-v1-compound-bot/tree/mev-with-signed-apis) - You can also inspect the
  [changes](https://github.com/api3dao/oev-v1-compound-bot/compare/mev...mev-with-signed-apis)
  needed to add the MEV with Signed APIs functionality to an existing MEV bot.
