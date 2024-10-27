import { useStore } from '../store'
import { Slider } from './Slider'
import { GasCostGrid } from './GasCostGrid'
import { useState } from 'react'

export function Controls() {
  const { controls, setControl } = useStore()
  const [isInsaneMode, setIsInsaneMode] = useState(false)
  const [isBasicControlsOpen, setIsBasicControlsOpen] = useState(true)
  const [isGasCostGridOpen, setIsGasCostGridOpen] = useState(false)
  const [isInsaneModeOpen, setIsInsaneModeOpen] = useState(false)

  const getMaxValue = (control: string) => {
    if (!isInsaneMode) {
      return {
        rollupCount: 1000,
        tpsPerRollup: 500,
        targetBlobsPerBlock: 128,
        maxBlobsPerBlock: 256,
        ethPrice: 10000,
      }[control] || 1000
    }
    
    return {
      rollupCount: 1000,
      tpsPerRollup: 1000,
      targetBlobsPerBlock: 4096,
      maxBlobsPerBlock: 8192,
      ethPrice: 100000,
    }[control] || 1000
  }

  const handleTargetBlobsChange = (value: number) => {
    setControl('targetBlobsPerBlock', value)
    setControl('maxBlobsPerBlock', value * 2)
  }

  return (
    <div className="space-y-8">
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => setIsBasicControlsOpen(!isBasicControlsOpen)}
          className="w-full px-4 py-2 text-left bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex justify-between items-center"
        >
          <span className="font-medium">Basic Controls</span>
          <span className="transform transition-transform duration-200" style={{ transform: isBasicControlsOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
        </button>
        
        {isBasicControlsOpen && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Slider
              label="Number of Rollups"
              value={controls.rollupCount}
              onChange={(value) => setControl('rollupCount', value)}
              min={1}
              max={getMaxValue('rollupCount')}
            />
            
            <Slider
              label="TPS per Rollup"
              value={controls.tpsPerRollup}
              onChange={(value) => setControl('tpsPerRollup', value)}
              min={1}
              max={getMaxValue('tpsPerRollup')}
            />
            
            <Slider
              label="Target Blobs per Block"
              value={controls.targetBlobsPerBlock}
              onChange={handleTargetBlobsChange}
              min={1}
              max={getMaxValue('targetBlobsPerBlock')}
            />
            
            <Slider
              label="Max Blobs per Block"
              value={controls.maxBlobsPerBlock}
              onChange={(value) => setControl('maxBlobsPerBlock', value)}
              min={1}
              max={getMaxValue('maxBlobsPerBlock')}
            />
            
            <Slider
              label="ETH Price"
              value={controls.ethPrice}
              onChange={(value) => setControl('ethPrice', value)}
              min={100}
              max={getMaxValue('ethPrice')}
              step={100}
              unit="USD"
            />
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Transaction Bytes</label>
              <input
                type="number"
                value={controls.txBytes}
                onChange={(e) => setControl('txBytes', Number(e.target.value))}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                min={1}
                max={1000}
              />
            </div>
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => setIsGasCostGridOpen(!isGasCostGridOpen)}
          className="w-full px-4 py-2 text-left bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex justify-between items-center"
        >
          <span className="font-medium">Gas Cost Grid</span>
          <span className="transform transition-transform duration-200" style={{ transform: isGasCostGridOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
        </button>
        
        {isGasCostGridOpen && (
          <div className="p-4">
            <GasCostGrid />
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => setIsInsaneModeOpen(!isInsaneModeOpen)}
          className="w-full px-4 py-2 text-left bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex justify-between items-center"
        >
          <span className="font-medium">Advanced Settings</span>
          <span className="transform transition-transform duration-200" style={{ transform: isInsaneModeOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
        </button>
        
        {isInsaneModeOpen && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <label className="font-medium">Fee Jitter</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add random variation to user fee preferences
                </p>
              </div>
              <button
                onClick={() => setControl('useRandomJitter', !controls.useRandomJitter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  controls.useRandomJitter 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {controls.useRandomJitter ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <label className="font-medium">🔥 Ludicrous Mode 🔥</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Increase maximum values for all controls
                </p>
              </div>
              <button
                onClick={() => setIsInsaneMode(!isInsaneMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isInsaneMode 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {isInsaneMode ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
