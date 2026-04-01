import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth.js'

const router = Router()

// GET /api/logs
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const querySchema = z.object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(20),
      userId: z.string().optional(),
      platformId: z.string().optional(),
      search: z.string().optional(),
    })

    const { page, limit, userId, platformId, search } = querySchema.parse(req.query)

    const where: Record<string, unknown> = {}

    // Usuários comuns só veem seus próprios logs
    if (req.user!.role !== 'ADMIN') {
      where.userId = req.user!.userId
    } else {
      if (userId) where.userId = userId
      if (platformId) where.platformId = platformId
    }

    const includeRelations = {
      user: { select: { id: true, name: true, email: true } },
      platform: { select: { id: true, name: true, category: true } },
    }

    let paginated
    let filteredTotal: number

    if (search) {
      // Com search: busca tudo e filtra em memória (SQLite não suporta mode: 'insensitive')
      const allLogs = await prisma.accessLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        include: includeRelations,
      })

      const s = search.toLowerCase()
      const filtered = allLogs.filter((log) =>
        log.userName.toLowerCase().includes(s) ||
        log.platformName.toLowerCase().includes(s) ||
        log.ip.includes(search),
      )

      filteredTotal = filtered.length
      paginated = filtered.slice((page - 1) * limit, page * limit)
    } else {
      // Sem search: pagina no banco para melhor performance
      const [total, logs] = await prisma.$transaction([
        prisma.accessLog.count({ where }),
        prisma.accessLog.findMany({
          where,
          orderBy: { timestamp: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: includeRelations,
        }),
      ])

      filteredTotal = total
      paginated = logs
    }

    res.json({
      data: paginated,
      pagination: {
        total: filteredTotal,
        page,
        limit,
        totalPages: Math.ceil(filteredTotal / limit),
      },
    })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/logs (apenas admin — limpa logs antigos)
// Parâmetro 'before' é OBRIGATÓRIO para evitar deleção acidental de todos os logs
router.delete('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { before } = z
      .object({
        before: z.string().datetime('Formato de data inválido. Use ISO 8601 (ex: 2024-01-01T00:00:00Z)'),
      })
      .parse(req.query)

    const { count } = await prisma.accessLog.deleteMany({
      where: { timestamp: { lt: new Date(before) } },
    })

    res.json({ deleted: count })
  } catch (err) {
    next(err)
  }
})

export default router
