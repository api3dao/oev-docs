---
title: Old integrations
pageHeader: dApps → Integration
---

<PageHeader/>

# Old integrations

If you are calling `read()` of a DapiProxy or a DapiProxyWithOev instead of [Api3ReaderProxyV1](/dapps/integration/contract-integration.md#api3readerproxyv1), your integration is of an older version.
Although these old integrations will be supported for the foreseeable future, please refer to the [integration instructions](/dapps/integration) to switch to the new version.
Doing so will allow us to upgrade your proxy if necessary (and there may be instances where us not being able to do so puts you at risk.)
As an additional note, DapiProxyWithOev users has stopped receiving OEV support, and will need to switch to the new integration version to continue receiving support.

If you are calling `read()` of a DataFeedProxy, or a DataFeedProxyWithOev, or Api3ServerV1 directly, you are strongly recommended to switch to the new integration version.
Note that such usage was never recommended in API3 docs, and we are making a stronger effort in steering users away from these now.
