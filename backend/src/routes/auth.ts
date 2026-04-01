import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt, { type SignOptions } from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authenticate, type AuthRequest } from '../middleware/auth.js'

const router = Router()

// Rate limiting para rotas de auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 10, // máx 10 tentativas por janela
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
})

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  limit: 5, // máx 5 registros por hora
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Muitas tentativas de registro. Tente novamente em 1 hora.' },
})

// Validação de complexidade de senha
const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter ao menos 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter ao menos 1 letra maiúscula')
  .regex(/[0-9]/, 'Senha deve conter ao menos 1 número')

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: passwordSchema,
})

function signToken(payload: { userId: string; email: string; role: string }): string {
  const jwtOptions: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'],
  }
  return jwt.sign(payload, process.env.JWT_SECRET!, jwtOptions)
}

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await prisma.user.findFirst({ where: { email, deletedAt: null } })

    if (!user) {
      res.status(401).json({ error: 'E-mail ou senha inválidos' })
      return
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      res.status(401).json({ error: 'E-mail ou senha inválidos' })
      return
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role })

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/register
router.post('/register', registerLimiter, async (req, res, next) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body)

    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) {
      res.status(409).json({ error: 'E-mail já cadastrado' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: passwordHash, role: 'USER' },
    })

    const token = signToken({ userId: user.id, email: user.email, role: user.role })

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: req.user!.userId, deletedAt: null },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' })
      return
    }

    res.json(user)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/auth/me
router.patch('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const updateSchema = z.object({
      name: z.string().min(2).optional(),
      currentPassword: z.string().min(1, 'Senha atual obrigatória para alterar senha').optional(),
      newPassword: passwordSchema.optional(),
    }).refine(
      (data) => {
        // Se quiser trocar senha, deve informar a senha atual
        if (data.newPassword && !data.currentPassword) return false
        return true
      },
      { message: 'Informe a senha atual para alterar a senha', path: ['currentPassword'] },
    )

    const data = updateSchema.parse(req.body)

    // Verifica se o usuário existe e não foi soft-deleted
    const currentUser = await prisma.user.findFirst({ where: { id: req.user!.userId, deletedAt: null } })
    if (!currentUser) {
      res.status(404).json({ error: 'Usuário não encontrado' })
      return
    }

    const updateData: Record<string, string> = {}
    if (data.name) updateData.name = data.name

    if (data.newPassword && data.currentPassword) {
      const passwordMatch = await bcrypt.compare(data.currentPassword, currentUser.password)
      if (!passwordMatch) {
        res.status(401).json({ error: 'Senha atual incorreta' })
        return
      }

      updateData.password = await bcrypt.hash(data.newPassword, 10)
    }

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: 'Nenhum campo para atualizar' })
      return
    }

    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, updatedAt: true },
    })

    res.json(user)
  } catch (err) {
    next(err)
  }
})

export default router
