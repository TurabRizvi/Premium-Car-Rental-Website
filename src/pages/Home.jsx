import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import * as Icons from 'lucide-react'
import { ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react'
import { categories } from '../data/categories'
import { useCars } from '../hooks/useCars'
import CarCard from '../components/CarCard'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

export default function Home() {
  const { cars, status, error, reload } = useCars()

  const featured = useMemo(
    () => cars.filter((c) => c.rating >= 4.8).slice(0, 3),
    [cars]
  )

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-700/60 bg-ink-950">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(201,161,90,0.12), transparent 45%), radial-gradient(circle at 80% 0%, rgba(201,161,90,0.08), transparent 40%)',
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-2 md:items-center md:px-8 md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-champagne/40 px-4 py-1.5 text-xs uppercase tracking-widest text-champagne">
              Est. Lahore · Serving Pakistan
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.1] text-ivory md:text-6xl">
              The car for the day
              <br />
              you won't repeat.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              From a Rolls-Royce Phantom for the baraat to a Corolla for the work week —
              Aurum Drive puts the right car in your driveway, chauffeur optional.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/cars"
                className="inline-flex items-center gap-2 rounded-full bg-champagne px-6 py-3 text-sm font-medium text-ink-950 transition-opacity hover:opacity-90"
              >
                Browse the fleet <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/wedding-collection"
                className="inline-flex items-center gap-2 rounded-full border border-ink-600 px-6 py-3 text-sm text-ivory transition-colors hover:border-champagne hover:text-champagne"
              >
                Wedding Collection
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-ink-700/60 pt-8">
              <div>
                <p className="font-display text-2xl text-champagne">120+</p>
                <p className="text-xs text-muted">Vehicles in fleet</p>
              </div>
              <div>
                <p className="font-display text-2xl text-champagne">9</p>
                <p className="text-xs text-muted">Cities covered</p>
              </div>
              <div>
                <p className="font-display text-2xl text-champagne">4.8★</p>
                <p className="text-xs text-muted">Average rating</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-ink-700/60 shadow-2xl">
              <img
                src="/image/rr-phantom.png"
                alt="Rolls-Royce Phantom, Aurum Drive wedding fleet"
                className="h-[420px] w-full object-cover md:h-[520px]"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-champagne/40 bg-ink-900/95 px-6 py-4 backdrop-blur md:block">
              <p className="font-display text-lg text-ivory">Rolls-Royce Phantom</p>
              <p className="text-xs text-muted">From Rs 45,000 / day · Chauffeur included</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-ink-700/60 bg-ink-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-8 sm:grid-cols-3 md:px-8">
          {[
            { icon: ShieldCheck, title: 'Verified fleet', desc: 'Every car inspected before dispatch' },
            { icon: Clock, title: '24/7 support', desc: 'Someone answers, always' },
            { icon: Award, title: 'Chauffeur available', desc: 'On every wedding & luxury booking' },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <f.icon className="h-5 w-5 shrink-0 text-champagne" strokeWidth={1.5} />
              <div>
                <p className="text-sm text-ivory">{f.title}</p>
                <p className="text-xs text-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-champagne">Fleet</span>
            <h2 className="mt-2 font-display text-3xl text-ivory">Browse by category</h2>
          </div>
          <Link to="/cars" className="hidden text-sm text-champagne hover:underline md:block">
            View all →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = Icons[cat.icon] || Icons.Car
            return (
              <Link
                key={cat.name}
                to={`/cars?category=${encodeURIComponent(cat.name)}`}
                className="group rounded-2xl border border-ink-700/60 bg-ink-900 p-5 transition-colors hover:border-champagne/50"
              >
                <Icon className="h-5 w-5 text-champagne" strokeWidth={1.5} />
                <p className="mt-4 font-display text-base text-ivory">{cat.name}</p>
                <p className="mt-1 text-xs text-muted">{cat.blurb}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Wedding collection teaser */}
      <section className="border-y border-ink-700/60 bg-ink-900">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:px-8">
          <div className="overflow-hidden rounded-3xl border border-ink-700/60">
            <img
              src="/image/bentley-flying-spur.png"
              alt="Wedding car collection"
              className="h-72 w-full object-cover md:h-96"
            />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-champagne">Signature Service</span>
            <h2 className="mt-2 font-display text-3xl text-ivory md:text-4xl">
              The Wedding Collection
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              Vintage Rolls-Royce, Bentley, Mercedes-Benz, BMW, Audi, stretch limousines, and
              exotic supercars — decorated, chauffeured, and timed to your rukhsati.
            </p>
            <Link
              to="/wedding-collection"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-champagne px-6 py-3 text-sm font-medium text-ink-950 hover:opacity-90"
            >
              Explore the collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured cars */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-champagne">Top Rated</span>
            <h2 className="mt-2 font-display text-3xl text-ivory">Featured this week</h2>
          </div>
          <Link to="/cars" className="hidden text-sm text-champagne hover:underline md:block">
            View all →
          </Link>
        </div>

        <div className="mt-8">
          {status === 'loading' && <LoadingState count={3} />}
          {status === 'error' && <ErrorState message={error} onRetry={reload} />}
          {status === 'success' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}