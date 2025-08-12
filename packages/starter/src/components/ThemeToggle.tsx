import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"

export interface ThemeToggleEvents extends BaseComponentEvents {
  themeChanged: (el: HTMLElement, theme: 'light' | 'dark') => void
}

export interface ThemeToggleLogic {
  getCurrentTheme: () => 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

export interface ThemeToggleProps {
  initialTheme?: 'light' | 'dark'
  'on:bind'?: (el: HTMLElement) => void
  'on:themeChanged'?: (el: HTMLElement, theme: 'light' | 'dark') => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<ThemeToggleProps>) {
  const { initialTheme = 'light', ...moreProps } = props

  return (
    <button
      class="fixed bottom-6 right-6 btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-all z-50"
      data-theme={initialTheme}
      aria-label="Toggle theme"
      title="Toggle between light and dark theme"
      {...moreProps}
    >
      <svg
        class="sun-icon w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <svg
        class="moon-icon w-6 h-6 hidden"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<ThemeToggleEvents>): BindReturn<ThemeToggleLogic> {
  const sunIcon = el.querySelector('.sun-icon') as SVGElement
  const moonIcon = el.querySelector('.moon-icon') as SVGElement
  
  // Get initial theme from localStorage or system preference
  function getInitialTheme(): 'light' | 'dark' {
    const stored = localStorage.getItem('theme')
    const hasOverride = localStorage.getItem('theme-override') === 'true'
    
    // If user has manually selected a theme, use it regardless of system preference
    if (hasOverride && (stored === 'light' || stored === 'dark')) {
      return stored
    }
    
    // Check system preference only if no manual override
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }

  let currentTheme = getInitialTheme()

  function updateIcons() {
    if (currentTheme === 'dark') {
      sunIcon.classList.add('hidden')
      moonIcon.classList.remove('hidden')
    } else {
      sunIcon.classList.remove('hidden')
      moonIcon.classList.add('hidden')
    }
  }

  function applyTheme(theme: 'light' | 'dark') {
    // Apply DaisyUI theme
    document.documentElement.setAttribute('data-theme', theme)
    document.body.setAttribute('data-theme', theme)
    
    // Add a custom CSS class to force the theme
    document.documentElement.classList.remove('theme-light', 'theme-dark')
    document.documentElement.classList.add(`theme-${theme}`)
    
    localStorage.setItem('theme', theme)
    localStorage.setItem('theme-override', 'true') // Flag that user has manually selected
    
    currentTheme = theme
    el.dataset.theme = theme
    updateIcons()
    eventEmitter.emit('themeChanged', theme)
  }

  function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    applyTheme(newTheme)
  }

  function handleClick() {
    toggleTheme()
  }

  // Initialize theme
  applyTheme(currentTheme)

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  function handleSystemThemeChange(e: MediaQueryListEvent) {
    // Only auto-switch if user hasn't manually overridden the theme
    const hasOverride = localStorage.getItem('theme-override') === 'true'
    if (!hasOverride) {
      const newTheme = e.matches ? 'dark' : 'light'
      // Don't set override flag for automatic system changes
      currentTheme = newTheme
      document.documentElement.setAttribute('data-theme', newTheme)
      document.body.setAttribute('data-theme', newTheme)
      document.documentElement.classList.remove('theme-light', 'theme-dark')
      document.documentElement.classList.add(`theme-${newTheme}`)
      localStorage.setItem('theme', newTheme)
      el.dataset.theme = newTheme
      updateIcons()
      eventEmitter.emit('themeChanged', newTheme)
    }
  }
  
  mediaQuery.addEventListener('change', handleSystemThemeChange)
  el.addEventListener('click', handleClick)

  function release() {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
    el.removeEventListener('click', handleClick)
  }

  return {
    getCurrentTheme: () => currentTheme,
    setTheme: applyTheme,
    toggleTheme,
    release
  }
}

const id = { id: "starter/theme-toggle" }

const ThemeToggle = createBlueprint<ThemeToggleProps, ThemeToggleEvents, ThemeToggleLogic>(
  id,
  render,
  {
    bind
  }
)

export default ThemeToggle