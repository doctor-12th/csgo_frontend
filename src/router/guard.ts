import type { Router } from "vue-router"
import { setRouteChange } from "@/common/composables/useRouteListener"
import { useTitle } from "@/common/composables/useTitle"
import NProgress from "nprogress"
import { usePermissionStore } from "@/pinia/stores/permission"
// import { useUserStore } from "@/pinia/stores/user"
import { routerConfig } from "@/router/config"
// import { isWhiteList } from "@/router/whitelist"

NProgress.configure({ showSpinner: false })

const { setTitle } = useTitle()

const LOGIN_PATH = "/login"

let isDynamicRoutesAdded = false

export function registerNavigationGuard(router: Router) {
  router.beforeEach(async (to, _from) => {
    NProgress.start()

    const permissionStore = usePermissionStore()

    try {
      // 动态路由只添加一次
      permissionStore.setAllRoutes()

        // 如果当前路由是动态添加的，需要 replace 跳转一次
        if (to.name === undefined) {
          return { ...to, replace: true }
        }
      

      return true
    } catch (error) {
      ElMessage.error((error as Error).message || "路由守卫发生错误")
      return LOGIN_PATH
    }
  })

  router.afterEach((to) => {
    setRouteChange(to)
    setTitle(to.meta.title)
    NProgress.done()
  })
}
