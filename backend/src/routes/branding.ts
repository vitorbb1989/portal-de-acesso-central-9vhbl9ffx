import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

// Rejeita URLs perigosas (javascript:, data:, vbscript:)
const safeUrlSchema = z
  .string()
  .refine(
    (val) => {
      if (!val || val.trim() === '') return true // permite vazio
      const lower = val.trim().toLowerCase()
      return !lower.startsWith('javascript:') && !lower.startsWith('data:') && !lower.startsWith('vbscript:')
    },
    { message: 'URL com scheme não permitido' },
  )
  .optional()

const brandingSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  subtitle: z.string().optional(),
  logoUrl: safeUrlSchema,
  iconUrl: safeUrlSchema,
  faviconUrl: safeUrlSchema,
})

// GET /api/branding
router.get('/', async (_req, res, next) => {
  try {
    const branding = await prisma.brandingConfig.findFirst()

    if (!branding) {
      res.json({
        name: 'Portal de Acesso',
        subtitle: 'Central de Sistemas',
        logoUrl: '',
        iconUrl: '',
        faviconUrl: '',
      })
      return
    }

    res.json(branding)
  } catch (err) {
    next(err)
  }
})

// PUT /api/branding
router.put('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const data = brandingSchema.parse(req.body)

    const existing = await prisma.brandingConfig.findFirst()

    const branding = existing
      ? await prisma.brandingConfig.update({ where: { id: existing.id }, data })
      : await prisma.brandingConfig.create({ data })

    res.json(branding)
  } catch (err) {
    next(err)
  }
})

export default router
