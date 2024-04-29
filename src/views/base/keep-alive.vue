<!--------------------------------
 - @Author: Kieslect Fashion
 - @LastEditor: Kieslect Fashion
 - @LastEditTime: 2023/12/05 21:27:37
 - @Email: Kieslect Fashion@gmail.com
 - Copyright © 2024 专一 | https://www.kieslect.com
 --------------------------------->

<template>
  <CommonPage show-footer>
    <div w-350>
      <n-input v-model:value="inputVal" />
      <n-input-number v-model:value="number" mt-30 />
      <p mt-20 text-center text-14 color-gray>注：右击标签重新加载可重置keep-alive</p>
    </div>
  </CommonPage>
</template>

<script setup>
defineOptions({ name: 'KeepAlive' })

const inputVal = ref('')
const number = ref(0)
</script>
