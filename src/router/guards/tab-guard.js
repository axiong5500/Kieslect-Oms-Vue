/**********************************
 * @Author: Kieslect Fashion
 * @LastEditor: Kieslect Fashion
 * @LastEditTime: 2023/12/05 21:25:17
 * @Email: Kieslect Fashion@gmail.com
 * Copyright © 2024 专一 | https://www.kieslect.com
 **********************************/

import { useTabStore } from '@/store'

export const EXCLUDE_TAB = ['/404', '/403', '/login','/public']

export function createTabGuard(router) {
  router.afterEach((to) => {
    if (EXCLUDE_TAB.includes(to.path)) return
    const tabStore = useTabStore()
    const { name, fullPath: path } = to
    const title = to.meta?.title
    const icon = to.meta?.icon
    const keepAlive = to.meta?.keepAlive
    tabStore.addTab({ name, path, title, icon, keepAlive })
  })
}
