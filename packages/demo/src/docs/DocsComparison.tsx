import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import DemoLayout from "@components/DemoLayout"
import { escapeHtml } from "@kitajs/html"
import Markdown from "@duct-ui/components/content/markdown/markdown"
import "@duct-ui/components/content/markdown/markdown.css"
import introductionContent from "./content/comparison/introduction.md?raw"
import reactButtonExample from "./content/comparison/examples/react-button.md?raw"
import vueButtonExample from "./content/comparison/examples/vue-button.md?raw"
import svelteButtonExample from "./content/comparison/examples/svelte-button.md?raw"
import webComponentsButtonExample from "./content/comparison/examples/webcomponents-button.md?raw"
import ductButtonExample from "./content/comparison/examples/duct-button.md?raw"

export interface DocsComparisonEvents extends BaseComponentEvents { }
export interface DocsComparisonLogic { }
export interface DocsComparisonProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<DocsComparisonProps>) {
  return (
    <div {...props}>
      <DemoLayout
        title="Duct vs Other Frameworks"
        description="How Duct compares to React, Vue, and Svelte"
        sourcePath="/demos/DocsComparisonDemo.tsx"
      >
        <div class="prose prose-lg max-w-none">
          <Markdown content={introductionContent} />

          <h2>Component Library Comparison</h2>
          <p>
            This section compares Duct as a component library for building interactive UI components.
          </p>

          <div class="not-prose">
            <div class="overflow-x-auto my-6">
              <table class="table table-zebra table-sm">
                <thead>
                  <tr>
                    <th class="font-bold">Feature</th>
                    <th class="font-bold text-primary">Duct</th>
                    <th class="font-bold">React</th>
                    <th class="font-bold">Vue</th>
                    <th class="font-bold">Svelte</th>
                    <th class="font-bold">Web Components</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="font-medium">Architecture</td>
                    <td>Blueprint pattern with separation</td>
                    <td>Component with mixed concerns</td>
                    <td>SFC with sections</td>
                    <td>Compiled components</td>
                    <td>Custom elements with class</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Virtual DOM</td>
                    <td class="text-success">❌ No</td>
                    <td class="text-warning">✅ Yes</td>
                    <td class="text-warning">✅ Yes</td>
                    <td class="text-success">❌ No</td>
                    <td class="text-success">❌ No</td>
                  </tr>
                  <tr>
                    <td class="font-medium">State Management</td>
                    <td>External/Manual</td>
                    <td>useState/useReducer</td>
                    <td>Reactive data</td>
                    <td>Reactive stores</td>
                    <td>Manual/Properties</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Learning Curve</td>
                    <td class="text-success">Low</td>
                    <td class="text-error">Medium-High</td>
                    <td class="text-warning">Medium</td>
                    <td class="text-success">Low-Medium</td>
                    <td class="text-warning">Medium</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Template Syntax</td>
                    <td>JSX</td>
                    <td>JSX</td>
                    <td>Template/JSX</td>
                    <td>Enhanced HTML</td>
                    <td>HTML/Template literals</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Logic Location</td>
                    <td class="text-primary">Separate bind function</td>
                    <td>Mixed in component</td>
                    <td>Script section</td>
                    <td>Script section</td>
                    <td>Class methods</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Reactivity</td>
                    <td>Event-driven</td>
                    <td>Re-render based</td>
                    <td>Proxy-based</td>
                    <td>Compile-time</td>
                    <td>Manual/Observers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h2>Detailed Comparisons</h2>

          <div class="not-prose">
            <div class="alert mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <div class="font-bold">Notice</div>
                <div class="text-sm">
                  Pay attention to how Duct code is direct, explicit, and easily understandable. What you see is what executes -
                  no hidden abstractions, magic behaviors, or complex state management. This makes debugging straightforward
                  and code behavior predictable.
                </div>
              </div>
            </div>
          </div>

          <h3>Duct vs React</h3>
          <p>
            React popularized component-based UI development, but Duct takes a fundamentally different approach
            to organizing component logic.
          </p>

          <div class="not-prose">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title text-error">React Component</h4>
                  <div class="prose prose-sm max-w-none">
                    <Markdown content={reactButtonExample} />
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-body">
                  <h4 class="card-title text-primary">Duct Component</h4>
                  <div class="prose prose-sm max-w-none">
                    <Markdown content={ductButtonExample} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="not-prose">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="info-card info-card-success">
                <div class="card-body">
                  <h4 class="card-title text-success text-base">Duct Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>✓ No re-rendering overhead</li>
                    <li>✓ Direct DOM control</li>
                    <li>✓ Clear separation of concerns</li>
                    <li>✓ Explicit behavior</li>
                    <li>✓ No hooks complexity</li>
                  </ul>
                </div>
              </div>
              <div class="info-card info-card-warning">
                <div class="card-body">
                  <h4 class="card-title text-warning text-base">React Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Large ecosystem</li>
                    <li>• Extensive tooling</li>
                    <li>• Huge community</li>
                    <li>• More job opportunities</li>
                    <li>• Mature libraries</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h3>Duct vs Vue</h3>
          <p>
            Vue offers a middle ground between React and traditional templating, while Duct goes further
            in separating concerns.
          </p>

          <div class="not-prose">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title text-secondary">Vue Component</h4>
                  <div class="prose prose-sm max-w-none">
                    <Markdown content={vueButtonExample} />
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-body">
                  <h4 class="card-title text-primary">Duct Component</h4>
                  <div class="prose prose-sm max-w-none">
                    <Markdown content={ductButtonExample} />
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div class="not-prose">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="info-card info-card-success">
                <div class="card-body">
                  <h4 class="card-title text-success text-base">Duct Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>✓ No reactivity magic to debug</li>
                    <li>✓ Explicit DOM control</li>
                    <li>✓ Clear separation of template/logic</li>
                    <li>✓ Standard JavaScript patterns</li>
                    <li>✓ Predictable performance</li>
                  </ul>
                </div>
              </div>
              <div class="info-card info-card-warning">
                <div class="card-body">
                  <h4 class="card-title text-warning text-base">Vue Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Gentle learning curve</li>
                    <li>• Progressive enhancement</li>
                    <li>• Excellent documentation</li>
                    <li>• Built-in state management</li>
                    <li>• Single-file components</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h3>Duct vs Svelte</h3>
          <p>
            Both Duct and Svelte avoid virtual DOM, but they differ significantly in their compilation
            and component organization approaches.
          </p>

          <div class="not-prose">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title text-accent">Svelte Component</h4>
                  <div class="prose prose-sm max-w-none">
                    <Markdown content={svelteButtonExample} />
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-body">
                  <h4 class="card-title text-primary">Duct Component</h4>
                  <div class="prose prose-sm max-w-none">
                    <Markdown content={ductButtonExample} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="not-prose">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="info-card info-card-success">
                <div class="card-body">
                  <h4 class="card-title text-success text-base">Duct Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>✓ No compile step required</li>
                    <li>✓ Runtime transparency</li>
                    <li>✓ Standard build tools</li>
                    <li>✓ Explicit behavior</li>
                    <li>✓ Easy debugging</li>
                  </ul>
                </div>
              </div>
              <div class="info-card info-card-warning">
                <div class="card-body">
                  <h4 class="card-title text-warning text-base">Svelte Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Tiny bundle sizes</li>
                    <li>• Compile-time optimizations</li>
                    <li>• Built-in animations</li>
                    <li>• Simple reactive syntax</li>
                    <li>• No runtime overhead</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h3>Duct vs Web Components</h3>
          <p>
            Both Duct and Web Components embrace direct DOM manipulation and standards-based approaches,
            but they differ in their component organization and abstraction levels.
          </p>

          <div class="not-prose">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title text-neutral">Web Components</h4>
                  <div class="prose prose-sm max-w-none">
                    <Markdown content={webComponentsButtonExample} />
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-body">
                  <h4 class="card-title text-primary">Duct Component</h4>
                  <div class="prose prose-sm max-w-none">
                    <Markdown content={ductButtonExample} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="not-prose">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="info-card info-card-success">
                <div class="card-body">
                  <h4 class="card-title text-success text-base">Duct Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>✓ Clear separation of render/logic concerns</li>
                    <li>✓ No Shadow DOM complexity</li>
                    <li>✓ Simpler component composition</li>
                    <li>✓ Framework-agnostic JSX templates</li>
                    <li>✓ Explicit lifecycle management</li>
                    <li>✓ Better TypeScript integration</li>
                  </ul>
                </div>
              </div>
              <div class="info-card info-card-warning">
                <div class="card-body">
                  <h4 class="card-title text-warning text-base">Web Components Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Native browser standard</li>
                    <li>• True encapsulation with Shadow DOM</li>
                    <li>• Framework interoperability</li>
                    <li>• No build step required</li>
                    <li>• CSS isolation by default</li>
                    <li>• Custom element lifecycle</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h3>When to Choose Component Libraries</h3>

          <div class="not-prose">
            {/* Duct Components - Full Width */}
            <div class="info-card info-card-primary my-6">
              <div class="card-body">
                <h4 class="card-title text-primary text-xl">Choose Duct Components When</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <ul class="text-sm space-y-2">
                    <li>✓ You value explicit, debuggable code</li>
                    <li>✓ You need direct DOM control</li>
                    <li>✓ You want minimal abstractions</li>
                  </ul>
                  <ul class="text-sm space-y-2">
                    <li>✓ You're building long-lived applications</li>
                    <li>✓ You work with AI code generation</li>
                    <li>✓ You prefer separation of concerns</li>
                  </ul>
                  <ul class="text-sm space-y-2">
                    <li>✓ You need predictable performance</li>
                    <li>✓ You want clear debugging paths</li>
                    <li>✓ You prioritize maintainability</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Other Component Libraries */}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
              <div class="card border">
                <div class="card-body">
                  <h4 class="card-title">Choose React When</h4>
                  <ul class="text-sm space-y-1">
                    <li>• You need the largest ecosystem</li>
                    <li>• You have React expertise</li>
                    <li>• You need enterprise support</li>
                    <li>• You're building complex SPAs</li>
                    <li>• You need extensive third-party libraries</li>
                  </ul>
                </div>
              </div>

              <div class="card bg-secondary/10 border border-secondary/20">
                <div class="card-body">
                  <h4 class="card-title text-secondary">Choose Vue When</h4>
                  <ul class="text-sm space-y-1">
                    <li>• You want balanced complexity</li>
                    <li>• You like single-file components</li>
                    <li>• You need official router/state management</li>
                    <li>• You're migrating from jQuery</li>
                    <li>• You want good documentation</li>
                  </ul>
                </div>
              </div>

              <div class="card bg-accent/10 border border-accent/20">
                <div class="card-body">
                  <h4 class="card-title text-accent">Choose Svelte When</h4>
                  <ul class="text-sm space-y-1">
                    <li>• You want the smallest bundle sizes</li>
                    <li>• You like compile-time optimizations</li>
                    <li>• You want built-in animations</li>
                    <li>• You prefer simpler mental models</li>
                    <li>• You're building content sites</li>
                  </ul>
                </div>
              </div>

              <div class="card bg-neutral/10 border border-neutral/20">
                <div class="card-body">
                  <h4 class="card-title text-neutral">Choose Web Components When</h4>
                  <ul class="text-sm space-y-1">
                    <li>• You need true framework interoperability</li>
                    <li>• You want standards-based components</li>
                    <li>• You need CSS encapsulation</li>
                    <li>• You're building design systems</li>
                    <li>• You want no build dependencies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h2>Complete Framework Comparison</h2>
          <p>
            This section compares Duct as a complete framework for building full applications with SSG, routing, and content management.
          </p>

          <div class="not-prose">
            <div class="overflow-x-auto my-6">
              <table class="table table-zebra table-sm">
                <thead>
                  <tr>
                    <th class="font-bold">Feature</th>
                    <th class="font-bold text-primary">Duct</th>
                    <th class="font-bold">Next.js</th>
                    <th class="font-bold">Nuxt</th>
                    <th class="font-bold">SvelteKit</th>
                    <th class="font-bold">Astro</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="font-medium">SSG/SSR</td>
                    <td class="text-success">✅ Built-in SSG</td>
                    <td class="text-success">✅ Full SSG/SSR</td>
                    <td class="text-success">✅ Full SSG/SSR</td>
                    <td class="text-success">✅ Full SSG/SSR</td>
                    <td class="text-success">✅ Content-focused SSG</td>
                  </tr>
                  <tr>
                    <td class="font-medium">File-based Routing</td>
                    <td class="text-success">✅ Built-in</td>
                    <td class="text-success">✅ Pages & app router</td>
                    <td class="text-success">✅ Built-in</td>
                    <td class="text-success">✅ Built-in</td>
                    <td class="text-success">✅ Built-in</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Content Management</td>
                    <td class="text-success">✅ Markdown + assets</td>
                    <td class="text-warning">⚠️ Via plugins</td>
                    <td class="text-warning">⚠️ Via modules</td>
                    <td class="text-warning">⚠️ Manual setup</td>
                    <td class="text-success">✅ Content collections</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Asset Management</td>
                    <td class="text-success">✅ Automatic copying</td>
                    <td class="text-success">✅ Advanced optimization</td>
                    <td class="text-success">✅ Built-in optimization</td>
                    <td class="text-warning">⚠️ Via adapters</td>
                    <td class="text-success">✅ Built-in optimization</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Learning Curve</td>
                    <td class="text-success">Low</td>
                    <td class="text-error">High</td>
                    <td class="text-warning">Medium-High</td>
                    <td class="text-warning">Medium</td>
                    <td class="text-success">Low-Medium</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Architecture</td>
                    <td>SSG with hydrated islands</td>
                    <td>Full-stack React</td>
                    <td>Full-stack Vue</td>
                    <td>Full-stack Svelte</td>
                    <td>Islands with framework choice</td>
                  </tr>
                  <tr>
                    <td class="font-medium">API Routes</td>
                    <td class="text-error">❌ Static-only</td>
                    <td class="text-success">✅ Full API support</td>
                    <td class="text-success">✅ Full API support</td>
                    <td class="text-success">✅ Full API support</td>
                    <td class="text-warning">⚠️ Via integrations</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Template System</td>
                    <td class="text-primary">Nunjucks (static) + JSX (components)</td>
                    <td>JSX everywhere</td>
                    <td>Vue templates everywhere</td>
                    <td>Svelte templates everywhere</td>
                    <td>Astro templates + framework islands</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Static/Dynamic Separation</td>
                    <td class="text-success">✅ Clear separation</td>
                    <td class="text-warning">⚠️ Mixed concerns</td>
                    <td class="text-warning">⚠️ Mixed concerns</td>
                    <td class="text-warning">⚠️ Mixed concerns</td>
                    <td class="text-success">✅ Islands pattern</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Deployment Target</td>
                    <td>Static hosting (CDN)</td>
                    <td>Vercel/Node.js/Edge</td>
                    <td>Various platforms</td>
                    <td>Various adapters</td>
                    <td>Static hosting/Edge</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3>When to Choose Complete Frameworks</h3>
            
          <div class="not-prose">
            <div class="info-card info-card-primary my-6">
              <div class="card-body">
                <h4 class="card-title text-primary text-xl">Choose Duct Framework When</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <ul class="text-sm space-y-2">
                    <li>✓ You're building content-driven sites</li>
                    <li>✓ You want simple SSG without complexity</li>
                    <li>✓ You need automatic content management</li>
                  </ul>
                  <ul class="text-sm space-y-2">
                    <li>✓ You prefer static-first architecture</li>
                    <li>✓ You want clear static/dynamic separation</li>
                    <li>✓ You like proven templating (Nunjucks)</li>
                  </ul>
                  <ul class="text-sm space-y-2">
                    <li>✓ You want fast, SEO-friendly sites</li>
                    <li>✓ You prefer explicit over magic</li>
                    <li>✓ You value simplicity and maintainability</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Complete Frameworks Grid */}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
              <div class="card border">
                <div class="card-body">
                  <h4 class="card-title">Choose Next.js When</h4>
                  <ul class="text-sm space-y-1">
                    <li>• You need full-stack React applications</li>
                    <li>• You want advanced SSR/SSG features</li>
                    <li>• You need API routes and serverless</li>
                    <li>• You're building e-commerce sites</li>
                    <li>• You need enterprise React features</li>
                  </ul>
                </div>
              </div>

              <div class="card bg-secondary/10 border border-secondary/20">
                <div class="card-body">
                  <h4 class="card-title text-secondary">Choose Nuxt When</h4>
                  <ul class="text-sm space-y-1">
                    <li>• You prefer Vue ecosystem</li>
                    <li>• You want opinionated structure</li>
                    <li>• You need full-stack capabilities</li>
                    <li>• You want automatic routing</li>
                    <li>• You need Vue-specific optimizations</li>
                  </ul>
                </div>
              </div>

              <div class="card bg-accent/10 border border-accent/20">
                <div class="card-body">
                  <h4 class="card-title text-accent">Choose SvelteKit When</h4>
                  <ul class="text-sm space-y-1">
                    <li>• You love Svelte's approach</li>
                    <li>• You want small bundle sizes</li>
                    <li>• You need full-stack capabilities</li>
                    <li>• You prefer compile-time optimizations</li>
                    <li>• You want simple mental models</li>
                  </ul>
                </div>
              </div>

              <div class="card bg-neutral/10 border border-neutral/20">
                <div class="card-body">
                  <h4 class="card-title text-neutral">Choose Astro When</h4>
                  <ul class="text-sm space-y-1">
                    <li>• You want zero JS by default</li>
                    <li>• You need content-heavy sites</li>
                    <li>• You want islands architecture</li>
                    <li>• You need framework flexibility</li>
                    <li>• You prioritize maximum performance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="alert mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>
              <strong>Remember:</strong> Each framework solves different problems well. Choose based on your project needs,
              team expertise, and long-term maintenance goals rather than popularity alone.
            </span>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

function bind(): BindReturn<DocsComparisonLogic> {
  return {
    release: () => { }
  }
}

const id = { id: "duct-demo/docs-comparison" }

const DocsComparison = createBlueprint<DocsComparisonProps, DocsComparisonEvents, DocsComparisonLogic>(
  id,
  render,
  { bind }
)

export default DocsComparison