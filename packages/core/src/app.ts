export interface AppOptions {
  rootElement?: HTMLElement | string
  clearContent?: boolean
  meta?: Record<string, any>
  env?: Record<string, any>
}

/**
 * Reanimate a Duct component into an existing DOM tree (for SSG/SSR)
 * @param Component - The root Duct component or JSX element to reanimate
 * @param options - Configuration options
 */
export function reanimate(Component: any, options: AppOptions = {}): void {
  const {
    rootElement = '#app',
    clearContent = true,
    meta = {},
    env = {}
  } = options

  // Get the root element
  const element = typeof rootElement === 'string' 
    ? document.querySelector(rootElement) as HTMLElement
    : rootElement

  if (!element) {
    throw new Error(`Root element not found: ${rootElement}`)
  }

  // Clear pre-rendered content if requested
  if (clearContent) {
    element.innerHTML = ''
  }

  // Check if Component is a function (DuctPageComponent) or a component
  const content = typeof Component === 'function' 
    ? Component({ meta, path: window.location.pathname, env })
    : Component

  // Render the component by setting innerHTML
  element.innerHTML = content.toString()
}

/**
 * Mount a Duct component into a DOM element (for client-only apps)
 * @param Component - The root Duct component or JSX element to mount
 * @param options - Configuration options
 */
export function mount(Component: any, options: AppOptions = {}): void {
  // For now, mount is the same as reanimate with clearContent=true
  reanimate(Component, { ...options, clearContent: true })
}

// Auto-initialize if this script is loaded directly (for SSG)
if (typeof window !== 'undefined' && (window as any).__DUCT_PAGE_COMPONENT__) {
  document.addEventListener('DOMContentLoaded', () => {
    reanimate((window as any).__DUCT_PAGE_COMPONENT__)
  })
}