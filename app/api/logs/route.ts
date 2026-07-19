import { NextRequest, NextResponse } from 'next/server'
import { logger, LogLevel, LogDomain } from '@/lib/logger'

// Endpoint interno para recibir logs desde el Edge Runtime (middleware)
// o desde Client Components. Solo acepta peticiones internas.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      level: LogLevel
      domain: LogDomain
      action: string
      message: string
      user?: string
      ip?: string
      metadata?: Record<string, unknown>
      error?: string
    }

    const { level, domain, action, message, user, ip, metadata, error } = body

    const entry = {
      domain,
      action,
      message,
      user,
      ip,
      metadata,
      error: error ? new Error(error) : undefined,
    }

    switch (level) {
      case 'warn':
        logger.warn(entry)
        break
      case 'error':
        logger.error(entry)
        break
      case 'critical':
        logger.critical(entry)
        break
      default:
        logger.info(entry)
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
