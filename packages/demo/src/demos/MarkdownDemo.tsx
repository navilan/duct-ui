import { createBlueprint, renderProps, type BaseProps, type BindReturn } from "@duct-ui/core/blueprint"
import { createRef, type MutableRef } from "@duct-ui/core"
import Markdown, { createMarkdownInstance, type MarkdownLogic } from "@duct-ui/components/content/markdown/markdown"
import "@duct-ui/components/content/markdown/markdown.css"
import Tabs, { type TabItem } from "@duct-ui/components/layout/tabs"
import DemoLayout from "@components/DemoLayout"
import DuctLogo from '../icons/duct-logo.svg'


const sampleMarkdown = `# Markdown Component Demo

This demo showcases the **Duct UI Markdown component**, which is the same component used throughout this documentation site.

## Features

### Basic Formatting

- **Bold text** and *italic text*
- ~~Strikethrough text~~
- \`inline code\`
- [Links](https://github.com/navilan/duct-ui)

### Lists

1. Ordered lists
2. With multiple items
   - Can be nested
   - With proper indentation

- Unordered lists
- Also work great
  - With nesting
  - As deep as needed

### Code Blocks with Syntax Highlighting

~~~typescript
// TypeScript example with Prism.js highlighting
interface MarkdownProps {
  content: string
  class?: string
  markdownIt?: MarkdownIt
  unsafe?: boolean
  linkTarget?: "_blank" | "_self" | "_parent" | "_top"
}

function render(props: BaseProps<MarkdownProps>) {
  const { content, markdownIt, unsafe } = props
  const md = markdownIt || defaultMarkdown
  return <div unsafe-html={md.render(content)} />
}
~~~

~~~javascript
// JavaScript is also supported
const markdown = createMarkdownInstance({
  html: false,
  linkify: true,
  typographer: true
})

console.log(markdown.render('# Hello World'))
~~~

### Blockquotes

> "The Markdown component in Duct UI provides a clean,
> extensible way to render markdown content with full
> TypeScript support and customizable parsing options."
>
> — Duct UI Documentation

### Tables

| Feature | Description | Status |
|---------|-------------|--------|
| CommonMark | Full CommonMark compliance | ✅ |
| Syntax Highlighting | Prism.js integration | ✅ |
| HTML Support | Raw HTML rendering enabled | ✅ |
| TypeScript | Full type safety | ✅ |

### Horizontal Rules

---

### Images

![Duct UI Logo](${DuctLogo})

## Advanced Usage

The component supports:

1. **Custom markdown-it instances** - Pass your own configured parser
2. **Unsafe HTML** - Enable raw HTML rendering when needed
3. **Link targets** - Control how links open
4. **Dynamic content updates** - Use the component logic to update content

### Security Note

By default, HTML in markdown is disabled for security. You can enable it with the \`unsafe\` prop, but be careful with user-generated content!
`

const advancedExample = `# Advanced Markdown Features

## Task Lists

- [x] Create Markdown component
- [x] Add syntax highlighting with Prism.js
- [x] Support custom markdown-it instances
- [ ] Add more Prism language packs
- [ ] Create plugin system

## Extended Syntax

### Definition Lists (with plugin)

Term 1
:   Definition 1 with *inline markup*

Term 2
:   Definition 2
    { some code, part of Definition 2 }

## HTML Support

<div class="alert alert-warning">
  <strong>Warning!</strong> This content includes raw HTML.
  Only enable this for trusted content.
</div>

<details>
<summary>Click to expand</summary>

This is a native HTML details element that works with custom markdown-it instances.

</details>
`

function createTabItems(markdownRef: MutableRef<MarkdownLogic>): TabItem[] {
  return [
    {
      id: 'basic',
      label: 'Basic Example',
      content: () => (
        <div>
          <div class="mb-4">
            <h3 class="text-lg font-semibold mb-2">Standard Markdown Rendering</h3>
            <p class="text-sm text-base-content/70">
              This example shows standard markdown features with syntax highlighting.
            </p>
          </div>
          <div class="border border-base-300 rounded-lg p-4 bg-base-100">
            <Markdown
              ref={markdownRef}
              content={sampleMarkdown}
              data-basic-markdown
            />
          </div>
        </div>
      )
    },
    {
      id: 'advanced',
      label: 'Advanced Features',
      content: () => (
        <div>
          <div class="mb-4">
            <h3 class="text-lg font-semibold mb-2">Advanced Markdown Features</h3>
            <p class="text-sm text-base-content/70">
              This example demonstrates extended syntax that requires plugins or unsafe mode.
            </p>
          </div>
          <div class="border border-base-300 rounded-lg p-4 bg-base-100">
            <Markdown
              content={advancedExample}
              data-advanced-markdown
            />
          </div>
        </div>
      )
    }
  ]
}

function render(props: BaseProps<{}>) {
  const markdownRef: MutableRef<MarkdownLogic> = createRef()

  return (
    <div {...renderProps(props)}>
      <DemoLayout
        title="Markdown Component"
        description="A powerful markdown rendering component with syntax highlighting, customizable parsing, and full TypeScript support. This is the same component used throughout the Duct UI documentation."
        sourcePath="/demos/MarkdownDemo.tsx"
      >
        <div>

          {/* Markdown Examples */}
          <Tabs
            items={createTabItems(markdownRef)}
            activeTabId="basic"
            tabClass="tab"
            activeTabClass="tab-active"
            contentClass="tab-content mt-4"
          />

          {/* Code Example */}
          <div class="mt-8">
            <h3 class="text-xl font-semibold mb-4">Usage Example</h3>
            <div class="border border-base-300 rounded-lg p-4 bg-base-100">
              <Markdown content={`## Installation

~~~bash
pnpm add markdown-it markdown-it-prism prismjs
~~~

## Basic Usage

~~~typescript
import Markdown from '@duct-ui/components/content/markdown/markdown'
import '@duct-ui/components/content/markdown/markdown.css'

// Simple markdown rendering
<Markdown content={markdownText} />
~~~

## Advanced Usage

~~~typescript
// Basic usage
<Markdown content={markdownText} />

// With component options
<Markdown
  content={markdownText}
  linkTarget="_blank"
  class="custom-markdown"
/>

// With custom markdown-it instance (if needed)
import { createMarkdownInstance } from '@duct-ui/components'
const md = createMarkdownInstance({ breaks: false })
<Markdown markdownIt={md} content={text} />
~~~

## Component Logic

~~~typescript
import { createRef } from '@duct-ui/core'
import type { MarkdownLogic } from '@duct-ui/components/content/markdown/markdown'

const markdownRef = createRef<MarkdownLogic>()

// Update content dynamically
markdownRef.current?.updateContent('# New Content')

// Get rendered HTML
const html = markdownRef.current?.getHtml()
~~~`} />
            </div>
          </div>

          {/* Feature List */}
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="card-title text-lg">Key Features</h3>
                <ul class="space-y-2 text-sm">
                  <li class="flex items-start gap-2">
                    <span class="text-success">✓</span>
                    <span>Full CommonMark support via markdown-it</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-success">✓</span>
                    <span>Syntax highlighting with Prism.js</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-success">✓</span>
                    <span>Support for custom markdown-it instances</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-success">✓</span>
                    <span>TypeScript support with full type safety</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-success">✓</span>
                    <span>Dynamic content updates via component logic</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-success">✓</span>
                    <span>Configurable link targets with security</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="card-title text-lg">Peer Dependencies</h3>
                <p class="text-sm text-base-content/70 mb-3">
                  To use the Markdown component, install these peer dependencies:
                </p>
                <div class="bg-base-content text-base-200 p-4">
                  <pre><code>pnpm add markdown-it markdown-it-prism prismjs</code></pre>
                </div>
                <p class="text-sm text-base-content/70 mt-3">
                  These are optional peer dependencies, so you only need them if you use the Markdown component.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

function bind(): BindReturn<any> {
  return {
    release: () => { }
  }
}

const id = { id: "duct-demo/markdown-demo" }

const MarkdownDemo = createBlueprint(id, render, { bind })

export default MarkdownDemo