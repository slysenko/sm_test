import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import VueVirtualScroller from 'vue-virtual-scroller'

import './style.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')

    return worker.start({
      onUnhandledRequest: 'bypass',
      quiet: false,
    })
  }
}

enableMocking().then(() => {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  app.use(VueVirtualScroller)

  app.mount('#app')
})
