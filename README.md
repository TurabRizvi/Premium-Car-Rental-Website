# Aurum Drive - Premium Car Rental Website

A modern, responsive car rental front end built with React and Vite, submitted as a technical
assessment project. Covers standard rentals (economy through SUVs and EVs) alongside a dedicated
Wedding Collection (vintage cars, Rolls-Royce, Bentley, Mercedes-Benz, BMW, Audi, stretch
limousines, and exotic supercars).

## Live Demo

https://premium-car-rental-website-lovat.vercel.app

## Tech Stack

- React 19 + Vite - app shell and build tooling
- React Router v6 - routing (/, /cars, /cars/:id, /wedding-collection, /booking/:id, /about,
  /contact, /wishlist, /compare, /admin, and a catch-all 404)
- Tailwind CSS v3 - styling, with a custom dark/champagne design system and a working light mode
- Axios - data fetching from the mock JSON API
- lucide-react - icons
- Mock API layer (src/utils/mockApi.js) - simulates an async network request with artificial
  delay, backed by public/data/cars.json (23 cars across all 9 required categories)

## Features

### Required

- Fully responsive design (mobile nav, responsive grids down to small screens)
- React Router with dynamic routes (/cars/:id, /booking/:id)
- Search by name, brand, or category on the Cars page
- Filter by category (dropdown, category tiles on Home, and deep links from the footer)
- Sort by price (ascending/descending) and by rating
- Dynamic car data served through a mock async API with loading and error states, including a
  retry button
- Detailed car page with gallery, specs, features, and live availability
- Booking form with full client-side validation (name, email, phone, dates, location) and a
  confirmation screen with a generated booking reference
- Custom 404 page
- Clean, reusable components (CarCard, CarFilters, LoadingState, ErrorState, Navbar, Footer,
  AvailabilityCalendar)

### Bonus

- Wishlist, persisted to localStorage, accessible from every car card and the navbar
- Compare cars, up to 3 at a time, with a side-by-side spec table
- Dark mode and light mode toggle, persisted across sessions
- Availability Calendar on the booking page, with deterministic per-car booked days and
  click-to-select date range, kept in sync with the manual date inputs
- Admin Dashboard with full Add / Edit / Delete on the fleet, including image upload, gated by a
  demo passcode, with a logout button and a reset-to-default option

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

    git clone https://github.com/TurabRizvi/Premium-Car-Rental-Website.git
    cd car-rental
    npm install
    npm run dev

The app runs at http://localhost:5173

### Build for production

    npm run build
    npm run preview

## Project Structure

    public/
      data/cars.json       Single source of truth for all car data, fetched via axios
      image/                Local car photos, referenced by cars.json
    src/
      components/           Reusable UI: Navbar, Footer, CarCard, CarFilters, LoadingState,
                             ErrorState, AvailabilityCalendar
      context/               AppContext - wishlist, compare list, theme (persisted to localStorage)
      data/                  categories.js - category metadata
      hooks/                 useCars.js - data-fetching hook with loading, error, and reload
      pages/                 Home, CarsListing, CarDetails, WeddingCollection, Booking, About,
                             Contact, Wishlist, Compare, AdminDashboard, NotFound
      utils/                 mockApi.js (axios-backed mock API), adminStore.js (localStorage CRUD
                             overlay), imageFallback.js (broken-image placeholder)

## How to Test

Run npm run dev first, then work through the list below. Everything here is meant to be checked
manually since there is no backend to inspect.

### Pages and routing

- Visit each of: Home, Cars Listing, a Car Details page, Booking, About, Contact
- Visit a route that does not exist (e.g. /nothing-here) and confirm the custom 404 page appears
  with a working link back to Home

### Search, filter, and sort

- Go to /cars and type a car name, brand, or category into the search box; the grid should
  narrow live
- Use the category dropdown to filter to a single category; the result count text should update
- Change the sort dropdown between price low-to-high, price high-to-low, and rating; the order
  of cards should change accordingly
- From another page, click a category link in the footer while you are already on /cars, and
  confirm the filtered results actually change (not just the URL)

### Loading and error states

- Refresh any data-driven page (Home, Cars, Car Details, Wedding Collection, Wishlist, Compare)
  and you should briefly see skeleton loading placeholders before the real content appears
- To force an error state, open the browser console and run:

      localStorage.setItem('car-rental:force-error', '1')

  then refresh the page. You should see a clear error message with a "Try again" button. Run
  localStorage.removeItem('car-rental:force-error') and refresh again to restore normal loading.

### Car details and booking

- Open any car's details page and confirm specs, features, and the gallery (if more than one
  image) all display correctly
- Click "Book This Car" and fill out the booking form
- Try submitting with an invalid email, an invalid phone number, a return date before the pickup
  date, or a past pickup date - each should show a specific validation message and block
  submission
- Use the availability calendar on the booking page to click a date instead of typing one, and
  confirm the manual date fields update to match. Also type a date manually into the pickup
  field and confirm the calendar jumps to show that month.
- Submit a valid booking and confirm you land on a confirmation screen with a generated booking
  reference
- Go back to the Cars listing or that car's details page afterward - the car should now show as
  "Currently Booked" everywhere, since a completed booking marks it unavailable

### Wishlist

- Click the heart icon on any car card; it should fill in and the navbar's wishlist counter
  should increase
- Visit /wishlist and confirm the car appears there
- Remove it by clicking the heart icon again (from either the card or the wishlist page) and
  confirm it disappears
- Refresh the page and confirm your wishlist survives, since it is stored in localStorage

### Compare

- Click the compare icon (the two-arrows icon next to the price) on 2 to 3 different car cards
- Visit /compare and confirm a side-by-side table appears with one column per car and rows for
  category, price, seats, transmission, fuel, year, rating, and location
- Try adding a 4th car to compare; it should be ignored, since the limit is 3
- Remove a car directly from the table using the X on its thumbnail, and try "Clear all"
- Visit /compare with nothing selected and confirm a friendly empty state appears instead of a
  blank page

### Dark mode and light mode

- Click the sun/moon icon in the navbar (desktop) or the "Toggle theme" row in the mobile menu
- Confirm the entire site switches between a dark champagne theme and a light cream theme,
  including backgrounds, text, and borders, not just a partial change
- Refresh the page and confirm your theme choice persists

### Admin Dashboard

- Visit /admin (also linked at the very bottom of the footer)
- Enter the demo passcode: admin123
- Add a new car using the "Add Car" button, filling in at least name, brand, price per day, and
  location
- Edit an existing car and change its price or availability toggle
- Try the three ways to set a car's image: paste a path like /image/lexus-ls500.png, paste a
  full https:// URL, or click "Upload from device" and pick a photo from your computer - each
  should update the live preview thumbnail
- Delete a car and confirm it disappears from the table and from the public-facing Cars listing
- Mark a car as unavailable and confirm its card shows "Currently Booked" across the site
- Click "Reset demo data" and confirm everything reverts to the original 23-car dataset
- Click "Logout" and confirm you are returned to the passcode screen

## Admin Dashboard Details

Changes made in the Admin Dashboard are written to localStorage as an overlay on top of the base
dataset in public/data/cars.json. This means:

- They persist across page reloads in your browser
- They show up immediately in the listing, details, wishlist, and compare views
- They do not sync to other visitors or devices, since there is no real backend
- "Reset demo data" clears all admin changes back to the original 23-car dataset

This is intentionally a client-only simulation for the assessment. A production version would
replace adminStore.js with real authenticated API calls and actual file storage.

## Image Sourcing

Car photos are served locally from public/image/. The exact filenames each car expects are
listed in public/image/README.txt. If a file has not been added yet, the site shows a subtle
placeholder icon instead of a broken image, so nothing looks broken mid-setup.

All car data, including image paths, lives in a single file: public/data/cars.json. This is
fetched via axios at runtime, so editing that file (or using the Admin Dashboard) is enough to
update the whole site with no other code changes required.

## Deployment

### Vercel

1. Push this repository to GitHub.
2. Import it in Vercel. Framework preset: Vite. Build command: npm run build. Output directory: dist.
3. Deploy.

### Netlify

1. Push this repository to GitHub.
2. New site from Git. Build command: npm run build. Publish directory: dist.
3. Deploy.

All data is served from local static files, so no environment variables or backend setup are
required for deployment.

## Future Improvements

- Replace the localStorage admin overlay with a real backend and proper authentication, so fleet
  changes persist for all visitors
- Show real per-day pricing or seasonal rates instead of a flat daily rate
- Add automated tests (Vitest and React Testing Library) for booking form validation
