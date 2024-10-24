interface VerticalSliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  height?: string
}

export function VerticalSlider({ value, onChange, min, max, height = "200px" }: VerticalSliderProps) {
  // Invert the value since we're flipping the slider
  const invertedValue = max - (value - min)
  
  return (
    <div 
      className="flex items-center justify-center"
      style={{ height, width: '20px' }}
    >
      <input
        type="range"
        min={min}
        max={max}
        value={invertedValue}
        onChange={(e) => onChange(max - (Number(e.target.value) - min))}
        className="accent-primary"
        style={{
          width: "1000px",
          transform: 'rotate(270deg)',
          transformOrigin: 'center',
        }}
      />
    </div>
  )
}
