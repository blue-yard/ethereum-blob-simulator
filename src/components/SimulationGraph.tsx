import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useStore } from '../store'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export function SimulationGraph() {
  const { results, controls } = useStore()

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Block Number'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Blobs per Block'
        },
        min: 0,
        max: controls.maxBlobsPerBlock,
      },
      y2: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Blob Base Fee (gwei per byte)'
        },
        grid: {
          drawOnChartArea: false,
        },
        min: 0,
      },
      y3: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'TPS'
        },
        grid: {
          drawOnChartArea: false,
        },
        min: 0,
      }
    },
  }

  const data = {
    labels: results.timeSeriesData.map(p => p.timestamp.toString()),
    datasets: [
      {
        label: 'Blobs per Block',
        data: results.timeSeriesData.map(p => p.blobsPerBlock),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y1',
      },
      {
        label: 'Blob Base Fee',
        data: results.timeSeriesData.map(p => p.blobBaseFee),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        yAxisID: 'y2',
      },
      {
        label: 'Actual TPS',
        data: results.timeSeriesData.map(p => p.actualTps),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        yAxisID: 'y3',
      }
    ],
  }

  return (
    <div className="mt-8">
      <Line options={options} data={data} />
    </div>
  )
}
