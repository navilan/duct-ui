import { ObservableV2 as Observable } from "lib0/observable"

export interface RefEvents<T> extends Record<string, any> {
  set: (value: T | null) => void
}

export class MutableRef<T = any> {
  private _current: T | null = null

  private observable = new Observable<RefEvents<T>>()

  private emit = (e: string, ...args: any[]) => {
    this.observable.emit(e, args)
  }

  get current(): T | null {
    return this._current
  }

  set current(value: T | null) {
    const oldValue = this._current
    this._current = value

    // Only emit if value actually changed
    if (oldValue !== value) {
      this.emit('set', value)
    }
  }

  public on = <K extends keyof RefEvents<T>>(event: K, callback: RefEvents<T>[K]) => {
    this.observable.on(event as string, callback)
  }

  public off = <K extends keyof RefEvents<T>>(event: K, callback: RefEvents<T>[K]) => {
    this.observable.off(event as string, callback)
  }

  public destroy = () => {
    this.observable.destroy()
  }
}

/**
 * Create a ref that can hold a reference to component logic
 */
export function createRef<T = any>(): MutableRef<T> {
  return new MutableRef<T>()
}