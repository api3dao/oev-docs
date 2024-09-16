---
title: Searchers
pageHeader: OEV → Searchers
outline: deep
---

<PageHeader/>

# OEV Searching

This part of the docs is dedicated to searchers. We've already covered how OEV
works and scratched the surface behind the complexity of searching. We aim to
provide basic searching strategies to simplify onboarding of the existing MEV
searching community to OEV.

## OEV dApps catalog

We maintain an open source list with all dApps which integrated API3 feeds as
part of [dApp registry](https://github.com/api3dao/dapp-registry). However, not
all dApps opted-in to OEV yet, so we provide a separate list of OEV dApps are
currently good candidates for searching:

1. [Lendle](https://lendle.xyz/)
2. [Hana Finance](https://www.hana.finance/)
3. [Init Capital](https://init.capital/)

## From MEV searching

MEV searching has a huge community and expertize securing health and stability
across many dApps and chains. We want to make use of this community by outlining
the steps to transition from MEV to OEV searching.

::: info

MEV searching is the the recommended starting point for OEV integration. With
MEV bot you can verify the understanding of the protocol and liquidation logic.

:::

First, let me mention that the MEV searchers can still use their existing
infrastructure and searching bots - OEV does not prevent MEV. It should be
treated as an optional extensions that searchers can capitalize on. Integrating
OEV increases their profits by outperforming the competition and paying less to
block validators.

All of the searching logic related to position tracking, using flashloans and
swapping assets remains the same. What's left is:

1. [Bridge funds](/oev/overview/oev-network.html#bridging-eth) to the OEV
   network.
2. Deposit funds to the OevAuctionHouse contract.
3. Monitor off-chain signed data for dAPIs used by the dApp.
4. (Optional) Simulate the data feed update on-chain to determine liquidation
   opportunities.
5. Place bid on the OEV Network.
6. Wait for auction award.
7. Use the award to update the data feed on-chain and capture the OEV.

Most of these steps require small additions to the existing MEV bot, but it's
required to understand the mental model behind OEV. Because of that, we
recommend starting with an in-between solution we call "signed data MEV".

### MEV with Signed APIs

One step closer to OEV searching, is to extend MEV bots to utilize the public
[Base Feed Endpoints](/oev/overview/target-chain.html#base-feed-endpoints).
These endpoints are public, and also used by API3 DAO push oracle - so there is
tight competition - something which searchers are already used to.

The existing MEV bot can utilize this off-chain open source data and making a
base feed update on-chain whenever there is OEV to be captured. Refer to
[dAPIs Reference](/dapis/reference/understand/#dapis) for more details.

One advantage of using this data is that searchers can easily simulate the data
feed update (which is permissionless for base feeds) and to more easily
determine the liquidation opportunities. This is a direct improvement over
monitoring values of the data sources and predicting the next oracle update.

This solution is also a perfect backup in case OEV is down or in maintenance,
because dAPIs are decentralized with great uptime.

## OEV Searching

We assume that a searcher has an MEV bot and is familiar with API3 OEV solution.
Let's detail the steps to transition from MEV to OEV searching.

### Deposit funds

To be eligible to win OEV auctions, searchers need to have enough collateral
deposited in the OevAuctionHouse contract. See
[Bid Eligibility](/oev/overview/oev-auctioneer.html#bid-eligibility) for more
details.

We recommend using the same hot wallet for the bot on the OEV network (to
participate in auctions) and the target chain (to capture the OEV). To deposit
funds, you can use either the `deposit` or `depositForBidder` functions. The
latter allows you to deposit the collateral on behalf of another address.

### Monitor signed data

Searchers should periodically call the public
[OEV Endpoints](/oev/overview/target-chain.html#oev-endpoints) to get the
real-time values for the dAPIs used by the dApp. The dApp will use the a proxy
to read the dAPI value.

#### Obtain dAPI beacons

Searchers need to know the proxy address and the underlying dAPI name that the
proxy is using. The dApps are in full control to change their proxies, so it's
best to refer to their documentation or inspect their contracts.

Then, determine the underlying beacons used by the dAPI. This information is
fully on-chain and can be read from AirseekerRegistry contract.

::: info

**Example:**

Say, there is a dApp which uses the `ETH/USD` dAPI. We can compute the details
for this dAPI by:

```js
const encodedDapiName = ethers.utils.formatBytes32String('ETH/USD'); // 0x4554482f55534400000000000000000000000000000000000000000000000000
const encodedDapiNameHash = ethers.utils.keccak256(encodedDapiName); // 0x9e6138f8f57d7b493a8364edb0a0ac92399dfd890eecb9121050836a1749ba42
```

To determine the data feed ID for this dAPI, we can use the
`dapiNameHashToDataFeedId` function on the Api3ServerV1 contract:

```js
const api3ServerV1 = new ethers.Contract(
  api3ServerV1Address,
  api3ServerV1Abi,
  provider
);
const dataFeedId =
  await api3ServerV1.dapiNameHashToDataFeedId(encodedDapiNameHash); // e.g. 0x28d7af9ef50bde705ccabb77f27cfa481b998a4a01eaae22825835f611bf7ffe
```

To determine the data feed details, use the `dataFeedIdToDetails` function on
AirseekerRegistry contract:

```js
const airseekerRegistry = new ethers.Contract(
  airseekerRegistryAddress,
  airseekerRegistryAbi,
  provider
);
const dataFeedDetails = await airseekerRegistry.dataFeedIdToDetails(dataFeedId);
```

The data feed details need to be decoded first. Refer to the
[decodeDataFeedDetails](https://github.com/api3dao/airseeker/blob/main/src/update-feeds-loops/contracts.ts#L61)
function in Airseeker. The following is a simplified version of this function:

```js
const deriveBeaconId = (airnodeAddress, templateId) => {
  return ethers.utils.solidityKeccak256(
    ['address', 'bytes32'],
    [airnodeAddress, templateId]
  );
};

const decodeDataFeedDetails = (dataFeed) => {
  // The contract returns empty bytes if the data feed is not registered.
  if (dataFeed === '0x') return null;

  // This is a hex encoded string, the contract works with bytes directly
  // 2 characters for the '0x' preamble + 32 * 2 hexadecimals for 32 bytes + 32 * 2 hexadecimals for 32 bytes
  if (dataFeed.length === 2 + 32 * 2 + 32 * 2) {
    const [airnodeAddress, templateId] = ethers.utils.defaultAbiCoder.decode(
      ['address', 'bytes32'],
      dataFeed
    );

    const dataFeedId = deriveBeaconId(airnodeAddress, templateId);
    return [{ beaconId: dataFeedId, airnodeAddress, templateId }];
  }

  const [airnodeAddresses, templateIds] = ethers.utils.defaultAbiCoder.decode(
    ['address[]', 'bytes32[]'],
    dataFeed
  );

  const beacons = airnodeAddresses.map((airnodeAddress, idx) => {
    const templateId = templateIds[idx];
    const beaconId = deriveBeaconId(airnodeAddress, templateId);

    return { beaconId, airnodeAddress, templateId };
  });

  return beacons;
};
```

Say the following is the output after decoding the data feed details:

```json
[
  {
    "beaconId": "0x853a5cc0a517489779025cc8a48e771461a0616665efd6a61424e57997e6dbed",
    "airnodeAddress": "0xC9B494D3c6eA3fD42779Df9A136Db10374c98D80",
    "templateId": "0x3bdd99217e0be6a0c7812aad3138bd941c2eaf60410740cac7d716d1c5e05558"
  },
  {
    "beaconId": "0xefec8dab2bc20fcc03141d6e521148564e548046d291e116d02581aea7407533",
    "airnodeAddress": "0x6b56E47DccFbC82D63Df3da417d26e8B1B877f0f",
    "templateId": "0xdeda2f7938bf877d2f011aa550852d3459794e16944ea0b7513465479752ba93"
  },
  {
    "beaconId": "0x00be0673ee8afc9a25fc12edddb7fbe293a7da8f04953171243b594c257141d7",
    "airnodeAddress": "0xa924847354c551C79BAE7E75529364bA0449e51A",
    "templateId": "0x9f66583540b490e11ee1b40c7b561946eceb96273489c95328c0cd290060129b"
  },
  {
    "beaconId": "0x83a32cce0fc108005ffb0f745f58f1f730770a361a3f051fd058357d525a2182",
    "airnodeAddress": "0x5791Fb78D4e37A9D0f0003199D1AE1A8C04C8d89",
    "templateId": "0x0970b1e622f50950bf55b3375a849cdd8f8ecbb0ff47d4bde3cbfb225dfcc607"
  },
  {
    "beaconId": "0x752bb8fa00e8c35657a8414884ad4ab976a56fa7d015eb7ade1d60eb15e2a895",
    "airnodeAddress": "0xbC6471E88d8aFe936A45bEB8bd20a210EBEF6822",
    "templateId": "0xb501fe47e4ad40fd34f5e5a685e79b991b51e2c887d2dbe35bc645ed1f390241"
  },
  {
    "beaconId": "0x4385954e058fbe6b6a744f32a4f89d67aad099f8fb8b23e7ea8dd366ae88151d",
    "airnodeAddress": "0xc52EeA00154B4fF1EbbF8Ba39FDe37F1AC3B9Fd4",
    "templateId": "0x154c34adf151cf4d91b7abe7eb6dcd193104ef2a29738ddc88020a58d6cf6183"
  },
  {
    "beaconId": "0xf580f27c696b05c8572266e6db5cb5b12a562cac5dfb2e7c240a5ef7d845aebf",
    "airnodeAddress": "0x31C7db0e12e002E071ca0FF243ec4788a8AD189F",
    "templateId": "0x046e65143918e48adc0a77bada55931622531819be4a7473d80b7f906b813105"
  }
]
```

The searching bot needs to monitor these data sources with the public Signed
APIs.

:::

#### Query Signed APIs

For each tracked beacon, searchers need to derive the corresponding
[OEV Beacon](http://localhost:5173/oev/overview/target-chain.html#oev-beacons).

Then, simply call the OEV Signed API endpoints for different Airnodes and pick
the signed data for the required OEV beacons. It's necessary to persist these
values for a brief period of time - in case they win the auction and need to
update the data feed.

OEV auctions provide exclusivity guarantees only for data points with timestamps
within the bidding phase, which are submitted during the allowance period.
Moreover, it's not possible to use data fresher than the end of the bidding
phase. This is to ensure the same guarantees apply for the subsequent auction
winner. This means that there is little reason to store data for longer than a
single auction.

#### Simulating data feed update

Compared to the base feed updates, OEV updates are permissioned - allowing only
the auction winner to update the data feed. However, simulating the data feed
updates on chain is really powerful because searchers don't need to replicate
complex on-chain logic off-chain, but instead attempt to update the feed(s) and
see how it affects the dApp (without actually making any state changes).

This works via `simulateDappOevDataFeedUpdate` and `simulateExternalCall`
function, which can be called only with `address(0)`. The only way to
impersonate a zero address is during staticcall simulation. The intended usage
is to do a multicall that simulates the data feed update(s) then makes arbitrary
number external calls.

To understand how to construct the payload for data feed simulation, refer to
[Update the Data Feed](/oev/overview/target-chain.html#update-the-data-feed)
section.

```js
const signedDataCollection = [...] // Assume we have the signed data for the beacons.

// 1. Create the calldata for the dApp OEV data feed updates.
const dAppOevDataFeedUpdateCalldata = []
for (const signedData of signedDataCollection) {
  dAppOevDataFeedUpdateCalldata.push(
    api3ServerV1OevExtension.interface.encodeFunctionData(
      'simulateDappOevDataFeedUpdate',
      [dAppId, signedData]
    )
  );
}

// 2. Create the calldata for the external calls.
const externalCallsCalldata = [...] // E.g. Liquidation calls.

// 3. Impersonate the zero address and simulate the data feed update.
const api3ServerV1OevExtensionImpersonated = api3ServerV1OevExtension.connect(
  ethers.constants.AddressZero
);

// 4. Simulate the data feed update and external calls.
const simulationResult = await api3ServerV1OevExtensionImpersonated.multicall.staticcall(
  ...dAppOevDataFeedUpdateCalldata,
  ...externalCallsCalldata
);
```

### Placing bid

https://github.com/api3dao/oev-docs/issues/57

### Waiting for auction award

https://github.com/api3dao/oev-docs/issues/57

### Capturing OEV

https://github.com/api3dao/oev-docs/issues/57
