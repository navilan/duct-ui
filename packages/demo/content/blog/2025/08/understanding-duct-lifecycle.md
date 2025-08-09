---
title: Understanding Duct Component Lifecycle
description: Deep dive into the render, load, bind, and release phases of Duct components and how to use them effectively
date: 2025-08-10
author: Duct Team
tags: [Advanced, Architecture, Lifecycle]
---

One of Duct's core strengths is its predictable, explicit component lifecycle. Unlike React's sometimes mysterious re-render behavior, Duct components follow a clear sequence of phases that you can reason about and control.

## The Four Phases

### 1. Render Phase

The render phase is where your component's HTML structure is generated. This is a **pure function** that takes props and returns JSX.

```typescript
function render(props: BaseProps<MyProps>) {
  return (
    <div class="my-component">
      <h1>{props.title}</h1>
      <p>{props.description}</p>
    </div>
  )
}
```

**Key Points:**
- No side effects allowed
- No state management
- No event handlers
- Just structure and initial content

### 2. Load Phase (Optional)

The load phase is for asynchronous data fetching. It runs **after** render but **before** bind, allowing you to fetch data while showing a loading state.

```typescript
async function load(el: HTMLElement, props: MyProps): Promise<LoadData> {
  // Show loading indicator
  const spinner = el.querySelector('.spinner')
  spinner?.classList.remove('hidden')

  // Fetch data
  const response = await fetch(`/api/data/${props.id}`)
  const data = await response.json()

  return { data }
}
```

**When to use:**
- API calls
- Reading from databases
- Loading configuration
- Any async initialization

### 3. Bind Phase

This is where your component comes alive. The bind phase receives the rendered DOM element and sets up all interactivity.

```typescript
function bind(
  el: HTMLElement,
  eventEmitter: EventEmitter<Events>,
  props: MyProps,
  loadData?: LoadData
): BindReturn<Logic> {
  // Hide loading indicator
  const spinner = el.querySelector('.spinner')
  spinner?.classList.add('hidden')

  // Use loaded data
  if (loadData?.data) {
    renderData(el, loadData.data)
  }

  // Set up event listeners
  const button = el.querySelector('button')
  button?.addEventListener('click', handleClick)

  // Return public API and cleanup
  return {
    update: (newData) => renderData(el, newData),
    release: () => {
      button?.removeEventListener('click', handleClick)
    }
  }
}
```

**Responsibilities:**
- Attach event listeners
- Initialize component state
- Start timers or observers
- Expose component API
- Define cleanup logic

### 4. Release Phase

The release phase is called when your component is being removed from the DOM. This is your chance to clean up resources.

```typescript
function release() {
  // Remove event listeners
  button?.removeEventListener('click', handleClick)

  // Clear timers
  clearInterval(updateTimer)

  // Disconnect observers
  resizeObserver?.disconnect()

  // Cancel pending requests
  abortController?.abort()
}
```

## Lifecycle Flow Diagram

```
┌─────────┐
│ Render  │ → Pure function generates HTML
└────┬────┘
     │
     ▼
┌─────────┐
│  Load   │ → Optional async data fetching
└────┬────┘
     │
     ▼
┌─────────┐
│  Bind   │ → Attach logic and interactivity
└────┬────┘
     │
     ▼
┌─────────┐
│ Active  │ → Component is interactive
└────┬────┘
     │
     ▼
┌─────────┐
│ Release │ → Cleanup when unmounting
└─────────┘
```

## Practical Example: User Profile Card

Let's see how all phases work together in a real component:

```typescript
interface ProfileProps {
  userId: string
  editable?: boolean
}

interface ProfileData {
  user: {
    name: string
    avatar: string
    bio: string
  }
}

interface ProfileLogic {
  refresh: () => Promise<void>
  setEditMode: (enabled: boolean) => void
}

// Render: Structure only
function render(props: BaseProps<ProfileProps>) {
  return (
    <div class="profile-card">
      <div class="spinner">Loading...</div>
      <div class="content hidden">
        <img data-avatar alt="Avatar" />
        <h2 data-name></h2>
        <p data-bio></p>
        {props.editable && (
          <button data-edit class="btn">Edit</button>
        )}
      </div>
    </div>
  )
}

// Load: Fetch user data
async function load(el: HTMLElement, props: ProfileProps): Promise<ProfileData> {
  const response = await fetch(`/api/users/${props.userId}`)
  const user = await response.json()
  return { user }
}

// Bind: Make it interactive
function bind(
  el: HTMLElement,
  eventEmitter: EventEmitter<ProfileEvents>,
  props: ProfileProps,
  loadData?: ProfileData
): BindReturn<ProfileLogic> {
  const spinner = el.querySelector('.spinner') as HTMLElement
  const content = el.querySelector('.content') as HTMLElement
  const avatar = el.querySelector('[data-avatar]') as HTMLImageElement
  const name = el.querySelector('[data-name]') as HTMLElement
  const bio = el.querySelector('[data-bio]') as HTMLElement
  const editBtn = el.querySelector('[data-edit]') as HTMLButtonElement

  // Hide spinner, show content
  spinner.classList.add('hidden')
  content.classList.remove('hidden')

  // Display loaded data
  if (loadData?.user) {
    avatar.src = loadData.user.avatar
    name.textContent = loadData.user.name
    bio.textContent = loadData.user.bio
  }

  // Edit functionality
  let editMode = false

  function setEditMode(enabled: boolean) {
    editMode = enabled
    if (editBtn) {
      editBtn.textContent = enabled ? 'Save' : 'Edit'
    }
    // Additional edit mode logic...
  }

  async function refresh() {
    const response = await fetch(`/api/users/${props.userId}`)
    const user = await response.json()
    avatar.src = user.avatar
    name.textContent = user.name
    bio.textContent = user.bio
  }

  // Event listeners
  editBtn?.addEventListener('click', () => {
    setEditMode(!editMode)
    eventEmitter.emit('editToggle', el, editMode)
  })

  // Public API
  return {
    refresh,
    setEditMode,
    release: () => {
      // Cleanup
      editBtn?.removeEventListener('click', () => {})
    }
  }
}

// Create the component
const ProfileCard = createBlueprint<ProfileProps, ProfileEvents, ProfileLogic, ProfileData>(
  { id: "my-app/profile-card" },
  render,
  { load, bind }
)
```

## Best Practices

1. **Keep render pure**: Never perform side effects in render
2. **Load for async**: Always use the load phase for async operations
3. **Bind for logic**: All interactivity belongs in bind
4. **Always cleanup**: Return a release function from bind
5. **Type everything**: Use TypeScript for all phases

## Comparison with React

| Aspect         | Duct                   | React                       |
| -------------- | ---------------------- | --------------------------- |
| Render         | Pure template function | Mixed with hooks and state  |
| Data fetching  | Explicit load phase    | useEffect with dependencies |
| Event handling | Direct DOM in bind     | Inline in JSX               |
| Cleanup        | Explicit release       | useEffect cleanup           |
| Mental model   | Sequential phases      | Render cycles               |

## Conclusion

Duct's lifecycle brings clarity and predictability to component development. By explicitly separating concerns into distinct phases, you always know where to look for specific functionality and can reason about your component's behavior with confidence.

No more debugging mysterious re-renders or untangling effect dependencies. With Duct, the lifecycle is your friend, not your enemy.