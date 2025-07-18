import { createBlueprint, EventEmitter, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { getDuct } from "@duct-ui/core/runtime"

export interface ListEvents extends BaseComponentEvents {
  // No specific events for List component
}

export interface ListLogic<Items extends Record<string, any>, ItemLogic> {
  getItemComponents: () => { [K in keyof Items]: ItemLogic }
  refresh: (page?: number) => void
  getCurrentPage: () => number
  getItems: () => Items
}

export interface ListProps<Items extends Record<string, any>, ItemProps> {
  getItems: (page: number) => Items
  makeItem: () => ((props: ItemProps) => JSX.Element) & { getLogic: () => Promise<any> }
  itemProps?: Partial<ItemProps>
  containerClass?: string
  initialPage?: number
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}


function render<Items extends Record<string, any>, ItemProps>(props: BaseProps<ListProps<Items, ItemProps>>) {
  const {
    getItems,
    makeItem,
    itemProps = {},
    containerClass = "",
    initialPage = 0,
    ...moreProps
  } = props

  // Get items for the initial page
  const items = getItems(initialPage)

  // Create component instances for each item
  const itemComponents: Array<{ key: string, component: any }> = []

  Object.keys(items).forEach((key) => {
    const ItemComponent = makeItem()
    itemComponents.push({ key, component: ItemComponent })
  })

  return (
    <div class={containerClass} {...moreProps}>
      {itemComponents.map(({ key, component: ItemComponent }) => {
        const item = items[key]

        return (
          <ItemComponent
            key={key}
            item={item}
            itemKey={key}
            {...itemProps}
          />
        )
      })}
    </div>
  )
}

function bind<Items extends Record<string, any>, ItemProps>(
  el: HTMLElement,
  _eventEmitter: EventEmitter<ListEvents>,
  props: any
): BindReturn<ListLogic<Items, any>> {
  // Store component logic references
  const itemLogicMap: Map<string, any> = new Map()
  let currentPage = 0
  let currentItems: Items = {} as Items

  // Find all item components in the DOM and get their logic
  const itemElements = el.querySelectorAll('[data-duct-id]')
  itemElements.forEach((itemEl) => {
    const itemKey = itemEl.getAttribute('key')
    if (itemKey) {
      // Get the component's logic through the Duct runtime
      const ductRuntime = getDuct()
      if (ductRuntime) {
        const logic = ductRuntime.getLogic(itemEl)
        if (logic) {
          itemLogicMap.set(itemKey, logic)
        }
      }
    }
  })

  function getItemComponents() {
    const result: Record<string, any> = {}
    itemLogicMap.forEach((logic, key) => {
      result[key] = logic
    })
    return result as { [K in keyof Items]: any }
  }

  function refresh(page?: number) {
    currentPage = page ?? 0
    props.initialPage = page
    const newEl = render(props)
    const temp = document.createElement('div')
    temp.innerHTML = newEl.toString()
    const newDomEl = temp.childNodes[0] as HTMLElement
    el.innerHTML = newDomEl.innerHTML
  }

  function getCurrentPage() {
    return currentPage
  }

  function getItems() {
    return currentItems
  }

  function release() {
    itemLogicMap.clear()
  }

  return {
    getItemComponents,
    refresh,
    getCurrentPage,
    getItems,
    release
  }
}

const id = { id: "duct/list" }

export default function makeList<Items extends Record<string, any> = Record<string, any>, ItemProps = any>() {
  return createBlueprint<ListProps<Items, ItemProps>, ListEvents, ListLogic<Items, any>>(
    id,
    render,
    {
      bind
    }
  )
}