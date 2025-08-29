import { createBlueprint, renderProps, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import DemoLayout from "@components/DemoLayout"
import Markdown from "@duct-ui/components/content/markdown/markdown"
import "@duct-ui/components/content/markdown/markdown.css"
import introductionContent from "./content/why-duct/introduction.md?raw"
import explicitOverImplicitContent from "./content/why-duct/explicit-over-implicit.md?raw"

export interface DocsWhyDuctEvents extends BaseComponentEvents { }
export interface DocsWhyDuctLogic { }
export interface DocsWhyDuctProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<DocsWhyDuctProps>) {
  return (
    <div {...renderProps(props)}>
      <DemoLayout
        title="Why Choose Duct?"
        description="Benefits and advantages of the Duct UI Framework"
        sourcePath="/demos/DocsWhyDuctDemo.tsx"
      >
        <div class="prose prose-lg max-w-none">
          <Markdown content={introductionContent} />

          <h2>Key Advantages</h2>

          <div class="not-prose">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div class="info-card info-card-gradient-primary">
                <div class="card-body">
                  <h3 class="card-title text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Developer Experience
                  </h3>
                  <ul class="text-sm space-y-1">
                    <li>✓ Clear separation of concerns</li>
                    <li>✓ Intuitive component lifecycle</li>
                    <li>✓ Full TypeScript support</li>
                    <li>✓ Excellent IDE integration</li>
                    <li>✓ Easy debugging</li>
                  </ul>
                </div>
              </div>

              <div class="info-card info-card-gradient-secondary">
                <div class="card-body">
                  <h3 class="card-title text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Maintainability
                  </h3>
                  <ul class="text-sm space-y-1">
                    <li>✓ Predictable code structure</li>
                    <li>✓ Easy to test components</li>
                    <li>✓ Clear data flow</li>
                    <li>✓ Minimal abstractions</li>
                    <li>✓ Self-documenting patterns</li>
                  </ul>
                </div>
              </div>

              <div class="info-card info-card-gradient-success">
                <div class="card-body">
                  <h3 class="card-title text-success">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Explicit Over Implicit
                  </h3>
                  <ul class="text-sm space-y-1">
                    <li>✓ Direct DOM manipulation</li>
                    <li>✓ No hidden magic or abstractions</li>
                    <li>✓ Easy AI-generated code debugging</li>
                    <li>✓ Clear component boundaries</li>
                    <li>✓ Transparent behavior</li>
                  </ul>
                </div>
              </div>

              <div class="info-card info-card-gradient-warning">
                <div class="card-body">
                  <h3 class="card-title text-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Simplicity First
                  </h3>
                  <ul class="text-sm space-y-1">
                    <li>✓ No virtual DOM complexity</li>
                    <li>✓ Precompiled templates</li>
                    <li>✓ Direct event handling</li>
                    <li>✓ Smaller learning curve</li>
                    <li>✓ Less cognitive overhead</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Markdown content={explicitOverImplicitContent} />


          <h2>When to Choose Duct</h2>

          <div class="not-prose">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div class="card bg-success/10 border border-success/20">
                <div class="card-body">
                  <h3 class="card-title text-success">Great For</h3>
                  <ul class="text-sm space-y-1">
                    <li>✓ Long-lived, maintainable codebases</li>
                    <li>✓ Teams that value simplicity and clarity</li>
                    <li>✓ Projects requiring clear debugging paths</li>
                    <li>✓ Applications with complex DOM interactions</li>
                    <li>✓ Progressive enhancement scenarios</li>
                    <li>✓ AI-assisted development workflows</li>
                  </ul>
                </div>
              </div>

              <div class="card bg-warning/10 border border-warning/20">
                <div class="card-body">
                  <h3 class="card-title text-warning">Consider Alternatives For</h3>
                  <ul class="text-sm space-y-1">
                    <li>• Rapid prototyping needs</li>
                    <li>• Existing large React ecosystems</li>
                    <li>• Teams heavily invested in other frameworks</li>
                    <li>• Simple static sites</li>
                    <li>• Projects requiring pre-built massive component libraries</li>
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
              <strong>Bottom Line:</strong> Choose Duct when you want the benefits of modern component architecture
              with maximum clarity and debuggability. It's perfect for teams that value maintainable, explicit code
              over complex abstractions.
            </span>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

function bind(): BindReturn<DocsWhyDuctLogic> {
  return {
    release: () => { }
  }
}

const id = { id: "duct-demo/docs-why-duct" }

const DocsWhyDuct = createBlueprint<DocsWhyDuctProps, DocsWhyDuctEvents, DocsWhyDuctLogic>(
  id,
  render,
  { bind }
)

export default DocsWhyDuct