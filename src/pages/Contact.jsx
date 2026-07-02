import { useState } from 'react'
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react'

const initialForm = { name: '', email: '', message: '' }

function validate(form) {
  const errors = {}
  if (!form.name.trim() || form.name.trim().length < 2) errors.name = 'Enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email.'
  if (!form.message.trim() || form.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters.'
  }
  return errors
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validation = validate(form)
    setErrors(validation)
    if (Object.keys(validation).length === 0) {
      setSent(true)
      setForm(initialForm)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
      <div className="mb-10 text-center">
        <span className="text-xs uppercase tracking-widest text-champagne">Contact</span>
        <h1 className="mt-2 font-display text-4xl text-ivory">Talk to the team</h1>
        <p className="mt-2 text-sm text-muted">Questions about a booking, a wedding date, or fleet availability.</p>
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        <div className="space-y-5">
          <ContactRow icon={Phone} label="Call us" value="+92 300 1234567" />
          <ContactRow icon={Mail} label="Email" value="hello@aurumdrive.pk" />
          <ContactRow icon={MapPin} label="Visit" value="Gulberg III, Lahore, Pakistan" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-ink-700/60 bg-ink-900 p-6 md:col-span-2">
          {sent && (
            <div className="flex items-center gap-2 rounded-xl border border-champagne/40 bg-champagne/10 px-4 py-3 text-sm text-champagne">
              <CheckCircle2 className="h-4 w-4" /> Message sent — we'll reply within one business day.
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-ivory/80">Name</label>
              <input
                value={form.name}
                onChange={handleChange('name')}
                className={inputClass(errors.name)}
                placeholder="Your name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ivory/80">Email</label>
              <input
                value={form.email}
                onChange={handleChange('email')}
                className={inputClass(errors.email)}
                placeholder="you@email.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ivory/80">Message</label>
            <textarea
              value={form.message}
              onChange={handleChange('message')}
              rows={5}
              className={inputClass(errors.message)}
              placeholder="Tell us about your booking..."
            />
            {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
          </div>
          <button
            type="submit"
            className="rounded-full bg-champagne px-6 py-3 text-sm font-medium text-ink-950 hover:opacity-90"
          >
            Send message
          </button>
        </form>
      </div>
    </div>
  )
}

function inputClass(error) {
  return `w-full rounded-xl border bg-ink-800 px-4 py-2.5 text-sm text-ivory placeholder:text-muted focus:outline-none ${
    error ? 'border-red-400' : 'border-ink-600 focus:border-champagne'
  }`
}

function ContactRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-ink-700/60 bg-ink-900 p-5">
      <Icon className="h-5 w-5 shrink-0 text-champagne" strokeWidth={1.5} />
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm text-ivory">{value}</p>
      </div>
    </div>
  )
}
