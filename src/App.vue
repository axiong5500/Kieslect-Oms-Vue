<!--------------------------------
 - @Author: Kieslect Fashion
 - @LastEditor: Kieslect Fashion
 - @LastEditTime: 2023/12/16 18:49:42
 - @Email: Kieslect Fashion@gmail.com
 - Copyright © 2024 专一 | https://www.kieslect.com
 --------------------------------->

<template>
  <n-config-provider
    class="wh-full"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="appStore.isDark ? darkTheme : undefined"
    :theme-overrides="appStore.naiveThemeOverrides"
  >
    <router-view v-if="Layout" v-slot="{ Component, route: curRoute }">
      <component :is="Layout">
        <KeepAlive :include="keepAliveNames">
          <component :is="Component" v-if="!tabStore.reloading" :key="curRoute.fullPath" />
        </KeepAlive>
      </component>

      <LayoutSetting v-if="shouldShowLayoutSetting" class="fixed right-12 top-1/2 z-999" />
    </router-view>
  </n-config-provider>
</template>

<script setup>
import { zhCN, dateZhCN, darkTheme } from 'naive-ui'
import { LayoutSetting } from '@/components'
import { useCssVar } from '@vueuse/core'
import { kebabCase } from 'lodash-es'
import { useAppStore, useTabStore } from '@/store'

const layouts = new Map()
function getLayout(name) {
  // 利用map将加载过的layout缓存起来，防止重新加载layout导致页面闪烁
  if (layouts.get(name)) return layouts.get(name)
  const layout = markRaw(defineAsyncComponent(() => import(`@/layouts/${name}/index.vue`)))
  layouts.set(name, layout)
  return layout
}

const route = useRoute()
const appStore = useAppStore()
if (appStore.layout === 'default') appStore.setLayout('')
const Layout = computed(() => {
  if (!route.matched?.length) return null
  return getLayout(route.meta?.layout || appStore.layout)
})

function setupCssVar() {
  const common = appStore.naiveThemeOverrides?.common || {}
  for (const key in common) {
    useCssVar(`--${kebabCase(key)}`, document.documentElement).value = common[key] || ''
    if (key === 'primaryColor') window.localStorage.setItem('__THEME_COLOR__', common[key] || '')
  }
}
setupCssVar()

const tabStore = useTabStore()
const keepAliveNames = computed(() => {
  return tabStore.tabs.filter((item) => item.keepAlive).map((item) => item.name)
})

// 定义白名单数组，包含允许显示 LayoutSetting 的路由名称
const whitelist = ['/login', '/404','/privacy']

// 根据白名单判断是否应该显示 LayoutSetting
const shouldShowLayoutSetting = computed(() => {
  // 获取当前路由名称
  const currentRoutePath = route.path

  // 判断当前路由名称是否在白名单中
  return !whitelist.some(path => currentRoutePath.startsWith(path))
})
</script>
