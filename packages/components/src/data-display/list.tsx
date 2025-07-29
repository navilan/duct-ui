import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { getDuct } from "@duct-ui/core/runtime"
import { EventEmitter } from "@duct-ui/core/shared"

export interface ListEvents extends BaseComponentEvents {
  // No specific events for List component
}

export interface ListLogic<Items extends Record<string, any>, ItemLogic> {
  refresh: (page?: number) => Promise<void>
  getCurrentPage: () => number
  getItems: () => Items
}

export interface ListProps<Items extends Record<string, any>, ItemProps> {
  getItems: (page: number) => Items | Promise<Items>
  ItemComponent: (props: ItemProps) => JSX.Element
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
    ItemComponent,
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

  // Hide loading indicator and render items
  if (loadData) {
    const loadingEl = el.querySelector('[data-list-loading]')
    if (loadingEl) {
      loadingEl.remove()
    }

    // Render the actual items and collect their logic
    renderItemsInContainer(el, loadData.items, props)
  }

  function renderItemsInContainer(container: HTMLElement, items: Items, renderProps: any) {
    const { ItemComponent, itemProps = {} } = renderProps

    const itemsHTML = Object.keys(items).map(key => {
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
  }

  function getCurrentPage() {
    return currentPage
  }

  function getItems() {
    return currentItems
  }

  function release() {
  }

  return {
    refresh,
    getCurrentPage,
    getItems,
    release
  }
}

const id = { id: "duct/list" }

const List = createBlueprint(
  id,
  render,
  {
    load,
    bind
  }
)

export default List