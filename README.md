# Aurum Drive — Premium Car Rental Website

A modern, responsive car rental front end built with **React + Vite**, submitted as a technical
assessment project. Covers standard rentals (economy through SUVs and EVs) alongside a dedicated
**Wedding Collection** (vintage cars, Rolls-Royce, Bentley, Mercedes-Benz, BMW, Audi, stretch
limousines, and exotic supercars).

## Live Demo
https://premium-car-rental-website-lovat.vercel.app

## Tech Stack

- **React 19 + Vite** — app shell and build tooling
- **React Router v6** — routing (`/`, `/cars`, `/cars/:id`, `/wedding-collection`,
  `/booking/:id`, `/about`, `/contact`, `/wishlist`, `/compare`, and a catch-all 404)
- **Tailwind CSS v3** — styling, with a custom dark/champagne design system + light mode
- **lucide-react** — icons
- **Mock API layer** (`src/utils/mockApi.js`) — simulates async fetch with artificial delay,
  backed by `src/data/cars.json` (20 cars across all 9 required categories)

## Features

### Required
- Fully responsive (mobile nav, responsive grids down to 320px)
- React Router with dynamic routes (`/cars/:id`, `/booking/:id`)
- Search (by name, brand, category) on the Cars page
- Filter by category (dropdown + category tiles on Home + footer/URL deep links)
- Sort by price (asc/desc) and by rating
- Dynamic car data served through a mock async API (loading + error states, retry button)
- Detailed car page (gallery, specs, features, availability)
- Booking form with full client-side validation (name, email, phone, dates, location) and a
  confirmation screen with a generated booking reference
- Custom 404 page
- Clean, reusable components (CarCard, CarFilters, LoadingState, ErrorState, Navbar, Footer)

### Bonus
- Wishlist (persisted to localStorage, heart icon on every card)
- Compare cars (up to 3 side by side, spec table)
- Dark mode / light mode toggle (persisted)
- Availability Calendar — visual month calendar on the booking page. Each car has
  deterministic "already booked" days (so refreshing shows the same pattern), click a day to
  set pickup, click a later day to set return; wired into the same validation as the manual
  date inputs
- Admin Dashboard — full Add / Edit / Delete on the fleet at `/admin` (linked at the bottom of
  the footer). Gated by a demo passcode (`admin123`, shown on the gate screen itself). Changes
  are stored in the browser's localStorage as an overlay on top of the base JSON dataset, so
  they persist across reloads and appear everywhere in the app (listing, details, wishlist,
  compare) without needing a real backend. A "Reset demo data" button clears all admin changes.

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

    git clone <(https://github.com/TurabRizvi/Premium-Car-Rental-Website.git)>
    cd car-rental
    npm install
    npm run dev

The app runs at http://localhost:5173

### Build for production

    npm run build
    npm run preview

## Project Structure

    src/
      components/     Reusable UI (Navbar, Footer, CarCard, CarFilters, LoadingState,
                      ErrorState, AvailabilityCalendar)
      context/        AppContext - wishlist, compare list, theme (persisted to localStorage)
      data/           cars.json (mock dataset), categories.js (category metadata)
      hooks/          useCars.js - data-fetching hook with loading/error/reload
      pages/          Home, CarsListing, CarDetails, WeddingCollection, Booking, About,
                      Contact, Wishlist, Compare, AdminDashboard, NotFound
      utils/          mockApi.js (simulated async API), adminStore.js (localStorage CRUD overlay)

## Admin Dashboard

Visit `/admin` (linked at the bottom of the footer) and enter the demo passcode `admin123`.
From there you can add, edit, or delete cars, and log out via the button in the header. Changes
are written to `localStorage` as an overlay on top of the static `cars.json`, so:

- They persist across page reloads in your browser
- They show up immediately in the listing, details, wishlist, and compare views
- They do **not** sync to other visitors/devices — there's no real backend
- "Reset demo data" on the dashboard clears all admin changes back to the original 23-car dataset

**Changing a car's image from the dashboard:** each add/edit form has an image field with a live
preview. You can either type a path to a file in `public/image/` (e.g. `/image/lexus-ls500.jpg`),
paste a full `https://` URL, or click "Upload from device" to pick a photo directly from your
computer — it's read in-browser and stored as the image for that car (under 2MB, JPG/PNG).
Uploaded images are stored as part of that browser's `localStorage`, same as other admin edits.

This is intentionally a client-only simulation for the assessment. A production version would
replace `adminStore.js` with real authenticated API calls and actual file storage.

## Image Sourcing

Car photos are served locally from `public/image/`. Drop your own photos there using the exact
filenames listed in `public/image/README.txt` (e.g. `rr-phantom.jpg` for the Rolls-Royce
Phantom) — no code changes needed, just refresh the app. If a file hasn't been added yet, the
site shows a gold placeholder icon instead of a broken image, so nothing looks broken mid-setup.

You can also change any car's image directly from the Admin Dashboard — either paste a path/URL,
or use "Upload from device" to pick a photo straight from your computer (stored as the car's
image for that browser session, see Admin Dashboard section below).

## Testing the error state

The mock API can be forced to throw, to demonstrate the error/retry UI. In the browser console:

    localStorage.setItem('car-rental:force-error', '1')
    // then refresh the page
    localStorage.removeItem('car-rental:force-error')

## Deployment

### Vercel
1. Push this repo to GitHub.
2. Import it in Vercel. Framework preset: Vite. Build command: npm run build. Output directory: dist.
3. Deploy.

### Netlify
1. Push this repo to GitHub.
2. New site from Git. Build command: npm run build. Publish directory: dist.
3. Deploy.

All data is a local mock JSON file (no real backend), so no environment variables are needed.

## Future Improvements

- Replace the localStorage admin overlay with a real backend (json-server or a small API) and
  proper authentication, so fleet changes persist for all visitors
- Show real per-day pricing or seasonal rates instead of a flat daily rate
- Add automated tests (Vitest + React Testing Library) for booking form validation
