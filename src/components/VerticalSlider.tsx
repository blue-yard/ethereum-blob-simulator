interface VerticalSliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  height?: string
}

export function VerticalSlider({ value, onChange, min, max, height = "200px" }: VerticalSliderProps) {
  return (
    <div 
      className="flex items-center justify-center relative"
      style={{ height, width: '20px' }}
    >
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-primary"
        style={{
          width: height,
          transform: 'rotate(-90deg)',
          transformOrigin: '0 0',
          position: 'absolute',
          top: '100%',
          left: '0%',
        }}
      />
    </div>
  )
}