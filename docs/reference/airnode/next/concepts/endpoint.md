---
title: Endpoint
sidebarHeader: Reference
sidebarSubHeader: Airnode
pageHeader: Reference → Airnode → v0.12 → Concepts and Definitions
path: /reference/airnode/next/concepts/endpoint.html
version: v0.12
outline: deep
tags:
---

<VersionWarning/>

<PageHeader/>

<SearchHighlight/>

<FlexStartTag/>

# {{$frontmatter.title}}

Airnode serves an API to a blockchain according to
[Oracle Integration Specifications (OIS)](/reference/ois/latest/). An API is
composed of [operations](/reference/ois/latest/specification.md#_5-2-operation),
which represent individual functionalities that an API offers. OIS maps each API
operation to an [endpoint](/reference/ois/latest/specification.md#_5-endpoints),
which can be thought of as an Airnode operation. The endpoints that an Airnode
will serve over the request–response protocol are listed under
[trigge/reference/airnode/next/deployment-files/config-json.md#triggers) of
[config.json](/reference/airnode/next/deployment-files/config-json.md).

## `endpointId`

`endpointId` identifies specific endpoints that an Airnode serves, and is
computed in JS (using ethers.js) as follows:

```js
ethers.utils.keccak256(
  ethers.utils.defaultAbiCoder.encode(
    ['string', 'string'],
    [oisTitle, endpointName]
  )
);
```

An alternative method to create an `endpointId` is to use the
[Admin CLI](/reference/airnode/next/packages/admin-cli.md) to derive the
endpoint ID.

Note that this means that an `endpointId` is not unique, and two Airnodes can
serve equivalent endpoints using the same ID (in fact, this is the desired
outcome).This is not an issue, as requests are made with a `airnode` (Airnode's
`address`) and `endpointId` pair.

This convention of determining an `endpointId` is not enforced at the
protocol-level. For example, one could choose to generate an `endpointId`
randomly, and as long as requesters use the correct `endpointId`, this will not
be an issue.

## Authorizers

Airnodes can assign a list of authorizers for each chain it responds to. See
[Authorizers](/reference/airnode/next/concepts/authorizers.md) for more
information.

<FlexEndTag/>