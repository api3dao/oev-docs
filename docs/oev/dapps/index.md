---
title: dApps
pageHeader: OEV -> dApps
outline: deep
---

<PageHeader/>

# dApps

OEV is a very interesting concept for dApps, because it's a way to increase the
revenue with minimal effort once using API3's decentralized APIs (dAPIs). There
are no protocol change required - the dApp needs to only change the oracle
source. This is because the dAPIs are built with OEV in mind and opting to OEV
is a matter of changing to a different proxy - one which supports OEV. To read
more about dAPIs, read [dAPIs documentation](/dapis/).

The dAPIs with OEV inherit all the same security guarantees as the non-OEV
dAPIs. Moreover, because of OEV dApps are guaranteed to have the most up-to-date
data available when it matters because of the searchers. There is no distinction
between regular updates (performed by API3 push oracle) and the OEV updates
(performed by the searcher). This maximizes the revenue and security for the
protocol with increased decentralization.

## Leveraging OEV alongside dAPIs

The prerequisite to leveraging OEV is to use API3's dAPIs. To learn more about
how dAPIs work, please refer to the [dAPIs documentation](/dapis/).

Integrating OEV dAPIs requires no code changes to the protocol. This is
accomplished by a [proxy contract](/oev/dapps/#proxy-contract). Searchers who
win the auction are able to update the data feed to the up-to-date value, which
can be read by the dApp through this proxy.
