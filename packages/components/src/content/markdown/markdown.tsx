import { createBlueprint, type BaseProps, type BindReturn, type BaseComponentEvents } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import MarkdownIt from "markdown-it"
import markdownItPrism from "markdown-it-prism"
import type { Options as MarkdownOptions } from "markdown-it"
import Prism from "prismjs"

// Import common Prism language components
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-json"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-go"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-docker"
import "prismjs/components/prism-graphql"

export interface MarkdownEvents extends BaseComponentEvents { }

export interface MarkdownLogic {
  updateContent: (content: string) => void
  getHtml: () => string
}

export interface MarkdownProps {
  content: string
  class?: string
  markdownIt?: MarkdownIt // Allow passing a custom markdown-it instance
  linkTarget?: "_blank" | "_self" | "_parent" | "_top"
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

// Factory function to create markdown instances with custom configuration
export function createMarkdownInstance(options?: MarkdownOptions) {
  const defaultOptions: MarkdownOptions = {
    html: false, // Disable HTML by default for safety
    linkify: true,
    typographer: true,
    breaks: true,
    ...options
  }

  const md = new MarkdownIt(defaultOptions)

  // Add syntax highlighting plugin
  md.use(markdownItPrism, {
    plugins: [],
    init: () => {
      // Any Prism initialization if needed
    }
  })

  // Customize link rendering to add target attribute if specified
  const defaultLinkRenderer = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

  return md
}

// Default markdown instance
const defaultMarkdown = createMarkdownInstance()

function render(props: BaseProps<MarkdownProps>) {
  const {
    content = '',
    class: className = '',
    markdownIt,
    linkTarget,
    ...moreProps
  } = props

  // Use provided markdown instance or default
  const md = markdownIt || defaultMarkdown

  // Override link renderer if linkTarget is specified
  if (linkTarget) {
    const originalLinkRenderer = md.renderer.rules.link_open
    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      const token = tokens[idx]
      const targetAttrIndex = token.attrIndex('target')

      if (targetAttrIndex < 0) {
        token.attrPush(['target', linkTarget])
      } else {
        token.attrs![targetAttrIndex][1] = linkTarget
      }

      // Add rel="noopener noreferrer" for security when target="_blank"
      if (linkTarget === '_blank') {
        const relAttrIndex = token.attrIndex('rel')
        if (relAttrIndex < 0) {
          token.attrPush(['rel', 'noopener noreferrer'])
        } else {
          token.attrs![relAttrIndex][1] = 'noopener noreferrer'
        }
      }

      return originalLinkRenderer ? originalLinkRenderer(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options)
    }
  }

  const html = md.render(content)

  // Reset link renderer to avoid side effects
  if (linkTarget) {
    md.renderer.rules.link_open = defaultMarkdown.renderer.rules.link_open
  }

  return (
    <div
      class={`markdown-content ${className}`}
      data-markdown
      {...moreProps}
    >
      <div data-content>{html}</div>
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<MarkdownEvents>, props: MarkdownProps): BindReturn<MarkdownLogic> {
  const contentEl = el.querySelector('[data-content]') as HTMLElement

  function updateContent(content: string) {
    // Use provided instance or default
    const md = props.markdownIt || defaultMarkdown

    const html = md.render(content)
    if (contentEl) {
      contentEl.innerHTML = html
    }
  }

  function getHtml(): string {
    return contentEl?.innerHTML || ''
  }

  return {
    updateContent,
    getHtml,
    release: () => {
      // No cleanup needed
    }
  }
}

const id = { id: "duct-ui/markdown" }

const Markdown = createBlueprint<MarkdownProps, MarkdownEvents, MarkdownLogic>(
  id,
  render,
  { bind }
)

// Export the component
export default Markdown