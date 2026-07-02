import { Link } from 'react-router-dom'
import { Heart, GitCompareArrows } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useCars } from '../hooks/useCars'
import CarCard from '../components/CarCard'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

export default function Wishlist() {
  const { wishlist, compareList } = useApp()
  const { cars, status, error, reload } = useCars()

  const wishedCars = cars.filter((c) => wishlist.includes(c.id))

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-champagne">Saved</span>
          <h1 className="mt-2 font-display text-3xl text-ivory">Your Wishlist</h1>
        </div>
        {compareList.length > 0 && (
          <Link
            to="/compare"
            className="inline-flex items-center gap-2 rounded-full border border-champagne/50 px-4 py-2.5 text-sm text-champagne hover:bg-champagne hover:text-ink-950"
          >
            <GitCompareArrows className="h-4 w-4" /> Compare ({compareList.length})
          </Link>
        )}
      </div>

      {status === 'loading' && <LoadingState count={3} />}

      {status === 'error' && <ErrorState message={error} onRetry={reload} />}

      {status === 'success' && wishedCars.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-ink-700/60 bg-ink-900 px-6 py-20 text-center">
          <Heart className="h-8 w-8 text-muted" />
          <h3 className="mt-4 font-display text-lg text-ivory">Nothing saved yet</h3>
          <p className="mt-1 text-sm text-muted">Tap the heart icon on any car to save it here.</p>
          <Link to="/cars" className="mt-5 rounded-full bg-champagne px-5 py-2.5 text-sm font-medium text-ink-950">
            Browse cars
          </Link>
        </div>
      )}

      {status === 'success' && wishedCars.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishedCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  )
}