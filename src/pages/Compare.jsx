import { Link } from 'react-router-dom'
import { X, GitCompareArrows } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useCars } from '../hooks/useCars'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { handleImageError } from '../utils/imageFallback'

const rows = [
  { key: 'category', label: 'Category' },
  { key: 'pricePerDay', label: 'Price / day', format: (v) => `Rs ${v.toLocaleString()}` },
  { key: 'seats', label: 'Seats' },
  { key: 'transmission', label: 'Transmission' },
  { key: 'fuel', label: 'Fuel' },
  { key: 'year', label: 'Year' },
  { key: 'rating', label: 'Rating', format: (v) => `${v} ★` },
  { key: 'location', label: 'Location' },
]

export default function Compare() {
  const { compareList, toggleCompare, clearCompare } = useApp()
  const { cars, status, error, reload } = useCars()

  const compared = cars.filter((c) => compareList.includes(c.id))

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <LoadingState count={3} />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <ErrorState message={error} onRetry={reload} />
      </div>
    )
  }

  if (compared.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center md:px-8">
        <GitCompareArrows className="h-8 w-8 text-muted" />
        <h1 className="mt-4 font-display text-2xl text-ivory">Nothing to compare</h1>
        <p className="mt-2 text-sm text-muted">
          Tap the compare icon on up to 3 cars to see them side by side.
        </p>
        <Link to="/cars" className="mt-6 rounded-full bg-champagne px-5 py-2.5 text-sm font-medium text-ink-950">
          Browse cars
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ivory">Compare Cars</h1>
        <button onClick={clearCompare} className="text-sm text-muted hover:text-champagne">
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink-700/60">
        <table className="w-full min-w-[600px] border-collapse bg-ink-900 text-sm">
          <thead>
            <tr>
              <th className="w-40 border-b border-ink-700/60 p-4 text-left text-muted"></th>
              {compared.map((car) => (
                <th key={car.id} className="border-b border-ink-700/60 p-4 text-left">
                  <div className="relative w-48">
                    <button
                      onClick={() => toggleCompare(car.id)}
                      className="absolute -right-1 -top-1 rounded-full bg-ink-950 p-1 text-muted hover:text-champagne"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <img src={car.image} alt={car.name} onError={handleImageError} className="aspect-[4/3] w-full rounded-lg object-cover" />
                    <p className="mt-2 font-display text-ivory">{car.name}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="odd:bg-ink-950/40">
                <td className="p-4 text-muted">{row.label}</td>
                {compared.map((car) => (
                  <td key={car.id} className="p-4 text-ivory">
                    {row.format ? row.format(car[row.key]) : car[row.key]}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-4"></td>
              {compared.map((car) => (
                <td key={car.id} className="p-4">
                  <Link
                    to={`/cars/${car.id}`}
                    className="inline-block rounded-full border border-champagne/70 px-4 py-2 text-xs text-champagne hover:bg-champagne hover:text-ink-950"
                  >
                    View
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}