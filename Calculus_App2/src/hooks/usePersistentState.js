import { useEffect, useState } from 'react'

const STORAGE_MARKER = 'interactive-calculus:persistent-state'
const UNSAFE_OBJECT_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false

  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

/**
 * Recursively overlays persisted plain-object values on current defaults.
 * Arrays and non-object values are treated as complete values rather than
 * merged, while newly introduced default keys remain available.
 */
export function mergePersistentDefaults(defaultValue, persistedValue) {
  if (!isPlainObject(defaultValue) || !isPlainObject(persistedValue)) {
    return persistedValue === undefined ? defaultValue : persistedValue
  }

  const merged = { ...defaultValue }

  Object.entries(persistedValue).forEach(([key, value]) => {
    if (UNSAFE_OBJECT_KEYS.has(key)) return

    merged[key] = Object.hasOwn(defaultValue, key)
      ? mergePersistentDefaults(defaultValue[key], value)
      : value
  })

  return merged
}

function resolveDefault(defaultValue) {
  return typeof defaultValue === 'function' ? defaultValue() : defaultValue
}

function resolveStorage(providedStorage) {
  if (providedStorage) return providedStorage
  if (typeof window === 'undefined') return null

  // Accessing localStorage itself can throw when storage is blocked.
  return window.localStorage
}

function reportPersistenceError(onError, error, phase, storageKey) {
  if (typeof onError !== 'function') return

  try {
    onError(error, { phase, storageKey })
  } catch {
    // Persistence must never break rendering, even if an error reporter fails.
  }
}

function isStorageEnvelope(value) {
  return (
    isPlainObject(value) &&
    value.marker === STORAGE_MARKER &&
    Object.hasOwn(value, 'version') &&
    Object.hasOwn(value, 'value')
  )
}

function applyDefaultMerge(defaultValue, persistedValue, mergeDefaults) {
  if (typeof mergeDefaults === 'function') {
    return mergeDefaults(defaultValue, persistedValue)
  }

  return mergeDefaults
    ? mergePersistentDefaults(defaultValue, persistedValue)
    : persistedValue
}

function readPersistentValue(storageKey, defaultValue, options) {
  const {
    acceptLegacy,
    mergeDefaults,
    migrate,
    onError,
    storage: providedStorage,
    validate,
    version,
  } = options

  if (typeof storageKey !== 'string' || storageKey.trim() === '') {
    return defaultValue
  }

  try {
    const storage = resolveStorage(providedStorage)
    if (!storage) return defaultValue

    const rawValue = storage.getItem(storageKey)
    if (rawValue === null) return defaultValue

    const parsedValue = JSON.parse(rawValue)
    let persistedValue

    if (isStorageEnvelope(parsedValue)) {
      if (parsedValue.version === version) {
        persistedValue = parsedValue.value
      } else if (typeof migrate === 'function') {
        persistedValue = migrate(parsedValue.value, parsedValue.version, version)
      } else {
        return defaultValue
      }
    } else if (acceptLegacy) {
      persistedValue =
        typeof migrate === 'function'
          ? migrate(parsedValue, 0, version)
          : parsedValue
    } else {
      return defaultValue
    }

    if (persistedValue === undefined) return defaultValue
    if (typeof validate === 'function' && !validate(persistedValue)) {
      return defaultValue
    }

    return applyDefaultMerge(defaultValue, persistedValue, mergeDefaults)
  } catch (error) {
    reportPersistenceError(onError, error, 'read', storageKey)
    return defaultValue
  }
}

/**
 * A useState-compatible hook backed by a versioned localStorage envelope.
 *
 * The hook safely falls back to `defaultValue` during SSR, when storage is
 * unavailable, when JSON is invalid, or when a stored version has no migrant.
 * By default, persisted object values are recursively merged over defaults so
 * new progress categories can be introduced without deleting existing work.
 *
 * Options:
 * - version: schema version written with the value (default: 1)
 * - migrate: (storedValue, storedVersion, currentVersion) => currentValue
 * - validate: (storedValue) => boolean
 * - mergeDefaults: boolean or custom (defaults, stored) => value (default: true)
 * - acceptLegacy: accept unwrapped JSON written before versioning (default: true)
 * - storage: optional Storage-compatible adapter (useful for tests)
 * - onError: (error, { phase, storageKey }) => void
 */
export function usePersistentState(storageKey, defaultValue, options = {}) {
  const {
    acceptLegacy = true,
    mergeDefaults = true,
    migrate,
    onError,
    storage,
    validate,
    version = 1,
  } = options

  const [state, setState] = useState(() => {
    const resolvedDefault = resolveDefault(defaultValue)

    return readPersistentValue(storageKey, resolvedDefault, {
      acceptLegacy,
      mergeDefaults,
      migrate,
      onError,
      storage,
      validate,
      version,
    })
  })

  useEffect(() => {
    if (typeof storageKey !== 'string' || storageKey.trim() === '') return

    try {
      const resolvedStorage = resolveStorage(storage)
      if (!resolvedStorage) return

      const serializedValue = JSON.stringify({
        marker: STORAGE_MARKER,
        version,
        value: state,
      })

      resolvedStorage.setItem(storageKey, serializedValue)
    } catch (error) {
      reportPersistenceError(onError, error, 'write', storageKey)
    }
  }, [onError, state, storage, storageKey, version])

  return [state, setState]
}

export default usePersistentState
