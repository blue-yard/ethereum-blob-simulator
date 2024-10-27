export interface SimulationControls {
  rollupCount: number
  tpsPerRollup: number
  targetBlobsPerBlock: number
  maxBlobsPerBlock: number
  ethPrice: number
  txBytes: number
  useMinimumBlobFee: boolean
  useRandomJitter: boolean
}

export interface GasCostGrid {
  grid: number[][]
}

export interface SimulationResults {
  totalTps: number
  avgTxPrice: number
  totalEthBurnt: number
  ethBurntPercentagePerYear: number
  totalUSDBurnt: number
  timeSeriesData: {
    timestamp: number
    blobsPerBlock: number
    blobBaseFee: number
    actualTps: number
  }[]
}
