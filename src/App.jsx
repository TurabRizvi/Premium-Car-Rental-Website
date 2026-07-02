import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import CarsListing from './pages/CarsListing'
import CarDetails from './pages/CarDetails'
import WeddingCollection from './pages/WeddingCollection'
import Booking from './pages/Booking'
import About from './pages/About'
import Contact from './pages/Contact'
import Wishlist from './pages/Wishlist'
import Compare from './pages/Compare'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AppProvider>
      <div className="flex min-h-screen flex-col bg-ink-950 font-body text-ivory">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<CarsListing />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/wedding-collection" element={<WeddingCollection />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AppProvider>
  )
}
