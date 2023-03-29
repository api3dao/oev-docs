Important OEV Relay Parameters (the values can be monitored by querying the status endpoint of the API, and unless specified otherwise, all periods are denominated in milliseconds):

Auction Delay (Data Feed proxy specific)
The minimum time that must elapse before bids are processed for the same data feed. This should be longer than the chain's block time, but ideally as close to it as possible while still giving searchers a reasonable time to land their transaction on-chain. 

Update Period (Data Feed proxy specific)
The time period that searchers will have to update the data feed after their bid is filled. If they do not perform the update in this period they will be slashed (provided there was no other update that frontran them). This period should be longer than the Configured Auction Delay. 

Withdraw Period (chain specific)
The time period that searchers have to withdraw funds after they have been given a signed message that allows them to do so from the BE. Currently hardcoded 1 hour.

Slashing
When a searcher makes a bid and the BE has filled it (i.e they won an auction), 10% of the bid amount is reserved from his available funds as collateral for potential slashing. If no entity updates the data feed then that searcher is slashed - the reserved funds are not freed.

Bid Collateral % Requirement (Data Feed proxy specific)
The amount of USDC collateral relative to the bid admount that needs to be posted in the vault contract for a bid to win an auction, also the amount of funds that can be slashed upon misbehavior. This will be represented as a % of the bid amount and initially set to 10%.

API3 Fee % (Data feed proxy specific)
The amount of USDC that will be taken from the searchers collateral upon a successful update to compensate data providers and the DAO. This will be initially set to 10% of a bid amount and must be smaller than or equal to the bid collateral % requirement. No fee is taken if the searcher is frontrun by another searcher or the oracle.

Minimum Bid Amount(Data Feed proxy specific)
The minimum amount in native tokens a searcher must bid to be eligible in that auction.