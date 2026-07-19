'use server'

import { logger } from '@/lib/logger'

export async function logAuthEvent(email: string, success: boolean, reason?: string) {
  if (success) {
    logger.info({
      domain: 'auth',
      action: 'login_success',
      message: 'User logged in successfully',
      user: email,
    })
  } else {
    logger.warn({
      domain: 'auth',
      action: 'login_failed',
      message: `Failed login attempt: ${reason || 'Unknown reason'}`,
      user: email,
    })
  }
}
