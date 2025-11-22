---
title: "Real-World Duct UI: Granular State Management in a Word Game"
date: 2025-11-22
image: /docs/gallery/fourdle.png
ogPath: /docs/gallery/fourdle.png
author: navilan
tags: [Examples, Tutorial, Real-World, Article, State Management]
---

Explore how Duct UI powers a multi-board word puzzle with granular observable state management, component refs, and SSG-compatible architecture. A practical example of building interactive games with surgical DOM updates and explicit memory management.

<!--more-->

[![Fourdle](/docs/gallery/fourdle.png)](https://fourdle.puthir.org/)

## Live Example: Fourdle

**Website**: [https://fourdle.puthir.org/](https://fourdle.puthir.org/)
**Source Code**: [https://github.com/puthirali/fourdle](https://github.com/puthirali/fourdle)

This word puzzle game showcases Duct UI's power for building stateful applications with fine-grained reactivity. The game manages multiple simultaneous Wordle-style boards with slot-level state subscriptions, demonstrating advanced patterns for performance optimization and memory management.

## Key Patterns Demonstrated

### 1. Granular Observable State Management

The core introduction is a state service with surgical precision updates—components subscribe to individual slots, not entire boards. This is simply a template to show
how such a service can be constructed. A robust structure can be built upon this
specific model to make event based state management centralized, de-centralized or
federated.

**Implementation Highlights:**

- Namespace-based event subscriptions: `slot:${boardIndex}:${entryIndex}:${slotIndex}`
- Change detection computes deltas between old and new state
- Only changed slots/entries/boards emit events
- Pure function separation for state computations

**See it live**: Visit [fourdle.puthir.org](https://fourdle.puthir.org/) and notice how only the slots you type into update, not the entire board.

**Technical approach**: The state service computes granular changes and emits targeted events, allowing components to subscribe only to their specific data.

### 2. Render/Bind Lifecycle Separation

The application strictly separates pure rendering from side effects using Duct's render/bind pattern.

**Architecture Features:**

- **Pure Render Functions**: Return JSX with no side effects (SSG-compatible)
- **Bind Lifecycle**: All subscriptions, DOM manipulation, and cleanup
- **Explicit Cleanup**: `release()` functions prevent memory leaks
- **SSG Constraints**: localStorage access only in `bind()`, never in `render()`

**See it in action**: The game pre-renders statically for instant loading, then hydrates with client-side state.

**Source code reference**: Every component in [src/components/](https://github.com/puthirali/fourdle/tree/main/src/components) follows this pattern consistently.

### 3. Component Refs for Parent-Child Communication

The app demonstrates type-safe parent-child communication using Duct's `createRef` pattern.

**Communication Patterns:**

- **Ref Creation**: `const helpModalRef = createRef<HelpModalLogic>()`
- **Logic Exposure**: Components expose methods via `BindReturn<ComponentLogic>`
- **Parent Control**: Parents call `helpModalRef.current?.open()`
- **Type Safety**: Full TypeScript support for exposed APIs

```typescript
// From App.tsx - controlling modals via refs
const helpModalRef = createRef<HelpModalLogic>()

<Header
  on:help-click={() => {
    const modalLogic = helpModalRef.current
    if (modalLogic) {
      modalLogic.open()
    }
  }}
/>
<HelpModal isOpen={false} ref={helpModalRef} />
```

### 4. Manual DOM Updates with Event Re-attachment

The interface demonstrates the innerHTML re-rendering pattern with manual event listener management.

**Component Integration:**

- **Dynamic Content**: Using JSX helper functions for re-renderable content
- **Event Re-attachment**: Listeners manually re-added after innerHTML updates
- **State in Bind**: Component state stored in bind closure, not React state
- **Controlled Updates**: Explicit `renderTabs()` calls, no automatic re-renders

**Source reference**: [SummaryModal.tsx](https://github.com/puthirali/fourdle/blob/main/src/components/SummaryModal.tsx) shows complex dynamic tab rendering with event re-attachment.

### 5. Explicit Memory Management

The application provides clear examples of subscription cleanup and memory leak prevention.

**Memory Management Features:**

- Symmetric `on()`/`off()` calls for all subscriptions
- Event listener cleanup in `release()`
- Timeout cleanup with stored timeout IDs

Check how every component's `bind()` function returns a `release()` that cleans up all subscriptions.

## Architecture Deep Dive

### Granular State Change Detection

```typescript
// From state-service.ts - computing granular changes
function computeChanges(oldState: State, newState: State): GranularChange[] {
  const changes: GranularChange[] = []

  oldState.boards.forEach((oldBoard, boardIndex) => {
    const newBoard = newState.boards[boardIndex]

    // Compare each entry
    oldBoard.board.entries.forEach((oldEntry, entryIndex) => {
      const newEntry = newBoard.board.entries[entryIndex]

      // Compare each slot
      for (let slotIndex = 0; slotIndex < 5; slotIndex++) {
        const oldChar = oldEntry.chars[slotIndex]
        const newChar = newEntry.chars[slotIndex]

        if (oldChar?.char !== newChar?.char || oldChar?.mode !== newChar?.mode) {
          changes.push({
            type: 'slot',
            boardIndex,
            entryIndex,
            slotIndex,
            data: { char: newChar, isCommitted: newEntry.isCommitted }
          })
        }
      }
    })
  })

  return changes
}
```

### Component Subscription Pattern

```typescript
// From Slot.tsx - subscribing to slot-specific changes
function bind(el: HTMLElement, _eventEmitter: any, props: SlotProps): BindReturn<SlotLogic> {
  const { boardIndex, entryIndex, slotIndex } = props
  const stateService = getStateService()

  // Subscribe to granular slot-specific event
  const eventName = `slot:${boardIndex}:${entryIndex}:${slotIndex}` as any
  const handleSlotChange = (slotData: any) => {
    const keyCap = slotData.char || emptyChar
    const text = keyCap.char.trim() === "" ? "\u00A0" : keyCap.char.toUpperCase()

    // Direct DOM updates
    if (frontFace) frontFace.textContent = text
    if (backFace) backFace.textContent = text

    // Update classes
    el.classList.toggle('flipped', slotData.isCommitted)
    if (backFace) {
      backFace.className = `slot-face slot-back mode-${keyCap.mode}`
    }
  }

  stateService.on(eventName, handleSlotChange)

  return {
    release: () => {
      stateService.off(eventName, handleSlotChange)
    }
  }
}
```

## Technical Stack

- **Framework**: Duct UI (SSG with client-side hydration)
- **State Management**: Observable pattern with lib0/observable
- **Build Tool**: Vite + @duct-ui/cli
- **Styling**: Tailwind CSS 4 + DaisyUI
- **Animations**: CSS transforms + @formkit/auto-animate
- **Type Safety**: TypeScript with strict mode
- **Package Manager**: pnpm
- **Deployment**: Static site generation

## Running Locally

To explore this example locally:

```bash
# Clone the repository
git clone https://github.com/puthirali/fourdle.git
cd fourdle

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Key Takeaways

This real-world example demonstrates:

1. **Granular Subscriptions**: Slot-level event subscriptions for surgical DOM updates
2. **Render/Bind Separation**: SSG-compatible architecture with clear lifecycle boundaries
3. **Component Refs**: Type-safe parent-child communication without prop drilling
4. **Manual Memory Management**: Explicit cleanup patterns for subscription lifecycle
5. **Observable Singleton**: Centralized state service with granular event emission
6. **Dynamic Re-rendering**: innerHTML pattern with event listener re-attachment

## Code Examples to Study

### Granular State Service

Examine [state-service.ts](https://github.com/puthirali/fourdle/blob/main/src/services/state-service.ts) to understand change detection, observable events, and the singleton pattern (495 lines of state management gold).

### Render/Bind Pattern

Study [Slot.tsx](https://github.com/puthirali/fourdle/blob/main/src/components/Slot.tsx) for the canonical example: pure `render()` function with all side effects in `bind()`.

### Component Refs

See [App.tsx](https://github.com/puthirali/fourdle/blob/main/src/components/App.tsx) for how parent components control modals using `createRef`.

### Dynamic Content Re-rendering

Observe [SummaryModal.tsx](https://github.com/puthirali/fourdle/blob/main/src/components/SummaryModal.tsx) for the innerHTML pattern with manual event re-attachment.

### Memory Management

Every component demonstrates proper cleanup—check the `release()` functions to see subscription cleanup patterns.

## Advanced Patterns Highlighted

### 1. Event Subscription Naming Convention

The app uses a consistent string-based event naming pattern:

```typescript
// Slot-level: slot:boardIndex:entryIndex:slotIndex
stateService.on(`slot:${boardIndex}:${entryIndex}:${slotIndex}`, handler)

// Entry-level: entry:boardIndex:entryIndex
stateService.on(`entry:${boardIndex}:${entryIndex}`, handler)

// Board-level: board:boardIndex
stateService.on(`board:${boardIndex}`, handler)

// Keycap-level: keycap:character
stateService.on(`keycap:${char}`, handler)
```

This convention allows components to subscribe to exactly what they need.

### 2. SSG-Compatible State Access

```typescript
// ❌ DON'T: This breaks SSG build
function render(props) {
  const savedMode = localStorage.getItem('game-mode')
  return <div>{savedMode}</div>
}

// ✅ DO: Access browser APIs only in bind
function bind(el) {
  const savedMode = localStorage.getItem('game-mode')
  // Use savedMode for client-side initialization
  return { release: () => {} }
}
```

### 3. Component Logic Exposure

```typescript
// From HelpModal.tsx - exposing imperative API
export interface HelpModalLogic {
  open: () => void
  close: () => void
}

function bind(_el: HTMLElement): BindReturn<HelpModalLogic> {
  return {
    open: () => {
      const modalLogic = innerModalRef.current
      if (modalLogic?.show) {
        modalLogic.show()
      }
    },
    close: () => {
      const modalLogic = innerModalRef.current
      if (modalLogic?.hide) {
        modalLogic.hide()
      }
    },
    release: () => {}
  }
}
```

## A High-Performance Game

This project showcases Duct UI's capability for building interactive applications where performance matters. The granular subscription pattern means typing a letter updates only one slot, not 20+ components.

The combination of observable state, render/bind separation, and explicit memory management creates a responsive user experience that demonstrates production-ready architectural patterns.

Visit [fourdle.puthir.org](https://fourdle.puthir.org/) to play the game, and explore the [source code](https://github.com/puthirali/fourdle) to understand the granular state management implementation.

## Share Your Duct UI Project!

Building games or interactive applications with Duct UI? We'd love to see your work!

**Join the conversation**: Share your projects, ask questions, and connect with the Duct UI community in our [GitHub Discussions](https://github.com/navilan/duct-ui/discussions).

Whether you're building games, data applications, or state-driven interfaces, your examples help demonstrate Duct UI's architectural capabilities and inspire others.

---

*Start a discussion about your Duct UI project at [github.com/navilan/duct-ui/discussions](https://github.com/navilan/duct-ui/discussions)*
