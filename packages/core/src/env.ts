/**
 * Environment detection utilities for Duct UI
 */

// Environment detection
export const isNodeJS = typeof process !== 'undefined' && process.versions?.node
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'
export const hasDocument = typeof document !== 'undefined'
export const hasMutationObserver = typeof MutationObserver !== 'undefined'

/**
 * Check if we're in a server-side rendering context
 */
export const isSSR = isNodeJS && !isBrowser

/**
 * Check if we can use DOM APIs safely
 */
export const canUseDOMAPIs = isBrowser && hasDocument