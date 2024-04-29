/**********************************
 * @Author: Kieslect Fashion
 * @LastEditor: Kieslect Fashion
 * @LastEditTime: 2024/01/06 17:18:40
 * @Email: Kieslect Fashion@gmail.com
 * Copyright © 2024 专一 | https://www.kieslect.com
 **********************************/

import { defineStore } from 'pinia'

export const useRouterStore = defineStore('router', () => {
  const router = useRouter()
  const route = useRoute()

  function resetRouter(accessRoutes) {
    accessRoutes.forEach((item) => {
      router.hasRoute(item.name) && router.removeRoute(item.name)
    })
  }

  return {
    router,
    route,
    resetRouter,
  }
})
