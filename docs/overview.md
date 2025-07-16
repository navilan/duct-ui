# Abstract

Duct: A new UI framework library that wraps over jsx templates and simplifies building
UI components.

# Components

A new component library is created by initializing a new typescript project. The following structure is expected:

- <library-name>
  - src
    - <component-name>
      - template.tsx
      - companion.ts

The template file contains the view and the companion contains the logic. The companion
can have its own shape that extends the following base shape:

interface DuctComponent<EventType, Events> {
  on?: (event: EventType, handler: Events[EventType])
  off?: (event: EventType, handler: Events[EventType])
  destroy: () => void
}

# Registration

During compile time each of these components is registered with an optional namespace. So a button component can register itself as "duct/button".

# Usage

const component = Duct.createComponent("duct/button")
component.on('click', () => {
  console.log("Button clicked")
})
const html = component.render(context)
rootElement.innerHTML = html

# Goals

* Minimum friction in creating component libraries, distributing and using them
* Ease of use in creating component libraries as part of a pnpm or yarn workspace and using them across applications in the workspace
* Ease of embedding components in other components.
* Clear separation of view code and logic code (as an antithesis to React)
* Simplicity and no leaky abstractions
* Templates are precompiled for speed

# Milestones

1. A simple button component with both UI rendering and click event handling is rendered
2. A dropdown button component that composes the button component is rendered

# Overall Project structure

- @duct-ui/core: The shared "Duct" runtime
- @duct-ui/tools/cli: Duct cli to bundle components
- @duct-ui/components: Core component library bundled with duct
    - button (duct/button)
    - dropdown (duct/dropdown)
- @duct-ui/demo: Demo project to test / showcase core components
    - examples
      - button
        - index.html
      - dropdown
        - index.html

# Tools & Environment

I prefer using pnpm for managing workspaces and dependencies. I'd like to use lib0/ObservableV2 library to handle type aware event emitting and handling. The bundles shall be ESM with types (*.mjs, *.d.mts).