import { createBlueprint } from "@duct-ui/core/blueprint"

// Define the events this component can handle
export interface ButtonEvents extends Record<string, any> {
  bind: (el: HTMLElement) => void
  click: (el: HTMLElement, e: MouseEvent) => void
  dblclick: (el: HTMLElement, e: MouseEvent) => void
  release: (el: HTMLElement) => void
}

// Define component props (including on:* event handlers)
export type ButtonProps = {
  label: string
  'on:click'?: (el: HTMLElement, e: MouseEvent) => void
  'on:dblclick'?: (el: HTMLElement, e: MouseEvent) => void
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
} & Record<string, any>

// Define the component logic interface
export type ButtonLogic = {
  on: <K extends keyof ButtonEvents>(event: K, callback: ButtonEvents[K]) => void
  off: <K extends keyof ButtonEvents>(event: K, callback: ButtonEvents[K]) => void
}

// Simple render function - no event handling logic needed!
function render(props: ButtonProps & { "data-duct-id": string }) {
  const {
    label,
    'data-duct-id': id,
    // All on:* props are automatically handled by eventedComponent
    ...moreProps
  } = props

  return <button
    data-duct-id={id}
    {...moreProps}
  >
    {label}
  </button>
}

function bind(el: HTMLElement, eventEmitter: any): ButtonLogic {
  return {
    on: eventEmitter.on.bind(eventEmitter),
    off: eventEmitter.off.bind(eventEmitter)
  }
}

function release(el: HTMLElement, logic: ButtonLogic) {
  // Cleanup is handled automatically by eventedComponent
  console.debug("Button released")
}

// Create the component
const id = { id: "duct/button" }

export default () => {
  return createBlueprint<ButtonProps, ButtonEvents, ButtonLogic>(
    id,
    render,
    {
      domEvents: ['click', 'dblclick'], // Automatically bind these DOM events
      customEvents: ['bind', 'release'], // Custom lifecycle events
      bind,
      release
    }
  )
}