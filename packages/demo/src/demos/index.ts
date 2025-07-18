import { ButtonDemo } from "./ButtonDemo"
import { IconButtonDemo } from "./IconButtonDemo"
import { EditableInputDemo } from "./EditableInputDemo"
import { MenuDemo } from "./MenuDemo"
import { SelectDemo } from "./SelectDemo"
import { TreeViewDemo } from "./TreeViewDemo"
import { SidebarDemo } from "./SidebarDemo"
import { DrawerDemo } from "./DrawerDemo"

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
        component: ButtonDemo
      },
      {
        id: "icon-button", 
        title: "Icon Button",
        description: "Button component with icon support",
        component: IconButtonDemo
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
        component: EditableInputDemo
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
        component: MenuDemo
      },
      {
        id: "select",
        title: "Select",
        description: "Dropdown select component with selection markers",
        component: SelectDemo
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
        component: TreeViewDemo
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
        component: SidebarDemo
      },
      {
        id: "drawer",
        title: "Drawer",
        description: "Responsive drawer component for mobile and desktop layouts",
        component: DrawerDemo
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