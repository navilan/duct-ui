export type LifecycleCallbacks = {
  onInsert?: (el: Element) => void | Promise<void>
  onRemove?: (el: Element) => void
}

const handlers = new Map<string, LifecycleCallbacks>()

const observer = new MutationObserver(async (mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (!(node instanceof Element)) continue

      const id = node.getAttribute("data-duct-id")
      const cb = id ? handlers.get(id) : undefined
      if (id && cb?.onInsert) await cb.onInsert(node)

      // check descendants
      const descendants = node.querySelectorAll("[data-duct-id]")
      for (const el of descendants) {
        const innerId = el.getAttribute("data-duct-id")
        const innerCb = innerId ? handlers.get(innerId) : undefined
        if (innerId && innerCb?.onInsert) await innerCb.onInsert(el)
      }
    }

    for (const node of mutation.removedNodes) {
      if (!(node instanceof Element)) continue

      const id = node.getAttribute("data-duct-id")
      const cb = id ? handlers.get(id) : undefined
      if (id && cb?.onRemove) cb.onRemove(node)

      // check descendants
      const descendants = node.querySelectorAll("[data-duct-id]")
      for (const el of descendants) {
        const innerId = el.getAttribute("data-duct-id")
        const innerCb = innerId ? handlers.get(innerId) : undefined
        if (innerId && innerCb?.onRemove) innerCb.onRemove(el)
      }
    }
  }
})

if (typeof document !== "undefined") {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

export function observeLifecycle(id: string, callbacks: LifecycleCallbacks) {
  handlers.set(id, callbacks)
}

export function cleanupLifecycleHandler(id: string) {
  handlers.delete(id)
}