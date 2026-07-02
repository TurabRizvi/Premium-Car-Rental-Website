import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Heart, Users, Fuel, Gauge, Calendar, MapPin, Star, GitCompareArrows, ArrowLeft, Check } from 'lucide-react'
import { fetchCarById } from '../utils/mockApi'
import { useApp } from '../context/AppContext'
import { handleImageError } from '../utils/imageFallback'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

export default function CarDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { wishlist, toggleWishlist, compareList, toggleCompare } = useApp()

  const [car, setCar] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [activeImage, setActiveImage] = useState(0)

  const load = () => {
    setStatus('loading')
    setError(null)
    fetchCarById(id)
      .then((data) => {
        setCar(data)
        setActiveImage(0)
        setStatus('success')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }

  useEffect(load, [id])

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <LoadingState count={1} />
      </div>
    )
  }

  if (status === 'error' || !car) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <ErrorState message={error || 'Car not found.'} onRetry={load} />
      </div>
    )
  }

  const isWished = wishlist.includes(car.id)
  const isComparing = compareList.includes(car.id)
  const gallery = car.gallery?.length ? car.gallery : [car.image]

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-champagne"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl border border-ink-700/60 bg-ink-900">
            <img src={gallery[activeImage]} alt={car.name} onError={handleImageError} className="aspect-[4/3] w-full object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-3">
              {gallery.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border ${
                    activeImage === i ? 'border-champagne' : 'border-ink-700/60'
                  }`}
                >
                  <img src={img} alt="" onError={handleImageError} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-champagne">{car.category}</span>
              <h1 className="mt-2 font-display text-3xl text-ivory md:text-4xl">{car.name}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="h-3.5 w-3.5" /> {car.location} · {car.brand} · {car.year}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleWishlist(car.id)}
                className={`rounded-full border p-2.5 ${
                  isWished ? 'border-champagne bg-champagne text-ink-950' : 'border-ink-600 text-ivory/70'
                }`}
              >
                <Heart className="h-4 w-4" fill={isWished ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => toggleCompare(car.id)}
                className={`rounded-full border p-2.5 ${
                  isComparing ? 'border-champagne text-champagne' : 'border-ink-600 text-ivory/70'
                }`}
              >
                <GitCompareArrows className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-sm text-champagne">
            <Star className="h-4 w-4" fill="currentColor" /> {car.rating} rating
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted">{car.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-ink-700/60 bg-ink-900 p-5 sm:grid-cols-4">
            <Spec icon={Users} label="Seats" value={car.seats} />
            <Spec icon={Gauge} label="Transmission" value={car.transmission} />
            <Spec icon={Fuel} label="Fuel" value={car.fuel} />
            <Spec icon={Calendar} label="Year" value={car.year} />
          </div>

          <div className="mt-6">
            <h3 className="font-display text-lg text-ivory">Features</h3>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {car.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted">
                  <Check className="h-3.5 w-3.5 text-champagne" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex items-center justify-between rounded-2xl border border-champagne/30 bg-ink-900 p-5">
            <div>
              <p className="font-display text-2xl text-ivory">
                Rs {car.pricePerDay.toLocaleString()}
                <span className="text-sm text-muted"> / day</span>
              </p>
              <p className="text-xs text-muted">{car.available ? 'Available now' : 'Currently booked'}</p>
            </div>
            <Link
              to={`/booking/${car.id}`}
              aria-disabled={!car.available}
              className={`rounded-full px-6 py-3 text-sm font-medium ${
                car.available
                  ? 'bg-champagne text-ink-950 hover:opacity-90'
                  : 'pointer-events-none bg-ink-700 text-muted'
              }`}
            >
              Book This Car
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Spec({ icon: Icon, label, value }) {
  return (
    <div>
      <Icon className="h-4 w-4 text-champagne" strokeWidth={1.5} />
      <p className="mt-2 text-sm text-ivory">{value}</p>
      <p className="text-[11px] text-muted">{label}</p>
    </div>
  )
}
