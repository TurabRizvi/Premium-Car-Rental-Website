const OVERRIDES_KEY = 'car-rental:admin-overrides'

function readOverrides() {
  try {
    const raw = window.localStorage.getItem(OVERRIDES_KEY)
    return raw ? JSON.parse(raw) : { added: [], edited: {}, deleted: [] }
  } catch {
    return { added: [], edited: {}, deleted: [] }
  }
}

function writeOverrides(overrides) {
  window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides))
}

/** Merge base dataset with admin overrides (added/edited/deleted cars). */
export function applyOverrides(baseCars) {
  const { added, edited, deleted } = readOverrides()
  const base = baseCars
    .filter((c) => !deleted.includes(c.id))
    .map((c) => (edited[c.id] ? { ...c, ...edited[c.id] } : c))
  return [...base, ...added]
}

export function addCar(car) {
  const overrides = readOverrides()
  overrides.added.push(car)
  writeOverrides(overrides)
}

export function editCar(id, changes, isAdded) {
  const overrides = readOverrides()
  if (isAdded) {
    overrides.added = overrides.added.map((c) => (c.id === id ? { ...c, ...changes } : c))
  } else {
    overrides.edited[id] = { ...(overrides.edited[id] || {}), ...changes }
  }
  writeOverrides(overrides)
}

export function deleteCar(id, isAdded) {
  const overrides = readOverrides()
  if (isAdded) {
    overrides.added = overrides.added.filter((c) => c.id !== id)
  } else if (!overrides.deleted.includes(id)) {
    overrides.deleted.push(id)
  }
  writeOverrides(overrides)
}

export function resetOverrides() {
  writeOverrides({ added: [], edited: {}, deleted: [] })
}

export function getOverrides() {
  return readOverrides()
}
