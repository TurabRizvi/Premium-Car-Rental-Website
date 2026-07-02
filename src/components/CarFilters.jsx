import { Search, SlidersHorizontal } from 'lucide-react'
import { categories } from '../data/categories'

export default function CarFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  resultCount,
}) {
  return (
    <div className="rounded-2xl border border-ink-700/60 bg-ink-900 p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, brand, or category..."
            className="w-full rounded-full border border-ink-600 bg-ink-800 py-2.5 pl-10 pr-4 text-sm text-ivory placeholder:text-muted focus:border-champagne focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <SlidersHorizontal className="hidden h-4 w-4 text-muted md:block" />
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="rounded-full border border-ink-600 bg-ink-800 px-4 py-2.5 text-sm text-ivory focus:border-champagne focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-full border border-ink-600 bg-ink-800 px-4 py-2.5 text-sm text-ivory focus:border-champagne focus:outline-none"
          >
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: Highest</option>
          </select>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">{resultCount} car{resultCount !== 1 ? 's' : ''} found</p>
    </div>
  )
}
