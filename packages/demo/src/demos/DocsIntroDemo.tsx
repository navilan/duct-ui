import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import makeDemoLayout from "../components/DemoLayout"
import { escapeHtml } from "../utils/htmlUtils"

export interface DocsIntroDemoEvents extends BaseComponentEvents { }
export interface DocsIntroDemoLogic { }
export interface DocsIntroDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<DocsIntroDemoProps>) {
  const DemoLayout = makeDemoLayout()

  return (
    <div {...props}>
      <DemoLayout
        title="What is Duct?"
        description="Introduction to the Duct UI Framework"
        sourcePath="/demos/DocsIntroDemo.tsx"
      >
        <div class="prose prose-lg max-w-none">
          <p class="lead">
            Duct is a modern UI framework that provides a clear separation between view code (templates) and logic code (companions).
            It embraces simplicity and maintainability through a well-defined component architecture.
          </p>

          <h2>Core Architecture</h2>

          <h3>Blueprint Pattern</h3>
          <p>
            Every Duct component follows a blueprint pattern with distinct phases:
          </p>
          <div class="not-prose">
            <div class="bg-base-200 rounded-lg p-6 my-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="card bg-base-100 shadow-sm">
                  <div class="card-body p-4">
                    <h4 class="card-title text-base text-primary">Render</h4>
                    <p class="text-sm">Pure JSX templates that define the component's structure and initial state</p>
                  </div>
                </div>
                <div class="card bg-base-100 shadow-sm">
                  <div class="card-body p-4">
                    <h4 class="card-title text-base text-secondary">Load</h4>
                    <p class="text-sm">Optional async data fetching phase that runs before binding</p>
                  </div>
                </div>
                <div class="card bg-base-100 shadow-sm">
                  <div class="card-body p-4">
                    <h4 class="card-title text-base text-success">Bind</h4>
                    <p class="text-sm">Event handling, DOM manipulation, and component logic initialization</p>
                  </div>
                </div>
                <div class="card bg-base-100 shadow-sm">
                  <div class="card-body p-4">
                    <h4 class="card-title text-base text-warning">Release</h4>
                    <p class="text-sm">Cleanup phase that removes listeners and frees resources</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3>Separation of Concerns</h3>
          <p>
            Duct enforces a clean separation between different aspects of component development:
          </p>
          <div class="not-prose">
            <div class="overflow-x-auto">
              <table class="table table-zebra">
                <thead>
                  <tr>
                    <th>Concern</th>
                    <th>Location</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Presentation</td>
                    <td>Render Function</td>
                    <td>Define HTML structure and styling</td>
                  </tr>
                  <tr>
                    <td>Data Loading</td>
                    <td>Load Function</td>
                    <td>Fetch data asynchronously before binding</td>
                  </tr>
                  <tr>
                    <td>Behavior</td>
                    <td>Bind Function</td>
                    <td>Handle interactions and state changes</td>
                  </tr>
                  <tr>
                    <td>Cleanup</td>
                    <td>Release Function</td>
                    <td>Remove listeners and prevent memory leaks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h2>Key Features</h2>

          <h3>Type-Safe Event System</h3>
          <p>
            Duct provides a strongly typed event system built on TypeScript:
          </p>
          <div class="not-prose">
            <div class="bg-base-200 rounded-lg p-6 my-4">
              <pre class="text-sm"><code>{escapeHtml(`// Define component events with full type safety
export interface ButtonEvents extends BaseComponentEvents {
  click: (el: HTMLElement) => void
  stateChange: (el: HTMLElement, newState: string) => void
}

// Use events in templates with clear syntax
<Button
  label="Click me"
  on:click={handleButtonClick}
  on:stateChange={handleStateChange}
/>`)}</code></pre>
            </div>
          </div>

          <h3>Direct DOM Manipulation</h3>
          <p>
            Duct components have direct access to DOM elements, allowing for efficient updates without virtual DOM overhead:
          </p>
          <div class="not-prose">
            <div class="bg-base-200 rounded-lg p-6 my-4">
              <pre class="text-sm"><code>{escapeHtml(`function bind(el: HTMLElement, eventEmitter: EventEmitter<Events>) {
  const button = el.querySelector('button')

  // Direct DOM updates are fast and explicit
  function updateState(newState: string) {
    button.className = \`btn btn-\${newState}\`
    button.dataset.state = newState
  }
}`)}</code></pre>
            </div>
          </div>

          <h3>Precompiled Templates</h3>
          <p>
            Templates are compiled at build time for optimal performance, with no runtime template parsing overhead.
          </p>

          <h3>Component Logic Access</h3>
          <p>
            Components expose their logic for programmatic control using refs (recommended) or getLogic callbacks:
          </p>
          <div class="not-prose">
            <div class="bg-base-200 rounded-lg p-6 my-4">
              <pre class="text-sm"><code>{escapeHtml(`// Recommended: Use refs for synchronous access
const buttonRef = createRef()
const MyButton = makeButton()

<MyButton ref={buttonRef} label="Test" />

// Access component logic immediately
buttonRef.current?.setDisabled(true)
buttonRef.current?.updateLabel('New Text')

// Alternative: Use getLogic when you need callback timing
MyButton.getLogic().then(logic => {
  logic.setDisabled(true)
  logic.updateLabel('New Text')
})`)}</code></pre>
            </div>
          </div>

          <h2>Lifecycle Flow</h2>
          <div class="not-prose">
            <div class="my-6">
              <div class="flex flex-col space-y-4">
                <div class="flex items-center space-x-4">
                  <div class="badge badge-primary badge-lg">1. Render</div>
                  <div class="flex-1">
                    <p class="text-sm">Generate initial HTML structure with JSX templates</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="badge badge-secondary badge-lg">2. Load</div>
                  <div class="flex-1">
                    <p class="text-sm">Fetch data asynchronously (optional) - perfect for API calls</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="badge badge-success badge-lg">3. Bind</div>
                  <div class="flex-1">
                    <p class="text-sm">Attach event listeners, initialize component logic, and update DOM with loaded data</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="badge badge-warning badge-lg">4. Release</div>
                  <div class="flex-1">
                    <p class="text-sm">Clean up event listeners and resources when component is removed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="alert alert-success mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong>Philosophy:</strong> Duct prioritizes simplicity, maintainability, and developer happiness through
              clear patterns and explicit behavior over magical abstractions.
            </span>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

function bind(): BindReturn<DocsIntroDemoLogic> {
  return {
    release: () => { }
  }
}

const id = { id: "duct-demo/docs-intro" }

export default () => {
  return createBlueprint<DocsIntroDemoProps, DocsIntroDemoEvents, DocsIntroDemoLogic>(
    id,
    render,
    { bind }
  )
}