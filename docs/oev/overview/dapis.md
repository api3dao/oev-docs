---
title: OEV Network
pageHeader: OEV → Overview
outline: deep
---

<PageHeader/>

# dAPIs

We assume the reader is already familiar with [API3 dAPIs](/dapis/). This
section is dedicated to the role of the dAPIs in the OEV extraction.

We've already explained how OEV works by using the combination OEV Network and
OEV Auctioneer. However, searchers need a way to monitor the actual off-chain
prices to find profitable opportunities. Normally, searchers need to buy API
subscriptions of the underlying oracle sources creating additional friction.
API3 simplifies this process by providing to the same data that is used for
updating the dAPIs to the searchers - transparently and without cost.

## Signed APIs

<!-- TODO: This should be moved to the dAPIs docs. This OEV dAPIs section should just link there. -->

The heart of dAPIs are the first-party data feeds, powered by the owners of the
data themselves. These data source owners operate an Airnode - a small
abstraction that takes there data and cryptographically signs it. The signer
wallet never leaves the owner control, and anyone can verify that a particular
signed data was signed by the respective data source. Airnodes periodically push
the signed data to Signed APIs.

Signed APIs store the data pushed by Airnodes and expose them to the public via
API. This allows various use cases, out of which the two most important are:

1. Regular dAPIs updates
2. OEV dAPIs updates

Both the Airnode and Signed API implementations are
[open-sourced](https://github.com/api3dao/signed-api) to increase the
transparency and security of the process.

### Regular dAPI updates

<!-- TODO: This should be moved to the dAPIs docs. This OEV dAPIs section should just link there. -->

API3 dAPIs are updated via Airseeker, a push oracle that updates the dAPIs based
on deviation treshold parameters and heartbeat parameters. This tool is also
[open-sourced](https://github.com/api3dao/airseeker) to increase the
transparency and security of the process.

To support OEV seamlessly, these regular (or "base feed") updates use a Signed
API endpoint that provides data with a small delay. This delay is negligible in
practice, because the OEV searchers will keep the dAPIs up-to-date when it
matters. This activity also increases the decentralization of the data source.

<!-- TODO: Shall we mention the delay explicitly? -->

### OEV Signed Data

OEV signed data provide the real-time values for the dAPIs for the searchers.
This data is useless for base feed updates. Only the OEV auction winner can
effectively use this data to update the dAPIs as dictated by the contract logic.

### Endpoints

Signed APIs are also open sourced for anyone to use. This is yet another step
towards more decentralization, because even if API3 oracle service is down,
anyone can use these existing Signed APIs to do the updates instead.

API3 runs two independent Signed API services, deployed on two different regions
and service providers to ensure maximum uptime and reliability.

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

#### Base Feed Endpoints

1. `https://signed-api.api3.org/public/<AIRNODE_ADDRESS>` - The official API3
   Signed APIs used by the push oracle to update the base feeds.
2. `https://signed-api.nodary.io/public/<AIRNODE_ADDRESS>` - The unofficial
   Signed APIs maintained by Nodary collective.

For example, see the
[API3 response for Nodary Airnode](https://signed-api.api3.org/public/0xc52EeA00154B4fF1EbbF8Ba39FDe37F1AC3B9Fd4).

#### OEV Endpoints

The following are the endpoints that are publicly available:

1. `https://signed-api.api3.org/public-oev/<AIRNODE_ADDRESS>`
2. `https://signed-api.nodary.io/public-oev/<AIRNODE_ADDRESS>`

For example, see the
[API3 response for Nodary Airnode](https://signed-api.api3.org/public-oev/0xc52EeA00154B4fF1EbbF8Ba39FDe37F1AC3B9Fd4).
