import { DuctGlobal } from "./types/duct"

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
    },
    register(el, logic) {
      window.Duct!.state.bound.set(el, logic)
    },
    getLogic(el) {
      return window.Duct!.state.bound.get(el)
    }
  }
}

initializeDuct()

export function getDuct(): DuctGlobal {
  if (!window.Duct) throw new Error("Duct runtime not initialized")
  return window.Duct
}