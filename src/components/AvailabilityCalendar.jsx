import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

// Deterministic string hash so the same car always shows the same "booked" days
// (simulates a real availability calendar without needing a backend).
function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function isBooked(carId, dateStr) {
  const h = hashString(carId + dateStr)
  return h % 7 === 0 // roughly 1 in 7 days pre-booked, deterministic per car+date
}

function toISO(date) {
  return date.toISOString().slice(0, 10)
}

export default function AvailabilityCalendar({ carId, pickupDate, returnDate, onSelectRange }) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [viewDate, setViewDate] = useState(() => {
    const base = pickupDate ? new Date(pickupDate) : today
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  // Keep the visible month in sync when the pickup date changes from
  // elsewhere (e.g. typed directly into the manual date input), not just
  // from clicking inside the calendar itself.
  useEffect(() => {
    if (!pickupDate) return
    const d = new Date(pickupDate)
    setViewDate((prev) =>
      prev.getFullYear() === d.getFullYear() && prev.getMonth() === d.getMonth()
        ? prev
        : new Date(d.getFullYear(), d.getMonth(), 1)
    )
  }, [pickupDate])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const startOffset = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  const handleClick = (date) => {
    if (!date) return
    const iso = toISO(date)
    if (date < today || isBooked(carId, iso)) return

    if (!pickupDate || (pickupDate && returnDate)) {
      onSelectRange(iso, '')
    } else if (iso < pickupDate) {
      onSelectRange(iso, '')
    } else {
      onSelectRange(pickupDate, iso)
    }
  }

  const changeMonth = (delta) => {
    setViewDate(new Date(year, month + delta, 1))
  }

  return (
    <div className="rounded-2xl border border-ink-700/60 bg-ink-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="rounded-full border border-ink-600 p-1.5 text-ivory/70 hover:border-champagne hover:text-champagne"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm text-ivory">{MONTH_NAMES[month]} {year}</p>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="rounded-full border border-ink-600 p-1.5 text-ivory/70 hover:border-champagne hover:text-champagne"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="py-1">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />
          const iso = toISO(date)
          const past = date < today
          const booked = isBooked(carId, iso)
          const isPickup = iso === pickupDate
          const isReturn = iso === returnDate
          const inRange = pickupDate && returnDate && iso > pickupDate && iso < returnDate

          let cls = 'text-ivory/80 hover:bg-ink-800'
          if (past || booked) cls = 'text-muted/40 line-through cursor-not-allowed'
          if (inRange) cls = 'bg-champagne/15 text-champagne'
          if (isPickup || isReturn) cls = 'bg-champagne text-ink-950 font-medium'

          return (
            <button
              type="button"
              key={iso}
              disabled={past || booked}
              onClick={() => handleClick(date)}
              className={`aspect-square rounded-lg text-xs transition-colors ${cls}`}
              title={booked && !past ? 'Already booked' : ''}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex items-center gap-4 text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-champagne" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-ink-700 line-through" /> Booked / past
        </span>
      </div>
    </div>
  )
}