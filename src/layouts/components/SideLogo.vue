<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:50:28
 - @Email: zclzone@outlook.com
 - Copyright © 2024 遥遥领先 | https://www.kieslect.com
 --------------------------------->

<template>
  <router-link class="h-60 f-c-c" to="/">
    <!-- <img src="@/assets/images/logo.png" class="h-40" /> -->
<!--    <TheLogo class="rounded-8!" />-->
    <TheLogo/>
<!--    <h2-->
<!--      v-show="!appStore.collapsed"-->
<!--      class="ml-10 max-w-140 flex-shrink-0 text-16 color-primary font-bold"-->
<!--    >-->
<!--      {{ title }}-->
<!--    </h2>-->
    <span
      v-show="!appStore.collapsed"
      style="font-weight: 700;
    font-size: 21px;
    line-height: 1;
    white-space: nowrap;"
    >
      {{ title }}
    </span>
  </router-link>
</template>

<script setup>
import { useAppStore } from '@/store'
const title = import.meta.env.VITE_TITLE

const appStore = useAppStore()
</script>
