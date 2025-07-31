import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import ductLogo from "../icons/duct-logo.svg"
import { escapeHtml } from "@kitajs/html"

export interface LandingPageEvents extends BaseComponentEvents { }
export interface LandingPageLogic { }
export interface LandingPageProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<LandingPageProps>) {
  return (
    <div {...props}>
      <div class="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
        {/* Hero Section */}
        <div class="container mx-auto px-6 py-16">
          <div class="text-center">
            {/* Logo */}
            <div class="flex justify-center mb-8">
              <div class="relative inline-block rounded-full border-2 m-8 border-primary/30 bg-primary/5">
                <img src={ductLogo} alt="Duct UI" class="h-32 w-32" />
              </div>
            </div>

            {/* Title */}
            <h1 class="text-5xl md:text-7xl font-bold text-base-content mb-6">
              Duct UI
            </h1>

            {/* Subtitle */}
            <p class="text-xl md:text-2xl text-base-content/80 mb-4 font-light">
              A compact, DOM-first UI library
            </p>

            {/* Tagline */}
            <p class="text-lg text-base-content/70 mb-12 max-w-2xl mx-auto">
              Build maintainable, explicit UI components with clear separation of concerns.
              Perfect for teams that value debuggable code over complex abstractions.
            </p>

            {/* CTA Buttons */}
            <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a
                href="/docs"
                class="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold"
              >
                Get Started
              </a>
              <a
                href="https://github.com/navilan/duct-ui"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline btn-lg px-8 py-4 text-lg font-semibold"
              >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>

          {/* Key Features */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div class="text-center p-6 bg-base-100/50 backdrop-blur-sm rounded-xl border border-base-300/50">
              <div class="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-base-content/80 mb-3">Explicit & Debuggable</h3>
              <p class="text-base-content/70 leading-relaxed">
                No hidden magic or complex abstractions. Every component behavior is explicit and easy to trace.
              </p>
            </div>

            <div class="text-center p-6 bg-base-100/50 backdrop-blur-sm rounded-xl border border-base-300/50">
              <div class="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-base-content/80 mb-3">Clean Architecture</h3>
              <p class="text-base-content/70 leading-relaxed">
                Clear separation between templates and logic. Blueprint pattern keeps code organized and maintainable.
              </p>
            </div>

            <div class="text-center p-6 bg-base-100/50 backdrop-blur-sm rounded-xl border border-base-300/50">
              <div class="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-base-content/80 mb-3">Direct DOM Control</h3>
              <p class="text-base-content/70 leading-relaxed">
                No virtual DOM overhead. Direct manipulation gives you predictable performance and full control.
              </p>
            </div>
          </div>

          {/* Quick Start */}
          <div class="max-w-5xl mx-auto">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-base-content/90 mb-4">Quick Start</h2>
              <p class="text-base-content/70">Get up and running with Duct in minutes</p>
            </div>

            <div class="bg-base-100/60 backdrop-blur-sm rounded-xl p-8 border border-base-300/50">
              <div class="grid grid-cols-1 gap-8">
                {/* Installation */}
                <div>
                  <h3 class="text-xl font-semibold mb-4 flex items-center">
                    <span class="w-8 h-8 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                    <span class="text-base-content/70">
                      Install
                    </span>
                  </h3>
                  <div class="text-center mt-2 flex justify-start px-12">
                    <img alt="NPM Version" src="https://img.shields.io/npm/v/%40duct-ui%2Fcore?style=for-the-badge" />
                  </div>
                  <div class="bg-base-300/50 rounded-lg p-4 font-mono text-md">
                    <div class="text-success">pnpm install @duct-ui/core</div>
                    <div class="text-success">pnpm install @duct-ui/components</div>
                  </div>
                </div>

                {/* Usage */}
                <div>
                  <h3 class="text-xl font-semibold mb-4 flex items-center">
                    <span class="w-8 h-8 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                    <span class="text-base-content/70">
                      Use
                    </span>
                  </h3>
                  <div class="bg-base-300/50 rounded-lg p-4 font-mono text-sm md:text-md flex flex-col gap-2">
                    <div class="text-info">
                      {escapeHtml(`import Button from '@duct-ui/components/button'`)}
                    </div>
                    <div class="text-info">
                      {escapeHtml(`import type {ButtonLogic} from '@duct-ui/components/button'`)}
                    </div>
                    <div class="text-info">
                      {escapeHtml(`import {createRef} from "@duct-ui/core"`)}
                    </div>
                    <div class="text-info">
                      {
                        escapeHtml(`...`)
                      }
                    </div>
                    <div class="text-info">
                      {
                        escapeHtml(`const buttonRef: MutableRef<ButtonLogic> = createRef()`)
                      }
                    </div>
                    <div class="text-info">
                      {
                        escapeHtml(`...`)
                      }
                    </div>
                    <div class="text-info">
                      {
                        escapeHtml(`<Button`)
                      }
                    </div>
                    <div class="text-info">
                      {
                        escapeHtml(` ref={buttonRef}`)
                      }
                    </div>
                    <div class="text-info">
                      {
                        escapeHtml(`label="Let's Go"`)
                      }
                    </div>
                    <div class="text-info">
                      {
                        escapeHtml(`on:click={...}`)
                      }
                    </div>
                    <div class="text-info">
                      {
                        escapeHtml(`/>`)
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div class="mt-16 text-center">
            <div class="flex flex-wrap justify-center gap-6">
              <a href="/demos" class="link link-primary text-lg font-medium">
                ▶️ Demos
              </a>
              <a href="/docs/what-is-duct" class="link link-primary text-lg font-medium">
                📚 Documentation
              </a>
              <a href="/docs/comparison" class="link link-primary text-lg font-medium">
                ⚖️ Framework Comparison
              </a>
              <a href="/docs/building-components" class="link link-primary text-lg font-medium">
                🛠️ Building Components
              </a>
              <a href="/docs/claude-code" class="link link-primary text-lg font-medium">
                🪄️ Working with Claude Code
              </a>
              <a href="https://www.npmjs.com/package/@duct-ui/core" target="_blank" rel="noopener noreferrer" class="link link-primary text-lg font-medium">
                📦 NPM Package
              </a>
            </div>
          </div>

          {/* Footer */}
          <div class="mt-16 pt-8 border-t border-base-300/50 text-center">
            <p class="text-base-content/60">
              Built with ❤️ for developers who value clarity over complexity
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function bind(): BindReturn<LandingPageLogic> {
  return {
    release: () => { }
  }
}

const id = { id: "duct/landing-page" }

const LandingPage = createBlueprint<LandingPageProps, LandingPageEvents, LandingPageLogic>(
  id,
  render,
  { bind }
)

export default LandingPage