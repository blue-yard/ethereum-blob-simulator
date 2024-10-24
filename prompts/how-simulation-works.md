How Ethereum and this simulation works:

- There are n layer 2 chains that post an average of m transactions per second, so the total transactions per second is m * n. This is the total amount of people that want to transact if the price is cheap enough for them. 
- Each transaction is an average of 180 bytes and each blob holds 128kb of information. 
- Blobs are posted every 12 seconds, the "max blobs per block" setting sets the max amount of blobs that can be in each block. 
- The price for a blob starts at 1 wei. There are 10^9 wei in a gwei and 10^9 gwei in an eth. 
- There should be an on/off selector added to the controls that is "Minimum blob fee" if this is toggled on then the price of a blob should start at 1 gwei instead of 1 wei. 
- When there are more blobs in a block than the target blobs then the price of the blobs in the next block go up by 12.5%. 
- The price of the blob affects the cost of all transactions in it. The price of the blob will be based on its cost in wei multiplied by the price of ETH, that the user sets, according to those ratios mentioned before (there are 10^18 wei in an eth). So the price of each transaction will be the price of a blob divided by the total transactions in it. 
- The price users are willing to pay for transactions is according to those sliders in the Gas Cost Grid. So if for example 90% of users will pay $0.01 if the price of a transaction goes over $0.01 then there should be 10% less transactions in the next block (subtracted from the total TPS). 
- The average gas fee should change to "average transaction bytes" and be setting of just 180 bytes for now. 