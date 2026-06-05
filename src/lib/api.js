const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

export function getStoredToken() {
  return localStorage.getItem('bolsa-token') || ''
}

export function setStoredToken(token) {
  localStorage.setItem('bolsa-token', token)
}

export function clearStoredToken() {
  localStorage.removeItem('bolsa-token')
}

export async function requestJSON(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'La petición falló.'
    throw new Error(message)
  }

  return payload
}

export async function requestText(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  const text = await response.text()

  if (!response.ok) {
    try {
      const payload = text ? JSON.parse(text) : null
      const message = payload?.message || payload?.error || 'La petición falló.'
      throw new Error(message)
    } catch {
      throw new Error(text || 'La petición falló.')
    }
  }

  return text
}

