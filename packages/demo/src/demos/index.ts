import makeButtonDemo from "./ButtonDemo"
import makeIconButtonDemo from "./IconButtonDemo"
import makeToggleDemo from "./ToggleDemo"
import makeEditableInputDemo from "./EditableInputDemo"
import makeMenuDemo from "./MenuDemo"
import makeSelectDemo from "./SelectDemo"
import makeTreeViewDemo from "./TreeViewDemo"
import makeSidebarDemo from "./SidebarDemo"
import makeDrawerDemo from "./DrawerDemo"
import makeTabsDemo from "./TabsDemo"
import makeModalDemo from "./ModalDemo"
import makeEmojiListDemo from "./EmojiListDemo"
import makeCounterDemo from "./CounterDemo"
import makeDocsIntroDemo from "./DocsIntroDemo"
import makeDocsWhyDuctDemo from "./DocsWhyDuctDemo"
import makeDocsComparisonDemo from "./DocsComparisonDemo"
import makeDocsBuildingDemo from "./DocsBuildingDemo"
import makeDocsClaudeCodeDemo from "./DocsClaudeCodeDemo"

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
          const DocsIntroDemo = makeDocsIntroDemo()
          return DocsIntroDemo({})
        }
      },
      {
        id: "why-duct",
        title: "Why Choose Duct?",
        description: "Benefits and advantages of using the Duct UI Framework",
        component: () => {
          const DocsWhyDuctDemo = makeDocsWhyDuctDemo()
          return DocsWhyDuctDemo({})
        }
      },
      {
        id: "comparison",
        title: "Duct vs Other Frameworks",
        description: "How Duct compares to React, Vue, and Svelte",
        component: () => {
          const DocsComparisonDemo = makeDocsComparisonDemo()
          return DocsComparisonDemo({})
        }
      },
      {
        id: "building-components",
        title: "Building Components",
        description: "A comprehensive guide to creating Duct components",
        component: () => {
          const DocsBuildingDemo = makeDocsBuildingDemo()
          return DocsBuildingDemo({})
        }
      },
      {
        id: "claude-code",
        title: "Using Claude Code",
        description: "How to train Claude Code to generate high-quality Duct components",
        component: () => {
          const DocsClaudeCodeDemo = makeDocsClaudeCodeDemo()
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
          const ButtonDemo = makeButtonDemo()
          return ButtonDemo({})
        }
      },
      {
        id: "icon-button",
        title: "Icon Button",
        description: "Button component with icon support",
        component: () => {
          const IconButtonDemo = makeIconButtonDemo()
          return IconButtonDemo({})
        }
      },
      {
        id: "toggle",
        title: "Toggle Button",
        description: "Toggle button with on/off states and custom styling",
        component: () => {
          const ToggleDemo = makeToggleDemo()
          return ToggleDemo({})
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
          const EditableInputDemo = makeEditableInputDemo()
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
          const MenuDemo = makeMenuDemo()
          return MenuDemo({})
        }
      },
      {
        id: "select",
        title: "Select",
        description: "Dropdown select component with selection markers",
        component: () => {
          const SelectDemo = makeSelectDemo()
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
          const TreeViewDemo = makeTreeViewDemo()
          return TreeViewDemo({})
        }
      },
      {
        id: "emoji-list",
        title: "List",
        description: "Interactive list with filtering, pagination, and component logic access",
        component: () => {
          const EmojiListDemo = makeEmojiListDemo()
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
          const TabsDemo = makeTabsDemo()
          return TabsDemo({})
        }
      },
      {
        id: "modal",
        title: "Modal Window",
        description: "Modal dialogs with customizable overlays and content",
        component: () => {
          const ModalDemo = makeModalDemo()
          return ModalDemo({})
        }
      },
      {
        id: "sidebar",
        title: "Sidebar Navigation",
        description: "Navigation sidebar with sections and hierarchical items",
        component: () => {
          const SidebarDemo = makeSidebarDemo()
          return SidebarDemo({})
        }
      },
      {
        id: "drawer",
        title: "Drawer",
        description: "Responsive drawer component for mobile and desktop layouts",
        component: () => {
          const DrawerDemo = makeDrawerDemo()
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
          const CounterDemo = makeCounterDemo()
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