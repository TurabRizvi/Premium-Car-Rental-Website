import { Users, ShieldCheck, MapPin, Sparkles } from 'lucide-react'

const values = [
  { icon: ShieldCheck, title: 'Vetted fleet', desc: 'Every car is inspected, insured, and serviced before it reaches you.' },
  { icon: Sparkles, title: 'Occasion-first', desc: 'We ask what the day is for, then match the car to the moment.' },
  { icon: Users, title: 'Real chauffeurs', desc: 'Trained, background-checked drivers for every luxury and wedding booking.' },
  { icon: MapPin, title: 'Nationwide', desc: 'Fleet coverage across Lahore, Islamabad, and Karachi, with more cities coming.' },
]

export default function About() {
  return (
    <div>
      <section className="border-b border-ink-700/60 bg-ink-900">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center md:px-8">
          <span className="text-xs uppercase tracking-widest text-champagne">About Us</span>
          <h1 className="mt-3 font-display text-4xl text-ivory md:text-5xl">
            We started with one wedding car — and a waiting list.
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Aurum Drive began in 2019 with a single restored vintage car booked out for wedding
            season after wedding season. Today we run a fleet spanning economy hatchbacks to
            Rolls-Royce Phantoms, built for the same idea: the car should match the occasion.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-ink-700/60 bg-ink-900 p-6">
              <v.icon className="h-5 w-5 text-champagne" strokeWidth={1.5} />
              <h3 className="mt-4 font-display text-base text-ivory">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-ink-700/60 bg-ink-900">
        <div className="mx-auto max-w-5xl px-5 py-16 md:px-8">
          <h2 className="font-display text-2xl text-ivory">How we work</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { step: 'Choose', desc: 'Browse by category, or tell us the occasion and we shortlist for you.' },
              { step: 'Book', desc: 'Pick your dates, confirm details, and lock in your rate — no hidden fees.' },
              { step: 'Ride', desc: 'Your car (and chauffeur, if booked) arrives ready for the day.' },
            ].map((s, i) => (
              <div key={s.step} className="rounded-2xl border border-ink-700/60 bg-ink-950 p-6">
                <span className="font-display text-2xl text-champagne">0{i + 1}</span>
                <h3 className="mt-3 font-display text-lg text-ivory">{s.step}</h3>
                <p className="mt-2 text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
