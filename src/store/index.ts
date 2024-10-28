import { create } from 'zustand'
import { SimulationControls, GasCostGrid, SimulationResults } from './types'
import { calculateSimulationResults } from '../utils/simulation'
import { DEFAULT_GRID_VALUES } from '../constants'

interface SimulatorStore {
  // Controls
  controls: SimulationControls
  gasCostGrid: GasCostGrid
  setControl: (key: keyof SimulationControls, value: number | boolean) => void
  setGasCostGrid: (row: number, col: number, value: number) => void
  
  // Results
  results: SimulationResults
  updateResults: () => void
}

const DEFAULT_CONTROLS: SimulationControls = {
  rollupCount: 20,
  tpsPerRollup: 10,
  targetBlobsPerBlock: 3,
  maxBlobsPerBlock: 6,
  ethPrice: 3000,
  txBytes: 180,
  useMinimumBlobFee: false,
  useRandomJitter: false  // Add this line
}

const createDefaultGrid = (): number[] => {
  return DEFAULT_GRID_VALUES
}

export const useStore = create<SimulatorStore>((set, get) => {
  const store = {
    controls: DEFAULT_CONTROLS,
    gasCostGrid: { grid: createDefaultGrid() },
    results: {
      totalTps: 0,
      avgTxPrice: 0,
      totalEthBurnt: 0,
      ethBurntPercentagePerYear: 0,
      totalUSDBurnt: 0,
      timeSeriesData: []
    },

    setControl: (key: any, value: any) => {
      set(state => ({
        controls: { ...state.controls, [key]: value }
      }))
      get().updateResults()
    },

    setGasCostGrid: (col: number, value: number) => {
      set(state => {
        const newGrid = [...state.gasCostGrid.grid]
        newGrid[col] = value
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
  }

  // Calculate initial results immediately
  setTimeout(() => store.updateResults(), 0)
  
  return store
})
