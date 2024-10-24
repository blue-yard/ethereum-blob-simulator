import { useStore } from '../store'
import { VerticalSlider } from './VerticalSlider'

const PRICE_POINTS = [0.0001, 0.001, 0.01, 0.1, 1.0, 10.0, 100.0]
const PERCENTAGES = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0]

export function GasCostGrid() {
  const { gasCostGrid, setGasCostGrid } = useStore()

  const handleSliderChange = (colIndex: number, value: number) => {
      setGasCostGrid(0, colIndex, value)
  }

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toFixed(0)}`
    return `$${price.toFixed(4)}`
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">
        Percentage of people that will pay this price for a transaction
      </h3>
      <div className="flex">
        {/* Percentage labels */}
        <div className="flex flex-col justify-between pr-2 py-4 h-[300px]">
          {PERCENTAGES.map((percent, i) => (
            <div key={i} className="text-xs w-8">
              {percent}%
            </div>
          ))}
        </div>

        {/* Grid of sliders */}
        <div className="flex-1 flex justify-between items-end">
          {PRICE_POINTS.map((price, colIndex) => (
            <div key={colIndex} className="flex flex-col items-center">
              <VerticalSlider
                value={gasCostGrid.grid[0][colIndex]}
                onChange={(value) => handleSliderChange(colIndex, value)}
                min={0}
                max={100}
                height="300px"
              />
              <div className="text-xs text-center mt-2">
                {formatPrice(price)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
