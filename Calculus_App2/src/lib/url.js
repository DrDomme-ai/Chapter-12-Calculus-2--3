export function getAppBaseUrl() {
  // Prefer an explicit env var if provided (useful for production deployments)
  const envUrl = import.meta.env?.VITE_APP_BASE_URL
  if (envUrl) return envUrl.replace(/\/$/, '')
  // Fallback to current origin (works during local dev when accessible)
  if (typeof window !== 'undefined' && window.location && window.location.origin) return window.location.origin
  return 'http://localhost:5173'
}

export function makeJoinUrl(joinCode) {
  const base = getAppBaseUrl()
  // Student links must always use the public student route. Never expose an
  // instructor URL in a QR code, copied link, or classroom projection.
  return `${base}/#/student?code=${encodeURIComponent(String(joinCode))}`
}
