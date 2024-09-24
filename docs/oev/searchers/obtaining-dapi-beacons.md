---
title: Obtaining dAPI Beacons
pageHeader: OEV → Searchers
outline: deep
---

<PageHeader/>

# Obtaining dAPI beacons

Searchers need to know the proxy address and the underlying dAPI name that the
proxy is using. The dApps are in full control to change their proxies, so it's
best to refer to their documentation or inspect their contracts.

To determine the underlying beacons used by the dAPI, you can use the
AirseekerRegistry contract on the target chain.

## Data feed details encoding

The AirseekerRegistry contract uses a particular encoding for data feed details
so that the details can be persisted on-chain as a single `bytes` value. The
callers of AirseekerRegistry need to encode or decode this value to get the
actual data feed details.

Encoding or decoding data feed details is simple, but depends on whether the
feed is a beacon (single source) or a beacon set (multi sources). Assume we have
encoded `dataFeedDetails` and we need to decode it. Note, the encoding follows a
similar principle.

The decoding of a beacon:

```solidity
(address airnode, bytes32 templateId) = abi.decode(
  dataFeedDetails,
  (address, bytes32)
);
```

The decoding of a beacon set:

```solidity
(address[] memory airnodes, bytes32[] memory templateIds) = abi.decode(
  dataFeedDetails,
  (address[], bytes32[])
);
```

To know which encoding to use, you can check the length of the
`dataFeedDetails`. For single beacon, the length is always `64` bytes, because
both `address` and `bytes32` are encoding using 32 bytes. For beacon set, the
length depends on the number of beacons encoded.

## Example

Say there is a dApp which uses the `ETH/USD` dAPI. We can compute the details
for this dAPI off-chain by:

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
the AirseekerRegistry contract:

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
