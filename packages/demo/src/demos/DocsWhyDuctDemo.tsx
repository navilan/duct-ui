import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import makeDemoLayout from "../components/DemoLayout"

export interface DocsWhyDuctDemoEvents extends BaseComponentEvents { }
export interface DocsWhyDuctDemoLogic { }
export interface DocsWhyDuctDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<DocsWhyDuctDemoProps>) {
  const DemoLayout = makeDemoLayout()

  return (
    <div {...props}>
      <DemoLayout
        title="Why Choose Duct?"
        description="Benefits and advantages of the Duct UI Framework"
        sourcePath="/demos/DocsWhyDuctDemo.tsx"
      >
        <div class="prose prose-lg max-w-none">
          <p class="lead">
            Duct offers a refreshing approach to UI development that prioritizes simplicity, clarity,
            and maintainability without sacrificing modern development practices.
          </p>

          <h2>Key Advantages</h2>

          <div class="not-prose">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div class="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
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

              <div class="card bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
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

              <div class="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
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

              <div class="card bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20">
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

          <h2>Explicit Over Implicit</h2>
          <p>
            One of Duct's core strengths is its explicit approach to component behavior. This philosophy makes it particularly
            well-suited for working with AI-generated code and debugging complex components.
          </p>

          <h3>Direct DOM Manipulation</h3>
          <p>
            Unlike frameworks that abstract DOM interactions, Duct gives you direct access to DOM elements.
            This makes it easy to understand exactly what's happening in your components:
          </p>
          <div class="not-prose">
            <div class="bg-base-200 rounded-lg p-6 my-4">
              <pre class="text-sm"><code>{`function bind(el: HTMLElement, eventEmitter, props) {
  const button = el.querySelector('button')
  const counter = el.querySelector('.counter')

  // Explicit DOM updates - no magic, no surprises
  function updateCounter(value) {
    counter.textContent = value.toString()
    button.disabled = value >= 10
  }

  // Clear event handling
  button.addEventListener('click', () => {
    const newValue = parseInt(counter.textContent) + 1
    updateCounter(newValue)
    eventEmitter.emit('change', newValue)
  })
}`}</code></pre>
            </div>
          </div>

          <h3>AI-Generated Code Debugging</h3>
          <p>
            When AI tools like Claude Code generate Duct components, the explicit nature makes it easy to:
          </p>
          <div class="not-prose">
            <ul class="list-disc list-inside space-y-2 my-4">
              <li><strong>Understand the code flow:</strong> No hidden lifecycle methods or implicit re-renders</li>
              <li><strong>Debug issues:</strong> Direct DOM queries and updates are easy to trace</li>
              <li><strong>Modify behavior:</strong> Clear separation between render, load, bind, and release phases</li>
              <li><strong>Verify correctness:</strong> Event handlers and DOM manipulations are explicit</li>
            </ul>
          </div>

          <h3>Transparent Component Behavior</h3>
          <div class="not-prose">
            <div class="bg-base-200 rounded-lg p-6 my-4">
              <pre class="text-sm"><code>{`// When you see this code, you know exactly what it does:
function bind(el, eventEmitter, props, loadData) {
  // 1. Find elements (explicit queries)
  const input = el.querySelector('input')
  const display = el.querySelector('.display')

  // 2. Initialize with loaded data (clear data flow)
  if (loadData) {
    input.value = loadData.initialValue
    display.textContent = loadData.displayText
  }

  // 3. Set up event handlers (no hidden magic)
  input.addEventListener('change', handleChange)

  // 4. Return methods for external control (explicit API)
  return {
    setValue: (value) => { input.value = value },
    getValue: () => input.value,
    release: () => input.removeEventListener('change', handleChange)
  }
}`}</code></pre>
            </div>
          </div>

          <h2>Developer Experience</h2>

          <h3>Predictable Component Structure</h3>
          <p>
            Every Duct component follows the same pattern. Once you understand one component, you understand them all.
            This consistency reduces cognitive load and makes code reviews more effective.
          </p>

          <h3>Excellent TypeScript Integration</h3>
          <p>
            Duct is built with TypeScript from the ground up. You get full type safety for component props, events,
            and exposed logic methods, with excellent IDE autocomplete and error detection.
          </p>

          <h3>Clear Data Flow</h3>
          <p>
            Data flows explicitly through the component lifecycle. There are no surprise re-renders or hidden state updates.
            You control when and how the DOM changes.
          </p>

          <h2>Progressive Enhancement</h2>

          <h3>SEO-Friendly</h3>
          <p>
            Duct components work great with server-side rendering. Templates generate clean HTML that search engines
            can easily parse, and the framework enhances this HTML progressively.
          </p>

          <h3>Works with Existing HTML</h3>
          <p>
            You can enhance existing HTML with Duct components without rebuilding your entire application.
            This makes migration and adoption much easier.
          </p>

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

          <div class="alert alert-info mt-6">
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

function bind(): BindReturn<DocsWhyDuctDemoLogic> {
  return {
    release: () => { }
  }
}

const id = { id: "duct-demo/docs-why-duct" }

export default () => {
  return createBlueprint<DocsWhyDuctDemoProps, DocsWhyDuctDemoEvents, DocsWhyDuctDemoLogic>(
    id,
    render,
    { bind }
  )
}