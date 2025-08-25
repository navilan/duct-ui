import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps, renderProps } from "@duct-ui/core/blueprint"
import ductLogo from "../icons/duct-logo.svg"
import ThemeToggle from "./ThemeToggle"
import { Markdown } from "@duct-ui/components"

export interface LandingPageEvents extends BaseComponentEvents { }
export interface LandingPageLogic { }
export interface LandingPageProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<LandingPageProps>) {
  return (
    <div {...renderProps(props)}>
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
              Web Framework for the Age of AI
            </p>

            {/* Tagline */}
            <p class="text-lg text-base-content/70 mb-12 max-w-3xl mx-auto">
              Built for clarity and explicitness, Duct makes your code understandable to both humans and AI.
              Component library + static site generator with a philosophy that embraces the future of development.
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

          {/* Two Powerful Systems */}
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
            {/* Component Library */}
            <div class="bg-base-100/60 backdrop-blur-sm rounded-xl p-8 border border-primary/30">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-base-content">Component Library</h2>
              </div>
              <p class="text-base-content/80 mb-6">
                Build interactive UI with explicit, debuggable components. Clear lifecycle management and direct DOM control.
              </p>
              <div class="space-y-3">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-base-content/70">Explicit render → bind → release lifecycle</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-base-content/70">TypeScript-first with full type safety</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-base-content/70">No virtual DOM - direct manipulation</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-base-content/70">JSX templating for familiar syntax</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-base-content/70">Works with any CSS framework or vanilla styles</span>
                </div>
              </div>
              <div class="mt-6 pt-6 border-t border-base-300">
                <a href="/docs/building-components" class="text-primary hover:text-primary-focus font-medium inline-flex items-center">
                  Learn about components
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Static Site Generator */}
            <div class="bg-base-100/60 backdrop-blur-sm rounded-xl p-8 border border-secondary/30">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-base-content">Static Site Generator</h2>
              </div>
              <p class="text-base-content/80 mb-6">
                Build fast, SEO-friendly websites with powerful content management. From blogs to documentation sites.
              </p>
              <div class="space-y-3">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-base-content/70">Markdown-based content management</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-base-content/70">Automatic routing and pagination</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-base-content/70">Nunjucks templates with custom filters</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-base-content/70">Built-in search indexing and sitemaps</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-base-content/70">Selective reanimation for interactivity</span>
                </div>
              </div>
              <div class="mt-6 pt-6 border-t border-base-300">
                <a href="/docs/static-site-generation" class="text-secondary hover:text-secondary-focus font-medium inline-flex items-center">
                  Learn about SSG
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Philosophy Section */}
          <div class="bg-base-100/60 backdrop-blur-sm rounded-xl p-8 border border-base-300/50 mb-16 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-center mb-8">Why Duct for the Age of AI?</h2>
            <p class="text-center text-base-content/80 mb-8 max-w-3xl mx-auto">
              When AI generates explicit, well-structured code, humans can easily understand, troubleshoot, and maintain it. 
              Duct's philosophy ensures AI-generated code remains debuggable and maintainable by your team.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="w-12 h-12 mx-auto mb-3 bg-primary/20 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold mb-2">Human-Friendly AI Code</h3>
                <p class="text-sm text-base-content/70">
                  Explicit patterns mean AI-generated code is instantly understandable. No magic to decipher.
                </p>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 mx-auto mb-3 bg-secondary/20 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold mb-2">Easy Troubleshooting</h3>
                <p class="text-sm text-base-content/70">
                  Clear separation makes debugging straightforward, whether code is human or AI-written.
                </p>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 mx-auto mb-3 bg-accent/20 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold mb-2">Maintainable Forever</h3>
                <p class="text-sm text-base-content/70">
                  Consistent patterns ensure your team can maintain and extend AI-generated code with confidence.
                </p>
              </div>
            </div>
            <div class="mt-6 pt-6 border-t border-base-300 text-center">
              <a href="/docs/why-duct" class="text-primary hover:text-primary-focus font-medium inline-flex items-center">
                Learn more about the Duct philosophy
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Start */}
          <div class="max-w-5xl mx-auto">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-base-content/90 mb-4">Quick Start</h2>
              <p class="text-base-content/70">Get up and running with Duct in minutes</p>
            </div>

            {/* Quick Start Options */}
            <div class="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* MCP Server for AI Development */}
              <div class="p-6 bg-primary/10 rounded-lg border border-primary/20">
                <h3 class="text-xl font-semibold mb-3 text-primary flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  MCP Server for AI Assistants
                </h3>
                <p class="text-base-content/70 mb-4">
                  AI-powered development with instant access to framework knowledge, component catalog, and project generation.
                </p>
                <div class="flex flex-col gap-3">
                  <a
                    href="/blog/2025/08/introducing-mcp-server"
                    class="btn btn-primary btn-sm"
                  >
                    Read Announcement
                  </a>
                  <a
                    href="/docs/claude-code"
                    class="btn btn-outline btn-sm"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Setup Guide
                  </a>
                  <div class="text-sm text-base-content/60">
                    <code class="bg-base-300/50 px-2 py-1 rounded text-xs">claude mcp add duct-ui</code>
                  </div>
                </div>
              </div>

              {/* Starter Template */}
              <div class="p-6 bg-primary/10 rounded-lg border border-primary/20">
                <h3 class="text-xl font-semibold mb-3 text-primary flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Complete Starter Template
                </h3>
                <p class="text-base-content/70 mb-4">
                  Get up and running instantly with a complete template including blog, themes, and components.
                </p>
                <div class="flex flex-col gap-3">
                  <a
                    href="https://starter.duct-ui.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-primary btn-sm"
                  >
                    View Live Demo
                  </a>
                  <a
                    href="https://github.com/navilan/duct-ui/tree/main/packages/starter"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-outline btn-sm"
                  >
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Source Code
                  </a>
                  <div class="text-sm text-base-content/60">
                    Copy <code class="bg-base-300/50 px-2 py-1 rounded text-xs">packages/starter</code>
                  </div>
                </div>
              </div>
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
                  <Markdown content={`
~~~typescript
import Button from '@duct-ui/components/button'
import type {ButtonLogic} from '@duct-ui/components/button'
import {createRef} from "@duct-ui/core"
...
const buttonRef: MutableRef<ButtonLogic> = createRef()
...
<Button
ref={buttonRef}
label="Let's Go"
on:click={...}
/>
~~~
                    `} />
                </div>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div class="mt-16 text-center">
            <div class="flex flex-wrap justify-center gap-6">
              <a href="/demos" class="text-primary hover:text-primary-focus text-lg font-medium no-underline hover:underline transition-colors">
                ▶️ Demos
              </a>
              <a href="/docs/what-is-duct" class="text-primary hover:text-primary-focus text-lg font-medium no-underline hover:underline transition-colors">
                📚 Documentation
              </a>
              <a href="/docs/comparison" class="text-primary hover:text-primary-focus text-lg font-medium no-underline hover:underline transition-colors">
                ⚖️ Framework Comparison
              </a>
              <a href="/docs/building-components" class="text-primary hover:text-primary-focus text-lg font-medium no-underline hover:underline transition-colors">
                🛠️ Building Components
              </a>
              <a href="/docs/claude-code" class="text-primary hover:text-primary-focus text-lg font-medium no-underline hover:underline transition-colors">
                🪄️ Working with Claude Code
              </a>
              <a href="/docs/built-with-duct" class="text-primary hover:text-primary-focus text-lg font-medium no-underline hover:underline transition-colors">
                🏗️ Built with Duct
              </a>
              <a href="/blog" class="text-primary hover:text-primary-focus text-lg font-medium no-underline hover:underline transition-colors">
                📝 Blog
              </a>
              <a href="https://www.npmjs.com/package/@duct-ui/core" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary-focus text-lg font-medium no-underline hover:underline transition-colors">
                📦 NPM Package
              </a>
            </div>
          </div>

          {/* Footer */}
          <div class="mt-16 pt-8 border-t border-base-300 text-center">
            <p class="text-base-content/60">
              Built for the future of development where humans and AI collaborate seamlessly
            </p>
          </div>
        </div>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />
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