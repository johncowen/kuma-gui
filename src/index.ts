import { Component, createApp } from 'vue'
import { Store, storeKey } from 'vuex'

import type { State } from '@/store/storeConfig'
import type { Router } from 'vue-router'

/**
 * This is a good place to run operations that should ideally be initiated or completed before the Vue application instance exists.
 *
 * @returns a factory creating an initialized Vue application with installed store and router without mounting it.
 */
export function useApp(
  store: Store<State>,
  router: Router,
) {
  return async (App: Component) => {
    const app = createApp(App)
    app.use(store, storeKey)
    app.use(router)
    return app
  }
}

export function useBootstrap(store: Store<State>) {
  return async (isAllowedToMakeApiCalls: boolean = true) => {
    if (isAllowedToMakeApiCalls) {
      await Promise.all([
        // Fetches basic resources before setting up the router and mounting the
        // application. This is mainly needed to properly redirect users to the
        // onboarding flow in the appropriate scenarios.
        store.dispatch('bootstrap'),
        // Loads available policy types in order to populate the necessary
        // information used for and policy lookups in the app.
        store.dispatch('fetchPolicyTypes'),
      ])
    } else {
      store.state.defaultVisibility.appError = false
    }
  }
}
