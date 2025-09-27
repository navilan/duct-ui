---
title: "Real-World Duct UI: Interactive Data Visualization"
date: 2025-09-27
image: /docs/gallery/eoeo-one.png
ogPath: /docs/gallery/eoeo-one.png
author: navilan
tags: [Examples, Tutorial, Real-World, Article, Visualization]
---

See how Duct UI powers an interactive single-page application with dynamic SVG visualizations, observable state management, and reactive architecture. A compelling example of building data-rich experiences with sophisticated state synchronization.

<!--more-->

[![Echoes of Each Other](/docs/gallery/eoeo-one.png)](https://eoeo.one/)

## 🎨 Live Example: eoeo.one

**Website**: [https://eoeo.one/](https://eoeo.one/)
**Source Code**: [https://github.com/navilan/eoeo](https://github.com/navilan/eoeo)

This interactive visualization app showcases Duct UI's power for building complex, stateful applications that go beyond traditional websites. The entire experience is a single-page application that dynamically generates and updates SVG visualizations based on user interactions through a sophisticated observable state management system.

## ✨ Key Features Demonstrated

### 1. Dynamic SVG Visualization

The core feature is a data-driven SVG visualization that responds to user input in real-time through reactive graph generation.

**Implementation Highlights:**
- Programmatically generated SVG elements via `buildActiveGraph()`
- Real-time data binding to visual properties
- Smooth transitions and animations
- Responsive scaling for all screen sizes

**See it live**: Visit [eoeo.one](https://eoeo.one/) and interact with the visualization controls to see the graphics update dynamically.

**Technical approach**: The visualization engine creates SVG elements through reactive graph building, where state changes automatically trigger graph regeneration and visual updates.

### 2. Observable State Management

The application implements a sophisticated singleton-based state management system using observables for reactive updates.

**Architecture Features:**
- **Singleton Pattern**: Global state access through `createAppState()` and `getAppState()`
- **Observable Events**: lib0/observable for reactive state changes
- **Immutable Updates**: State cloning prevents direct mutations
- **Granular Updates**: Specific methods for different state properties

**See it in action**: Notice how changes in control panels immediately reflect in the visualization through the observable state system.

**Source code reference**: The state management in [app-state.ts](https://github.com/navilan/eoeo/blob/main/src/utils/app-state.ts) implements typed interfaces with comprehensive event handling.

### 3. Reactive Component Communication

The app demonstrates advanced reactive patterns using observable state and typed event interfaces.

**Communication Patterns:**
- **AppStateEvents Interface**: Typed event definitions for state, graph, transform, and search changes
- **Observable Subscriptions**: Components subscribe to specific state changes
- **Automatic Graph Rebuilding**: State changes trigger reactive graph updates
- **Batch State Updates**: Multiple state properties updated atomically

```typescript
// Example reactive pattern from the implementation
interface AppStateEvents {
  stateChange: (state: AppState) => void
  graphChange: (graph: GraphData) => void
  transformChange: (transform: TransformState) => void
  searchChange: (query: string) => void
}
```

### 4. Interactive UI Components with State Binding

The interface uses Duct's built-in components enhanced with reactive state binding.

**Component Integration:**
- **Drawer Component**: Navigation panels with state-driven visibility
- **Select Component**: Dropdown controls bound to observable state
- **Custom Controls**: Specialized inputs with granular state updates
- **Reactive Layout**: Dynamic updates based on state changes

**State Integration**: Components use methods like `updatePerspective()`, `updateMetric()`, and `toggleState()` for granular state control.

### 5. Real-Time Reactive Updates

The application provides immediate visual feedback through the observable state system.

**Reactive Features:**
- Instant visualization changes via `buildActiveGraph()`
- Smooth state transitions with immutable updates
- Performance-optimized observable subscriptions
- Memory-efficient event handling with cleanup

Check how the visualization responds immediately to control changes through the reactive state management system.

## 🏗️ Architecture Deep Dive

### Observable State Pattern

```typescript
// Simplified version of the actual implementation
function createAppState(initialState?: Partial<AppState>): AppStateManager {
  const state = { ...defaultState, ...initialState }
  const observable = new Observable<AppStateEvents>()

  return {
    getState: () => state,
    updateState: (updates) => {
      Object.assign(state, updates)
      observable.emit('stateChange', state)
    },
    on: (event, callback) => observable.on(event, callback),
    off: (event, callback) => observable.off(event, callback)
  }
}
```

### Component State Integration

```typescript
// How components integrate with the observable state
function bind(el, eventEmitter, props) {
  const appState = getAppState()

  // Subscribe to state changes
  appState.on('stateChange', (newState) => {
    updateVisualization(newState)
  })

  appState.on('graphChange', (graph) => {
    renderGraph(graph)
  })

  // Handle user interactions
  function handleControlChange(value) {
    appState.updatePerspective(value)
  }

  return {
    release: () => {
      // Observable cleanup handled automatically
    }
  }
}
```

## 🛠️ Technical Stack

- **Framework**: Duct UI (Client-side rendering)
- **State Management**: Observable pattern with lib0/observable
- **Build Tool**: Vite
- **Graphics**: Native SVG with reactive generation
- **Styling**: CSS with Tailwind utilities
- **Architecture**: Singleton state with reactive updates
- **Languages**: TypeScript, JavaScript
- **Package Manager**: pnpm

## 🚀 Running Locally

To explore this example locally:

```bash
# Clone the repository
git clone https://github.com/navilan/eoeo.git
cd eoeo

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 💡 Key Takeaways

This real-world example demonstrates:

1. **Observable State Management**: Implementing reactive state with typed events
2. **Singleton Pattern**: Global state access with proper initialization
3. **Reactive Architecture**: Automatic updates through observable subscriptions
4. **Component Integration**: Seamless binding between Duct components and state
5. **SVG Generation**: Dynamic graphics through reactive graph building
6. **Performance Optimization**: Efficient state updates with immutable patterns

## 🔍 Code Examples to Study

### Observable State Implementation
Examine [app-state.ts](https://github.com/navilan/eoeo/blob/main/src/utils/app-state.ts) to understand the singleton observable pattern and reactive state management.

### Graph Generation Logic
Study how `buildActiveGraph()` creates dynamic visualizations based on state changes.

### Component State Binding
See how Duct components integrate with the observable state system for reactive updates.

### Event-Driven Architecture
Observe the typed event interfaces and how components subscribe to specific state changes.

## 🎉 A Reactive Example

This project showcases Duct UI's capability for building reactive, data-driven applications with sophisticated state management. The observable pattern creates a clean separation between state and UI while maintaining real-time synchronization.

The combination of singleton state management, observable events, and reactive graph generation creates a smooth, responsive user experience that demonstrates advanced architectural patterns.

Visit [eoeo.one](https://eoeo.one/) to experience the reactive visualization, and explore the [source code](https://github.com/navilan/eoeo) to understand the observable state implementation.

## 🤝 Share Your Duct UI Project!

Building reactive applications with Duct UI? We'd love to see your work!

**Join the conversation**: Share your projects, ask questions, and connect with the Duct UI community in our [GitHub Discussions](https://github.com/navilan/duct-ui/discussions).

Whether you're building data visualizations, reactive interfaces, or state-driven applications, your examples help demonstrate Duct UI's architectural capabilities and inspire others.

---

*Start a discussion about your Duct UI project at [github.com/navilan/duct-ui/discussions](https://github.com/navilan/duct-ui/discussions)*