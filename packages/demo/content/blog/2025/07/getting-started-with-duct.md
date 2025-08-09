---
title: Getting Started with Duct UI
description: Learn the basics of Duct UI and how to build your first component with our unique template-logic separation approach
date: 2025-07-15
author: Duct Team
tags: [Tutorial, Duct, Getting Started]
---

Duct UI is a revolutionary framework that brings clarity to web development through explicit separation of concerns. Unlike React's all-in-one approach, Duct clearly separates templates from logic, making your code more maintainable and easier to understand.

## Why Duct?

Duct was born from the frustration of debugging complex React components where render logic, state management, and side effects are all intertwined. We believe that **templates should be templates** and **logic should be logic**.

## Your First Component

Let's create a simple counter component to understand Duct's approach:

```typescript
import { createBlueprint, type BaseProps } from "@duct-ui/core/blueprint"

// Define your props
interface CounterProps {
  initialCount?: number
  step?: number
}

// Pure template - just structure and presentation
function render(props: BaseProps<CounterProps>) {
  const { initialCount = 0, step = 1 } = props

  return (
    <div class="counter">
      <button data-decrement class="btn">-{step}</button>
      <span data-count class="mx-4">{initialCount}</span>
      <button data-increment class="btn">+{step}</button>
    </div>
  )
}

// Logic separated from rendering
function bind(el: HTMLElement, eventEmitter, props: CounterProps) {
  const countEl = el.querySelector('[data-count]')!
  const incrementBtn = el.querySelector('[data-increment]')!
  const decrementBtn = el.querySelector('[data-decrement]')!

  let count = props.initialCount || 0
  const step = props.step || 1

  function updateDisplay() {
    countEl.textContent = count.toString()
  }

  incrementBtn.addEventListener('click', () => {
    count += step
    updateDisplay()
  })

  decrementBtn.addEventListener('click', () => {
    count -= step
    updateDisplay()
  })

  return {
    release: () => {
      // Cleanup if needed
    }
  }
}

// Create the component
const Counter = createBlueprint(
  { id: "my-app/counter" },
  render,
  { bind }
)

export default Counter
```

## Key Concepts

### 1. **Render Function**
The render function is pure - it takes props and returns JSX. No hooks, no state, no side effects. Just a template.

### 2. **Bind Function**
The bind function is where all your component logic lives. It receives the rendered DOM element and sets up all interactivity.

### 3. **Lifecycle**
Duct components have a clear, predictable lifecycle:
- **Render**: Generate HTML from props
- **Load** (optional): Fetch async data
- **Bind**: Attach event listeners and logic
- **Release**: Cleanup when component unmounts

### 4. **No Magic**
Everything in Duct is explicit. No hidden re-renders, no mysterious hook dependencies, no virtual DOM diffing. You're in control.

## Next Steps

Now that you understand the basics:

1. Explore the [component lifecycle](/docs/building) in detail
2. Learn about [async data loading](/docs/building#async-loading)
3. Discover how to [compose components](/docs/composition)
4. See how Duct compares to [other frameworks](/docs/comparison)

Welcome to a clearer way of building web applications. Welcome to Duct UI!