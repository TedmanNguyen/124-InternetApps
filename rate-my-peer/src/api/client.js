// Single place for HTTP. Every API helper goes through `request`.
// - Adds the JWT bearer token to every call.
// - Throws a real Error with a useful message on non-2xx so callers can `try/catch`.
// - Returns parsed JSON.

const TOKEN_KEY = 'rmp_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getToken()
  const res = await fetch(path.startsWith('/') ? path : `/api/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    // empty body is fine for 204
  }

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

// Thin wrappers — every endpoint we built.
export const api = {
  auth: {
    signup: (payload) => request('/api/auth/signup', { method: 'POST', body: payload }),
    login: (payload) => request('/api/auth/login', { method: 'POST', body: payload }),
    me: () => request('/api/auth/me'),
  },
  students: {
    list: (q = '') => request(`/api/students${q ? `?q=${encodeURIComponent(q)}` : ''}`),
    get: (id) => request(`/api/students/${id}`),
    getByName: name => request(`/api/students/name/${encodeURIComponent(name)}`),
    getByEmail: email => request(`/api/students/email/${encodeURIComponent(email)}`),
    create: (payload) => request('/api/students', { method: 'POST', body: payload }),
    update: (id, payload) => request(`/api/students/${id}`, { method: 'PATCH', body: payload })
    // reviewsReceived: (id) => request(`/api/students/${id}/reviews`),
    // reviewsGiven: (id) => request(`/api/students/${id}/reviews/given`),
  },
  reviews: {
    listAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString()
      return request(`/api/reviews${qs ? `?${qs}` : ''}`)
    },
    create: (payload) => request('/api/reviews', { method: 'POST', body: payload }),
    remove: (id) => request(`/api/reviews/${id}`, { method: 'DELETE' }),
    vote: (id, value) => request(`/api/reviews/${id}/vote`, { method: 'POST', body: { value } }),
    readByReviewerId: (reviewerId) => request(`/api/reviews/reviewer/${reviewerId}`),
    readByRevieweeId: (revieweeId) => request(`/api/reviews/reviewee/${revieweeId}`)
  },
  reports: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString()
      return request(`/api/reports${qs ? `?${qs}` : ''}`)
    },
    create: (payload) => request('/api/reports', { method: 'POST', body: payload }),
    updateStatus: (id, status) => request(`/api/reports/${id}`, { method: 'PATCH', body: { status } }),
    remove: (id) => request(`/api/reports/${id}`, { method: 'DELETE' }),
  },
  faqs: {
    list: () => request('/api/faqs'),
  },
}
