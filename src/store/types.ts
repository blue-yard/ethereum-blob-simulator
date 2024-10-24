export interface SimulationControls {
  rollupCount: number
  tpsPerRollup: number
  targetBlobsPerBlock: number
  maxBlobsPerBlock: number
  ethPrice: number
  averageGasFee: number
}

export interface GasCostGrid {
  // 10x7 grid where each cell represents percentage of users willing to pay at that price point
  // Index 0,0 is 100% users at $0.0001, 9,6 is 10% users at $100
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
  }[]
}
