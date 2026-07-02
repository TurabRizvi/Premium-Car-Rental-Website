import { Link } from 'react-router-dom'
import { Car, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 text-center md:px-8">
      <Car className="h-10 w-10 text-champagne" strokeWidth={1.5} />
      <h1 className="mt-6 font-display text-6xl text-ivory">404</h1>
      <p className="mt-3 text-lg text-ivory/80">This road doesn't lead anywhere.</p>
      <p className="mt-2 text-sm text-muted">
        The page you're looking for has been moved, renamed, or never existed.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-champagne px-6 py-3 text-sm font-medium text-ink-950 hover:opacity-90"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  )
}
