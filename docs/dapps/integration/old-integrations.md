---
title: Old integrations
pageHeader: dApps → Integration
---

<PageHeader/>

# Old integrations

If you are calling `read()` of a DapiProxy or a DapiProxyWithOev instead of [Api3ReaderProxyV1](/dapps/integration/contract-integration.md#api3readerproxyv1), your integration is of an older version.
While we'll continue supporting these older integrations, we recommend upgrading to the new version following our [integration instructions](/dapps/integration/index).
This upgrade enables us to update your proxy when needed, protecting you from potential risks.
Note that DapiProxyWithOev users must upgrade to restore their discontinued OEV support.

If you are calling `read()` of a DataFeedProxy, or a DataFeedProxyWithOev, or Api3ServerV1 directly, we strongly recommend switching to the new integration version.
These integration methods were never documented in Api3 docs, and we now actively discourage their use.
