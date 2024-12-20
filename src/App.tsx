import { Controls } from './components/Controls'
import { StatsDisplay } from './components/StatsDisplay'
import { SimulationGraph } from './components/SimulationGraph'
import { MathDetails } from './components/MathDetails'
import { useState } from 'react'

function App() {
  const [isMathDetailsOpen, setIsMathDetailsOpen] = useState(false)
  const [isResultsOpen, setIsResultsOpen] = useState(true) // Start open by default

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col">
      <div className="flex-grow">
        <h1 className="text-3xl font-bold mb-8">
          Ethereum Blob Simulator
        </h1>
        <div className="grid grid-cols-1 gap-8">
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Controls</h2>
            <Controls />
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <button
              onClick={() => setIsResultsOpen(!isResultsOpen)}
              className="w-full px-6 py-4 text-left flex justify-between items-center"
            >
              <span className="text-xl font-semibold">Simulation Results</span>
              <span 
                className="transform transition-transform duration-200" 
                style={{ transform: isResultsOpen ? 'rotate(180deg)' : 'none' }}
              >▼</span>
            </button>
            
            {isResultsOpen && (
              <div className="p-6 border-t dark:border-gray-700">
                <StatsDisplay />
                <SimulationGraph />
              </div>
            )}
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <button
              onClick={() => setIsMathDetailsOpen(!isMathDetailsOpen)}
              className="w-full px-6 py-4 text-left flex justify-between items-center"
            >
              <span className="text-xl font-semibold">The Math</span>
              <span 
                className="transform transition-transform duration-200" 
                style={{ transform: isMathDetailsOpen ? 'rotate(180deg)' : 'none' }}
              >▼</span>
            </button>
            
            {isMathDetailsOpen && (
              <div className="p-6 border-t dark:border-gray-700">
                <MathDetails />
              </div>
            )}
          </section>
        </div>
      </div>

      <footer className="mt-8 py-4 border-t dark:border-gray-700">
        <div className="flex justify-center gap-8">
          <a 
            href="https://github.com/blue-yard/ethereum-blob-simulator#faq"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            FAQ
          </a>
          <a 
            href="https://github.com/blue-yard/ethereum-blob-simulator/issues"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            Report Bug
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
