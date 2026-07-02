import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, ArrowLeft, AlertTriangle } from 'lucide-react'
import { fetchCarById, submitBooking } from '../utils/mockApi'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import AvailabilityCalendar, { isBooked } from '../components/AvailabilityCalendar'
import { handleImageError } from '../utils/imageFallback'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  pickupDate: '',
  returnDate: '',
  pickupLocation: '',
  notes: '',
}

function validate(form, car) {
  const errors = {}
  if (!form.fullName.trim() || form.fullName.trim().length < 3) {
    errors.fullName = 'Enter your full name (min 3 characters).'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!/^[0-9+\-\s]{7,15}$/.test(form.phone)) {
    errors.phone = 'Enter a valid phone number.'
  }
  if (!form.pickupDate) {
    errors.pickupDate = 'Pickup date is required.'
  }
  if (!form.returnDate) {
    errors.returnDate = 'Return date is required.'
  }
  if (form.pickupDate && form.returnDate && form.returnDate < form.pickupDate) {
    errors.returnDate = 'Return date must be after pickup date.'
  }
  if (form.pickupDate && form.pickupDate < new Date().toISOString().slice(0, 10)) {
    errors.pickupDate = 'Pickup date cannot be in the past.'
  }
  if (form.pickupDate && car && isBooked(car.id, form.pickupDate) && !errors.pickupDate) {
    errors.pickupDate = 'This car is already booked on that date. Check the calendar below.'
  }
  if (!form.pickupLocation.trim()) {
    errors.pickupLocation = 'Pickup location is required.'
  }
  return errors
}

function daysBetween(a, b) {
  const d1 = new Date(a)
  const d2 = new Date(b)
  const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 1
}

export default function Booking() {
  const { id } = useParams()
  const [car, setCar] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)

  useEffect(() => {
    setStatus('loading')
    fetchCarById(id)
      .then((data) => {
        setCar(data)
        setStatus('success')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }, [id])

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleRangeSelect = (pickup, ret) => {
    setForm((f) => ({ ...f, pickupDate: pickup, returnDate: ret }))
    setErrors((prev) => ({ ...prev, pickupDate: undefined, returnDate: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validate(form, car)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    setSubmitting(true)
    try {
      const result = await submitBooking({ carId: car.id, carName: car.name, ...form })
      setConfirmation(result)
    } catch {
      setErrors({ form: 'Booking failed. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-3xl px-5 py-12 md:px-8">
        <LoadingState count={1} />
      </div>
    )
  }

  if (status === 'error' || !car) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <ErrorState message={error || 'Car not found.'} />
      </div>
    )
  }

  if (!car.available && !confirmation) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center md:px-8">
        <AlertTriangle className="h-8 w-8 text-champagne" />
        <h1 className="mt-4 font-display text-2xl text-ivory">{car.name} is currently booked</h1>
        <p className="mt-2 text-sm text-muted">
          This car isn't available right now. Browse similar cars or check back later.
        </p>
        <Link to="/cars" className="mt-6 rounded-full bg-champagne px-6 py-3 text-sm font-medium text-ink-950">
          Browse other cars
        </Link>
      </div>
    )
  }

  if (confirmation) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center md:px-8">
        <CheckCircle2 className="h-12 w-12 text-champagne" />
        <h1 className="mt-5 font-display text-3xl text-ivory">Booking confirmed</h1>
        <p className="mt-2 text-sm text-muted">
          Reference <span className="text-champagne">{confirmation.bookingId}</span> — a confirmation has
          been sent to {confirmation.email}.
        </p>
        <div className="mt-8 w-full rounded-2xl border border-ink-700/60 bg-ink-900 p-6 text-left text-sm">
          <Row label="Car" value={confirmation.carName} />
          <Row label="Pickup" value={`${confirmation.pickupDate} — ${confirmation.pickupLocation}`} />
          <Row label="Return" value={confirmation.returnDate} />
          <Row label="Duration" value={`${daysBetween(confirmation.pickupDate, confirmation.returnDate)} day(s)`} />
          <Row
            label="Estimated total"
            value={`Rs ${(car.pricePerDay * daysBetween(confirmation.pickupDate, confirmation.returnDate)).toLocaleString()}`}
          />
        </div>
        <Link to="/cars" className="mt-8 rounded-full bg-champagne px-6 py-3 text-sm font-medium text-ink-950">
          Browse more cars
        </Link>
      </div>
    )
  }

  const days = form.pickupDate && form.returnDate ? daysBetween(form.pickupDate, form.returnDate) : 0
  const total = days * car.pricePerDay

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <Link to={`/cars/${car.id}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-champagne">
        <ArrowLeft className="h-4 w-4" /> Back to details
      </Link>

      <div className="grid gap-10 md:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-5 md:col-span-2">
          <div>
            <span className="text-xs uppercase tracking-widest text-champagne">Booking</span>
            <h1 className="mt-2 font-display text-3xl text-ivory">Reserve the {car.name}</h1>
          </div>

          <Field label="Full name" error={errors.fullName}>
            <input
              value={form.fullName}
              onChange={handleChange('fullName')}
              placeholder="Ali Raza"
              className={inputClass(errors.fullName)}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="ali@email.com"
                className={inputClass(errors.email)}
              />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input
                value={form.phone}
                onChange={handleChange('phone')}
                placeholder="+92 300 1234567"
                className={inputClass(errors.phone)}
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Pickup date" error={errors.pickupDate}>
              <input
                type="date"
                value={form.pickupDate}
                onChange={handleChange('pickupDate')}
                min={new Date().toISOString().slice(0, 10)}
                className={inputClass(errors.pickupDate)}
              />
            </Field>
            <Field label="Return date" error={errors.returnDate}>
              <input
                type="date"
                value={form.returnDate}
                onChange={handleChange('returnDate')}
                min={form.pickupDate || new Date().toISOString().slice(0, 10)}
                className={inputClass(errors.returnDate)}
              />
            </Field>
          </div>

          <div>
            <p className="mb-2 text-sm text-ivory/80">
              Or pick dates on the availability calendar
            </p>
            <AvailabilityCalendar
              carId={car.id}
              pickupDate={form.pickupDate}
              returnDate={form.returnDate}
              onSelectRange={handleRangeSelect}
            />
          </div>

          <Field label="Pickup location" error={errors.pickupLocation}>
            <input
              value={form.pickupLocation}
              onChange={handleChange('pickupLocation')}
              placeholder="e.g. Gulberg III, Lahore"
              className={inputClass(errors.pickupLocation)}
            />
          </Field>

          <Field label="Notes (optional)">
            <textarea
              value={form.notes}
              onChange={handleChange('notes')}
              rows={3}
              placeholder="Decor requests, wedding timing, chauffeur instructions..."
              className={inputClass()}
            />
          </Field>

          {errors.form && <p className="text-sm text-red-400">{errors.form}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-champagne py-3 text-sm font-medium text-ink-950 transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-ink-700/60 bg-ink-900 p-6">
          <img src={car.image} alt={car.name} onError={handleImageError} className="aspect-[4/3] w-full rounded-xl object-cover" />
          <h3 className="mt-4 font-display text-lg text-ivory">{car.name}</h3>
          <p className="text-xs text-muted">{car.category} · {car.location}</p>
          <div className="mt-4 space-y-2 border-t border-ink-700/60 pt-4 text-sm">
            <Row label="Rate" value={`Rs ${car.pricePerDay.toLocaleString()} / day`} />
            <Row label="Duration" value={days ? `${days} day(s)` : '—'} />
            <Row label="Estimated total" value={total ? `Rs ${total.toLocaleString()}` : '—'} highlight />
          </div>
        </aside>
      </div>
    </div>
  )
}

function inputClass(error) {
  return `w-full rounded-xl border bg-ink-800 px-4 py-2.5 text-sm text-ivory placeholder:text-muted focus:outline-none ${
    error ? 'border-red-400' : 'border-ink-600 focus:border-champagne'
  }`
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-ivory/80">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className={highlight ? 'font-display text-champagne' : 'text-ivory'}>{value}</span>
    </div>
  )
}