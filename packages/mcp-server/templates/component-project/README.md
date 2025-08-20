# {{name}}

{{description}}

## Installation

```bash
npm install {{name}}
# or
pnpm add {{name}}
# or
yarn add {{name}}
```

## Usage

```typescript
import { MyButton } from '{{name}}'

// Use the component in your Duct application
function MyApp() {
  return (
    <div>
      <MyButton variant="primary">Click me</MyButton>
    </div>
  )
}
```

## Components

This package provides the following components:

- **MyButton**: A customizable button component with multiple variants and click handling

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Watch for changes during development
pnpm dev

# Type check
pnpm check

# Clean build artifacts
pnpm clean
```

## Built with Duct UI

This component library is built using the [Duct UI Framework](https://duct-ui.org), providing:

- **Performance**: Compiled templates with minimal runtime overhead
- **Type Safety**: Full TypeScript support with strict typing
- **Lifecycle Management**: Clear component lifecycle with render, bind, and release phases
- **Event System**: Type-aware event handling with EventEmitter
- **SSR/SSG Support**: Server-side rendering and static site generation ready

## License

MIT