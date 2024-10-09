---
title: dApps
pageHeader: OEV -> dApps
outline: deep
---

<PageHeader/>

# OEV and dApps

OEV is an interesting concept for dApps, because it's a way to increase their
revenue with minimal effort once using API3's decentralized APIs (dAPIs). There
are no protocol changes required - the dApp only needs to change the oracle
source. This is because the dAPIs are built with OEV in mind and opting-in to
OEV is a matter of changing to a different proxy, the one with OEV support. To
read more about dAPIs, read [dAPIs documentation](/dapis/).

The dAPIs with OEV inherit all the same security guarantees as the non-OEV
dAPIs. Moreover, because of OEV, dApps are guaranteed to have the most
up-to-date data available when it matters because of the searchers. There is no
distinction between regular updates (performed by API3 push oracle) and the OEV
updates (performed by the searcher). This maximizes the revenue and security for
the protocol with increased decentralization.

## Leveraging OEV alongside dAPIs

The prerequisite to leveraging OEV is to use API3's dAPIs. To learn more about
how dAPIs work, please refer to the [dAPIs documentation](/dapis/).

Integrating OEV dAPIs requires no code changes to the protocol. This is
accomplished by a
[proxy contract](/dapis/reference/understand/proxy-contracts.md). Searchers who
win the auction are able to update the data feed to the up-to-date value, which
can be read by the dApp through this proxy.

If you're a dApp interested in leveraging OEV, please reach out to us in
[OEV Discord Channel](https://discord.com/channels/758003776174030948/1062909222347603989).

## Payouts

Currently, the dApps are paid manually by inspecting the logs of the PaidOevBid
event emitted by the `payOevBid` function. Payouts happen monthly and the payout
amount is calculated by accumulating all the amounts from the event logs and
taking an 80% cut of it. The remaining 20% is used as a revenue for API3 DAO.
