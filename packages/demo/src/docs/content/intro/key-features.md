## Key Features

### Type-Safe Event System

Duct provides a strongly typed event system built on TypeScript:

~~~typescript
// Define component events with full type safety
export interface ButtonEvents extends BaseComponentEvents {
  click: (el: HTMLElement) => void
  stateChange: (el: HTMLElement, newState: string) => void
}

// Use events in templates with clear syntax
<Button
  label="Click me"
  on:click={handleButtonClick}
  on:stateChange={handleStateChange}
/>
~~~

### Direct DOM Manipulation

Duct components have direct access to DOM elements, allowing for efficient updates without virtual DOM overhead:

~~~typescript
function bind(el: HTMLElement, eventEmitter: EventEmitter<Events>) {
  const button = el.querySelector('button')

  // Direct DOM updates are fast and explicit
  function updateState(newState: string) {
    button.className = `btn btn-${newState}`
    button.dataset.state = newState
  }
}
~~~

### Precompiled Templates

Templates are compiled at build time for optimal performance, with no runtime template parsing overhead.

### Component Logic Access

Components expose their logic for programmatic control using refs:

~~~typescript
// Recommended: Use refs for synchronous access
import { Button } from '@duct-ui/components'
const buttonRef = createRef()

<Button ref={buttonRef} label="Test" />

// Access component logic immediately
buttonRef.current?.setDisabled(true)
buttonRef.current?.updateLabel('New Text')
~~~