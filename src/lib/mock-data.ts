import {
  Activity,
  BarChart3,
  Box,
  Cloud,
  Code2,
  Database,
  Globe,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Server,
  Shield,
  Terminal,
  Users,
} from 'lucide-react'

export type PlatformStatus = 'online' | 'warning' | 'offline'

export interface Platform {
  id: string
  name: string
  description: string
  category: 'Marketing' | 'DevTools' | 'CRM' | 'Infra' | 'Comunicação' | string
  status: PlatformStatus
  icon: any
  color?: string
  lastAccessed?: string
  url: string
  hasAccess?: boolean
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

export const mockContext = {
  currentRoute: {
    path: '/',
    component: 'Index',
  },
}

export const mockBranding: BrandingConfig = {
  name: 'OmniStack',
  subtitle: 'Enterprise Gateway',
  logoUrl: '', // Leave empty to demonstrate the stylized text fallback
  iconUrl: 'https://img.usecurling.com/i?q=hexagon&shape=fill&color=blue',
  faviconUrl: 'https://img.usecurling.com/i?q=hexagon&shape=fill&color=blue',
}

export const mockPlatforms: Platform[] = [
  {
    id: '1',
    name: 'CustomerHub',
    description: 'Gestão de relacionamento com clientes e leads.',
    category: 'CRM',
    status: 'online',
    icon: Users,
    color: '#8B5CF6',
    lastAccessed: 'Há 5 minutos',
    url: 'https://crm.example.com',
    hasAccess: true,
  },
  {
    id: '2',
    name: 'CloudConsole',
    description: 'Painel de controle de infraestrutura em nuvem.',
    category: 'Infra',
    status: 'online',
    icon: Cloud,
    color: '#0066FF',
    lastAccessed: 'Há 1 hora',
    url: 'https://cloud.example.com',
    hasAccess: true,
  },
  {
    id: '3',
    name: 'DeployMaster',
    description: 'Pipeline de CI/CD e gestão de deploys.',
    category: 'DevTools',
    status: 'warning',
    icon: Terminal,
    color: '#F59E0B',
    lastAccessed: 'Há 2 horas',
    url: 'https://ci.example.com',
    hasAccess: true,
  },
  {
    id: '4',
    name: 'MetricsPro',
    description: 'Análise de dados e visualização de métricas de negócio.',
    category: 'Marketing',
    status: 'online',
    icon: BarChart3,
    color: '#10B981',
    lastAccessed: 'Ontem',
    url: 'https://metrics.example.com',
    hasAccess: true,
  },
  {
    id: '5',
    name: 'TeamChat',
    description: 'Comunicação interna e canais de equipe.',
    category: 'Comunicação',
    status: 'online',
    icon: MessageSquare,
    color: '#F43F5E',
    lastAccessed: 'Há 10 minutos',
    url: 'https://chat.example.com',
    hasAccess: true,
  },
  {
    id: '6',
    name: 'SecureVault',
    description: 'Gerenciamento de segredos e acessos sensíveis.',
    category: 'Infra',
    status: 'offline',
    icon: Shield,
    lastAccessed: 'Há 3 dias',
    url: 'https://vault.example.com',
    hasAccess: true,
  },
  {
    id: '7',
    name: 'EmailCampaigns',
    description: 'Plataforma de disparo e automação de e-mails.',
    category: 'Marketing',
    status: 'online',
    icon: Mail,
    lastAccessed: 'Há 4 horas',
    url: 'https://email.example.com',
    hasAccess: true,
  },
  {
    id: '8',
    name: 'DataWarehouse',
    description: 'Acesso unificado aos bancos de dados analíticos.',
    category: 'Infra',
    status: 'online',
    icon: Database,
    color: '#0066FF',
    lastAccessed: 'Há 1 dia',
    url: 'https://dw.example.com',
    hasAccess: false,
  },
]

export const mockLogs: AccessLog[] = [
  {
    id: 'l1',
    user: 'Ana Silva',
    platform: 'CustomerHub',
    timestamp: '2023-10-27 14:32:01',
    ip: '192.168.1.45',
  },
  {
    id: 'l2',
    user: 'Carlos Gomes',
    platform: 'CloudConsole',
    timestamp: '2023-10-27 14:15:22',
    ip: '10.0.0.12',
  },
  {
    id: 'l3',
    user: 'Ana Silva',
    platform: 'TeamChat',
    timestamp: '2023-10-27 13:45:10',
    ip: '192.168.1.45',
  },
  {
    id: 'l4',
    user: 'Marcos Costa',
    platform: 'DeployMaster',
    timestamp: '2023-10-27 11:20:05',
    ip: '172.16.0.8',
  },
  {
    id: 'l5',
    user: 'Juliana Paes',
    platform: 'MetricsPro',
    timestamp: '2023-10-27 09:10:33',
    ip: '192.168.1.102',
  },
]
