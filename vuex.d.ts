// Type declarations for vuex module to resolve ESM type issues
declare module 'vuex' {
  import type { InjectionKey } from 'vue'
  import type {
    ActionContext,
    ActionTree,
    GetterTree,
    MutationTree,
    Store,
    StoreOptions,
  } from 'vuex/types'

  export function createStore<S>(options: StoreOptions<S>): Store<S>
  export function useStore<S = unknown>(injectKey?: InjectionKey<Store<S>> | string): Store<S>
  export type {
    ActionContext,
    ActionTree,
    GetterTree,
    MutationTree,
    Store,
    StoreOptions,
  }
  export * from 'vuex/types'
}
