### Step 3: Implement the Bind Function (For Complex Components)

The bind function is where all your component logic lives. It receives the DOM element,
event emitter, properly typed props, and any loaded data.

~~~typescript
function bind(
  el: HTMLElement,
  eventEmitter: EventEmitter<InputEvents>,
  props: InputProps  // Now properly typed
): BindReturn<InputLogic> {
  // 1. Get references to DOM elements (el is the component container)
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

  function getValue(): string {
    return input.value
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
    getValue,
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
interface UserSelectLoadData {
  users: Array<{ id: string, name: string, email: string }>
}

async function load(
  el: HTMLElement, 
  props: UserSelectProps
): Promise<UserSelectLoadData> {
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
  props: UserSelectProps,
  loadData?: UserSelectLoadData
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
  function handleChange(e: Event) {
    const select = e.target as HTMLSelectElement
    const selectedUser = loadData?.users.find(u => u.id === select.value)
    if (selectedUser) {
      eventEmitter.emit('userSelected', el, selectedUser)
    }
  }

  const select = el.querySelector('select') as HTMLSelectElement
  select.addEventListener('change', handleChange)

  return {
    getSelectedUser: () => {
      const selectedId = select.value
      return loadData?.users.find(u => u.id === selectedId)
    },
    release: () => {
      select.removeEventListener('change', handleChange)
    }
  }
}

// Create blueprint with load function - note the fourth generic type
const UserSelect = createBlueprint<
  UserSelectProps, 
  UserSelectEvents, 
  UserSelectLogic, 
  UserSelectLoadData
>(
  { id: "my-app/user-select" },
  render,
  { load, bind }
)

export default UserSelect
~~~

## Accessing Component Logic

Components expose their logic for external control using refs:

~~~typescript
// Import and use components directly (no factory functions needed)
import { createRef } from '@duct-ui/core'
import Toggle from '@duct-ui/components/toggle/toggle'

const toggleRef = createRef<ToggleLogic>()

function MyApp() {
  function handleToggleChange(el: HTMLElement, state: ToggleState) {
    console.log('Toggle changed to:', state)
  }

  return (
    <Toggle
      ref={toggleRef}
      initialState="off"
      class="my-toggle"
      on:change={handleToggleChange}
    />
  )
}

// Access component methods via ref
toggleRef.current?.setState('on')
toggleRef.current?.toggle()
const currentState = toggleRef.current?.getState()
~~~

## Component Lifecycle

Understanding the lifecycle helps you place code in the right functions:

1. **Render Phase:** Component JSX is generated and inserted into DOM
2. **Load Phase (optional):** Async data loading happens  
3. **Bind Phase:** Event listeners and logic are attached
4. **Runtime:** Component is active and responsive
5. **Release Phase:** Cleanup when component is removed

~~~typescript
// Load runs AFTER render, BEFORE bind
async function load(el: HTMLElement, props: MyProps) {
  // DOM exists, but no event listeners yet
  // Perfect for fetching data, setting up observers
}

// Bind runs AFTER load (if present)
function bind(el: HTMLElement, eventEmitter, props, loadData?) {
  // DOM exists, data is loaded
  // Set up event listeners, expose component logic
  
  return {
    // Public methods...
    release: () => {
      // Cleanup: remove listeners, clear timers, etc.
    }
  }
}
~~~