import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { staticRoutes } from './constantRoutes'
import * as NProgress from 'nprogress'
import { useUserStore } from '@/store/modules/user'
import { LOGIN_URL, ROUTER_WHITE_LIST } from '@/config/config'

const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRoutes as RouteRecordRaw[],
  // Restore scroll position on refresh
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

router.beforeEach(async (to, from, next) => {
  NProgress.start()

   const userStore = useUserStore()
  // 1. If visiting login page, stay if token exists, otherwise reset route and go to login
  if (to.path === LOGIN_URL) {
    if (userStore.token) return next(from.fullPath)
    return next()
  }

  // 2. If the page is in the router whitelist (no login required), allow directly
  if (ROUTER_WHITE_LIST.includes(to.path)) return next()

  // 3. If no token, redirect to login page with original target path
  if (!userStore.token) {
    return next({ path: LOGIN_URL, query: { redirect: to.fullPath } })
  } 

  // 4. If none of the above, allow directly
  return next()
})

/**
 * @description After route change
 * */
router.afterEach(() => {
  NProgress.done()
})

/**
 * @description Route error
 * */
router.onError((error) => {
  NProgress.done()
  console.warn('Router error', error.message)
})

export default router
