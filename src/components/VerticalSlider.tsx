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
      className="flex items-center justify-center"
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
          width: "1000px",
          transform: 'rotate(270deg)',
          transformOrigin: 'center',
        }}
      />
    </div>
  )
}
