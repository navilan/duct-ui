import { createBlueprint, type BaseProps, createRef } from '@duct-ui/core'
import type { BindReturn } from '@duct-ui/core/blueprint'
import SiteSearch from './SiteSearch'
import SearchModalProvider, { type SearchModalProviderLogic } from './SearchModalProvider'

export interface HeroSectionLogic {
  openSearch: () => void
}

interface HeroSectionProps {
  siteName?: string
  siteUrl?: string
}

function render(props: BaseProps<HeroSectionProps>) {
  const {
    siteName = 'Duct Starter',
    siteUrl = 'https://starter.duct-ui.org',
    ...moreProps
  } = props

  return (
    <>
      {/* Search Modal Provider - rendered outside hero constraints at document level */}
      <SearchModalProvider />

      <section class="hero bg-primary text-primary-content min-h-screen relative overflow-hidden" {...moreProps}>
        {/* Background decoration */}
        <div class="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>

        <div class="hero-content text-center relative z-10 max-w-7xl">
          <div>
            {/* Badge */}
            <div class="badge badge-secondary badge-outline mb-8 p-4">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Powered by Duct UI Framework
            </div>

            <h1 class="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              Welcome to <span class="text-accent">{siteName}</span>
            </h1>

            <p class="text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed opacity-90">
              A modern website starter built with Duct UI - the component framework
              that brings <span class="font-semibold">clarity</span>, <span class="font-semibold">performance</span>, and
              <span class="font-semibold">maintainability</span> to web development.
            </p>

            {/* Search Section - just the button */}
            <div class="mb-10">
              <SiteSearch
                showButton={true}
                data-duct-search-modal-trigger
              />
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/about" class="btn btn-secondary btn-lg">
                Learn More
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a href="/blog" class="btn btn-outline btn-lg">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Read Blog
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function bind(el: HTMLElement, eventEmitter: any): BindReturn<HeroSectionLogic> {
  function openSearch() {
    const modal = searchModalProviderRef.current?.getSearchModal()
    if (modal) {
      modal.show()
    }
  }

  return {
    openSearch,
    release: () => {
      // Component cleanup if needed
    }
  }
}

const id = { id: "starter/hero-section" }

const HeroSection = createBlueprint<HeroSectionProps, {}, HeroSectionLogic>(
  id,
  render,
  { bind }
)

export default HeroSection