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

export const demoCategories: DemoCategory[] = [
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
export const allDemos: DemoInfo[] = demoCategories.flatMap(category => category.demos)

export function getDemoById(id: string): DemoInfo | undefined {
  return allDemos.find(demo => demo.id === id)
}

export function getDefaultDemo(): DemoInfo {
  return allDemos[0]
}