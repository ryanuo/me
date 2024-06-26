import FloatingVue from 'floating-vue'
import NProgress from 'nprogress'
import { routes } from 'vue-router/auto-routes'
import type { ViteSSGContext } from 'vite-ssg'
import { ViteSSG } from 'vite-ssg'
import { setupRouterScroller } from 'vue-router-better-scroller'

import '@shikijs/twoslash/style-rich.css'
import '@unocss/reset/tailwind.css'
import 'floating-vue/dist/style.css'
import 'vue-final-modal/style.css'
import './styles/markdown.css'
import './styles/prose.css'
import './styles/style.css'

import 'uno.css'

import App from './App.vue'
import i18n, { handleLanguageSwitch } from './i18n'

NProgress.configure({ showSpinner: false })

export const createApp = ViteSSG(
  App,
  {
    routes,
  },
  ({ router, isClient, app }: ViteSSGContext) => {
    app.use(i18n)
    app.use(FloatingVue)

    if (isClient) {
      const html = document.querySelector('html')!
      setupRouterScroller(router, {
        selectors: {
          html(ctx: any) {
            // only do the sliding transition when the scroll position is not 0
            if (ctx.savedPosition?.top)
              html.classList.add('no-sliding')
            else html.classList.remove('no-sliding')
            return true
          },
        },
        behavior: 'auto',
      })
      router.beforeEach((to: any, from: any, next: any) => {
        handleLanguageSwitch(to, next)
        NProgress.start()
      })
      router.afterEach(() => {
        NProgress.done()
      })
    }
  },
)
