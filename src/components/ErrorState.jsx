import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-ink-700/60 bg-ink-900 px-6 py-16 text-center">
      <div className="rounded-full bg-red-500/10 p-3 text-red-400">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-lg text-ivory">Something went wrong</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">
        {message || 'We could not load the fleet right now. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-champagne px-5 py-2.5 text-sm font-medium text-ink-950 transition-opacity hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  )
}
