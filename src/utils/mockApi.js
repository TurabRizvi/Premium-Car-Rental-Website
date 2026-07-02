import axios from 'axios'
import { applyOverrides, editCar } from './adminStore'

const DELAY = 550
const DATA_URL = '/data/cars.json'

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Cache the base dataset in memory after the first successful fetch, so we
// don't re-request the static JSON on every navigation. Admin overrides are
// re-applied on every call, so edits still show up immediately.
let cachedBaseCars = null

async function loadBaseCars() {
  if (cachedBaseCars) return cachedBaseCars
  const response = await axios.get(DATA_URL)
  cachedBaseCars = response.data
  return cachedBaseCars
}

/**
 * Simulates a network request to fetch all cars via axios, with an
 * artificial delay so loading states are visible.
 * Force an error to test the error/retry UI:
 *   localStorage.setItem('car-rental:force-error', '1')
 */
export async function fetchCars() {
  const [baseCars] = await Promise.all([loadBaseCars(), wait(DELAY)])
  if (window.localStorage.getItem('car-rental:force-error') === '1') {
    throw new Error('Unable to reach the fleet server. Please try again.')
  }
  return applyOverrides(baseCars)
}

export async function fetchCarById(id) {
  const [baseCars] = await Promise.all([loadBaseCars(), wait(DELAY)])
  const car = applyOverrides(baseCars).find((c) => c.id === id)
  if (!car) {
    throw new Error('Car not found.')
  }
  return car
}

export async function fetchRawBaseCars() {
  return loadBaseCars()
}

export async function submitBooking(payload) {
  await wait(700)

  // Mark the car unavailable so it immediately shows as "Currently Booked"
  // everywhere (car cards, details, admin table) — same mechanism the admin
  // dashboard uses, so a real booking behaves the same as an admin edit.
  try {
    const baseCars = await loadBaseCars()
    const isAdded = !baseCars.some((c) => c.id === payload.carId)
    editCar(payload.carId, { available: false }, isAdded)
  } catch {
    // Non-fatal: the booking still succeeds even if this fails.
  }

  return {
    success: true,
    bookingId: `CFB-${Date.now().toString().slice(-8)}`,
    ...payload,
  }
}