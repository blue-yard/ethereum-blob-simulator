import { PRICE_POINTS } from '../constants'

interface SimulationParams {
  rollupCount: number
  tpsPerRollup: number
  targetBlobsPerBlock: number
  maxBlobsPerBlock: number
  ethPrice: number
  txBytes: number
  useMinimumBlobFee: boolean
  gasCostGrid: number[]
  useRandomJitter: boolean
}

interface TimePoint {
  timestamp: number
  blobsPerBlock: number
  blobBaseFee: number
  actualTps: number
}

const BLOB_SIZE = 128 * 1024 // 128KB in bytes
const BLOCK_TIME = 12 // seconds
const WEI_PER_ETH = BigInt(1e18)
const MINIMUM_BLOB_FEE = BigInt(1e9)
const TOTAL_ETH = 120_000_000

function calculateTransactionsPerBlob(txBytes: number): number {
  return Math.floor(BLOB_SIZE / txBytes)
}

function calculateRequiredBlobs(tps: number, txPerBlob: number): number {
  return Math.ceil((tps * BLOCK_TIME) / txPerBlob)
}

function weiToUsd(weiAmount: bigint, ethPriceUsd: number): number {
  return Number(weiAmount) * ethPriceUsd / Number(WEI_PER_ETH)
}

function calculateBlobCostInWei(bytePrice: bigint): bigint {
  return bytePrice * BigInt(BLOB_SIZE)
}

function interpolatePercentage(price: number, gasCostGrid: number[], useRandomJitter: boolean): number {
  // Find the price point we're at or just below
  let upperIndex = PRICE_POINTS.findIndex(p => price <= p)
  
  // If price is higher than our highest price point
  if (upperIndex === -1) return 0
  if (gasCostGrid[upperIndex] === 0) return 0
  
  // If price is at or below our lowest price point
  if (upperIndex === 0) {
    const basePercentage = gasCostGrid[0] / 100
    if (!useRandomJitter) return basePercentage
    return basePercentage * (1 + (Math.random() * 0.2 - 0.1))
  }
  
  // Get the two price points and their corresponding percentages
  const lowerPrice = PRICE_POINTS[upperIndex - 1]
  const upperPrice = PRICE_POINTS[upperIndex]
  const lowerPercentage = gasCostGrid[upperIndex - 1]
  const upperPercentage = gasCostGrid[upperIndex]
  
  // Calculate where we are between the two price points (in log space)
  const logPrice = Math.log10(price)
  const logLower = Math.log10(lowerPrice)
  const logUpper = Math.log10(upperPrice)
  
  // Linear interpolation in log space
  const t = (logPrice - logLower) / (logUpper - logLower)
  
  // Interpolate the percentage - removed the (1-t) to make it interpolate correctly
  const percentage = lowerPercentage * (1 - t) + upperPercentage * t
  
  if (!useRandomJitter) return percentage / 100
  
  return (percentage / 100) * (1 + (Math.random() * 0.2 - 0.1))
}

function getWillingUsers(priceUSD: number, gasCostGrid: number[], useRandomJitter: boolean): number {
  return interpolatePercentage(priceUSD, gasCostGrid, useRandomJitter)
}

export function generateTimeSeriesData(params: SimulationParams): TimePoint[] {
  const points: TimePoint[] = []
  const txPerBlob = calculateTransactionsPerBlob(params.txBytes)
  const totalPotentialTps = params.rollupCount * params.tpsPerRollup
  const blocksPerHour = Math.floor(3600 / BLOCK_TIME)
  const maxTps = txPerBlob * params.maxBlobsPerBlock
  
  let currentByteFee = MINIMUM_BLOB_FEE // This is now per byte
  let currentTps = totalPotentialTps
  
  for (let blockNumber = 0; blockNumber < blocksPerHour; blockNumber++) {
    const blobCostWei = calculateBlobCostInWei(currentByteFee)
    const txPriceUsd = weiToUsd(blobCostWei, params.ethPrice) / txPerBlob
    
    const willingUsers = getWillingUsers(txPriceUsd, params.gasCostGrid, params.useRandomJitter)
    currentTps = Math.min(maxTps, totalPotentialTps * willingUsers)
    
    let requiredBlobs = Math.min(
      calculateRequiredBlobs(currentTps, txPerBlob),
      params.maxBlobsPerBlock
    )

    points.push({
      timestamp: blockNumber,
      blobsPerBlock: requiredBlobs,
      blobBaseFee: Number(currentByteFee) / 1e9, // Convert to gwei per byte for display
      actualTps: currentTps
    })
    
    if (requiredBlobs > params.targetBlobsPerBlock) {
      currentByteFee = currentByteFee * BigInt(1125) / BigInt(1000)
    } else if (requiredBlobs < params.targetBlobsPerBlock) {
      currentByteFee = currentByteFee * BigInt(1000) / BigInt(1125)
      if (currentByteFee < MINIMUM_BLOB_FEE) {
        currentByteFee = MINIMUM_BLOB_FEE
      }
    }   
  }
  
  return points
}

export function calculateSimulationResults(params: SimulationParams) {
  const timeSeriesData = generateTimeSeriesData(params)
  const lastPoint = timeSeriesData[timeSeriesData.length - 1]
  
  // Calculate total ETH burnt per day using full blob cost
  const blocksPerDay = 24 * 3600 / BLOCK_TIME
  const bytePriceWei = BigInt(Math.floor(lastPoint.blobBaseFee * 1e9))
  const blobCostWei = calculateBlobCostInWei(bytePriceWei)
  const ethBurntPerDay = Number(blobCostWei) * lastPoint.blobsPerBlock * blocksPerDay / Number(WEI_PER_ETH)
  const ethBurntPerYear = ethBurntPerDay * 365
  const ethBurntPercentagePerYear = ethBurntPerYear / TOTAL_ETH * 100

  const totalTps = params.rollupCount * params.tpsPerRollup
  
  return {
    totalTps,
    avgTxPrice: weiToUsd(calculateBlobCostInWei(bytePriceWei), params.ethPrice) / 
                calculateTransactionsPerBlob(params.txBytes),
    totalEthBurnt: ethBurntPerDay,
    ethBurntPercentagePerYear,
    totalUSDBurnt: ethBurntPerDay * params.ethPrice,
    timeSeriesData
  }
}
