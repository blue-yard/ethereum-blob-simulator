import { create } from 'zustand'
import { SimulationControls, GasCostGrid, SimulationResults } from './types'
import { calculateSimulationResults } from '../utils/simulation'

interface SimulatorStore {
  // Controls
  controls: SimulationControls
  gasCostGrid: GasCostGrid
  setControl: (key: keyof SimulationControls, value: number) => void
  setGasCostGrid: (row: number, col: number, value: number) => void
  
  // Results
  results: SimulationResults
  updateResults: () => void
}

const DEFAULT_CONTROLS: SimulationControls = {
  rollupCount: 10,
  tpsPerRollup: 100,
  targetBlobsPerBlock: 3,
  maxBlobsPerBlock: 6,
  ethPrice: 3000,
  averageGasFee: 21000
}

const createDefaultGrid = (): number[][] => {
  return Array(10).fill(0).map(() => Array(7).fill(50))
}

export const useStore = create<SimulatorStore>((set, get) => ({
  controls: DEFAULT_CONTROLS,
  gasCostGrid: { grid: createDefaultGrid() },
  results: {
    totalTps: 0,
    avgTxPrice: 0,
    totalEthBurnt: 0,
    timeSeriesData: []
  },

  setControl: (key, value) => {
    set(state => ({
      controls: { ...state.controls, [key]: value }
    }))
    get().updateResults()
  },

  setGasCostGrid: (row, col, value) => {
    set(state => {
      const newGrid = [...state.gasCostGrid.grid]
      newGrid[row][col] = value
      return { gasCostGrid: { grid: newGrid } }
    })
    get().updateResults()
  },

  updateResults: () => {
    const state = get()
    const results = calculateSimulationResults({
      ...state.controls,
      gasCostGrid: state.gasCostGrid.grid
    })
    set({ results })
  }
}))
