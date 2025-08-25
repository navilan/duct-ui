// Import all demo components
import ButtonDemo from "./demos/ButtonDemo"
import IconButtonDemo from "./demos/IconButtonDemo"
import ToggleDemo from "./demos/ToggleDemo"
import AsyncToggleDemo from "./demos/AsyncToggleDemo"
import EditableInputDemo from "./demos/EditableInputDemo"
import MenuDemo from "./demos/MenuDemo"
import SelectDemo from "./demos/SelectDemo"
import TreeViewDemo from "./demos/TreeViewDemo"
import SidebarDemo from "./demos/SidebarDemo"
import DrawerDemo from "./demos/DrawerDemo"
import TabsDemo from "./demos/TabsDemo"
import ModalDemo from "./demos/ModalDemo"
import EmojiListDemo from "./demos/EmojiListDemo"
import CounterDemo from "./demos/CounterDemo"
import MarkdownDemo from "./demos/MarkdownDemo"
import SearchDemo from "./demos/SearchDemo"
import DocsIntro from "./docs/DocsIntro"
import DocsWhyDuct from "./docs/DocsWhyDuct"
import DocsComparison from "./docs/DocsComparison"
import DocsBuilding from "./docs/DocsBuilding"
import DocsClaudeCode from "./docs/DocsClaudeCode"
import DocsSSG from "./docs/DocsSSG"
import DocsBlog from "./docs/DocsBlog"
import DocsBuiltWithDuct from "./docs/DocsBuiltWithDuct"
import DocsLayoutContext from "./docs/DocsLayoutContext"

export interface PageInfo {
  id: string
  title: string
  description: string
  component: () => JSX.Element
}

export interface PageCategory {
  type: 'category'
  id: string
  title: string
  page: 'docs' | 'demos'
  items: PageInfo[]
}

export interface PageSeparator {
  type: 'separator'
  title?: string
}

export type PageSection = PageCategory | PageSeparator

// Documentation sections - properly categorized
export const docsSections: PageSection[] = [
  {
    type: 'category',
    id: "getting-started",
    title: "Getting Started",
    page: "docs",
    items: [
      {
        id: "what-is-duct",
        title: "What is Duct?",
        description: "Introduction to the Duct UI Framework and its core concepts",
        component: () => {
          return DocsIntro({})
        }
      },
      {
        id: "why-duct",
        title: "Why Choose Duct?",
        description: "Benefits and advantages of using the Duct UI Framework",
        component: () => {
          return DocsWhyDuct({})
        }
      },
      {
        id: "comparison",
        title: "Duct vs Other Frameworks",
        description: "How Duct compares to React, Vue, and Svelte",
        component: () => {
          return DocsComparison({})
        }
      }
    ]
  },
  {
    type: 'category',
    id: "core-concepts",
    title: "Core Concepts",
    page: "docs",
    items: [
      {
        id: "building-components",
        title: "Building Components",
        description: "A comprehensive guide to creating Duct components",
        component: () => {
          return DocsBuilding({})
        }
      },
      {
        id: "claude-code",
        title: "Using Claude Code",
        description: "How to train Claude Code to generate high-quality Duct components",
        component: () => {
          return DocsClaudeCode({})
        }
      }
    ]
  },
  {
    type: 'category',
    id: "static-site",
    title: "Static Site Generation",
    page: "docs",
    items: [
      {
        id: "static-site-generation",
        title: "Static Site Generation",
        description: "Build fast, SEO-friendly websites with file-based routing and SSG",
        component: () => {
          return DocsSSG({})
        }
      },
      {
        id: "creating-a-blog",
        title: "Creating a Blog",
        description: "Complete guide to building a blog with markdown content, tagging, and pagination",
        component: () => {
          return DocsBlog({})
        }
      },
      {
        id: "layout-context",
        title: "Layout Context Reference",
        description: "Complete guide to Duct layouts, context variables, and Nunjucks templating",
        component: () => {
          return DocsLayoutContext({})
        }
      }
    ]
  },
  {
    type: 'category',
    id: "showcase",
    title: "Showcase",
    page: "docs",
    items: [
      {
        id: "built-with-duct",
        title: "Built with Duct",
        description: "Real-world websites and applications showcasing Duct features",
        component: () => {
          return DocsBuiltWithDuct({})
        }
      }
    ]
  }
]

// Demo sections
export const demoSections: PageSection[] = [
  {
    type: 'category',
    id: "button",
    title: "Button",
    page: "demos",
    items: [
      {
        id: "button",
        title: "Basic Button",
        description: "Basic button component with event handling",
        component: () => {
          return ButtonDemo({})
        }
      },
      {
        id: "icon-button",
        title: "Icon Button",
        description: "Button component with icon support",
        component: () => {
          return IconButtonDemo({})
        }
      },
      {
        id: "toggle",
        title: "Toggle Button",
        description: "Toggle button with on/off states and custom styling",
        component: () => {
          return ToggleDemo({})
        }
      },
      {
        id: "async-toggle",
        title: "Async Toggle",
        description: "Asynchronous toggle button with custom async operations and loading states",
        component: () => {
          return AsyncToggleDemo({})
        }
      }
    ]
  },
  {
    type: 'category',
    id: "input",
    title: "Input",
    page: "demos",
    items: [
      {
        id: "editable-input",
        title: "Editable Input",
        description: "Click-to-edit input with keyboard shortcuts",
        component: () => {
          return EditableInputDemo({})
        }
      },
      {
        id: "search",
        title: "Search",
        description: "Full-text search with FlexSearch and real-time results",
        component: () => {
          return SearchDemo({})
        }
      }
    ]
  },
  {
    type: 'category',
    id: "dropdown",
    title: "Dropdown",
    page: "demos",
    items: [
      {
        id: "menu",
        title: "Menu & MenuItem",
        description: "Dropdown menus with customizable placement and actions",
        component: () => {
          return MenuDemo({})
        }
      },
      {
        id: "select",
        title: "Select",
        description: "Dropdown select component with selection markers",
        component: () => {
          return SelectDemo({})
        }
      }
    ]
  },
  {
    type: 'category',
    id: "data-display",
    title: "Data Display",
    page: "demos",
    items: [
      {
        id: "tree-view",
        title: "TreeView",
        description: "Collapsible tree view for hierarchical data",
        component: () => {
          return TreeViewDemo({})
        }
      },
      {
        id: "emoji-list",
        title: "List",
        description: "Interactive list with filtering, pagination, and component logic access",
        component: () => {
          return EmojiListDemo({})
        }
      }
    ]
  },
  {
    type: 'category',
    id: "content",
    title: "Content",
    page: "demos",
    items: [
      {
        id: "markdown",
        title: "Markdown",
        description: "Render markdown content with syntax highlighting - the same component used in this documentation",
        component: () => {
          return MarkdownDemo({})
        }
      }
    ]
  },
  {
    type: 'category',
    id: "layout",
    title: "Layout",
    page: "demos",
    items: [
      {
        id: "tabs",
        title: "Tabs",
        description: "Tabbed interface with dynamic content and nested tabs",
        component: () => {
          return TabsDemo({})
        }
      },
      {
        id: "modal",
        title: "Modal Window",
        description: "Modal dialogs with customizable overlays and content",
        component: () => {
          return ModalDemo({})
        }
      },
      {
        id: "sidebar",
        title: "Sidebar Navigation",
        description: "Navigation sidebar with sections and hierarchical items",
        component: () => {
          return SidebarDemo({})
        }
      },
      {
        id: "drawer",
        title: "Drawer",
        description: "Responsive drawer component for mobile and desktop layouts",
        component: () => {
          return DrawerDemo({})
        }
      }
    ]
  },
  {
    type: 'category',
    id: "advanced",
    title: "Advanced",
    page: "demos",
    items: [
      {
        id: "counter",
        title: "Async Counter",
        description: "Counter component demonstrating async data loading with IndexedDB persistence",
        component: () => {
          return CounterDemo({})
        }
      }
    ]
  }
]

// Combined sections for backward compatibility
export const sections: PageSection[] = [...docsSections, ...demoSections]

// Flatten all pages for easy lookup
export const allPages: PageInfo[] = sections.flatMap(category =>
  'items' in category ? category.items : []
)

// Separate docs and component demos
export const docsItems: PageInfo[] = docsSections
  .filter(category => 'items' in category)
  .flatMap(category => (category as PageCategory).items)

export const componentDemos: PageInfo[] = demoSections
  .filter(category => 'items' in category)
  .flatMap(category => (category as PageCategory).items)

export function getItemById(id: string): PageInfo | undefined {
  return allPages.find(demo => demo.id === id)
}

export function getDefaultItem(): PageInfo {
  return allPages[0]
}