import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import DemoLayout from "../components/DemoLayout"
import { escapeHtml } from "@kitajs/html"

export interface DocsBuildingDemoEvents extends BaseComponentEvents { }
export interface DocsBuildingDemoLogic { }
export interface DocsBuildingDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<DocsBuildingDemoProps>) {
  return (
    <div {...props}>
      <DemoLayout
        title="Building Components in Duct"
        description="A comprehensive guide to creating Duct components"
        sourcePath="/demos/DocsBuildingDemo.tsx"
      >
        <div class="prose prose-lg max-w-none">
          <p class="lead">
            Learn how to build Duct components step-by-step, from basic buttons to complex components
            with async data loading and sophisticated interactions.
          </p>

          <h2>Component Anatomy</h2>
          <p>
            Every Duct component consists of several key parts that work together in a predictable pattern:
          </p>

          <div class="not-prose">
            <div class="bg-base-200 rounded-lg p-6 my-6">
              <pre class="text-sm overflow-x-auto"><code>{escapeHtml(`import { createBlueprint, EventEmitter, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"

// 1. Define your event interface
export interface ButtonEvents extends BaseComponentEvents {
  click: (el: HTMLElement) => void
  stateChange: (el: HTMLElement, state: string) => void
}

// 2. Define your logic interface
export interface ButtonLogic {
  setDisabled: (disabled: boolean) => void
  getLabel: () => string
}

// 3. Define your props interface
export interface ButtonProps {
  label: string
  disabled?: boolean
  class?: string
  'on:click'?: (el: HTMLElement) => void
}

// 4. Render function - pure presentation
function render(props: BaseProps<ButtonProps>) {
  const { label, disabled = false, class: className = '', ...moreProps } = props

  return (
    <button
      class={\`btn \${className}\`}
      disabled={disabled}
      {...moreProps}
    >
      {label}
    </button>
  )
}

// 5. Bind function - behavior and logic
function bind(el: HTMLElement, eventEmitter: EventEmitter<ButtonEvents>, props: any): BindReturn<ButtonLogic> {
  const button = el as HTMLButtonElement

  function handleClick(e: Event) {
    if (!button.disabled) {
      eventEmitter.emit('click', button)
    }
  }

  button.addEventListener('click', handleClick)

  function setDisabled(disabled: boolean) {
    button.disabled = disabled
  }

  function getLabel(): string {
    return button.textContent || ''
  }

  function release() {
    button.removeEventListener('click', handleClick)
  }

  return {
    setDisabled,
    getLabel,
    release
  }
}

// 6. Create and export the component directly
const id = { id: "my-app/button" }

const Button = createBlueprint<ButtonProps, ButtonEvents, ButtonLogic>(
  id,
  render,
  { bind }
)

export default Button`)}</code></pre>
            </div>
          </div>

          <h2>Step-by-Step Guide</h2>

          <h3>Step 1: Define TypeScript Interfaces</h3>
          <p>
            Start by defining clear contracts for your component. This provides excellent IDE support
            and catches errors early.
          </p>

          <div class="not-prose">
            <div class="bg-base-200 rounded-lg p-6 my-4">
              <pre class="text-sm"><code>{escapeHtml(`// Events your component can emit
export interface MyComponentEvents extends BaseComponentEvents {
  change: (el: HTMLElement, value: string) => void
  submit: (el: HTMLElement, data: FormData) => void
}

// Methods your component exposes for external control
export interface MyComponentLogic {
  setValue: (value: string) => void
  reset: () => void
  focus: () => void
}

// Props your component accepts
export interface MyComponentProps {
  initialValue?: string
  placeholder?: string
  required?: boolean
  'on:change'?: (el: HTMLElement, value: string) => void
  'on:submit'?: (el: HTMLElement, data: FormData) => void
}`)}</code></pre>
            </div>
          </div>

          <h3>Step 2: Create the Render Function</h3>
          <p>
            The render function should be pure - no side effects, just return JSX based on props.
            Think of it as your component's initial HTML structure.
          </p>

          <div class="not-prose">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
              <div class="card bg-success/10 border border-success/20">
                <div class="card-body">
                  <h4 class="card-title text-success text-base">✅ Good Render Function</h4>
                  <pre class="text-xs"><code>{escapeHtml(`function render(props: BaseProps<InputProps>) {
  const {
    initialValue = '',
    placeholder = '',
    required = false,
    class: className = '',
    ...moreProps
  } = props

  return (
    <div class="input-container" {...moreProps}>
      <input
        type="text"
        class={\`input \${className}\`}
        placeholder={placeholder}
        value={initialValue}
        required={required}
        data-input
      />
      <span class="error-message hidden" data-error></span>
    </div>
  )
}`)}</code></pre>
                </div>
              </div>

              <div class="card bg-error/10 border border-error/20">
                <div class="card-body">
                  <h4 class="card-title text-error text-base">❌ Bad Render Function</h4>
                  <pre class="text-xs"><code>{escapeHtml(`function render(props: BaseProps<InputProps>) {
  // DON'T: Side effects in render
  console.log('Rendering input')

  // DON'T: Event handlers in render
  const handleClick = () => alert('clicked')

  // DON'T: Complex logic in render
  if (props.value && props.value.length > 10) {
    validateInput(props.value)
  }

  return (
    <input
      onClick={handleClick} // DON'T: Inline handlers
      {...props}
    />
  )
}`)}</code></pre>
                </div>
              </div>
            </div>
          </div>

          <h3>Step 3: Implement the Bind Function</h3>
          <p>
            The bind function is where all your component logic lives. It receives the DOM element,
            event emitter, props, and any loaded data.
          </p>

          <div class="not-prose">
            <div class="bg-base-200 rounded-lg p-6 my-4">
              <pre class="text-sm"><code>{escapeHtml(`function bind(
  el: HTMLElement,
  eventEmitter: EventEmitter<InputEvents>,
  props: any
): BindReturn<InputLogic> {
  // 1. Get references to DOM elements
  const input = el.querySelector('[data-input]') as HTMLInputElement
  const errorEl = el.querySelector('[data-error]') as HTMLElement

  // 2. Set up internal state
  let isValid = true

  // 3. Define internal functions
  function validateInput(value: string): boolean {
    const valid = props.required ? value.trim().length > 0 : true

    if (!valid) {
      errorEl.textContent = 'This field is required'
      errorEl.classList.remove('hidden')
    } else {
      errorEl.classList.add('hidden')
    }

    isValid = valid
    return valid
  }

  // 4. Set up event handlers
  function handleChange(e: Event) {
    const value = (e.target as HTMLInputElement).value

    if (validateInput(value)) {
      eventEmitter.emit('change', el, value)
    }
  }

  input.addEventListener('change', handleChange)
  input.addEventListener('blur', handleChange)

  // 5. Define public methods
  function setValue(value: string) {
    input.value = value
    validateInput(value)
  }

  function reset() {
    input.value = ''
    errorEl.classList.add('hidden')
    isValid = true
  }

  function focus() {
    input.focus()
  }

  // 6. Cleanup function
  function release() {
    input.removeEventListener('change', handleChange)
    input.removeEventListener('blur', handleChange)
  }

  // 7. Return public interface
  return {
    setValue,
    reset,
    focus,
    release
  }
}`)}</code></pre>
            </div>
          </div>

          <h3>Step 4: Add Async Loading (Optional)</h3>
          <p>
            For components that need to load data asynchronously, add a load function. This runs
            after render but before bind.
          </p>

          <div class="not-prose">
            <div class="bg-base-200 rounded-lg p-6 my-4">
              <pre class="text-sm"><code>{escapeHtml(`interface UserSelectData {
  users: Array<{ id: string, name: string, email: string }>
}

async function load(el: HTMLElement, props: any): Promise<UserSelectData> {
  // Show loading state
  const loadingEl = el.querySelector('[data-loading]')
  if (loadingEl) {
    loadingEl.classList.remove('hidden')
  }

  try {
    // Fetch data from API
    const response = await fetch('/api/users')
    const users = await response.json()

    return { users }
  } catch (error) {
    console.error('Failed to load users:', error)
    return { users: [] }
  }
}

function bind(
  el: HTMLElement,
  eventEmitter: EventEmitter<UserSelectEvents>,
  props: any,
  loadData?: UserSelectData
): BindReturn<UserSelectLogic> {
  // Hide loading indicator
  const loadingEl = el.querySelector('[data-loading]')
  if (loadingEl) {
    loadingEl.classList.add('hidden')
  }

  // Use loaded data to populate select
  if (loadData?.users) {
    const select = el.querySelector('select') as HTMLSelectElement

    loadData.users.forEach(user => {
      const option = document.createElement('option')
      option.value = user.id
      option.textContent = user.name
      select.appendChild(option)
    })
  }

  // Rest of bind logic...
  return { /* ... */ }
}

// Create blueprint with load function
export default function makeUserSelect() {
  return createBlueprint<UserSelectProps, UserSelectEvents, UserSelectLogic, UserSelectData>(
    { id: "my-app/user-select" },
    render,
    { load, bind }
  )
}`)}</code></pre>
            </div>
          </div>

          <h2>Accessing Component Logic</h2>

          <p>
            Components expose their logic for external control using two patterns:
          </p>

          <div class="not-prose">
            <div class="bg-base-200 rounded-lg p-6 my-4">
              <pre class="text-sm"><code>{escapeHtml(`// Import and use components directly
import { createRef } from '@duct-ui/core'
import Button from './Button' // Your component

const buttonRef = createRef<ButtonLogic>()

function MyApp() {
  return (
    <Button
      ref={buttonRef}
      label="Click me"
      class="btn btn-primary"
      on:click={handleClick}
    />
  )
}

// Access component methods via ref
buttonRef.current?.setDisabled(true)
buttonRef.current?.setLabel('New Text')`)}</code></pre>
            </div>
          </div>

          <div class="alert alert-info my-4">
            <span class="text-sm">
              <strong>Direct Usage:</strong> Components can be used directly in JSX without factory functions.
              Use refs to access component methods and state after the component is mounted.
            </span>
          </div>

          <h2>Best Practices</h2>

          <div class="not-prose">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div class="card bg-success/10 border border-success/20">
                <div class="card-body">
                  <h3 class="card-title text-success">Do</h3>
                  <ul class="text-sm space-y-2">
                    <li>✓ Use TypeScript interfaces for everything</li>
                    <li>✓ Keep render functions pure</li>
                    <li>✓ Export components directly, not factory functions</li>
                    <li>✓ Use refs for component logic access</li>
                    <li>✓ Use data attributes for element selection</li>
                    <li>✓ Always implement the release function</li>
                    <li>✓ Validate props in bind, not render</li>
                    <li>✓ Use descriptive component IDs</li>
                    <li>✓ Emit events for important state changes</li>
                    <li>✓ Handle errors gracefully in load functions</li>
                  </ul>
                </div>
              </div>

              <div class="card bg-error/10 border border-error/20">
                <div class="card-body">
                  <h3 class="card-title text-error">Don't</h3>
                  <ul class="text-sm space-y-2">
                    <li>❌ Put side effects in render functions</li>
                    <li>❌ Forget to remove event listeners</li>
                    <li>❌ Use global variables for component state</li>
                    <li>❌ Query DOM elements by tag name or class</li>
                    <li>❌ Mutate props directly</li>
                    <li>❌ Create components without TypeScript types</li>
                    <li>❌ Ignore async errors in load functions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h2>Testing Components</h2>
          <p>
            Duct components are easy to test because of their explicit structure:
          </p>

          <div class="not-prose">
            <div class="bg-base-200 rounded-lg p-6 my-4">
              <pre class="text-sm"><code>{escapeHtml(`// Test example
import Button from './Button'
import { createRef } from '@duct-ui/core'

describe('Button Component', () => {
  let container: HTMLElement
  let buttonRef: any

  beforeEach(() => {
    buttonRef = createRef()

    // Render component
    container = document.createElement('div')
    document.body.appendChild(container)

    // Render the button component
    const buttonElement = Button({
      ref: buttonRef,
      label: 'Test Button'
    })
    container.appendChild(buttonElement)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  test('should render with correct label', () => {
    const button = container.querySelector('button')
    expect(button?.textContent).toBe('Test Button')
  })

  test('should disable when setDisabled(true) is called', () => {
    buttonRef.current?.setDisabled(true)
    const button = container.querySelector('button')
    expect(button?.disabled).toBe(true)
  })

  test('should handle click events', () => {
    const button = container.querySelector('button')
    const clickSpy = jest.fn()

    // Set up click handler
    button?.addEventListener('click', clickSpy)
    button?.click()

    expect(clickSpy).toHaveBeenCalled()
  })
})`)}</code></pre>
            </div>
          </div>

          <div class="alert alert-success mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong>Pro Tip:</strong> Start simple and gradually add complexity. A basic component with just
              render and bind functions is often all you need. Add load functions and complex logic only when required.
            </span>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

function bind(): BindReturn<DocsBuildingDemoLogic> {
  return {
    release: () => { }
  }
}

const id = { id: "duct-demo/docs-building" }

const DocsBuildingDemo = createBlueprint<DocsBuildingDemoProps, DocsBuildingDemoEvents, DocsBuildingDemoLogic>(
  id,
  render,
  { bind }
)

export default DocsBuildingDemo