import { useEffect, useState } from 'react'
import { ApiError, api, setStoredToken } from '@/lib/api'
import {
  type AccessLog,
  type AppSettings,
  type AppUser,
  type BrandingConfig,
  type NavigationPreference,
  type Platform,
  type PlatformRecord,
  getDefaultBranding,
  getDefaultSettings,
  mapAccessLog,
  mapPlatform,
} from '@/lib/platforms'

type ProfileUpdateInput = {
  name?: string
  currentPassword?: string
  newPassword?: string
}

let globalSearchQuery = ''
let globalPlatforms: Platform[] = []
let globalLogs: AccessLog[] = []
let globalBranding: BrandingConfig = getDefaultBranding()
let globalSettings: AppSettings = getDefaultSettings()
let globalUser: AppUser | null = null
let globalIsLoading = true
let globalIsReady = false
let globalIsAuthSubmitting = false
let globalError: string | null = null
let listeners: Array<() => void> = []
let initPromise: Promise<void> | null = null

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Não foi possível carregar os dados do portal.'
}

function resetProtectedState() {
  globalPlatforms = []
  globalLogs = []
  globalSettings = getDefaultSettings()
  globalUser = null
}

async function loadBranding() {
  try {
    globalBranding = await api.getBranding()
  } catch {
    globalBranding = getDefaultBranding()
  }
}

async function loadProtectedData() {
  try {
    const [user, settings, platformsResponse, logsResponse] = await Promise.all([
      api.getCurrentUser(),
      api.getSettings(),
      api.getPlatforms(),
      api.getLogs(),
    ])

    globalUser = user
    globalSettings = settings
    globalPlatforms = platformsResponse.data.map(mapPlatform)
    globalLogs = logsResponse.data.map(mapAccessLog)
    globalError = null
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      setStoredToken(null)
      resetProtectedState()
      globalError = null
      return
    }

    resetProtectedState()
    globalError = getErrorMessage(error)
  }
}

async function refreshData() {
  globalIsLoading = true
  notifyListeners()

  await loadBranding()
  await loadProtectedData()

  globalIsLoading = false
  globalIsReady = true
  notifyListeners()
}

function ensureInitialized() {
  if (!initPromise) {
    initPromise = refreshData()
  }

  return initPromise
}

ensureInitialized()

async function authenticate(
  mode: 'login' | 'register',
  payload: { name?: string; email: string; password: string },
) {
  globalIsAuthSubmitting = true
  globalError = null
  notifyListeners()

  try {
    const response =
      mode === 'login'
        ? await api.login(payload.email, payload.password)
        : await api.register(payload.name ?? '', payload.email, payload.password)

    setStoredToken(response.token)
    initPromise = refreshData()
    await initPromise
  } finally {
    globalIsAuthSubmitting = false
    notifyListeners()
  }
}

async function patchSettings(payload: Partial<AppSettings>) {
  const previous = globalSettings
  globalSettings = { ...globalSettings, ...payload }
  notifyListeners()

  try {
    globalSettings = await api.updateSettings(payload)
    notifyListeners()
  } catch (error) {
    globalSettings = previous
    notifyListeners()
    throw error
  }
}

async function appendPlatform(record: Omit<PlatformRecord, 'id' | 'lastAccessed'>) {
  const created = await api.createPlatform(record)
  globalPlatforms = [mapPlatform(created), ...globalPlatforms]
  notifyListeners()
}

async function updateProfile(payload: ProfileUpdateInput) {
  globalUser = await api.updateCurrentUser(payload)
  notifyListeners()
}

async function recordPlatformAccess(platformId: string) {
  const log = await api.recordPlatformAccess(platformId)
  globalLogs = [mapAccessLog(log), ...globalLogs]
  globalPlatforms = globalPlatforms.map((platform) =>
    platform.id === platformId ? { ...platform, lastAccessed: 'Agora mesmo' } : platform,
  )
  notifyListeners()
}

export const useAppStore = () => {
  const [, setTick] = useState(0)

  useEffect(() => {
    const listener = () => setTick((tick) => tick + 1)
    listeners.push(listener)

    return () => {
      listeners = listeners.filter((item) => item !== listener)
    }
  }, [])

  const filteredPlatforms = globalPlatforms.filter((platform) => {
    const query = globalSearchQuery.trim().toLowerCase()
    if (!query) return true

    return (
      platform.name.toLowerCase().includes(query) ||
      platform.category.toLowerCase().includes(query) ||
      platform.description.toLowerCase().includes(query)
    )
  })

  return {
    searchQuery: globalSearchQuery,
    setSearchQuery: (query: string) => {
      globalSearchQuery = query
      notifyListeners()
    },
    platforms: filteredPlatforms,
    allPlatforms: globalPlatforms,
    logs: globalLogs,
    branding: globalBranding,
    user: globalUser,
    settings: globalSettings,
    navigationPreference: globalSettings.navigationPreference,
    notificationsEnabled: globalSettings.notificationsEnabled,
    theme: globalSettings.theme,
    isLoading: globalIsLoading,
    isReady: globalIsReady,
    isAuthenticated: Boolean(globalUser),
    isAuthSubmitting: globalIsAuthSubmitting,
    error: globalError,
    retryFetch: () => {
      initPromise = refreshData()
    },
    signIn: (email: string, password: string) => authenticate('login', { email, password }),
    register: (name: string, email: string, password: string) =>
      authenticate('register', { name, email, password }),
    signOut: () => {
      setStoredToken(null)
      globalSearchQuery = ''
      globalError = null
      resetProtectedState()
      globalIsLoading = false
      globalIsReady = true
      notifyListeners()
    },
    setNavigationPreference: (preference: NavigationPreference) =>
      patchSettings({ navigationPreference: preference }),
    setNotificationsEnabled: (notificationsEnabled: boolean) =>
      patchSettings({ notificationsEnabled }),
    updateProfile,
    addPlatform: appendPlatform,
    recordPlatformAccess,
  }
}
