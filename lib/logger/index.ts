import fs from 'fs'
import path from 'path'

export type LogLevel = 'info' | 'warn' | 'error' | 'critical'
export type LogDomain = 'auth' | 'admin' | 'orders' | 'db' | 'system'

export interface LogEntry {
  level: LogLevel
  domain: LogDomain
  action: string
  message: string
  user?: string
  ip?: string
  error?: unknown
  metadata?: Record<string, unknown>
}

// Directorio /logs en la raíz del proyecto
const LOGS_DIR = path.join(process.cwd(), 'logs')

// Crea el directorio de logs si no existe
function ensureLogsDir() {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true })
  }
}

// Selecciona el archivo de log según dominio y nivel
function resolveLogFile(entry: LogEntry): string {
  if (entry.level === 'error' || entry.level === 'critical') return 'error.log'
  if (entry.domain === 'auth') return 'security.log'
  if (entry.domain === 'orders') return 'orders.log'
  return 'app.log'
}

// Formatea la línea en el formato solicitado:
// 2026-07-18 14:25:33 | INFO | usuario=x | ip=x | modulo=x | accion=x | Mensaje
function formatLine(entry: LogEntry): string {
  const now = new Date()
  const date = now.toISOString().replace('T', ' ').slice(0, 19)
  const level = entry.level.toUpperCase()

  let line = `${date} | ${level}`
  if (entry.user) line += ` | usuario=${entry.user}`
  if (entry.ip) line += ` | ip=${entry.ip}`
  line += ` | modulo=${entry.domain} | accion=${entry.action} | ${entry.message}`

  if (entry.metadata && Object.keys(entry.metadata).length > 0) {
    line += ` | ${JSON.stringify(entry.metadata)}`
  }

  if (entry.error) {
    if (entry.error instanceof Error) {
      line += ` | error=${entry.error.message}`
      if (entry.error.stack) line += ` | stack=${entry.error.stack.split('\n')[1]?.trim() ?? ''}`
    } else {
      line += ` | error=${JSON.stringify(entry.error)}`
    }
  }

  return line + '\n'
}

function write(entry: LogEntry) {
  const line = formatLine(entry)

  // Siempre imprimimos en consola también (útil en desarrollo y en Vercel Logs)
  if (entry.level === 'error' || entry.level === 'critical') {
    console.error(line.trimEnd())
  } else if (entry.level === 'warn') {
    console.warn(line.trimEnd())
  } else {
    console.info(line.trimEnd())
  }

  // Escribimos al archivo físico (solo funciona en Node.js runtime, no en Edge)
  try {
    ensureLogsDir()
    const filePath = path.join(LOGS_DIR, resolveLogFile(entry))
    fs.appendFileSync(filePath, line, 'utf8')
  } catch {
    // Si falla (ej. entorno Edge), el log de consola ya fue emitido arriba
  }
}

class Logger {
  info(entry: Omit<LogEntry, 'level'>) {
    write({ ...entry, level: 'info' })
  }

  warn(entry: Omit<LogEntry, 'level'>) {
    write({ ...entry, level: 'warn' })
  }

  error(entry: Omit<LogEntry, 'level'>) {
    write({ ...entry, level: 'error' })
  }

  critical(entry: Omit<LogEntry, 'level'>) {
    write({ ...entry, level: 'critical' })
  }
}

export const logger = new Logger()

