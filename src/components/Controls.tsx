import { useStore } from '../store'
import { Slider } from './Slider'
import { GasCostGrid } from './GasCostGrid'

export function Controls() {
  const { controls, setControl } = useStore()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Slider
          label="Number of Rollups"
          value={controls.rollupCount}
          onChange={(value) => setControl('rollupCount', value)}
          min={1}
          max={1000}
        />
        
        <Slider
          label="TPS per Rollup"
          value={controls.tpsPerRollup}
          onChange={(value) => setControl('tpsPerRollup', value)}
          min={1}
          max={1000}
        />
        
        <Slider
          label="Target Blobs per Block"
          value={controls.targetBlobsPerBlock}
          onChange={(value) => setControl('targetBlobsPerBlock', value)}
          min={1}
          max={12}
        />
        
        <Slider
          label="Max Blobs per Block"
          value={controls.maxBlobsPerBlock}
          onChange={(value) => setControl('maxBlobsPerBlock', value)}
          min={1}
          max={12}
        />
        
        <Slider
          label="ETH Price"
          value={controls.ethPrice}
          onChange={(value) => setControl('ethPrice', value)}
          min={100}
          max={10000}
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="minimumBlobFee"
            checked={controls.useMinimumBlobFee}
            onChange={(e) => setControl('useMinimumBlobFee', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="minimumBlobFee" className="text-sm font-medium">
            Use Minimum Blob Fee (1 gwei instead of 1 wei)
          </label>
        </div>
      </div>
      <GasCostGrid />
    </div>
  )
}
