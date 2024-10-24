import { useStore } from '../store'

export function StatsDisplay() {
  const { results } = useStore()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Desired TPS
        </h3>
        <p className="text-2xl font-bold mt-1">
          {results.totalTps.toLocaleString()}
        </p>
      </div>

      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Average Transaction Price
        </h3>
        <p className="text-2xl font-bold mt-1">
          ${results.avgTxPrice.toFixed(4)}
        </p>
      </div>

      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total ETH Burnt per Day
        </h3>
        <p className="text-2xl font-bold mt-1">
          {results.totalEthBurnt.toFixed(2)} ETH
        </p>
      </div>
    </div>
  )
}
