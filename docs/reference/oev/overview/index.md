Introduction:
The OEV Relay is software run by oracles that allows third parties to participate in an auction for the sole right to publish an oracle update for a certain time period. This is designed to direct MEV value related to oracle updates back to the applications that generate that value. 

The OEV Auction:
The auction process within the OEV relay is an off-chain sealed bid order book hosted by a single entity currently. It functions like a normal order book, but the orders are completely private, and are placed for a certain data feed with conditions being that the datapoint must be above or below a certain price. All orders are accompanied by a bid amount specified in native tokens on the chain you are bidding for a data feed update on. Once the oracle off-chain price meets the conditions specified by one or multiple orders, the OEV relay will fill the order with the highest bid amount for that condition. Any other orders that met those conditions with a lower bid amount will be canceled by the relay. When a searchers order is filled, they will have the exclusive rights to publish the oracle update for a certain amount of blocks, to publish the oracle update they must pay the specified bid amount within the same transaction to the data feed contract.

Auction times are determined by the time it takes for the relay to reach a consensus between data providers, making them randomized. In order to identify when a bid of yours has been filled or canceled you must query the relay status endpoint, these status updates are not currently pushed to searchers. Bids are signed by the bidder and stored in the relay database to address any disputes that may occur. To execute the data feed update searchers must call the updateOevProxyDataFeedWithSignedData function. If searchers do not update the data feed within the Update Period parameter, and they have not been frontrun by another data feed update, they will be slashed a percentage of their bid.
 
There are two possible conditions available for orders
>= greater than or equal to
<= less than or equal to


Searcher staking (Vault.sol):
To be filled on a bid you must have staked a certain % of your bid amount in USDC, so you must be aware of the exchange rate between the native token you bid in and USDC. This percentage is defined as a parameter for the OEV relay that is subject to change, and is currently set at 10%. You may place as many bids as you like, and your collateral staked will only be checked when a bid is filled. Once you have been filled, the collateral is now reserved and cannot be used again until the data feed update has been performed. This collateral is used to slash a searcher if they fail to publish the data feed update that they bid for within a defined amount of time, in order to prevent denial of service attacks. If you have won an auction and are frontrun in performing the data feed update by either another searcher or the oracle itself, your collateral will be freed without any cost. 
Deposits into Vault.sol will initially be set to only be withdrawable to the depositor address, regardless of who calls the function. You can change the address to be withdrawn to by the current withdrawal account calling setWithdrawalAccount with a new address. To withdraw funds you call the withdraw endpoint on the relay with a signed message, and receive a signature back that can be used to withdraw from Vault.sol. This will allow for all your available funds to be withdrawn and they now cannot be used to place bids. You have 1 hour to use the signature before it expires. To note, Vault.sol will not necessarily be on the chain you are bidding for a data feed update on, and will start by being deployed on ethereum mainnet.

Searcher onboarding notes:
Searchers/mev bot operators should continue to run their old software as a backup or fallback in the case that the OEV Relay experiences downtime. Opportunities such as liquidations or arbitrage will be able to be executed by the old searcher software in the same way as they were before the application integrated OEV data feeds.

Integrating the OEV auction may differ from current MEV architecture in that it expects searchers to be aware of which off-chain prices will trigger MEV opportunities and the value of them, instead of for example reacting to oracle updates in the mempool and being able to simulate MEV opportunities that they will cause on the current blockchain state. If you would like to integrate OEV auctions in a similiar way to the example above where you can simulate oracle updates seen in the mempool, you could use an API such as Coingecko as a replacement for the mempool and simulate their current prices against blockchain state. Then when you have simulated a valid MEV oppprtunity you can place bids to the OEV relay, note that you should continue to simulate for the presence of these opportunities while you have an open bid so that you can cancel the bid if the opportunity dissapears. 


Important OEV Relay Parameters (the values can be monitored by querying the status endpoint of the API, Unless specified otherwise, all periods are denominated in milliseconds):

Auction Delay (Data Feed proxy specific)
The minimum time that must elapse before bids are processed for the same data feed. This should be longer than the chain's block time, but ideally as close to it as possible while still giving searchers a reasonable time to land their tx. 
Update Period (Data Feed proxy specific)
The time period that searchers will have, to update the data feed after their bid is filled. If they do not perform the action in this period they will be slashed (provided there was no other update). This should be longer than the Configured Auction Delay. 
Withdraw Period (chain specific)
The time period that searchers have to withdraw funds after they have been given a signed message that allows them to do so from the BE. Hardcoded 1 hour (MVP)
Slashing
When a searcher makes a bid and the BE has filled it (i.e they won an auction), 10% of the bid amount is reserved from his available funds as collateral for potential slashing. If no entity updates the data feed then that searcher is slashed - the reserved funds are not freed.
Bid Collateral % Requirement (Data Feed proxy specific)
The amount of USDC collateral that needs to be posted in the vault contract for a bid to win an auction, also the amount of funds that can be slashed upon misbehavior. This will be represented as a % of the bid amount. Initially set to 10%.
API3 Fee % (Data feed proxy specific)
The amount of USDC that will be taken from the searchers collateral upon a successful update. Initially set to 10% of a bid amount. Percentage reserved for API providers is covered under this fee. Must be smaller than or equal to the bid collateral. No fee is taken if the searcher is frontrun by another searcher or the oracle.
Min Confirmations (chain specific)
A chain-specific number of blocks that must have passed for the BE to acknowledge certain events. Hardcoded for MVP.
Min Bid (Data Feed proxy specific)
The minimum amount in native tokens a searcher must bid to be eligible in that auction. In the future this should maybe be defined in the proxy contract metadata by the deployer. 
Default Min Bid (chain specific)
This default is necessary to initialize the min bid value in the proxy such that the proxy registering can be automatic.

