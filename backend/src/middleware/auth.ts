import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
  userId: string
  email: string
  role: string
}

export interface AuthRequest extends Request {
  user?: AuthPayload
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticação não fornecido' })
    return
  }

  const token = authHeader.substring(7)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Não autenticado' })
    return
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Acesso negado. Requer permissão de administrador.' })
    return
  }

  next()
}
