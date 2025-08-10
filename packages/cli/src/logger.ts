/**
 * Simple logging utility with different levels
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
}

const icons = {
  error: '❌',
  warn: '⚠️',
  info: 'ℹ️',
  success: '✅',
  debug: '🔍',
  build: '🏗️',
  file: '📄',
  folder: '📁',
  copy: '📂',
  scan: '🔍',
  generate: '✨',
  compile: '⚡'
}

export function error(message: string, ...args: any[]) {
  console.error(`${colors.red}${icons.error} ERROR${colors.reset}`, message, ...args)
}

export function warn(message: string, ...args: any[]) {
  console.warn(`${colors.yellow}${icons.warn} WARN${colors.reset}`, message, ...args)
}

export function info(message: string, ...args: any[]) {
  console.info(`${colors.blue}${icons.info} INFO${colors.reset}`, message, ...args)
}

export function success(message: string, ...args: any[]) {
  console.log(`${colors.green}${icons.success} SUCCESS${colors.reset}`, message, ...args)
}

export function debug(message: string, ...args: any[]) {
  if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
    console.debug(`${colors.gray}${icons.debug} DEBUG${colors.reset}`, message, ...args)
  }
}

export function build(message: string, ...args: any[]) {
  console.info(`${colors.cyan}${icons.build} BUILD${colors.reset}`, message, ...args)
}

export function step(stepNum: number, message: string, ...args: any[]) {
  console.info(`${colors.magenta}📋 Step ${stepNum}:${colors.reset}`, message, ...args)
}

export function file(message: string, ...args: any[]) {
  console.info(`${colors.cyan}${icons.file}${colors.reset}`, message, ...args)
}

export function folder(message: string, ...args: any[]) {
  console.info(`${colors.cyan}${icons.folder}${colors.reset}`, message, ...args)
}

export function scan(message: string, ...args: any[]) {
  console.debug(`${colors.blue}${icons.scan}${colors.reset}`, message, ...args)
}

export function generate(message: string, ...args: any[]) {
  console.info(`${colors.green}${icons.generate}${colors.reset}`, message, ...args)
}

export function compile(message: string, ...args: any[]) {
  console.info(`${colors.yellow}${icons.compile}${colors.reset}`, message, ...args)
}

export function copy(message: string, ...args: any[]) {
  console.info(`${colors.cyan}${icons.copy}${colors.reset}`, message, ...args)
}

// Simple indented logging for sub-operations
export function indent(level: number = 1) {
  const spaces = '  '.repeat(level)
  return {
    error: (message: string, ...args: any[]) => error(`${spaces}${message}`, ...args),
    warn: (message: string, ...args: any[]) => warn(`${spaces}${message}`, ...args),
    info: (message: string, ...args: any[]) => info(`${spaces}${message}`, ...args),
    success: (message: string, ...args: any[]) => success(`${spaces}${message}`, ...args),
    debug: (message: string, ...args: any[]) => debug(`${spaces}${message}`, ...args),
    log: (message: string, ...args: any[]) => console.log(`${spaces}${message}`, ...args)
  }
}