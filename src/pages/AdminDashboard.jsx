import { useEffect, useState, useRef } from 'react'
import { Plus, Pencil, Trash2, X, LockKeyhole, RotateCcw, LogOut, Upload, ImageOff } from 'lucide-react'
import { addCar, editCar, deleteCar, resetOverrides } from '../utils/adminStore'
import { fetchRawBaseCars } from '../utils/mockApi'
import { useCars } from '../hooks/useCars'
import { categories } from '../data/categories'
import { handleImageError } from '../utils/imageFallback'

const ADMIN_PASSCODE = 'admin123' // Demo-only passcode. See README for how this would work in production.
const SESSION_KEY = 'car-rental:admin-session'

const emptyForm = {
  id: '',
  name: '',
  brand: '',
  category: categories[0].name,
  subType: '',
  pricePerDay: '',
  seats: '',
  transmission: 'Automatic',
  fuel: 'Petrol',
  year: new Date().getFullYear(),
  rating: 4.5,
  location: '',
  image: '',
  description: '',
  features: '',
  available: true,
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminDashboard() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [passcode, setPasscode] = useState('')
  const [passcodeError, setPasscodeError] = useState('')

  const { cars, status, reload } = useCars()
  const [baseIds, setBaseIds] = useState(new Set())
  const [baseIdsReady, setBaseIdsReady] = useState(false)

  useEffect(() => {
    fetchRawBaseCars()
      .then((base) => setBaseIds(new Set(base.map((c) => c.id))))
      .finally(() => setBaseIdsReady(true))
  }, [])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setFormError('Please choose an image file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setFormError('Image is larger than 2MB — choose a smaller file or use an image URL / local path instead.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setForm((f) => ({ ...f, image: reader.result }))
      setFormError('')
    }
    reader.onerror = () => setFormError('Could not read that file. Try again.')
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    document.title = 'Admin · Aurum Drive'
  }, [])

  const handleUnlock = (e) => {
    e.preventDefault()
    if (passcode === ADMIN_PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setUnlocked(true)
      setPasscodeError('')
    } else {
      setPasscodeError('Incorrect passcode.')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setUnlocked(false)
    setPasscode('')
  }

  if (!unlocked) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center md:px-8">
        <LockKeyhole className="h-8 w-8 text-champagne" />
        <h1 className="mt-4 font-display text-2xl text-ivory">Admin Access</h1>
        <p className="mt-2 text-sm text-muted">
          This is a demo gate for the assessment (passcode: <code className="text-champagne">admin123</code>).
          A real deployment would use proper authentication.
        </p>
        <form onSubmit={handleUnlock} className="mt-6 w-full space-y-3">
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode"
            className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-2.5 text-center text-sm text-ivory focus:border-champagne focus:outline-none"
          />
          {passcodeError && <p className="text-xs text-red-400">{passcodeError}</p>}
          <button type="submit" className="w-full rounded-full bg-champagne py-2.5 text-sm font-medium text-ink-950 hover:opacity-90">
            Unlock
          </button>
        </form>
      </div>
    )
  }

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
    setShowForm(true)
  }

  const openEdit = (car) => {
    setEditingId(car.id)
    setForm({
      ...car,
      features: (car.features || []).join(', '),
    })
    setFormError('')
    setShowForm(true)
  }

  const handleDelete = (car) => {
    if (!window.confirm(`Delete ${car.name}? This cannot be undone.`)) return
    deleteCar(car.id, !baseIds.has(car.id))
    reload()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.brand.trim() || !form.pricePerDay || !form.location.trim()) {
      setFormError('Name, brand, price per day, and location are required.')
      return
    }

    const payload = {
      ...form,
      pricePerDay: Number(form.pricePerDay),
      seats: Number(form.seats) || 4,
      rating: Number(form.rating) || 4.5,
      year: Number(form.year) || new Date().getFullYear(),
      features: form.features
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      image: form.image.trim() || 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop',
      gallery: [form.image.trim() || 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop'],
    }

    if (editingId) {
      editCar(editingId, payload, !baseIds.has(editingId))
    } else {
      const id = slugify(form.name) + '-' + Date.now().toString().slice(-5)
      addCar({ ...payload, id })
    }

    setShowForm(false)
    reload()
  }

  const handleResetAll = () => {
    if (!window.confirm('Reset all admin changes back to the original demo dataset?')) return
    resetOverrides()
    reload()
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-champagne">Admin</span>
          <h1 className="mt-2 font-display text-3xl text-ivory">Fleet Management</h1>
          <p className="mt-1 text-sm text-muted">
            Add, edit, or remove cars. Changes are saved to your browser's storage (demo only —
            not shared with other visitors).
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleResetAll}
            className="inline-flex items-center gap-2 rounded-full border border-ink-600 px-4 py-2.5 text-sm text-ivory/80 hover:border-champagne hover:text-champagne"
          >
            <RotateCcw className="h-4 w-4" /> Reset demo data
          </button>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-full bg-champagne px-4 py-2.5 text-sm font-medium text-ink-950 hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add Car
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-ink-600 px-4 py-2.5 text-sm text-ivory/80 hover:border-red-400 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      {(status === 'loading' || !baseIdsReady) && <p className="text-sm text-muted">Loading fleet...</p>}

      {status === 'success' && baseIdsReady && (
        <div className="overflow-x-auto rounded-2xl border border-ink-700/60">
          <table className="w-full min-w-[760px] border-collapse bg-ink-900 text-sm">
            <thead>
              <tr className="text-left text-muted">
                <th className="border-b border-ink-700/60 p-4">Car</th>
                <th className="border-b border-ink-700/60 p-4">Category</th>
                <th className="border-b border-ink-700/60 p-4">Price / day</th>
                <th className="border-b border-ink-700/60 p-4">Location</th>
                <th className="border-b border-ink-700/60 p-4">Status</th>
                <th className="border-b border-ink-700/60 p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="odd:bg-ink-950/40">
                  <td className="flex items-center gap-3 p-4">
                    <img src={car.image} alt="" onError={handleImageError} className="h-10 w-14 rounded-md object-cover" />
                    <span className="text-ivory">{car.name}</span>
                  </td>
                  <td className="p-4 text-muted">{car.category}</td>
                  <td className="p-4 text-ivory">Rs {car.pricePerDay.toLocaleString()}</td>
                  <td className="p-4 text-muted">{car.location}</td>
                  <td className="p-4">
                    <span className={car.available ? 'text-champagne' : 'text-muted'}>
                      {car.available ? 'Available' : 'Booked'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(car)}
                        className="rounded-full border border-ink-600 p-2 text-ivory/70 hover:border-champagne hover:text-champagne"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(car)}
                        className="rounded-full border border-ink-600 p-2 text-ivory/70 hover:border-red-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-ink-700/60 bg-ink-900 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl text-ivory">{editingId ? 'Edit Car' : 'Add Car'}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-champagne">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
              <TextField label="Brand" value={form.brand} onChange={(v) => setForm((f) => ({ ...f, brand: v }))} />

              <div>
                <label className="mb-1.5 block text-sm text-ivory/80">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className={selectClass}
                >
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <TextField label="Sub-type" value={form.subType} onChange={(v) => setForm((f) => ({ ...f, subType: v }))} placeholder="e.g. Modern Luxury" />

              <TextField label="Price per day (Rs)" type="number" value={form.pricePerDay} onChange={(v) => setForm((f) => ({ ...f, pricePerDay: v }))} />
              <TextField label="Seats" type="number" value={form.seats} onChange={(v) => setForm((f) => ({ ...f, seats: v }))} />

              <div>
                <label className="mb-1.5 block text-sm text-ivory/80">Transmission</label>
                <select value={form.transmission} onChange={(e) => setForm((f) => ({ ...f, transmission: e.target.value }))} className={selectClass}>
                  <option>Automatic</option>
                  <option>Manual</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-ivory/80">Fuel</label>
                <select value={form.fuel} onChange={(e) => setForm((f) => ({ ...f, fuel: e.target.value }))} className={selectClass}>
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                  <option>Hybrid</option>
                </select>
              </div>

              <TextField label="Year" type="number" value={form.year} onChange={(v) => setForm((f) => ({ ...f, year: v }))} />
              <TextField label="Rating (0-5)" type="number" step="0.1" value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />

              <TextField label="Location" value={form.location} onChange={(v) => setForm((f) => ({ ...f, location: v }))} />
              <div className="flex items-center gap-2 pt-6">
                <input
                  id="available"
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
                  className="h-4 w-4 accent-[#C9A15A]"
                />
                <label htmlFor="available" className="text-sm text-ivory/80">Available for booking</label>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm text-ivory/80">Car image</label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink-600 bg-ink-800">
                    {form.image ? (
                      <img
                        src={form.image}
                        alt="Preview"
                        onError={handleImageError}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageOff className="h-5 w-5 text-muted" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={form.image?.startsWith('data:') ? '' : form.image}
                      onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                      placeholder="/image/your-car-photo.jpg or a full https:// URL"
                      className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-2.5 text-sm text-ivory placeholder:text-muted focus:border-champagne focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-full border border-ink-600 px-3 py-1.5 text-xs text-ivory/80 hover:border-champagne hover:text-champagne"
                      >
                        <Upload className="h-3.5 w-3.5" /> Upload from device
                      </button>
                      <span className="text-[11px] text-muted">JPG/PNG, under 2MB</span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-[11px] text-muted">
                      Either paste a path to a file in <code className="text-champagne">public/image/</code>{' '}
                      (e.g. <code className="text-champagne">/image/lexus-ls500.jpg</code>), paste a full image URL,
                      or upload a photo directly from your device.
                    </p>
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm text-ivory/80">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-2.5 text-sm text-ivory focus:border-champagne focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <TextField
                  label="Features (comma-separated)"
                  value={form.features}
                  onChange={(v) => setForm((f) => ({ ...f, features: v }))}
                  placeholder="Sunroof, Cruise control, Reverse camera"
                />
              </div>

              {formError && <p className="text-sm text-red-400 sm:col-span-2">{formError}</p>}

              <div className="flex gap-3 sm:col-span-2">
                <button type="submit" className="flex-1 rounded-full bg-champagne py-2.5 text-sm font-medium text-ink-950 hover:opacity-90">
                  {editingId ? 'Save Changes' : 'Add Car'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-full border border-ink-600 py-2.5 text-sm text-ivory/80 hover:border-champagne"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const selectClass =
  'w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-2.5 text-sm text-ivory focus:border-champagne focus:outline-none'

function TextField({ label, value, onChange, type = 'text', step, placeholder }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-ivory/80">{label}</label>
      <input
        type={type}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-2.5 text-sm text-ivory placeholder:text-muted focus:border-champagne focus:outline-none"
      />
    </div>
  )
}