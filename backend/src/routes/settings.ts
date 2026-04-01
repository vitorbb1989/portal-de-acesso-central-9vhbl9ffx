import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

const settingsSchema = z.object({
  navigationPreference: z.enum(['default', 'always_new_tab', 'always_internal']).optional(),
  notificationsEnabled: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
})

// GET /api/settings
router.get('/', authenticate, async (_req, res, next) => {
  try {
    const settings = await prisma.appSettings.findFirst()

    if (!settings) {
      res.json({
        navigationPreference: 'default',
        notificationsEnabled: true,
        theme: 'system',
      })
      return
    }

    res.json(settings)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/settings
router.patch('/', authenticate, async (req, res, next) => {
  try {
    const data = settingsSchema.parse(req.body)

    if (Object.keys(data).length === 0) {
      res.status(400).json({ error: 'Nenhum campo para atualizar' })
      return
    }

    const existing = await prisma.appSettings.findFirst()

    const settings = existing
      ? await prisma.appSettings.update({ where: { id: existing.id }, data })
      : await prisma.appSettings.create({ data })

    res.json(settings)
  } catch (err) {
    next(err)
  }
})

export default router
