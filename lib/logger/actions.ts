'use server'

import { logger, LogDomain, LogLevel } from './index'

export async function logClientEvent(
  level: LogLevel,
  domain: LogDomain,
  action: string,
  message: string,
  metadata?: Record<string, unknown>,
  user?: string,
  errorDetail?: string
) {
  const entry = {
    domain,
    action,
    message,
    metadata,
    user,
    error: errorDetail ? new Error(errorDetail) : undefined,
  }

  switch (level) {
    case 'info':
      logger.info(entry)
      break
    case 'warn':
      logger.warn(entry)
      break
    case 'error':
      logger.error(entry)
      break
    case 'critical':
      logger.critical(entry)
      break
  }
}
