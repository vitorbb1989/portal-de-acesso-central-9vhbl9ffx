import { randomUUID } from 'node:crypto'
import type { Request, Response, NextFunction } from 'express'

export interface RequestWithId extends Request {
  requestId?: string
}

export function requestLogger(req: RequestWithId, res: Response, next: NextFunction): void {
  const requestId = randomUUID()
  req.requestId = requestId
  res.setHeader('X-Request-Id', requestId)

  const start = performance.now()

  res.on('finish', () => {
    const duration = (performance.now() - start).toFixed(1)
    const { method } = req
    const url = req.originalUrl
    const status = res.statusCode

    const level = status >= 500 ? 'ERROR' : status >= 400 ? 'WARN' : 'INFO'

    console.log(
      `[${level}] ${method} ${url} ${status} ${duration}ms [${requestId}]`,
    )
  })

  next()
}
