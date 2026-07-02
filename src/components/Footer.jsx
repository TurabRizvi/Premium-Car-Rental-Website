import { Link } from 'react-router-dom'
import { Car, Camera, Users2, MessageCircle } from 'lucide-react'
import { categories } from '../data/categories'

export default function Footer() {
  return (
    <footer className="border-t border-ink-700/60 bg-ink-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div>
          <div className="flex items-center gap-2 font-display text-lg text-ivory">
            <Car className="h-5 w-5 text-champagne" strokeWidth={1.5} />
            <span>
              Aur<span className="text-champagne">um</span> Drive
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Premium and wedding car rentals across Pakistan — from vintage Rolls-Royce arrivals to
            everyday economy hire.
          </p>
          <div className="mt-5 flex gap-3">
            {[Camera, Users2, MessageCircle].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="rounded-full border border-ink-600 p-2 text-ivory/60 transition-colors hover:border-champagne hover:text-champagne"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-champagne">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><Link to="/cars" className="hover:text-ivory">All Cars</Link></li>
            <li><Link to="/wedding-collection" className="hover:text-ivory">Wedding Collection</Link></li>
            <li><Link to="/about" className="hover:text-ivory">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-ivory">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-champagne">Categories</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {categories.slice(0, 5).map((c) => (
              <li key={c.name}>
                <Link to={`/cars?category=${encodeURIComponent(c.name)}`} className="hover:text-ivory">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-champagne">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>Gulberg III, Lahore, Pakistan</li>
            <li>+92 300 1234567</li>
            <li>hello@aurumdrive.pk</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-700/60 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Aurum Drive. Built as a technical assessment project. ·{' '}
        <Link to="/admin" className="hover:text-champagne">Admin</Link>
      </div>
    </footer>
  )
}
