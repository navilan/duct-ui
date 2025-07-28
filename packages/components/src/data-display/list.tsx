import { createBlueprint, EventEmitter, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { getDuct } from "@duct-ui/core/runtime"

export interface ListEvents extends BaseComponentEvents {
  // No specific events for List component
}

export interface ListLogic<Items extends Record<string, any>, ItemLogic> {
  getItemComponents: () => { [K in keyof Items]: ItemLogic }
  refresh: (page?: number) => Promise<void>
  getCurrentPage: () => number
  getItems: () => Items
}

export interface ListProps<Items extends Record<string, any>, ItemProps> {
  getItems: (page: number) => Items | Promise<Items>
  makeItem: () => ((props: ItemProps) => JSX.Element) & { getLogic: () => Promise<any> }
  itemProps?: Partial<ItemProps>
  containerClass?: string
  initialPage?: number
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}


interface ListLoadData<Items extends Record<string, any>> {
  items: Items
  page: number
}

function render<Items extends Record<string, any>, ItemProps>(props: BaseProps<ListProps<Items, ItemProps>>) {
  const {
    containerClass = "",
    getItems,
    makeItem,
    itemProps,
    initialPage,
    ...moreProps
  } = props

  // Render loading state initially - items will be populated after load
  return (
    <div class={containerClass} {...moreProps}>
      <div class="loading loading-spinner loading-md" data-list-loading></div>
    </div>
  )
}

async function load<Items extends Record<string, any>, ItemProps>(
  el: HTMLElement,
  props: any
): Promise<ListLoadData<Items>> {
  const { getItems, initialPage = 0 } = props

  // Load items (handle both sync and async getItems)
  const items = await Promise.resolve(getItems(initialPage))

  return {
    items,
    page: initialPage
  }
}

function bind<Items extends Record<string, any>, ItemProps>(
  el: HTMLElement,
  _eventEmitter: EventEmitter<ListEvents>,
  props: any,
  loadData?: ListLoadData<Items>
): BindReturn<ListLogic<Items, any>> {
  let currentPage = loadData?.page ?? 0
  let currentItems = loadData?.items ?? ({} as Items)
  let itemLogicMap = new Map<string, any>()

  // Hide loading indicator and render items
  if (loadData) {
    const loadingEl = el.querySelector('[data-list-loading]')
    if (loadingEl) {
      loadingEl.remove()
    }

    // Render the actual items and collect their logic
    renderItemsInContainer(el, loadData.items, props)
    collectItemLogic(loadData.items, props)
  }

  async function collectItemLogic(items: Items, renderProps: any) {
    const { makeItem } = renderProps
    itemLogicMap.clear()
    
    for (const key of Object.keys(items)) {
      const ItemComponent = makeItem()
      try {
        const logic = await ItemComponent.getLogic()
        itemLogicMap.set(key, logic)
      } catch (error) {
        console.warn(`Failed to get logic for item ${key}:`, error)
      }
    }
  }

  function renderItemsInContainer(container: HTMLElement, items: Items, renderProps: any) {
    const { makeItem, itemProps = {} } = renderProps

    const itemsHTML = Object.keys(items).map(key => {
      const ItemComponent = makeItem()
      const item = items[key]

      return ItemComponent({
        key,
        item,
        itemKey: key,
        ...itemProps
      }).toString()
    }).join('')

    container.innerHTML = itemsHTML
  }

  function getItemComponents() {
    const result: Record<string, any> = {}
    itemLogicMap.forEach((logic, key) => {
      result[key] = logic
    })
    return result as { [K in keyof Items]: any }
  }

  async function refresh(page?: number) {
    const newPage = page ?? currentPage

    // Show loading
    el.innerHTML = '<div class="loading loading-spinner loading-md"></div>'

    // Load new data using the same load logic
    const newLoadData = await load<Items, ItemProps>(el, { ...props, initialPage: newPage })

    // Update state
    currentPage = newLoadData.page
    currentItems = newLoadData.items

    // Hide loading and render items
    const loadingEl = el.querySelector('.loading')
    if (loadingEl) {
      loadingEl.remove()
    }

    renderItemsInContainer(el, newLoadData.items, props)
    await collectItemLogic(newLoadData.items, props)
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
  return createBlueprint<ListProps<Items, ItemProps>, ListEvents, ListLogic<Items, any>, ListLoadData<Items>>(
    id,
    render,
    {
      load,
      bind
    }
  )
}