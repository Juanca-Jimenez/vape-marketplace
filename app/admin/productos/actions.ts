'use server'

import { logger } from '@/lib/logger'

export async function logProductEvent(actionName: string, name: string, success: boolean, errorDetail?: string) {
  if (success) {
    logger.info({
      domain: 'admin',
      action: actionName,
      message: `Product event successful: ${name}`,
    })
  } else {
    logger.error({
      domain: 'admin',
      action: `${actionName}_failed`,
      message: `Failed product event: ${name}`,
      error: errorDetail,
    })
  }
}
