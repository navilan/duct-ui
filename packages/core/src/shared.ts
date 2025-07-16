export type LogicFactory<L extends Record<string, any>> = (el: HTMLElement) => L

export interface DuctComponentId {
  readonly id: string
}


export type Component<
  Props extends Record<string, any>,
  L extends Record<string, any>
> = ((props: Props) => JSX.Element) & L