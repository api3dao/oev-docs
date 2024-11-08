---
title: MEV with Signed APIs
pageHeader: OEV Searchers → In Depth
outline: deep
---

<PageHeader/>

# MEV with Signed APIs

An intermediate step towards OEV searching is to extend MEV bots to utilize the
public
[base feed endpoints](/oev-searchers/in-depth/dapis/#base-feed-endpoints). These
endpoints are also used by the API3 push oracle, so there is tight competition
to be the fastest with the on-chain transaction.

The existing MEV bot can utilize this off-chain open-source data and make a base
feed update on-chain whenever there is OEV to be captured. Refer to
[updating dAPI value](/oev-searchers/in-depth/dapis/#updating-dapi-value)
section for more details.

One advantage of using this data is that searchers can easily simulate the data
feed update (which is permissionless for base feeds) to determine OEV
opportunities more easily. This is a direct improvement over monitoring data
source values and predicting the next oracle update.

This solution is also a backup in case OEV is down or under maintenance.

## Monitoring Signed Data

First, searchers need to have a list of dAPIs used by the dApp and
[obtain its beacons](/oev-searchers/in-depth/dapis/#dapp-sources). Note that
this operation can be heavily cached because they change only when the
underlying base feed changes, which happens only when the dAPI is reconfigured.

Once the list of base feed beacons is known, searchers should periodically call
the public
[base feed endpoints](/oev-searchers/in-depth/dapis/#base-feed-endpoints) to get
the real-time values for the base feed beacons used by the dApp. This data may
be used immediately to look for OEV opportunities.

## Simulating a Data Feed Update

Assuming a searcher called the Signed APIs and has valid data to update the base
feed, they can use them to simulate the data feed update on-chain followed by a
call to check for OEV opportunities.

The code below demonstrates how this process can be implemented in JavaScript
with the ethers library for an imaginary liquidation protocol. Note that this
code makes use of variables that are not defined in the code snippet. Their
purpose can be understood from the context and is left out to keep the example
concise and focused on the general idea.

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

## Example

One can refer the the
[OEV v1 Compound example bot](https://github.com/api3dao/oev-v1-compound-bot/tree/mev-with-signed-apis)
and inspect the
[changes](https://github.com/api3dao/oev-v1-compound-bot/compare/mev...mev-with-signed-apis)
needed to migrate the MEV bot to MEV with Signed APIs bot.

The bot is configured to run against a forked Compound3 protocol on Base
network. Follow the description in the README for details.
