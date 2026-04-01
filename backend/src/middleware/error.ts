import type { Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import type { RequestWithId } from './logger.js'

const isProduction = process.env.NODE_ENV === 'production'

export function errorHandler(
  err: unknown,
  req: RequestWithId,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = req.requestId ?? 'unknown'

  // Zod — validação de entrada
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Dados inválidos',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
    return
  }

  // Prisma — erros conhecidos
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        res.status(409).json({ error: 'Registro já existe com esses dados' })
        return
      case 'P2025': // Record not found
        res.status(404).json({ error: 'Registro não encontrado' })
        return
      case 'P2003': // Foreign key constraint failed
        res.status(400).json({ error: 'Referência inválida. Registro relacionado não encontrado.' })
        return
      default:
        console.error(`[ERROR] Prisma ${err.code} [${requestId}]`, err.message)
        res.status(500).json({ error: 'Erro interno do servidor' })
        return
    }
  }

  // Prisma — erros de validação
  if (err instanceof Prisma.PrismaClientValidationError) {
    console.error(`[ERROR] Prisma validation [${requestId}]`, err.message)
    res.status(400).json({ error: 'Dados inválidos para o banco de dados' })
    return
  }

  // SyntaxError — JSON body malformado
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'JSON inválido no corpo da requisição' })
    return
  }

  // Erros genéricos
  if (err instanceof Error) {
    console.error(`[ERROR] ${err.message} [${requestId}]`, isProduction ? '' : err.stack)

    res.status(500).json({
      error: 'Erro interno do servidor',
      ...(isProduction ? {} : { message: err.message, requestId }),
    })
    return
  }

  // Erro desconhecido
  console.error(`[ERROR] Unknown error [${requestId}]`, err)
  res.status(500).json({ error: 'Erro interno do servidor' })
}
