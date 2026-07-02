import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { useCars } from '../hooks/useCars'
import CarCard from '../components/CarCard'
import CarFilters from '../components/CarFilters'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

export default function CarsListing() {
  const { cars, status, error, reload } = useCars()
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [sort, setSort] = useState('default')

  useEffect(() => {
    const params = {}
    if (search) params.q = search
    if (category !== 'all') params.category = category
    setSearchParams(params, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category])

  // Keep local filters in sync when the URL changes from outside this page
  // (e.g. clicking a category link in the footer while already on /cars) —
  // without this, the component stays mounted and never re-reads the URL.
  useEffect(() => {
    setSearch(searchParams.get('q') || '')
    setCategory(searchParams.get('category') || 'all')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()])

  const filtered = useMemo(() => {
    let list = [...cars]

    if (category !== 'all') {
      list = list.filter((c) => c.category === category)
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      )
    }

    if (sort === 'price-asc') list.sort((a, b) => a.pricePerDay - b.pricePerDay)
    if (sort === 'price-desc') list.sort((a, b) => b.pricePerDay - a.pricePerDay)
    if (sort === 'rating-desc') list.sort((a, b) => b.rating - a.rating)

    return list
  }, [cars, category, search, sort])

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest text-champagne">Fleet</span>
        <h1 className="mt-2 font-display text-3xl text-ivory md:text-4xl">All Cars</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Search, filter by category, and sort by price to find the right car for the day.
        </p>
      </div>

      <CarFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        resultCount={filtered.length}
      />

      <div className="mt-8">
        {status === 'loading' && <LoadingState count={9} />}
        {status === 'error' && <ErrorState message={error} onRetry={reload} />}
        {status === 'success' && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-ink-700/60 bg-ink-900 px-6 py-20 text-center">
            <SearchX className="h-8 w-8 text-muted" />
            <h3 className="mt-4 font-display text-lg text-ivory">No cars match your search</h3>
            <p className="mt-1 text-sm text-muted">Try a different keyword or clear the category filter.</p>
          </div>
        )}
        {status === 'success' && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}