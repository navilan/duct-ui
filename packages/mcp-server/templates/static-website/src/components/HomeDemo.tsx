import { createBlueprint, type BaseProps } from '@duct-ui/core'
import { EventEmitter } from '@duct-ui/core/shared'
import Button from '@duct-ui/components/button/button'
import { BaseComponentEvents, BindReturn } from '@duct-ui/core/blueprint'

interface HomeDemoProps {
}

interface HomeDemoEvents extends BaseComponentEvents { }

interface HomeDemoLogic {
  showDemo: () => void
}

function render(props: BaseProps<HomeDemoProps>) {
  return (
    <section class="py-16" {...props}>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">
            Interactive Demo
          </h2>
          <p class="text-lg opacity-70 mb-8">
            See Duct UI components in action with this interactive demonstration.
          </p>

          <div class="inline-flex flex-col sm:flex-row gap-4 items-center">
            <button
              id="demo-toggle-btn"
              class="btn btn-primary btn-lg"
            >
              Try Interactive Demo
            </button>
            <button
              id="docs-btn"
              class="btn btn-outline btn-lg"
            >
              View Documentation
            </button>
          </div>
        </div>

        <div id="demo-area" class="hidden card bg-base-100 text-base-content shadow-xl transition-all duration-300">
          <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-xl font-semibold mb-4">Component Preview</h3>
                <div class="space-y-4">
                  <div class="flex flex-wrap gap-2">
                    <Button label="Primary" class="btn btn-primary btn-sm" />
                    <Button label="Secondary" class="btn btn-secondary btn-sm" />
                    <Button label="Accent" class="btn btn-accent btn-sm" />
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <Button label="Success" class="btn btn-success btn-sm" />
                    <Button label="Warning" class="btn btn-warning btn-sm" />
                    <Button label="Error" class="btn btn-error btn-sm" />
                  </div>
                  <div class="divider">Button Sizes</div>
                  <div class="flex flex-wrap gap-2 items-center">
                    <Button label="XS" class="btn btn-primary btn-xs" />
                    <Button label="SM" class="btn btn-primary btn-sm" />
                    <Button label="MD" class="btn btn-primary" />
                    <Button label="LG" class="btn btn-primary btn-lg" />
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-semibold mb-4">Key Features</h3>
                <ul class="space-y-3 bg-base-200 rounded-box p-4">
                  <li class="flex items-center">
                    <div class="flex items-center gap-2">
                      <div class="badge badge-success badge-sm">✓</div>
                      <span>Full TypeScript support with strict typing</span>
                    </div>
                  </li>
                  <li class="flex items-center">
                    <div class="flex items-center gap-2">
                      <div class="badge badge-success badge-sm">✓</div>
                      <span>Explicit component lifecycle management</span>
                    </div>
                  </li>
                  <li class="flex items-center">
                    <div class="flex items-center gap-2">
                      <div class="badge badge-success badge-sm">✓</div>
                      <span>Event-driven component communication</span>
                    </div>
                  </li>
                  <li class="flex items-center">
                    <div class="flex items-center gap-2">
                      <div class="badge badge-success badge-sm">✓</div>
                      <span>Built-in static site generation</span>
                    </div>
                  </li>
                  <li class="flex items-center">
                    <div class="flex items-center gap-2">
                      <div class="badge badge-success badge-sm">✓</div>
                      <span>Performance-optimized with minimal overhead</span>
                    </div>
                  </li>
                  <li class="flex items-center">
                    <div class="flex items-center gap-2">
                      <div class="badge badge-success badge-sm">✓</div>
                      <span>Clear separation of logic and presentation</span>
                    </div>
                  </li>
                </ul>

                <div class="mt-6">
                  <button
                    id="hide-demo-btn"
                    class="btn btn-ghost btn-sm"
                  >
                    Hide Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<HomeDemoEvents>): BindReturn<HomeDemoLogic> {
  const demoArea = el.querySelector('#demo-area') as HTMLElement
  const demoToggleBtn = el.querySelector('#demo-toggle-btn') as HTMLButtonElement
  const hideDemoBtn = el.querySelector('#hide-demo-btn') as HTMLButtonElement
  const docsBtn = el.querySelector('#docs-btn') as HTMLButtonElement

  function showDemo() {
    if (demoArea) {
      const isHidden = demoArea.classList.contains('hidden')
      demoArea.classList.toggle('hidden')

      // Update button text based on visibility
      if (demoToggleBtn) {
        demoToggleBtn.textContent = isHidden ? 'Hide Demo' : 'Try Interactive Demo'
      }

      // Smooth scroll to demo area when showing
      if (isHidden) {
        setTimeout(() => {
          demoArea.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
    }
  }

  function openDocs() {
    window.open('https://github.com/navilan/duct-ui', '_blank')
  }

  // Bind event listeners
  if (demoToggleBtn) {
    demoToggleBtn.addEventListener('click', showDemo)
  }

  if (hideDemoBtn) {
    hideDemoBtn.addEventListener('click', showDemo)
  }

  if (docsBtn) {
    docsBtn.addEventListener('click', openDocs)
  }

  function release() {
    // Remove event listeners
    if (demoToggleBtn) {
      demoToggleBtn.removeEventListener('click', showDemo)
    }
    if (hideDemoBtn) {
      hideDemoBtn.removeEventListener('click', showDemo)
    }
    if (docsBtn) {
      docsBtn.removeEventListener('click', openDocs)
    }
  }

  return {
    showDemo,
    release
  }
}

const id = { id: "starter/home-demo" }

const HomeDemo = createBlueprint<HomeDemoProps, HomeDemoEvents, HomeDemoLogic>(
  id,
  render,
  { bind }
)

export default HomeDemo