# Duct UI

![NPM Version](https://img.shields.io/npm/v/%40duct-ui%2Fcore)

A DOM-first UI framework with JSX templates, standard component library and explicit lifecycle management.

> **⚠️ Under Construction**: This library is currently in early development and may exhibit unexpected behavior. APIs are subject to change and components may not be fully stable. Use with caution in production environments.

## Quick Start

```bash
npm install @duct-ui/core @duct-ui/components
```

```typescript
import { createRef } from '@duct-ui/core'
import Button from '@duct-ui/components/button/button'

const buttonRef = createRef<ButtonLogic>()

function MyApp() {
  return (
    <Button
      ref={buttonRef}
      label="Click me"
      class="btn btn-primary"
      on:click={() => console.log('Clicked!')}
    />
  )
}
```

## Core Concepts

### Component Logic Access
Access component methods via refs:

```typescript
const buttonRef = createRef<ButtonLogic>()

// In render
<Button ref={buttonRef} label="Toggle" />

// Access methods
buttonRef.current?.setDisabled(true)
```

### Lifecycle Phases
Components follow explicit lifecycle phases:
1. **Render**: JSX structure creation
2. **Load**: Async data loading (optional)
3. **Bind**: Event listeners and logic setup
4. **Release**: Cleanup when component unmounts

## Building Components

```typescript
import { createBlueprint, type BaseProps, type BaseComponentEvents } from '@duct-ui/core'

interface MyComponentProps {
  label: string
  disabled?: boolean
  'on:click'?: (el: HTMLElement) => void
}

interface MyComponentEvents extends BaseComponentEvents {
  click: (el: HTMLElement) => void
}

interface MyComponentLogic {
  setDisabled: (disabled: boolean) => void
}

function render(props: BaseProps<MyComponentProps>) {
  const { disabled = false, label, ...moreProps} = props;
  return (
    <button
      class="btn"
      disabled={disabled}
      {...moreProps}
    >
      {label}
    </button>
  )
}

function bind(el: HTMLElement, eventEmitter, props): BindReturn<MyComponentLogic> {
  const button = el as HTMLButtonElement

  function handleClick() {
    eventEmitter.emit('click', button)
  }

  button.addEventListener('click', handleClick)

  return {
    setDisabled: (disabled) => button.disabled = disabled,
    release: () => button.removeEventListener('click', handleClick)
  }
}

const MyComponent = createBlueprint<MyComponentProps, MyComponentEvents, MyComponentLogic>(
  { id: 'my-app/my-component' },
  render,
  { bind }
)

export default MyComponent
```

## Packages

- **@duct-ui/core**: Core framework runtime and utilities
- **@duct-ui/components**: Pre-built component library
- **@duct-ui/cli**: Static site generation and build tools
- **@duct-ui/demo**: Interactive demos and documentation

## Static Site Generation

Duct includes first-class support for static site generation with file-based routing:

```bash
npm install @duct-ui/cli --save-dev
```

Build fast, SEO-friendly static sites with Duct components using file-based routing, dynamic routes, and Nunjucks layouts. Perfect for documentation sites, blogs, and marketing pages.

[→ Learn more about SSG](https://duct-ui.org/docs/static-site-generation)

## Philosophy

1. **Don't hide the DOM** - Direct DOM access and manipulation
2. **Little magic, lots of logic** - Explicit over implicit
3. **Easy packaging, simple reuse** - Component composition and distribution
