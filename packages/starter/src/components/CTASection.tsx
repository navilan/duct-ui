import { createBlueprint, renderProps, type BaseProps } from '@duct-ui/core'
import type { BindReturn } from '@duct-ui/core/blueprint'

export interface CTASectionLogic {
  // Add any CTA-specific logic here if needed
}

interface CTASectionProps {
  // Can add props for customization if needed
}

function render(props: BaseProps<CTASectionProps>) {
  const { ...moreProps } = props

  return (
    <section class="hero bg-primary text-primary-content py-24 relative overflow-hidden" {...renderProps(moreProps)}>
      <div class="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>

      <div class="hero-content text-center relative z-10 max-w-7xl">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p class="text-xl md:text-2xl mb-10 leading-relaxed opacity-90">
            Join developers who are building faster, more maintainable web applications with Duct UI.
            Start your project today and experience the difference.
          </p>
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href="/contact" class="btn btn-secondary btn-lg">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Get in Touch
            </a>
            <a href="/about" class="btn btn-outline btn-lg">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div class="stats shadow mt-16 bg-base-100/20">
            <div class="stat">
              <div class="stat-value text-secondary">100%</div>
              <div class="stat-desc text-base-content/80">TypeScript Support</div>
            </div>
            <div class="stat">
              <div class="stat-value text-accent">Zero</div>
              <div class="stat-desc text-base-content/80">Runtime Dependencies</div>
            </div>
            <div class="stat">
              <div class="stat-value text-info">Fast</div>
              <div class="stat-desc text-base-content/80">Static Site Generation</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function bind(el: HTMLElement, eventEmitter: any): BindReturn<CTASectionLogic> {
  return {
    release: () => {
      // Component cleanup if needed
    }
  }
}

const id = { id: "starter/cta-section" }

const CTASection = createBlueprint<CTASectionProps, {}, CTASectionLogic>(
  id,
  render,
  { bind }
)

export default CTASection