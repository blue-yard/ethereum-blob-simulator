interface SimulationParams {
  rollupCount: number
  tpsPerRollup: number
  targetBlobsPerBlock: number
  maxBlobsPerBlock: number
  ethPrice: number
  averageGasFee: number
  gasCostGrid: number[][]
}

interface TimePoint {
  timestamp: number
  blobsPerBlock: number
  blobBaseFee: number
}

export function calculateBlobFee(blobsPerBlock: number, targetBlobsPerBlock: number): number {
  // EIP-4844 blob base fee formula
  // If we're at target, fee is 1 gwei
  // Fee doubles for each doubling of blob usage
  const ratio = blobsPerBlock / targetBlobsPerBlock
  return Math.pow(2, Math.log2(ratio)) // in gwei
}

export function findEquilibriumPoint(params: SimulationParams): number {
  const totalTps = params.rollupCount * params.tpsPerRollup
  const blobCapacity = 128 * 1024 // bytes per blob
  const txSize = 100 // average tx size in bytes
  const txPerBlob = blobCapacity / txSize
  
  // Start with minimum blobs needed
  let blobsNeeded = (totalTps * 12) / (txPerBlob * 7200) // 12s per block, 7200 blocks per day
  let blobFee = calculateBlobFee(blobsNeeded, params.targetBlobsPerBlock)
  
  // Convert gwei to USD
  const feeInUsd = (blobFee * params.ethPrice) / 1e9
  
  // Find what percentage of users will pay this price
  const pricePoints = [0.0001, 0.001, 0.01, 0.1, 1.0, 10.0, 100.0]
  let priceIndex = pricePoints.findIndex(p => feeInUsd <= p)
  if (priceIndex === -1) priceIndex = pricePoints.length - 1
  
  // Use the gas cost grid to determine percentage of users willing to pay
  const willingToPay = params.gasCostGrid[0][priceIndex] / 100
  
  // Adjust blobs needed based on willing users
  return blobsNeeded * willingToPay
}

export function generateTimeSeriesData(params: SimulationParams, hours: number = 24): TimePoint[] {
  const equilibriumBlobs = findEquilibriumPoint(params)
  const points: TimePoint[] = []
  const intervalsPerHour = 4
  
  for (let i = 0; i <= hours * intervalsPerHour; i++) {
    const timestamp = i * (3600 / intervalsPerHour) // seconds since start
    const progress = Math.min(1, i / (intervalsPerHour * 2)) // Reach equilibrium in 2 hours
    const blobsPerBlock = equilibriumBlobs * progress
    const blobBaseFee = calculateBlobFee(blobsPerBlock, params.targetBlobsPerBlock)
    
    points.push({
      timestamp,
      blobsPerBlock,
      blobBaseFee
    })
  }
  
  return points
}

export function calculateSimulationResults(params: SimulationParams) {
  const equilibriumBlobs = findEquilibriumPoint(params)
  const blobBaseFee = calculateBlobFee(equilibriumBlobs, params.targetBlobsPerBlock)
  const timeSeriesData = generateTimeSeriesData(params)
  
  // Calculate average transaction price in USD
  const avgTxPriceInGwei = blobBaseFee + params.averageGasFee
  const avgTxPriceInUsd = (avgTxPriceInGwei * params.ethPrice) / 1e9
  
  // Calculate total ETH burnt per day
  const blocksPerDay = 7200 // 12 seconds per block
  const ethBurntPerDay = (blobBaseFee * equilibriumBlobs * blocksPerDay) / 1e9
  
  return {
    totalTps: params.rollupCount * params.tpsPerRollup,
    avgTxPrice: avgTxPriceInUsd,
    totalEthBurnt: ethBurntPerDay,
    timeSeriesData
  }
}
