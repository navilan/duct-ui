# Duct UI Components

![NPM Version](https://img.shields.io/npm/v/%40duct-ui%2Fcomponents)

A comprehensive component library for Duct UI with buttons, forms, navigation, layout, and data display components.

## Installation

```bash
npm install @duct-ui/components @duct-ui/core
```

## Usage

```typescript
import { createRef } from '@duct-ui/core'
import Button from '@duct-ui/components/button/button'
import Toggle from '@duct-ui/components/button/toggle'
import Modal from '@duct-ui/components/layout/modal'

const buttonRef = createRef<ButtonLogic>()
const modalRef = createRef<ModalLogic>()

function MyApp() {
  return (
    <div>
      <Button
        ref={buttonRef}
        label="Open Modal"
        class="btn btn-primary"
        on:click={() => modalRef.current?.show()}
      />

      <Toggle
        onLabel="Hide"
        offLabel="Show"
        initialState="off"
        on:change={(el, state) => console.log('Toggle:', state)}
      />

      <Modal
        ref={modalRef}
        content={() => <div>Modal content here</div>}
        on:close={() => console.log('Modal closed')}
      />
    </div>
  )
}
```

## Available Components

### Buttons
- `Button` - Basic button with customizable styling
- `IconButton` - Button with icon support
- `Toggle` - Toggle button with on/off states
- `AsyncToggle` - Toggle with async operations

### Forms & Input
- `EditableInput` - Click-to-edit text input

### Dropdown & Navigation
- `Menu` - Dropdown menu with items
- `MenuItem` - Individual menu item
- `MenuSeparator` - Visual separator for menus
- `Select` - Dropdown selection component

### Layout
- `Modal` - Modal dialogs with positioning
- `Tabs` - Tabbed interface component
- `Drawer` - Responsive drawer/sidebar
- `SidebarNav` - Navigation sidebar

### Data Display
- `List` - Paginated list component
- `TreeView` - Hierarchical tree view

### Images
- `Icon` - Icon component with SVG support

## Styling

Components use Tailwind CSS classes. Some components include additional CSS files that should be imported:

```css
/* In your main CSS file */
@import '@duct-ui/components/layout/drawer.css';
@import '@duct-ui/components/layout/modal.css';
@import '@duct-ui/components/data-display/tree-view.css';
@import '@duct-ui/components/layout/sidebar-nav.css';
```

## Component Logic Access

All components expose their logic through refs:

```typescript
const componentRef = createRef<ComponentLogic>()

// Use in JSX
<Component ref={componentRef} />

// Access methods
componentRef.current?.someMethod()
```

## Static Site Generation

All components work seamlessly with Duct's static site generation:

```typescript
// In your SSG pages
import Button from '@duct-ui/components/button/button'

export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <Button label="Get Started" class="btn btn-primary" />
    </div>
  )
}
```

## Resources

- [Main Repository](https://github.com/navilan/duct-ui)
- [Core Framework](https://www.npmjs.com/package/@duct-ui/core)
- [Static Site Generation](https://www.npmjs.com/package/@duct-ui/cli)
- [Live Demos](https://duct-ui.org)
