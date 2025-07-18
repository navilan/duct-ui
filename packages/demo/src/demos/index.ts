import makeButtonDemo from "./ButtonDemo"
import makeIconButtonDemo from "./IconButtonDemo"
import makeEditableInputDemo from "./EditableInputDemo"
import makeMenuDemo from "./MenuDemo"
import makeSelectDemo from "./SelectDemo"
import makeTreeViewDemo from "./TreeViewDemo"
import makeSidebarDemo from "./SidebarDemo"
import makeDrawerDemo from "./DrawerDemo"

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
    id: "menu",
    title: "Menu",
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
    id: "tree",
    title: "Tree",
    demos: [
      {
        id: "tree-view",
        title: "TreeView",
        description: "Collapsible tree view for hierarchical data",
        component: () => {
          const TreeViewDemo = makeTreeViewDemo()
          return TreeViewDemo({})
        }
      }
    ]
  },
  {
    id: "layout",
    title: "Layout",
    demos: [
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