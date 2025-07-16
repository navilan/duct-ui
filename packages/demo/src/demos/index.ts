import { ButtonDemo } from "./ButtonDemo"
import { IconButtonDemo } from "./IconButtonDemo"

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