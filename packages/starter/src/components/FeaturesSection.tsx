import { createBlueprint, renderProps, type BaseProps } from '@duct-ui/core'
import type { BindReturn } from '@duct-ui/core/blueprint'

export interface FeaturesSectionLogic {
  // Add any features-specific logic here if needed
}

interface FeaturesSectionProps {
  // Can add props for customization if needed
}

function render(props: BaseProps<FeaturesSectionProps>) {
  const { ...moreProps } = props

  return (
    <section class="py-24 bg-base-200 text-base-content" {...renderProps(moreProps)}>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-bold mb-6">
            Why Choose Duct UI?
          </h2>
          <p class="text-xl opacity-70 max-w-3xl mx-auto">
            Built for developers who value <span class="text-accent-content font-medium">explicit patterns</span>,
            <span class="text-accent-content font-medium">performance</span>, and
            <span class="text-accent-content font-medium">maintainable code</span>.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div
            class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="card-body text-center">
              <div class="flex justify-center mb-6">
                <div class="bg-primary text-primary-content rounded-full w-16 h-16 flex items-center justify-center">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 class="card-title justify-center text-2xl font-bold mb-4">Fast & Lightweight</h3>
              <p class="opacity-70 leading-relaxed">
                Optimized for performance with minimal runtime overhead, efficient rendering, and lightning-fast static
                site generation.
              </p>
            </div>
          </div>

          <div
            class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="card-body text-center">
              <div class="flex justify-center mb-6">
                <div
                  class="bg-secondary text-secondary-content rounded-full w-16 h-16 flex items-center justify-center">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
              <h3 class="card-title justify-center text-2xl font-bold mb-4">Developer Friendly</h3>
              <p class="opacity-70 leading-relaxed">
                Clear separation of concerns with explicit render, bind, and lifecycle patterns. TypeScript-first with
                excellent tooling.
              </p>
            </div>
          </div>

          <div
            class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="card-body text-center">
              <div class="flex justify-center mb-6">
                <div class="bg-accent text-accent-content rounded-full w-16 h-16 flex items-center justify-center">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <h3 class="card-title justify-center text-2xl font-bold mb-4">Static Generation</h3>
              <p class="opacity-70 leading-relaxed">
                Built-in static site generation with dynamic routing, content management, and seamless deployment
                workflows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function bind(el: HTMLElement, eventEmitter: any): BindReturn<FeaturesSectionLogic> {
  return {
    release: () => {
      // Component cleanup if needed
    }
  }
}

const id = { id: "starter/features-section" }

const FeaturesSection = createBlueprint<FeaturesSectionProps, {}, FeaturesSectionLogic>(
  id,
  render,
  { bind }
)

export default FeaturesSection