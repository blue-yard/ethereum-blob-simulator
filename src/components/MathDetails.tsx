import { useStore } from '../store'

const PRICE_POINTS = [0.0001, 0.001, 0.01, 0.1, 1.0, 10.0, 100.0]
const MAX_ETH_SUPPLY = 120000000
export function MathDetails() {
  const { controls, gasCostGrid, results } = useStore()
  const lastDataPoint = results.timeSeriesData[results.timeSeriesData.length - 1]
  const blobBaseFeeGwei = lastDataPoint?.blobBaseFee || 0
  const blobBaseFeeEth = blobBaseFeeGwei / 1e9
  const blobBaseFeeUsd = blobBaseFeeEth * controls.ethPrice
  const totalPotentialTps = controls.rollupCount * controls.tpsPerRollup
  
  const txPerBlob = Math.floor((128 * 1024) / controls.txBytes)
  const txPriceUsd = blobBaseFeeUsd / txPerBlob

  return (
    <div className="space-y-6 text-left">
      <div className="text-gray-500 italic mb-4">
        All values based on the last tick of the hour, after blobs have reached a steady state of supply and demand.
      </div>
      <section>
        <h3 className="font-bold mb-2">Network Stats</h3>
        <div className="space-y-1 text-sm">
          <div>TPS Demand: {controls.rollupCount * controls.tpsPerRollup} ({controls.rollupCount} rollups × {controls.tpsPerRollup} TPS)</div>
          <div>Blobs per Block: {lastDataPoint?.blobsPerBlock.toFixed(2)}</div>
          <div>Max TPS from Blobs: {((txPerBlob * controls.targetBlobsPerBlock) / 12).toFixed(2)} ({txPerBlob} tx/blob × {controls.targetBlobsPerBlock} blobs/block ÷ 12 sec/block)</div>
          <div>Current TPS: {lastDataPoint?.actualTps.toFixed(2)}</div>
        </div>
      </section>

      <section>
        <h3 className="font-bold mb-2">User Price Sensitivity</h3>
        <div className="space-y-1 text-sm">
          {PRICE_POINTS.map((price: number, i: number) => (
            <div key={i}>
              {`${gasCostGrid.grid[i]}% (${Math.floor(totalPotentialTps * gasCostGrid.grid[i] / 100)}) will pay up to $${price}`}
            </div>
          ))}
          
        </div>
      </section>

      <section>
        <h3 className="font-bold mb-2">Blob Costs</h3>
        <div className="space-y-1 text-sm">
          <div>Base Fee: {blobBaseFeeGwei.toFixed(2)} gwei</div>
          <div>= {blobBaseFeeEth.toFixed(9)} ETH ({blobBaseFeeGwei.toFixed(2)} × 10⁻⁹)</div>
          <div>= ${blobBaseFeeUsd.toFixed(4)} USD ({blobBaseFeeEth} × ${controls.ethPrice})</div>
        </div>
      </section>

      <section>
        <h3 className="font-bold mb-2">Transaction Space</h3>
        <div className="space-y-1 text-sm">
          <div>Blob Size: 128 KB = 131,072 bytes</div>
          <div>Transaction Size: {controls.txBytes} bytes</div>
          <div>Transactions per Blob: {txPerBlob} tx ({Math.floor(128 * 1024)} ÷ {controls.txBytes})</div>
          <div>Avg Transaction Price: ${txPriceUsd.toFixed(6)} (${blobBaseFeeUsd.toFixed(4)} ÷ {txPerBlob})</div>
        </div>
      </section>

      <section>
        <h3 className="font-bold mb-2">Daily/Yearly Projections</h3>
        <div className="space-y-1 text-sm">
          <div>Blocks per Day: {Math.floor(24 * 60 * 60 / 12)} (86,400 seconds ÷ 12 second blocks)</div>
          <div>Daily ETH Burnt: {results.totalEthBurnt.toFixed(2)} ETH</div>
          <div>Daily USD Burnt: ${results.totalUSDBurnt.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</div>
          <div>Yearly ETH Burnt: {(results.totalEthBurnt * 365).toFixed(2)} ETH</div>
          <div>Yearly Burn Rate: {results.ethBurntPercentagePerYear.toFixed(3)}% of total ETH supply ({(results.totalEthBurnt * 365).toFixed(2)} / {MAX_ETH_SUPPLY})</div>
        </div>
      </section>

      <section>
        <h3 className="font-bold mb-2">Fee Dynamics</h3>
        <div className="space-y-1 text-sm">
          <div>Target Blobs per Block: {controls.targetBlobsPerBlock}</div>
          <div>Maximum Blobs per Block: {controls.maxBlobsPerBlock}</div>
          <div>When usage {'>'} target: Fee increases by 12.5%</div>
          <div>When usage {'<'} target: Fee decreases by 12.5%</div>
          <div>Minimum Base Fee: 1 gwei</div>
        </div>
      </section>
    </div>
  )
}
