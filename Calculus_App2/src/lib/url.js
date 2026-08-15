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
  // Use hash route for SPA compatibility: /#/join/<code>
  return `${base}/#/join/${encodeURIComponent(String(joinCode))}`
}
