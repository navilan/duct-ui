import { DuctGlobal } from "./types/duct"

export type { DuctGlobal }
export function initializeDuct() {
  const existing = window.Duct || undefined

  window.Duct = {
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
      window.Duct!.state.bound.set(el, logic)
    },
    saveProps(id, props) {
      window.Duct!.state.props.set(id, props)
    },
    getLogic(el) {
      return window.Duct!.state.bound.get(el)
    },
    getProps(id) {
      return window.Duct!.state.props.get(id)
    },
    clearProps(id) {
      window.Duct!.state.props.delete(id)
    }
  }
}

initializeDuct()

export function getDuct(): DuctGlobal {
  if (!window.Duct) throw new Error("Duct runtime not initialized")
  return window.Duct
}