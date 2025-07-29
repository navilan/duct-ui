# Duct UI Core

![NPM Version](https://img.shields.io/npm/v/%40duct-ui%2Fcore)

The core runtime for Duct UI framework providing component blueprint, minimal runtime, and lifecycle management.

> **⚠️ Under Construction**: This library is currently in early development and may exhibit unexpected behavior. APIs are subject to change and components may not be fully stable. Use with caution in production environments.

## Installation

```bash
npm install @duct-ui/core
```

## Core APIs

### `createBlueprint()`
Creates a component blueprint with render, bind, and lifecycle functions:

```typescript
import { createBlueprint } from '@duct-ui/core'

const MyComponent = createBlueprint<Props, Events, Logic>(
  { id: 'my-app/component' },
  render,
  { bind, load } // load is optional
)
```

### `createRef()`
Creates a reference to access component logic:

```typescript
import { createRef } from '@duct-ui/core'

const componentRef = createRef<ComponentLogic>()

// In JSX
<MyComponent ref={componentRef} />

// Access methods
componentRef.current?.someMethod()
```

### Component Lifecycle

1. **Render Phase**: Component JSX is created and inserted into DOM
2. **Load Phase** (optional): Async data loading before binding
3. **Bind Phase**: Event listeners attached, logic initialized
4. **Release Phase**: Cleanup when component is destroyed

## Well-typed Components

```typescript
import type {
  BaseProps,
  BaseComponentEvents,
  BindReturn
} from '@duct-ui/core'

interface MyComponentProps {
  label: string
  'on:click'?: (el: HTMLElement) => void
}

interface MyComponentEvents extends BaseComponentEvents {
  click: (el: HTMLElement) => void
}

interface MyComponentLogic {
  setLabel: (label: string) => void
}
```

## Resources

- [Main Repository](https://github.com/navilan/duct-ui)
- [Component Library](@duct-ui/components)
- [Live Demos](https://duct-ui.org)
