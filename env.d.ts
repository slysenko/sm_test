/// <reference types="vite/client" />

declare module 'vue-virtual-scroller' {
  import type { DefineComponent, ComponentPublicInstance } from 'vue'

  interface DynamicScrollerMethods {
    scrollToBottom(): void
    scrollToItem(index: number): void
    scrollToPosition(position: number): void
  }

  export const DynamicScroller: DefineComponent<
    {
      items: unknown[]
      minItemSize: number
      keyField?: string
      listClass?: string
      listTag?: string
    },
    DynamicScrollerMethods
  > & {
    new (): ComponentPublicInstance & DynamicScrollerMethods
  }

  export const DynamicScrollerItem: DefineComponent<{
    item: unknown
    active: boolean
    sizeDependencies?: unknown[]
    dataIndex?: number
  }>

  export const RecycleScroller: DefineComponent

  const plugin: {
    install: (app: import('vue').App) => void
  }
  export default plugin
}
