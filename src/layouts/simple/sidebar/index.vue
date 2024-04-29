<!--------------------------------
 - @Author: Kieslect Fashion
 - @LastEditor: Kieslect Fashion
 - @LastEditTime: 2023/12/05 21:24:09
 - @Email: Kieslect Fashion@gmail.com
 - Copyright © 2024 专一 | https://www.kieslect.com
 --------------------------------->

<template>
  <SideLogo border-b="1px light_border dark:dark_border" />
  <SideMenu class="cus-scroll-y mt-4 h-0 flex-1" />
  <div class="my-12 flex items-center justify-around px-12">
    <UserAvatar v-if="!appStore.collapsed" />
    <MenuCollapse />
  </div>
</template>

<script setup>
import { UserAvatar, MenuCollapse, SideLogo, SideMenu } from '@/layouts/components'
import { useAppStore } from '@/store'

const appStore = useAppStore()
</script>
