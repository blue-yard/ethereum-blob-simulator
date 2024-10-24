This simulator is a single page static react app that runs completely client side. It should be styled with some nice css using tailwind and a nice slick looking templating system that works well with react. The overall system will simulate how Ethereum blobs fill up over time, how much gwei they will cost to post to Ethereum, how many blobs there will be given the options the user has selected, and at what point will they reach equilibrium where the users are paying the most they desire based on the gas cost selector. 

Up the top of the page is the controls the user can change. The are as follows:
- Slider to select how many rollups
- Slider for TPS per rollup
- Slider for target blobs per block
- Slider for max blobs per block
- Slider for ETH price
- Average gas fee field (set to ERC20 send by default)
	- Has a guide saying the gas cost for an ETH transfer, ERC20 transfer, NFT purchase
- Gas cost selector to pick what percent of people will pay different fees
	- This is 10 separate sliders in a 2D grid. On the Y axis is 100% to 10% scaling down by 10 each time the 100% is at the top and 10% is at the bottom.
	- On the X axis is a price from $0.0001 to $100 scaling by 10x each time, so there are 7 levels. The lowest level is $0.0001 and highest is $100. 
	- The sliders are vertical and users can slide them up and down. 

Below these controls is the display. This area has:
- Total TPS
- Average transaction price on rollups
- Total ETH burnt
- Graph of total blobs per block and gwei paid per blob
	- X axis is time
	- Y axis is blobs per block
	- Other Y axis is blob base fee

First you should create the controls and layout and then we'll wire up the controls to make them automatically change the output when they're changed. 