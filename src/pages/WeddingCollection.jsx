import { useMemo } from 'react'
import { Heart } from 'lucide-react'
import { useCars } from '../hooks/useCars'
import { weddingSubTypes } from '../data/categories'
import CarCard from '../components/CarCard'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

export default function WeddingCollection() {
  const { cars, status, error, reload } = useCars()

  const weddingCars = useMemo(
    () => cars.filter((c) => c.category === 'Wedding Cars' || c.category === 'Limousines'),
    [cars]
  )

  const grouped = useMemo(() => {
    const map = {}
    weddingSubTypes.forEach((t) => (map[t] = []))
    weddingCars.forEach((c) => {
      if (!map[c.subType]) map[c.subType] = []
      map[c.subType].push(c)
    })
    return map
  }, [weddingCars])

  return (
    <div>
      <section className="border-b border-ink-700/60 bg-ink-900">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center md:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-champagne/40 px-4 py-1.5 text-xs uppercase tracking-widest text-champagne">
            <Heart className="h-3.5 w-3.5" /> Wedding Collection
          </span>
          <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl text-ivory md:text-5xl">
            Vintage arrivals. Modern flagships. One unforgettable exit.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted">
            Vintage cars, Rolls-Royce, Bentley, Mercedes-Benz, BMW, Audi, stretch limousines, and
            exotic supercars — decorated and chauffeured for your day.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        {status === 'loading' && <LoadingState count={6} />}
        {status === 'error' && <ErrorState message={error} onRetry={reload} />}
        {status === 'success' &&
          weddingSubTypes.map((type) =>
            grouped[type]?.length ? (
              <div key={type} className="mb-14 last:mb-0">
                <h2 className="mb-6 font-display text-2xl text-ivory">{type}</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[type].map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              </div>
            ) : null
          )}
      </div>
    </div>
  )
}
