import { useEffect, useState, useCallback } from 'react'
import { fetchCars } from '../utils/mockApi'

export function useCars() {
  const [cars, setCars] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    setStatus('loading')
    setError(null)
    fetchCars()
      .then((data) => {
        setCars(data)
        setStatus('success')
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong.')
        setStatus('error')
      })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { cars, status, error, reload: load }
}
