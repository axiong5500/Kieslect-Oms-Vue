<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/04 22:51:12
 - @Email: zclzone@outlook.com
 - Copyright © 2024 遥遥领先 | https://www.kieslect.com
 --------------------------------->

<template>
  <main class="cus-scroll h-full flex-col flex-1 bg-#f5f6fb dark:bg-#121212">
    <transition name="fade-slide" mode="out-in" appear>
      <main :class="{ 'flex-1': full }" class="m-12"><slot /></main>
    </transition>
    <slot v-if="$slots.footer" name="footer" />
    <TheFooter v-else-if="showFooter" class="mb-12 mt-auto" />
    <n-back-top :bottom="20" />
  </main>
</template>

<script setup>
defineProps({
  full: {
    type: Boolean,
    default: false,
  },
  showFooter: {
    type: Boolean,
    default: false,
  },
})
</script>
