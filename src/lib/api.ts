import type {
  AccessLogRecord,
  AppSettings,
  AppUser,
  AuthResponse,
  BrandingConfig,
  PaginatedResponse,
  PlatformRecord,
} from '@/lib/platforms'

const API_BASE = '/api'
const TOKEN_KEY = 'portal-central-token'

interface RequestOptions extends RequestInit {
  auth?: boolean
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string') {
    return payload.error
  }

  return fallback
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.auth !== false) {
    const token = getStoredToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, getErrorMessage(payload, 'Não foi possível concluir a solicitação.'))
  }

  return payload as T
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return

  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token)
    return
  }

  window.localStorage.removeItem(TOKEN_KEY)
}

export const api = {
  getBranding() {
    return request<BrandingConfig>('/branding', { auth: false })
  },
  login(email: string, password: string) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ email, password }),
    })
  },
  register(name: string, email: string, password: string) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ name, email, password }),
    })
  },
  getCurrentUser() {
    return request<AppUser>('/auth/me')
  },
  updateCurrentUser(payload: { name?: string; currentPassword?: string; newPassword?: string }) {
    return request<AppUser>('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },
  getPlatforms() {
    return request<PaginatedResponse<PlatformRecord>>('/platforms?limit=100')
  },
  createPlatform(payload: Omit<PlatformRecord, 'id' | 'lastAccessed'>) {
    return request<PlatformRecord>('/platforms', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  recordPlatformAccess(id: string) {
    return request<AccessLogRecord>(`/platforms/${id}/access`, {
      method: 'POST',
    })
  },
  getLogs() {
    return request<PaginatedResponse<AccessLogRecord>>('/logs?limit=50')
  },
  getSettings() {
    return request<AppSettings>('/settings')
  },
  updateSettings(payload: Partial<AppSettings>) {
    return request<AppSettings>('/settings', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },
}
