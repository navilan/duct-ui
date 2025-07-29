import ButtonDemo from "./ButtonDemo"
import IconButtonDemo from "./IconButtonDemo"
import ToggleDemo from "./ToggleDemo"
import AsyncToggleDemo from "./AsyncToggleDemo"
import EditableInputDemo from "./EditableInputDemo"
import MenuDemo from "./MenuDemo"
import SelectDemo from "./SelectDemo"
import TreeViewDemo from "./TreeViewDemo"
import SidebarDemo from "./SidebarDemo"
import DrawerDemo from "./DrawerDemo"
import TabsDemo from "./TabsDemo"
import ModalDemo from "./ModalDemo"
import EmojiListDemo from "./EmojiListDemo"
import CounterDemo from "./CounterDemo"
import DocsIntroDemo from "./DocsIntroDemo"
import DocsWhyDuctDemo from "./DocsWhyDuctDemo"
import DocsComparisonDemo from "./DocsComparisonDemo"
import DocsBuildingDemo from "./DocsBuildingDemo"
import DocsClaudeCodeDemo from "./DocsClaudeCodeDemo"

export interface DemoInfo {
  id: string
  title: string
  description: string
  component: () => JSX.Element
}

export interface DemoCategory {
  id: string
  title: string
  demos: DemoInfo[]
}

export const demoCategories: (DemoCategory | { type: 'separator', title?: string })[] = [
  {
    id: "documentation",
    title: "Documentation",
    demos: [
      {
        id: "what-is-duct",
        title: "What is Duct?",
        description: "Introduction to the Duct UI Framework and its core concepts",
        component: () => {
          return DocsIntroDemo({})
        }
      },
      {
        id: "why-duct",
        title: "Why Choose Duct?",
        description: "Benefits and advantages of using the Duct UI Framework",
        component: () => {
          return DocsWhyDuctDemo({})
        }
      },
      {
        id: "comparison",
        title: "Duct vs Other Frameworks",
        description: "How Duct compares to React, Vue, and Svelte",
        component: () => {
          return DocsComparisonDemo({})
        }
      },
      {
        id: "building-components",
        title: "Building Components",
        description: "A comprehensive guide to creating Duct components",
        component: () => {
          return DocsBuildingDemo({})
        }
      },
      {
        id: "claude-code",
        title: "Using Claude Code",
        description: "How to train Claude Code to generate high-quality Duct components",
        component: () => {
          return DocsClaudeCodeDemo({})
        }
      }
    ]
  },
  {
    type: 'separator',
    title: 'Component Demos'
  },
  {
    id: "button",
    title: "Button",
    demos: [
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
    id: "input",
    title: "Input",
    demos: [
      {
        id: "editable-input",
        title: "Editable Input",
        description: "Click-to-edit input with keyboard shortcuts",
        component: () => {
          return EditableInputDemo({})
        }
      }
    ]
  },
  {
    id: "dropdown",
    title: "Dropdown",
    demos: [
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
    id: "data-display",
    title: "Data Display",
    demos: [
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
    id: "layout",
    title: "Layout",
    demos: [
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
    id: "advanced",
    title: "Advanced",
    demos: [
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

// Flatten all demos for easy lookup
export const allDemos: DemoInfo[] = demoCategories.flatMap(category => 
  'demos' in category ? category.demos : []
)

export function getDemoById(id: string): DemoInfo | undefined {
  return allDemos.find(demo => demo.id === id)
}

export function getDefaultDemo(): DemoInfo {
  return allDemos[0]
}