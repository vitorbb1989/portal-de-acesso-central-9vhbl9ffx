import {
  Activity,
  BarChart3,
  Box,
  Cloud,
  Code2,
  Command,
  Database,
  Globe,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Server,
  Shield,
  Terminal,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type PlatformStatus = 'online' | 'warning' | 'offline'
export type PlatformOpenMode = 'default' | 'new_tab' | 'internal'
export type NavigationPreference = 'default' | 'always_new_tab' | 'always_internal'
export type ThemePreference = 'light' | 'dark' | 'system'
export type UserRole = 'ADMIN' | 'USER'

export interface PlatformRecord {
  id: string
  name: string
  description: string
  category: string
  status: PlatformStatus
  icon?: string | null
  color?: string | null
  lastAccessed?: string | null
  url: string
  hasAccess?: boolean
  openMode?: PlatformOpenMode
}

export interface Platform {
  id: string
  name: string
  description: string
  category: string
  status: PlatformStatus
  icon: LucideIcon
  iconName: string
  color?: string
  lastAccessed?: string
  url: string
  hasAccess: boolean
  openMode: PlatformOpenMode
}

export interface AccessLogRecord {
  id: string
  userName: string
  platformName: string
  timestamp: string
  ip: string
}

export interface AccessLog {
  id: string
  user: string
  platform: string
  timestamp: string
  ip: string
}

export interface BrandingConfig {
  name: string
  subtitle?: string
  logoUrl?: string
  iconUrl?: string
  faviconUrl?: string
}

export interface AppSettings {
  navigationPreference: NavigationPreference
  notificationsEnabled: boolean
  theme: ThemePreference
}

export interface AppUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  token: string
  user: AppUser
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const ICONS: Record<string, LucideIcon> = {
  Activity,
  BarChart3,
  Box,
  Cloud,
  Code2,
  Command,
  Database,
  Globe,
  LayoutDashboard,
  Mail,
  Message: MessageSquare,
  MessageSquare,
  Server,
  Shield,
  Terminal,
  Users,
}

export const PLATFORM_ICON_OPTIONS = [
  { name: 'Box', icon: Box },
  { name: 'Globe', icon: Globe },
  { name: 'Shield', icon: Shield },
  { name: 'Database', icon: Database },
  { name: 'Cloud', icon: Cloud },
  { name: 'Terminal', icon: Terminal },
  { name: 'Activity', icon: Activity },
  { name: 'Users', icon: Users },
  { name: 'Mail', icon: Mail },
  { name: 'MessageSquare', icon: MessageSquare },
  { name: 'LayoutDashboard', icon: LayoutDashboard },
  { name: 'BarChart3', icon: BarChart3 },
  { name: 'Code2', icon: Code2 },
  { name: 'Server', icon: Server },
]

const defaultBranding: BrandingConfig = {
  name: 'Portal de Acesso',
  subtitle: 'Central de Sistemas',
  logoUrl: '',
  iconUrl: '',
  faviconUrl: '',
}

const defaultSettings: AppSettings = {
  navigationPreference: 'default',
  notificationsEnabled: true,
  theme: 'system',
}

export function getDefaultBranding(): BrandingConfig {
  return { ...defaultBranding }
}

export function getDefaultSettings(): AppSettings {
  return { ...defaultSettings }
}

export function resolvePlatformIcon(iconName?: string | null): LucideIcon {
  if (!iconName) return Globe
  return ICONS[iconName] ?? Globe
}

export function formatRelativeAccess(value?: string | null): string | undefined {
  if (!value) return undefined

  const timestamp = new Date(value)
  if (Number.isNaN(timestamp.getTime())) return undefined

  const diffMs = Date.now() - timestamp.getTime()
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000))

  if (diffMinutes < 60) {
    return `Há ${diffMinutes} min`
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) {
    return `Há ${diffHours} h`
  }

  const diffDays = Math.round(diffHours / 24)
  return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`
}

export function formatTimestamp(value: string): string {
  const timestamp = new Date(value)
  if (Number.isNaN(timestamp.getTime())) return value

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(timestamp)
}

export function mapPlatform(record: PlatformRecord): Platform {
  const iconName = record.icon || 'Globe'

  return {
    id: record.id,
    name: record.name,
    description: record.description,
    category: record.category,
    status: record.status,
    icon: resolvePlatformIcon(iconName),
    iconName,
    color: record.color ?? undefined,
    lastAccessed: formatRelativeAccess(record.lastAccessed),
    url: record.url,
    hasAccess: record.hasAccess ?? true,
    openMode: record.openMode ?? 'default',
  }
}

export function mapAccessLog(record: AccessLogRecord): AccessLog {
  return {
    id: record.id,
    user: record.userName,
    platform: record.platformName,
    timestamp: formatTimestamp(record.timestamp),
    ip: record.ip,
  }
}
