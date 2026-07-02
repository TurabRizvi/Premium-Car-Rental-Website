export default function LoadingState({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-ink-700/60 bg-ink-900"
        >
          <div className="aspect-[4/3] bg-ink-800" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-2/3 rounded bg-ink-800" />
            <div className="h-3 w-1/2 rounded bg-ink-800" />
            <div className="h-3 w-1/3 rounded bg-ink-800" />
            <div className="h-8 w-full rounded-full bg-ink-800" />
          </div>
        </div>
      ))}
    </div>
  )
}
