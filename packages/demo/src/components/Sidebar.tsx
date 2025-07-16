import { createBlueprint } from "@duct-ui/core/blueprint"
import ductLogo from "../icons/duct-logo.svg"

export interface SidebarEvents extends Record<string, any> {
  bind: (el: HTMLElement) => void
  navigate: (el: HTMLElement, demoId: string) => void
  release: (el: HTMLElement) => void
}

export interface SidebarProps {
  categories: Array<{
    id: string
    title: string
    demos: Array<{ id: string; title: string; description?: string }>
  }>
  currentDemo: string
  'on:navigate'?: (el: HTMLElement, demoId: string) => void
}

function render(props: SidebarProps & { "data-duct-id": string }) {
  const {
    categories,
    currentDemo,
    'data-duct-id': id,
    ...moreProps
  } = props

  return (
    <div
      data-duct-id={id}
      class="w-64 bg-base-200 h-screen overflow-y-auto border-r border-base-300"
      {...moreProps}
    >
      <div class="p-4 border-b border-base-300">
        <img class="h-24 aspect-square" src={ductLogo} />
        <h1 class="text-xl font-bold text-base-content">Duct UI</h1>
        <p class="text-sm text-base-content/70">Component Demos</p>
      </div>

      <nav class="p-2">
        {categories.map(category => (
          <div data-key={category.id} class="mb-4">
            <div class="px-4 py-2 text-sm font-semibold text-base-content/60 uppercase tracking-wider">
              {category.title}
            </div>
            <ul class="menu menu-sm">
              {category.demos.map(demo => (
                <li data-key={demo.id}>
                  <a
                    href={`#${demo.id}`}
                    class={`block px-4 py-2 rounded-lg hover:bg-base-500 transition-colors ${currentDemo === demo.id ? 'bg-primary text-primary-content' : 'text-base-content'
                      }`}
                    data-demo-id={demo.id}
                  >
                    <div>
                      <div class="font-medium">{demo.title}</div>
                      {demo.description && (
                        <div class="text-xs opacity-70">{demo.description}</div>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}

let clickHandler: any

function bind(el: HTMLElement, eventEmitter: any) {
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const link = target.closest('a[data-demo-id]')
    if (link) {
      e.preventDefault()
      const demoId = link.getAttribute('data-demo-id')
      if (demoId) {
        eventEmitter.emit('navigate', demoId)
      }
    }
  }

  clickHandler = handleClick
  el.addEventListener('click', handleClick)

  return {}
}

function release(el: HTMLElement) {
  el.removeEventListener('click', clickHandler)
}

const id = { id: "duct/sidebar" }

export default () => {
  return createBlueprint<SidebarProps, SidebarEvents>(
    id,
    render,
    {
      customEvents: ['bind', 'navigate', 'release'],
      bind,
      release
    }
  )
}