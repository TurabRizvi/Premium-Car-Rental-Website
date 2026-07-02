import { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)

const WISHLIST_KEY = 'car-rental:wishlist'
const COMPARE_KEY = 'car-rental:compare'
const THEME_KEY = 'car-rental:theme'

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => readStorage(WISHLIST_KEY, []))
  const [compareList, setCompareList] = useState(() => readStorage(COMPARE_KEY, []))
  const [theme, setTheme] = useState(() => readStorage(THEME_KEY, 'dark'))

  useEffect(() => {
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    window.localStorage.setItem(COMPARE_KEY, JSON.stringify(compareList))
  }, [compareList])

  useEffect(() => {
    window.localStorage.setItem(THEME_KEY, theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  const toggleWishlist = (carId) => {
    setWishlist((prev) =>
      prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
    )
  }

  const toggleCompare = (carId) => {
    setCompareList((prev) => {
      if (prev.includes(carId)) return prev.filter((id) => id !== carId)
      if (prev.length >= 3) return prev
      return [...prev, carId]
    })
  }

  const clearCompare = () => setCompareList([])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <AppContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        compareList,
        toggleCompare,
        clearCompare,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}