### Step 3: Implement the Bind Function

The bind function is where all your component logic lives. It receives the DOM element,
event emitter, props, and any loaded data.

~~~typescript
function bind(
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
}
~~~

### Step 4: Add Async Loading (Optional)

For components that need to load data asynchronously, add a load function.
This runs after render but before bind.

~~~typescript
interface UserSelectData {
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
    return {users}
  } catch (error) {
      console.error('Failed to load users:', error)
      return {users: [] }
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
  return { /* ... */}
}

// Create blueprint with load function
export default function makeUserSelect() {
  return createBlueprint<UserSelectProps, UserSelectEvents, UserSelectLogic, UserSelectData>(
    {id: "my-app/user-select" },
    render,
    {load, bind}
  )
}
~~~

## Accessing Component Logic

Components expose their logic for external control using two patterns:

~~~typescript
// Import and use components directly
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
buttonRef.current?.setLabel('New Text')
~~~