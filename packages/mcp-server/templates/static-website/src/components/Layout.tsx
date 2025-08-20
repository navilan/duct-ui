import { createBlueprint } from '@duct-ui/core'

export interface LayoutProps {
  children?: any
  className?: string
}

function render(props: LayoutProps) {
  const { children, className = '' } = props

  return (
    <div class={`min-h-screen bg-white ${className}`}>
      {/* Navigation */}
      <nav class="border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <a href="/" class="text-xl font-bold text-gray-900">
                {{name}}
              </a>
            </div>
            <div class="flex items-center space-x-8">
              <a href="/" class="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </a>
              <a href="/blog" class="text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </a>
              <a href="/about" class="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer class="bg-gray-50 border-t border-gray-200 mt-20">
        <div class="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div class="text-center">
            <p class="text-gray-600">
              © 2024 {{name}}. Built with{' '}
              <a 
                href="https://duct-ui.org" 
                class="text-blue-600 hover:text-blue-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Duct UI
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function bind(element: HTMLElement, props: LayoutProps) {
  // Add any interactive behavior here if needed
  return {}
}

function release(element: HTMLElement) {
  // Clean up any event listeners or resources
}

const Layout = createBlueprint({
  render,
  bind,
  release
})

export default Layout