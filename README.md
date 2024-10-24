# Ethereum Blob Simulator

This simulator helps visualize and understand how Ethereum's blob space market dynamics work, particularly focusing on the relationship between blob fees, transaction throughput, and user behavior.

For example, here's how Ethereum will function with 16MB blobs doing 10k TPS:

![](/16mb-10ktps.png)

Fwoah that's a lot of burn!

## Live Demo
Try it out here: [Ethereum Blob Simulator](https://blue-yard.github.io/ethereum-blob-simulator)

## Overview

The simulator models how Layer 2 rollups use Ethereum's blob space, taking into account:

- Number of rollups and their TPS requirements
- User price sensitivity for transactions
- Blob space availability and pricing mechanics
- Dynamic fee adjustments based on demand

## Key Features

- Real-time simulation of blob space usage and pricing
- Interactive controls for key parameters
- Visual representation of market dynamics
- Price sensitivity modeling through user-defined curves

## How It Works

### Blob Space Mechanics
- Each blob can hold 128KB of data
- Each transaction uses an average of 180 bytes
- Blobs are posted every 12 seconds (1 block)
- The base fee for blobs starts at 1 gwei and adjusts based on demand
- When blob usage exceeds the target, fees increase by 12.5%

### User Controls

1. **Basic Parameters**
   - Number of rollups (1-1000)
   - TPS per rollup (1-500)
   - Target blobs per block (1-100)
   - Max blobs per block (1-200)
   - ETH price in USD
   - Transaction size in bytes
   - Minimum blob fee toggle (1 gwei vs 1 wei)

2. **Price Sensitivity Grid**
   - Vertical sliders showing percentage of users willing to transact at different price points
   - Price points range from $0.0001 to $100
   - Percentages interpolate smoothly between points

### Display Metrics

1. **Key Statistics**
   - Desired TPS (total theoretical throughput)
   - Average transaction price
   - Total ETH burnt per day
   - Total USD value burnt per day

2. **Real-time Graphs**
   - Blobs per block
   - Blob base fee in gwei
   - Actual TPS achieved


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

The simulator is automatically deployed to GitHub Pages when changes are pushed to the main branch.
