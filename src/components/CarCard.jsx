import { Link } from 'react-router-dom'
import { Heart, Users, Fuel, GitCompareArrows, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { handleImageError } from '../utils/imageFallback'

export default function CarCard({ car }) {
  const { wishlist, toggleWishlist, compareList, toggleCompare } = useApp()
  const isWished = wishlist.includes(car.id)
  const isComparing = compareList.includes(car.id)

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-700/60 bg-ink-900 transition-colors hover:border-champagne/50">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
        <img
          src={car.image}
          alt={car.name}
          loading="lazy"
          onError={handleImageError}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-ink-950/80 px-3 py-1 text-[11px] uppercase tracking-wide text-champagne backdrop-blur">
          {car.category}
        </div>
        {!car.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-950/70">
            <span className="rounded-full bg-ink-950 px-4 py-1.5 text-xs uppercase tracking-widest text-ivory/80 shadow-gold">
              Currently Booked
            </span>
          </div>
        )}
        <button
          onClick={() => toggleWishlist(car.id)}
          aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute right-3 top-3 rounded-full p-2 backdrop-blur transition-colors ${
            isWished ? 'bg-champagne text-ink-950' : 'bg-ink-950/80 text-ivory/70 hover:text-champagne'
          }`}
        >
          <Heart className="h-4 w-4" fill={isWished ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-tight text-ivory">{car.name}</h3>
          <div className="flex shrink-0 items-center gap-1 text-xs text-champagne">
            <Star className="h-3.5 w-3.5" fill="currentColor" />
            {car.rating}
          </div>
        </div>
        <p className="mt-1 text-xs text-muted">{car.brand} · {car.year} · {car.location}</p>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {car.seats} seats
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5" /> {car.fuel}
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="font-display text-xl text-ivory">Rs {car.pricePerDay.toLocaleString()}</span>
            <span className="text-xs text-muted"> / day</span>
          </div>
          <button
            onClick={() => toggleCompare(car.id)}
            title="Add to compare"
            className={`rounded-full border p-2 transition-colors ${
              isComparing
                ? 'border-champagne text-champagne'
                : 'border-ink-600 text-ivory/50 hover:text-champagne'
            }`}
          >
            <GitCompareArrows className="h-3.5 w-3.5" />
          </button>
        </div>

        <Link
          to={`/cars/${car.id}`}
          className="mt-4 block rounded-full border border-champagne/70 py-2.5 text-center text-sm text-champagne transition-colors hover:bg-champagne hover:text-ink-950"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}
