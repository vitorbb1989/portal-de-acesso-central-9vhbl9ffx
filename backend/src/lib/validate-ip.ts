import { isIP } from 'node:net'

/**
 * Extrai e valida o IP do cliente a partir dos headers da request.
 * Retorna o IP validado ou o remoteAddress como fallback.
 */
export function extractClientIp(
  forwardedFor: string | string[] | undefined,
  remoteAddress: string | undefined,
): string {
  if (typeof forwardedFor === 'string') {
    const candidate = forwardedFor.split(',')[0]?.trim()
    if (candidate && isIP(candidate)) {
      return candidate
    }
  }

  if (remoteAddress && isIP(remoteAddress)) {
    return remoteAddress
  }

  return 'unknown'
}
