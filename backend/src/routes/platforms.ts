import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { extractClientIp } from '../lib/validate-ip.js'
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth.js'

const router = Router()

// Rejeita URLs com schemes perigosos (XSS)
const safeUrl = z.string().url('URL inválida').refine(
  (val) => {
    const lower = val.trim().toLowerCase()
    return !lower.startsWith('javascript:') && !lower.startsWith('data:') && !lower.startsWith('vbscript:')
  },
  { message: 'URL com scheme não permitido' },
)

const platformSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  description: z.string().min(1, 'Descrição obrigatória'),
  category: z.string().min(1, 'Categoria obrigatória'),
  status: z.enum(['online', 'warning', 'offline']).default('online'),
  icon: z.string().optional(),
  color: z.string().optional(),
  url: safeUrl,
  hasAccess: z.boolean().default(true),
  openMode: z.enum(['default', 'new_tab', 'internal']).default('default'),
})

const listQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
})

// Filtro base: somente registros não deletados
const notDeleted = { deletedAt: null }

// GET /api/platforms
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { search, category, status, page, limit } = listQuerySchema.parse(req.query)

    const platforms = await prisma.platform.findMany({
      where: notDeleted,
      orderBy: { name: 'asc' },
    })

    // Filtragem em memória (SQLite não suporta mode: 'insensitive')
    const filtered = platforms.filter((p) => {
      if (search) {
        const s = search.toLowerCase()
        const match =
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s)
        if (!match) return false
      }
      if (category && p.category !== category) return false
      if (status && p.status !== status) return false
      return true
    })

    const total = filtered.length
    const paginated = filtered.slice((page - 1) * limit, page * limit)

    res.json({
      data: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/platforms/categories
router.get('/categories', authenticate, async (_req, res, next) => {
  try {
    const platforms = await prisma.platform.findMany({
      where: notDeleted,
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    })

    const categories = platforms.map((p) => p.category)
    res.json(categories)
  } catch (err) {
    next(err)
  }
})

// GET /api/platforms/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const id = req.params.id as string
    const platform = await prisma.platform.findFirst({
      where: { id, ...notDeleted },
      include: {
        logs: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    })

    if (!platform) {
      res.status(404).json({ error: 'Plataforma não encontrada' })
      return
    }

    res.json(platform)
  } catch (err) {
    next(err)
  }
})

// POST /api/platforms
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const data = platformSchema.parse(req.body)
    const platform = await prisma.platform.create({
      data: {
        ...data,
        createdBy: req.user!.userId,
        updatedBy: req.user!.userId,
      },
    })
    res.status(201).json(platform)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/platforms/:id
router.patch('/:id', authenticate, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string
    const data = platformSchema.partial().parse(req.body)

    if (Object.keys(data).length === 0) {
      res.status(400).json({ error: 'Nenhum campo para atualizar' })
      return
    }

    // Verifica se existe e não está deletado
    const existing = await prisma.platform.findFirst({ where: { id, ...notDeleted } })
    if (!existing) {
      res.status(404).json({ error: 'Plataforma não encontrada' })
      return
    }

    const platform = await prisma.platform.update({
      where: { id },
      data: {
        ...data,
        updatedBy: req.user!.userId,
      },
    })

    res.json(platform)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/platforms/:id (soft delete)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string

    const existing = await prisma.platform.findFirst({ where: { id, ...notDeleted } })
    if (!existing) {
      res.status(404).json({ error: 'Plataforma não encontrada' })
      return
    }

    await prisma.platform.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: req.user!.userId,
      },
    })

    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

// POST /api/platforms/:id/access
// Registra log de acesso quando o usuário abre uma plataforma
router.post('/:id/access', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string
    const platform = await prisma.platform.findFirst({
      where: { id, ...notDeleted },
    })

    if (!platform) {
      res.status(404).json({ error: 'Plataforma não encontrada' })
      return
    }

    const ip = extractClientIp(req.headers['x-forwarded-for'], req.socket.remoteAddress)

    // Busca o nome real do usuário para o log (JWT só tem email)
    const user = await prisma.user.findFirst({
      where: { id: req.user!.userId, deletedAt: null },
      select: { name: true },
    })

    const [log] = await prisma.$transaction([
      prisma.accessLog.create({
        data: {
          userName: user?.name ?? req.user!.email,
          platformName: platform.name,
          ip,
          userId: req.user!.userId,
          platformId: platform.id,
        },
      }),
      prisma.platform.update({
        where: { id: platform.id },
        data: { lastAccessed: new Date() },
      }),
    ])

    res.status(201).json(log)
  } catch (err) {
    next(err)
  }
})

export default router
