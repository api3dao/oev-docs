dApp Onboarding

OEV auctions operate as a sidecar service to regular data feed operation, meaning that if the OEV relay experiences downtime or there aren't any OEV opportunities, updates will be carried out by the oracle as usual.

Integration of OEV auctions only requires the dApp to deploy a proxy data feed contract and point the dApp towards this. This proxy contract will be updated by the searchers, but will display the datapoint from the main data feed contract if it has a more recent timestamp than the last searcher update.

When deploying a proxy the dApp specifies an address that is able to withdraw OEV proceeds from the main data feed contract. 