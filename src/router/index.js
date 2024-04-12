/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:25:23
 * @Email: zclzone@outlook.com
 * Copyright © 2024 遥遥领先 | https://www.kieslect.com
 **********************************/

import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { setupRouterGuards } from './guards'
import { basicRoutes } from './basic-routes'

export const router = createRouter({
  history:
    import.meta.env.VITE_USE_HASH === 'true'
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH || '/')
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH || '/'),
  routes: basicRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export async function setupRouter(app) {
  app.use(router)
  setupRouterGuards(router)
}
