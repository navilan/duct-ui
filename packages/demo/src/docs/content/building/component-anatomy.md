Learn how to build Duct components step-by-step, from basic buttons to complex components with async data loading and sophisticated interactions.{.lead}

## Component Anatomy

Every Duct component consists of several key parts that work together in a predictable pattern:

~~~typescript
import { createBlueprint, EventEmitter, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"

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
      class={`btn ${className}`}
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

export default Button
~~~

## Step-by-Step Guide

### Step 1: Define TypeScript Interfaces

Start by defining clear contracts for your component. This provides excellent IDE support and catches errors early.

~~~typescript
// Events your component can emit
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
}
~~~

### Step 2: Create the Render Function

The render function should be pure - no side effects, just return JSX based on props.
Think of it as your component's initial HTML structure.