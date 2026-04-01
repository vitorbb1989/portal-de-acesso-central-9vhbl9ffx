import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { requestLogger } from './middleware/logger.js'
import { errorHandler } from './middleware/error.js'
import { prisma } from './lib/prisma.js'
import authRouter from './routes/auth.js'
import platformsRouter from './routes/platforms.js'
import logsRouter from './routes/logs.js'
import brandingRouter from './routes/branding.js'
import settingsRouter from './routes/settings.js'

const app = express()
const PORT = Number(process.env.PORT ?? 3333)
const trustProxySetting = process.env.TRUST_PROXY ?? (process.env.NODE_ENV === 'production' ? '1' : 'false')

if (trustProxySetting === 'true') {
  app.set('trust proxy', true)
} else if (trustProxySetting === 'false') {
  app.set('trust proxy', false)
} else {
  const hops = Number(trustProxySetting)
  app.set('trust proxy', Number.isNaN(hops) ? trustProxySetting : hops)
}

// Segurança
app.use(helmet())

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:8080',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

// Body parsing
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiter global (100 req/min por IP — rotas de auth têm limites próprios mais restritivos)
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Muitas requisições. Tente novamente em instantes.' },
  }),
)

// Request logger (antes das rotas)
app.use(requestLogger)

// Health check (verifica conectividade com o banco)
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  } catch {
    res.status(503).json({ status: 'unhealthy', timestamp: new Date().toISOString() })
  }
})

// Rotas
app.use('/api/auth', authRouter)
app.use('/api/platforms', platformsRouter)
app.use('/api/logs', logsRouter)
app.use('/api/branding', brandingRouter)
app.use('/api/settings', settingsRouter)

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

// Error handler (deve ser o último middleware)
app.use(errorHandler)

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
  console.log(`📋 Ambiente: ${process.env.NODE_ENV ?? 'development'}`)
  console.log(`🛡️  trust proxy: ${String(app.get('trust proxy'))}`)
  console.log(`🏥 Health check: http://localhost:${PORT}/health`)
  console.log('\n📡 Rotas disponíveis:')
  console.log(`  POST   /api/auth/login`)
  console.log(`  POST   /api/auth/register`)
  console.log(`  GET    /api/auth/me`)
  console.log(`  PATCH  /api/auth/me`)
  console.log(`  GET    /api/platforms`)
  console.log(`  GET    /api/platforms/categories`)
  console.log(`  POST   /api/platforms`)
  console.log(`  GET    /api/platforms/:id`)
  console.log(`  PATCH  /api/platforms/:id`)
  console.log(`  DELETE /api/platforms/:id`)
  console.log(`  POST   /api/platforms/:id/access`)
  console.log(`  GET    /api/logs`)
  console.log(`  DELETE /api/logs`)
  console.log(`  GET    /api/branding`)
  console.log(`  PUT    /api/branding`)
  console.log(`  GET    /api/settings`)
  console.log(`  PATCH  /api/settings`)
})

// Graceful shutdown
function shutdown(signal: string) {
  console.log(`\n⏳ Recebido ${signal}. Encerrando servidor...`)

  server.close(async () => {
    console.log('🔌 Conexões HTTP encerradas')
    await prisma.$disconnect()
    console.log('🗄️  Prisma desconectado')
    console.log('✅ Servidor encerrado com sucesso')
    process.exit(0)
  })

  // Força encerramento após 10s se não conseguir fechar graciosamente
  setTimeout(() => {
    console.error('⚠️  Forçando encerramento após timeout')
    process.exit(1)
  }, 10_000)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

export default app
