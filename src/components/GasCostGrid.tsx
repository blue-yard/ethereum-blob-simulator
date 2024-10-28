import { useStore } from '../store'
import { VerticalSlider } from './VerticalSlider'
import { PRICE_POINTS, PERCENTAGES } from '../constants'

export function GasCostGrid() {
  const { gasCostGrid, setGasCostGrid } = useStore()

  const handleSliderChange = (colIndex: number, value: number) => {
    setGasCostGrid(colIndex, value)
  }

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toFixed(0)}`
    return `$${price}`
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">
        Percentage of users willing to pay up to this price
      </h3>
      <div className="flex">
        {/* Percentage labels */}
        <div className="flex flex-col justify-between pr-2 py-4 h-[320px]">
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
                value={gasCostGrid.grid[colIndex]}
                onChange={(value) => handleSliderChange(colIndex, value)}
                min={0}
                max={100}
                height="280px"
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
