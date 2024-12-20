# Ethereum Blob Simulator

This simulator helps visualize and understand how Ethereum's blob space market dynamics work, particularly focusing on the relationship between blob fees, transaction throughput, and user behavior.

For example, here's how Ethereum will function with 16MB of blobs per block doing 10k TPS:

![](/16mb-10ktps.png)

Fwoah that's a lot of burn!

## Live Demo

Try it out here: [Ethereum Blob Simulator](https://ethereum-blob-simulator.netlify.app/)

## Overview

The simulator models how Layer 2 rollups use Ethereum's blob space, taking into account:

- Number of rollups and their TPS requirements
- User price sensitivity for transactions
- Blob space availability and pricing mechanics
- Dynamic fee adjustments based on demand


## How It Works

### Blob Space Mechanics
- Each blob can hold 128KB of data
- Each transaction uses an average of 180 bytes
- Blobs are posted every 12 seconds (1 block)
- The base fee for blobs starts at 1 gwei (this assumes [EIP-7762](https://ethereum-magicians.org/t/eip-7762-increase-min-base-fee-per-blob-gas/20949) has been implemented) and adjusts based on demand.
- When blob usage exceeds the target, fees increase by 12.5%, when they are below target fees decrease by 12.5%
- Eventually total blobs reaches a steady state based on how much users are willing to pay for transactions vs blob base fees. 

### User Controls

1. **Basic Parameters**
   - Number of rollups (1-1000)
   - TPS per rollup (1-500)
   - Target blobs per block (1-100)
   - Max blobs per block (1-200)
   - ETH price in USD
   - Transaction size in bytes

2. **Price Sensitivity Grid**
   - Vertical sliders showing percentage of users willing to transact at different price points
   - Price points range from $0.0001 to $100
   - Percentages interpolate smoothly between points

3. **Advanced Settings**
   - Add random jitter to create a more realistic simulation
   - Toggle Ludicrous mode which enables much higher TPS / Blob / Price scaling.

### Display Metrics

1. **Key Statistics**
   - TPS Demand - What would the TPS be if transactions were < $0.0001
   - Average transaction price
   - Total ETH burnt per day, with yearly burn as a percentage in red. 
   - Total USD value burnt per day

2. **Real-time Graphs**
   - Blobs per block
   - Blob base fee in gwei
   - Current TPS

3. **The Math**
   - Shows all core math underlying the stats/graph.


## Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
npm run preview
```

## Deployment

The simulator is automatically deployed to Netlify, [you can see it here](https://ethereum-blob-simulator.netlify.app/)

## FAQ

### Why does the blob burn go down as the ETH price goes up?

Because the price people are willing to pay to transact is in USD (as that's how most think about fees) while the actual burnt resource is ETH. 
Imagine there are 1000 people that will pay 10c to transact. These 1000 transactions total $100 and fit into one blob. If ETH is $1000 that blob will cost and burn 0.1 ETH, while if ETH is $10k that blob will cost and burn 0.01 ETH. The same amount of money is being paid to transact, but this money puchases and burns less ETH.

### When I set a price people are willing to pay to 0, why are there still people bidding higher than the previous price?

The simulation uses interpolation between the prices to make the graph smoother and more realistic. It assumes if say 30% of people are willing to pay 10c and 0% are willing to pay $1, then somewhere between 0% and 30% of people are ok with paying 20c, 50c etc. So the average payment could be higher than 10c, but no one is paying $1. 