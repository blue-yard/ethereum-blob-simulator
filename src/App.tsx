import { Controls } from './components/Controls'
import { StatsDisplay } from './components/StatsDisplay'
import { SimulationGraph } from './components/SimulationGraph'

function App() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">
        Ethereum Blob Simulator
      </h1>
      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          <Controls />
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Simulation Results</h2>
          <StatsDisplay />
          <SimulationGraph />
        </section>
      </div>
    </div>
  );
}

export default App;
