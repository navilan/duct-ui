import { createBlueprint, type BaseProps, type BindReturn, renderProps } from "@duct-ui/core/blueprint"
import ductLogo from "../icons/duct-logo.svg"
import ThemeToggle from "./ThemeToggle"
import SearchModalProvider from "./SearchModalProvider"

export interface NotFoundPageProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}


function render(props: BaseProps<NotFoundPageProps>) {
  return (
    <div class="min-h-screen flex flex-col items-center justify-center p-8" {...renderProps(props)}>
      <div class="text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div class="logo-container mx-auto mb-8 float-animation">
          <img src={ductLogo} alt="Duct UI Logo" class="w-full h-auto max-w-[200px]" />
        </div>

        {/* 404 Message */}
        <div class="fade-in-up">
          <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 class="text-3xl font-semibold text-base-content mb-6">Page Not Found</h2>
          <p class="text-lg text-base-content/80 mb-8 leading-relaxed">
            Oops! The page you're looking for seems to have wandered off into the digital void.
            <br class="hidden sm:block" />
            But don't worry – we'll help you get back on track!
          </p>
        </div>

        {/* Search Section */}
        <div class="fade-in-up mb-8">
          <h3 class="text-xl font-semibold text-base-content mb-4">Maybe search for what you need?</h3>
          <div class="max-w-md mx-auto">
            <button
              data-duct-search-modal-trigger
              class="btn btn-primary btn-lg w-full gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search documentation, demos...
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 fade-in-up">
          {/* Home */}
          <a href="/" class="card bg-base-200 hover:bg-base-300 transition-colors group">
            <div class="card-body items-center text-center p-6">
              <svg class="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                </path>
              </svg>
              <h3 class="font-semibold text-base-content">Home</h3>
              <p class="text-sm text-base-content/70">Back to landing page</p>
            </div>
          </a>

          {/* Documentation */}
          <a href="/docs" class="card bg-base-200 hover:bg-base-300 transition-colors group">
            <div class="card-body items-center text-center p-6">
              <svg class="w-8 h-8 text-secondary mb-2 group-hover:scale-110 transition-transform" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                </path>
              </svg>
              <h3 class="font-semibold text-base-content">Documentation</h3>
              <p class="text-sm text-base-content/70">Components & guides</p>
            </div>
          </a>

          {/* Components */}
          <a href="/demos/button" class="card bg-base-200 hover:bg-base-300 transition-colors group">
            <div class="card-body items-center text-center p-6">
              <svg class="w-8 h-8 text-accent mb-2 group-hover:scale-110 transition-transform" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
                </path>
              </svg>
              <h3 class="font-semibold text-base-content">Components</h3>
              <p class="text-sm text-base-content/70">Browse components</p>
            </div>
          </a>
        </div>

        {/* External Links */}
        <div class="flex flex-wrap justify-center gap-4 mb-8 fade-in-up">
          <a href="https://github.com/navilan/duct-ui" target="_blank" rel="noopener noreferrer"
            class="btn btn-outline btn-sm gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>

          <a href="https://www.npmjs.com/package/@duct-ui/core" target="_blank" rel="noopener noreferrer"
            class="btn btn-outline btn-sm gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0H1.763zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113L5.13 5.323z" />
            </svg>
            NPM
          </a>
        </div>

        {/* Popular Demos Section */}
        <div class="fade-in-up mb-8">
          <h3 class="text-xl font-semibold text-base-content mb-4">Popular Component Demos</h3>
          <div class="flex flex-wrap justify-center gap-2">
            <a href="/demos/button" class="btn btn-sm btn-ghost">Button</a>
            <a href="/demos/editable-input" class="btn btn-sm btn-ghost">Input</a>
            <a href="/demos/modal" class="btn btn-sm btn-ghost">Modal</a>
            <a href="/demos/drawer" class="btn btn-sm btn-ghost">Drawer</a>
            <a href="/demos/menu" class="btn btn-sm btn-ghost">Menu</a>
            <a href="/demos/toggle" class="btn btn-sm btn-ghost">Toggle</a>
            <a href="/demos/select" class="btn btn-sm btn-ghost">Select</a>
            <a href="/demos/tabs" class="btn btn-sm btn-ghost">Tabs</a>
            <a href="/demos/sidebar" class="btn btn-sm btn-ghost">Sidebar</a>
            <a href="/demos/tree-view" class="btn btn-sm btn-ghost">Tree View</a>
          </div>
        </div>

        {/* Go Back Button */}
        <div class="mt-8 fade-in-up">
          <button data-go-back class="btn btn-ghost gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18">
              </path>
            </svg>
            Go Back
          </button>
        </div>
      </div>

      <style>{`
        /* Custom animations */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .logo-container {
          max-width: 200px;
          width: 100%;
        }
      `}</style>
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Search Modal Provider */}
      <SearchModalProvider />
    </div>
  )
}

function bind(el: HTMLElement): BindReturn<any> {
  const goBackButton = el.querySelector('[data-go-back]') as HTMLButtonElement

  function handleGoBack() {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  if (goBackButton) {
    goBackButton.addEventListener('click', handleGoBack)
  }

  return {
    release: () => {
      if (goBackButton) {
        goBackButton.removeEventListener('click', handleGoBack)
      }
    }
  }
}

const id = { id: "duct-demo/not-found-page" }

const NotFoundPage = createBlueprint(id, render, { bind })

export default NotFoundPage