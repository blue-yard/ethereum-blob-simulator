export interface SimulationControls {
  rollupCount: number
  tpsPerRollup: number
  targetBlobsPerBlock: number
  maxBlobsPerBlock: number
  ethPrice: number
  txBytes: number
  useMinimumBlobFee: boolean
}

export interface GasCostGrid {
  grid: number[][]
}

export interface SimulationResults {
  totalTps: number
  avgTxPrice: number
  totalEthBurnt: number
  timeSeriesData: {
    timestamp: number
    blobsPerBlock: number
    blobBaseFee: number
    actualTps: number
  }[]
}
