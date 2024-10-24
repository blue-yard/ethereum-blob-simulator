interface SimulationParams {
  rollupCount: number
  tpsPerRollup: number
  targetBlobsPerBlock: number
  maxBlobsPerBlock: number
  ethPrice: number
  txBytes: number
  useMinimumBlobFee: boolean
  gasCostGrid: number[][]
}

interface TimePoint {
  timestamp: number
  blobsPerBlock: number
  blobBaseFee: number
  actualTps: number
}

const BLOB_SIZE = 128 * 1024 // 128KB in bytes
const BLOCK_TIME = 12 // seconds
const PRICE_POINTS = [0.0001, 0.001, 0.01, 0.1, 1.0, 10.0, 100.0]
const WEI_PER_ETH = BigInt(1e18)
const GWEI_PER_ETH = BigInt(1e9)

function calculateTransactionsPerBlob(txBytes: number): number {
  return Math.floor(BLOB_SIZE / txBytes)
}

function calculateRequiredBlobs(tps: number, txPerBlob: number): number {
  return Math.ceil((tps * BLOCK_TIME) / txPerBlob)
}

function weiToUsd(weiAmount: bigint, ethPriceUsd: number): number {
  return Number(weiAmount) * ethPriceUsd / Number(WEI_PER_ETH)
}

function getWillingUsers(priceUSD: number, gasCostGrid: number[][]): number {
  const priceIndex = PRICE_POINTS.findIndex(p => priceUSD <= p)
  if (priceIndex === -1) return 0
  
  // All rows have the same value for each price point in our implementation
  const percentWilling = gasCostGrid[0][priceIndex]
  return percentWilling / 100
}

export function generateTimeSeriesData(params: SimulationParams): TimePoint[] {
  console.log("params: ", params);
  const points: TimePoint[] = []
  const txPerBlob = calculateTransactionsPerBlob(params.txBytes)
  const totalPotentialTps = params.rollupCount * params.tpsPerRollup
  const blocksPerHour = Math.floor(3600 / BLOCK_TIME) // Calculate number of blocks in an hour
  
  // Start with minimum blob fee (1 wei or 1 gwei)
  let currentBlobFee = BigInt(params.useMinimumBlobFee ? 1e9 : 1e9)
  let currentTps = totalPotentialTps
  
  for (let blockNumber = 0; blockNumber < blocksPerHour; blockNumber++) {
    // Calculate price per transaction in USD first
    const txPriceUsd = weiToUsd(currentBlobFee, params.ethPrice) / txPerBlob
    
    // Update TPS based on willing users before calculating required blobs
    const willingUsers = getWillingUsers(txPriceUsd, params.gasCostGrid)
    console.log("tx Price: ", txPriceUsd, " willing users: ", willingUsers)
    currentTps = totalPotentialTps * willingUsers
    
    // Calculate required blobs based on current TPS
    let requiredBlobs = Math.min(
      calculateRequiredBlobs(currentTps, txPerBlob),
      params.maxBlobsPerBlock
    )

    points.push({
      timestamp: blockNumber,
      blobsPerBlock: requiredBlobs,
      blobBaseFee: Number(currentBlobFee) / 1e9, // Convert to gwei for display
      actualTps: currentTps
    })
    
    // Update blob fee for next block if above target
    if (requiredBlobs > params.targetBlobsPerBlock) {
      currentBlobFee = currentBlobFee * BigInt(1125) / BigInt(1000) // Exact 12.5% increase
    } else if (requiredBlobs < params.targetBlobsPerBlock) {
      currentBlobFee = currentBlobFee * BigInt(1000) / BigInt(1125) // Exact 12.5% decrease
    }   
  }
  
  return points
}

export function calculateSimulationResults(params: SimulationParams) {
  const timeSeriesData = generateTimeSeriesData(params)
  const lastPoint = timeSeriesData[timeSeriesData.length - 1]
  
  // Calculate total ETH burnt per day
  const blocksPerDay = 24 * 3600 / BLOCK_TIME
  const ethBurntPerDay = lastPoint.blobBaseFee * lastPoint.blobsPerBlock * blocksPerDay / 1e9
  
  // Total TPS is just rollups * TPS per rollup
  const totalTps = params.rollupCount * params.tpsPerRollup
  
  return {
    totalTps, // Use the direct calculation instead of the last point
    avgTxPrice: weiToUsd(BigInt(Math.floor(lastPoint.blobBaseFee * 1e9)), params.ethPrice) / 
                calculateTransactionsPerBlob(params.txBytes),
    totalEthBurnt: ethBurntPerDay,
    totalUSDBurnt: ethBurntPerDay * params.ethPrice,
    timeSeriesData
  }
}
