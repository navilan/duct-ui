Learn how to build Duct components step-by-step, from basic buttons to complex components with async data loading and sophisticated interactions.{.lead}

## Component Anatomy

Every Duct component consists of several key parts that work together in a predictable pattern:

~~~typescript
import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"

// 1. Define your event interface
export interface ButtonEvents extends BaseComponentEvents {
  click: (el: HTMLElement, e: MouseEvent) => void
  dblclick: (el: HTMLElement, e: MouseEvent) => void
}

// 2. Define your props interface  
export interface ButtonProps {
  label: string
  disabled?: boolean
  class?: string
  'on:click'?: (el: HTMLElement, e: MouseEvent) => void
  'on:dblclick'?: (el: HTMLElement, e: MouseEvent) => void
}

// 3. Render function - pure presentation
function render(props: BaseProps<ButtonProps>) {
  const { label, disabled = false, class: className = '', ...moreProps } = props

  return (
    <button
      class={`btn ${className}`}
      disabled={disabled}
      {...moreProps}
    >
      {label}
    </button>
  )
}

// 4. Create component with domEvents (simple approach)
const id = { id: "my-app/button" }

const Button = createBlueprint<ButtonProps, ButtonEvents>(
  id,
  render,
  {
    domEvents: ['click', 'dblclick']  // Automatically handles DOM events
  }
)

export default Button
~~~

## Alternative: Component with Custom Logic

For components that need custom behavior, use the bind function:

~~~typescript
import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"

// Define toggle states
export type ToggleState = 'on' | 'off'

export interface ToggleEvents extends BaseComponentEvents {
  change: (el: HTMLElement, state: ToggleState) => void
}

export interface ToggleLogic {
  getState: () => ToggleState
  setState: (state: ToggleState) => void
  toggle: () => void
}

export interface ToggleProps {
  initialState?: ToggleState
  disabled?: boolean
  class?: string
  'on:change'?: (el: HTMLElement, state: ToggleState) => void
}

function render(props: BaseProps<ToggleProps>) {
  const { initialState = 'off', disabled = false, class: className = '', ...moreProps } = props

  return (
    <button
      class={`toggle ${initialState} ${className}`}
      disabled={disabled}
      data-state={initialState}
      {...moreProps}
    >
      <span class="toggle-handle"></span>
    </button>
  )
}

function bind(
  el: HTMLElement, 
  eventEmitter: EventEmitter<ToggleEvents>, 
  props: ToggleProps
): BindReturn<ToggleLogic> {
  const button = el as HTMLButtonElement
  let currentState: ToggleState = props.initialState || 'off'

  function updateUI() {
    button.className = `toggle ${currentState} ${props.class || ''}`
    button.setAttribute('data-state', currentState)
  }

  function handleClick() {
    if (!button.disabled) {
      toggle()
    }
  }

  function setState(newState: ToggleState) {
    if (currentState !== newState) {
      currentState = newState
      updateUI()
      eventEmitter.emit('change', el, currentState)
    }
  }

  function toggle() {
    setState(currentState === 'on' ? 'off' : 'on')
  }

  function getState() {
    return currentState
  }

  button.addEventListener('click', handleClick)

  return {
    getState,
    setState,
    toggle,
    release: () => {
      button.removeEventListener('click', handleClick)
    }
  }
}

const Toggle = createBlueprint<ToggleProps, ToggleEvents, ToggleLogic>(
  id,
  render,
  { bind }
)

export default Toggle
~~~

## Step-by-Step Guide

### Step 1: Choose Your Component Pattern

Duct offers two main patterns:

**Simple Components (domEvents):** For basic components that just need DOM event handling
~~~typescript
const Button = createBlueprint<ButtonProps, ButtonEvents>(
  id,
  render,
  { domEvents: ['click', 'dblclick'] }
)
~~~

**Complex Components (bind function):** For components with custom logic and state management
~~~typescript  
const Toggle = createBlueprint<ToggleProps, ToggleEvents, ToggleLogic>(
  id,
  render,
  { bind }
)
~~~

### Step 2: Define TypeScript Interfaces

Start by defining clear contracts for your component:

~~~typescript
// Events your component can emit (include DOM event when relevant)
export interface MyComponentEvents extends BaseComponentEvents {
  change: (el: HTMLElement, value: string) => void
  submit: (el: HTMLElement, data: FormData) => void
  click: (el: HTMLElement, e: MouseEvent) => void  // DOM events include event object
}

// Methods your component exposes (only needed for bind function components)
export interface MyComponentLogic {
  getValue: () => string
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
  'on:click'?: (el: HTMLElement, e: MouseEvent) => void
}
~~~

### Step 3: Create the Render Function

The render function should be pure - no side effects, just return JSX based on props.
Think of it as your component's initial HTML structure.