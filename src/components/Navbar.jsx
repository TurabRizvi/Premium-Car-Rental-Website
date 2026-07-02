import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Heart, Moon, Sun, Car } from 'lucide-react'
import { useApp } from '../context/AppContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/cars', label: 'Cars' },
  { to: '/wedding-collection', label: 'Wedding Collection' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { wishlist, theme, toggleTheme } = useApp()

  const linkClass = ({ isActive }) =>
    `text-sm tracking-wide transition-colors ${
      isActive ? 'text-champagne' : 'text-ivory/70 hover:text-ivory'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-ink-700/60 bg-ink-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <NavLink to="/" className="flex items-center gap-2 font-display text-xl text-ivory">
          <Car className="h-5 w-5 text-champagne" strokeWidth={1.5} />
          <span>
            Aur<span className="text-champagne">um</span> Drive
          </span>
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="hidden rounded-full border border-ink-600 p-2 text-ivory/70 transition-colors hover:text-champagne md:inline-flex"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <NavLink
            to="/wishlist"
            className="relative hidden rounded-full border border-ink-600 p-2 text-ivory/70 transition-colors hover:text-champagne md:inline-flex"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4" />
            {wishlist.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-champagne text-[10px] font-semibold text-ink-950">
                {wishlist.length}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/cars"
            className="hidden rounded-full bg-champagne px-4 py-2 text-sm font-medium text-ink-950 transition-opacity hover:opacity-90 md:inline-block"
          >
            Book Now
          </NavLink>

          <button
            className="text-ivory md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-ink-700/60 bg-ink-950 px-5 pb-5 pt-3 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm ${
                  isActive ? 'bg-ink-800 text-champagne' : 'text-ivory/80'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/wishlist"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-ivory/80"
          >
            Wishlist {wishlist.length > 0 && <span className="text-champagne">{wishlist.length}</span>}
          </NavLink>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-ivory/80"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            Toggle theme
          </button>
        </nav>
      )}
    </header>
  )
}
