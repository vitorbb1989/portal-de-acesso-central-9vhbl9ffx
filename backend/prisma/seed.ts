import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  const passwordHash = await bcrypt.hash('Admin123', 10)
  const userPasswordHash = await bcrypt.hash('User1234', 10)

  // Timestamps recentes (últimos 7 dias)
  const now = new Date()
  const minutesAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000)
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000)
  const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000)

  await prisma.$transaction(async (tx) => {
    // Limpa dados existentes (idempotente)
    await tx.accessLog.deleteMany()
    await tx.platform.deleteMany()
    await tx.user.deleteMany()
    await tx.brandingConfig.deleteMany()
    await tx.appSettings.deleteMany()

    // Usuários
    const admin = await tx.user.create({
      data: { name: 'Admin', email: 'admin@portal.com', password: passwordHash, role: 'ADMIN' },
    })

    const ana = await tx.user.create({
      data: { name: 'Ana Silva', email: 'ana.silva@portal.com', password: userPasswordHash, role: 'USER' },
    })

    const carlos = await tx.user.create({
      data: { name: 'Carlos Gomes', email: 'carlos.gomes@portal.com', password: userPasswordHash, role: 'USER' },
    })

    const marcos = await tx.user.create({
      data: { name: 'Marcos Costa', email: 'marcos.costa@portal.com', password: userPasswordHash, role: 'USER' },
    })

    const juliana = await tx.user.create({
      data: { name: 'Juliana Paes', email: 'juliana.paes@portal.com', password: userPasswordHash, role: 'USER' },
    })

    console.log('✅ 5 usuários criados')

    // Plataformas
    const customerHub = await tx.platform.create({
      data: {
        name: 'CustomerHub', description: 'Gestão de relacionamento com clientes e leads.',
        category: 'CRM', status: 'online', icon: 'Users', color: '#8B5CF6',
        url: 'https://crm.example.com', hasAccess: true, openMode: 'internal',
        lastAccessed: minutesAgo(5), createdBy: admin.id, updatedBy: admin.id,
      },
    })

    const cloudConsole = await tx.platform.create({
      data: {
        name: 'CloudConsole', description: 'Painel de controle de infraestrutura em nuvem.',
        category: 'Infra', status: 'online', icon: 'Cloud', color: '#0066FF',
        url: 'https://cloud.example.com', hasAccess: true, openMode: 'internal',
        lastAccessed: hoursAgo(1), createdBy: admin.id, updatedBy: admin.id,
      },
    })

    const deployMaster = await tx.platform.create({
      data: {
        name: 'DeployMaster', description: 'Pipeline de CI/CD e gestão de deploys.',
        category: 'DevTools', status: 'warning', icon: 'Terminal', color: '#F59E0B',
        url: 'https://ci.example.com', hasAccess: true, openMode: 'new_tab',
        lastAccessed: hoursAgo(2), createdBy: admin.id, updatedBy: admin.id,
      },
    })

    const metricsPro = await tx.platform.create({
      data: {
        name: 'MetricsPro', description: 'Análise de dados e visualização de métricas de negócio.',
        category: 'Marketing', status: 'online', icon: 'BarChart3', color: '#10B981',
        url: 'https://metrics.example.com', hasAccess: true, openMode: 'internal',
        lastAccessed: daysAgo(1), createdBy: admin.id, updatedBy: admin.id,
      },
    })

    const teamChat = await tx.platform.create({
      data: {
        name: 'TeamChat', description: 'Comunicação interna e canais de equipe.',
        category: 'Comunicação', status: 'online', icon: 'MessageSquare', color: '#F43F5E',
        url: 'https://chat.example.com', hasAccess: true, openMode: 'new_tab',
        lastAccessed: minutesAgo(10), createdBy: admin.id, updatedBy: admin.id,
      },
    })

    await tx.platform.create({
      data: {
        name: 'SecureVault', description: 'Gerenciamento de segredos e acessos sensíveis.',
        category: 'Infra', status: 'offline', icon: 'Shield',
        url: 'https://vault.example.com', hasAccess: true, openMode: 'internal',
        lastAccessed: daysAgo(3), createdBy: admin.id, updatedBy: admin.id,
      },
    })

    await tx.platform.create({
      data: {
        name: 'EmailCampaigns', description: 'Plataforma de disparo e automação de e-mails.',
        category: 'Marketing', status: 'online', icon: 'Mail',
        url: 'https://email.example.com', hasAccess: true, openMode: 'new_tab',
        lastAccessed: hoursAgo(4), createdBy: admin.id, updatedBy: admin.id,
      },
    })

    await tx.platform.create({
      data: {
        name: 'DataWarehouse', description: 'Acesso unificado aos bancos de dados analíticos.',
        category: 'Infra', status: 'online', icon: 'Database', color: '#0066FF',
        url: 'https://dw.example.com', hasAccess: false, openMode: 'internal',
        lastAccessed: daysAgo(1), createdBy: admin.id, updatedBy: admin.id,
      },
    })

    console.log('✅ 8 plataformas criadas')

    // Logs de acesso (timestamps recentes)
    await tx.accessLog.createMany({
      data: [
        { userName: ana.name, platformName: customerHub.name, ip: '192.168.1.45', timestamp: minutesAgo(5), userId: ana.id, platformId: customerHub.id },
        { userName: carlos.name, platformName: cloudConsole.name, ip: '10.0.0.12', timestamp: minutesAgo(20), userId: carlos.id, platformId: cloudConsole.id },
        { userName: ana.name, platformName: teamChat.name, ip: '192.168.1.45', timestamp: hoursAgo(1), userId: ana.id, platformId: teamChat.id },
        { userName: marcos.name, platformName: deployMaster.name, ip: '172.16.0.8', timestamp: hoursAgo(3), userId: marcos.id, platformId: deployMaster.id },
        { userName: juliana.name, platformName: metricsPro.name, ip: '192.168.1.102', timestamp: daysAgo(1), userId: juliana.id, platformId: metricsPro.id },
      ],
    })

    console.log('✅ 5 logs de acesso criados')

    // Branding
    await tx.brandingConfig.create({
      data: {
        name: 'OmniStack', subtitle: 'Enterprise Gateway', logoUrl: '',
        iconUrl: 'https://img.usecurling.com/i?q=hexagon&shape=fill&color=blue',
        faviconUrl: 'https://img.usecurling.com/i?q=hexagon&shape=fill&color=blue',
      },
    })

    console.log('✅ Branding configurado')

    // Settings
    await tx.appSettings.create({
      data: { navigationPreference: 'default', notificationsEnabled: true, theme: 'system' },
    })

    console.log('✅ Configurações do app criadas')
  })

  console.log('\n🎉 Seed concluído com sucesso (dentro de transaction)')
  console.log('\n📋 Usuários para login:')
  console.log('  Admin: admin@portal.com / Admin123')
  console.log('  User:  ana.silva@portal.com / User1234')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
