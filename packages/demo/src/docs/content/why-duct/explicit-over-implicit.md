## Explicit Over Implicit

One of Duct's core strengths is its explicit approach to component behavior. This philosophy makes it particularly well-suited for working with AI-generated code and debugging complex components.

### Direct DOM Manipulation

Unlike frameworks that abstract DOM interactions, Duct gives you direct access to DOM elements. This makes it easy to understand exactly what's happening in your components:

~~~typescript
function bind(el: HTMLElement, eventEmitter, props) {
  const button = el.querySelector('button')
  const counter = el.querySelector('.counter')

  // Explicit DOM updates - no magic, no surprises
  function updateCounter(value) {
    counter.textContent = value.toString()
    button.disabled = value >= 10
  }

  // Clear event handling
  const handleClick = () => {
    const newValue = parseInt(counter.textContent) + 1
    updateCounter(newValue)
    eventEmitter.emit('change', newValue)
  }
  button.addEventListener('click', handleClick)

  return {
    release: () => button.removeEventListener('click', handleClick)
  }
}
~~~

### AI-Generated Code Debugging

When AI tools like Claude Code generate Duct components, the explicit nature makes it easy to:

- **Understand the code flow:** No hidden lifecycle methods or implicit re-renders
- **Debug issues:** Direct DOM queries and updates are easy to trace
- **Modify behavior:** Clear separation between render, load, bind, and release phases
- **Verify correctness:** Event handlers and DOM manipulations are explicit

### Transparent Component Behavior

~~~typescript
// When you see this code, you know exactly what it does:
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
}
~~~

## Developer Experience

### Predictable Component Structure

Every Duct component follows the same pattern. Once you understand one component, you understand them all. This consistency reduces cognitive load and makes code reviews more effective.

### Excellent TypeScript Integration

Duct is built with TypeScript from the ground up. You get full type safety for component props, events, and exposed logic methods, with excellent IDE autocomplete and error detection.

### Clear Data Flow

Data flows explicitly through the component lifecycle. There are no surprise re-renders or hidden state updates. You control when and how the DOM changes.