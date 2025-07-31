import { DuctGlobal } from "./types/duct"
import { isBrowser } from "./env.js"

export type { DuctGlobal }

declare global {
  var Duct: DuctGlobal | undefined
}

export function initializeDuct() {
  const existing = globalThis.Duct || undefined

  globalThis.Duct = {
    runtime: {
      version: "0.1.0",
      config: {
        debug: false,
      }
    },
    state: {
      unbound: existing?.state?.unbound ?? new WeakMap(),
      bound: existing?.state?.bound ?? new WeakMap(),
      props: existing?.state?.props ?? new Map<string, any>()
    },
    register(el, logic) {
      if (isBrowser) {
        globalThis.Duct!.state.bound.set(el, logic)
      }
      // No-op in SSR
    },
    saveProps(id, props) {
      globalThis.Duct!.state.props.set(id, props)
    },
    getLogic(el) {
      return globalThis.Duct!.state.bound.get(el)
    },
    getProps(id) {
      return globalThis.Duct!.state.props.get(id)
    },
    clearProps(id) {
      globalThis.Duct!.state.props.delete(id)
    }
  }
}

initializeDuct()

export function getDuct(): DuctGlobal {
  if (!globalThis.Duct) {
    initializeDuct()
  }
  return globalThis.Duct!
}