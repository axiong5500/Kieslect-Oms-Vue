<!--------------------------------
 - @Author: Kieslect Fashion
 - @LastEditor: Kieslect Fashion
 - @LastEditTime: 2023/12/05 21:29:56
 - @Email: Kieslect Fashion@gmail.com
 - Copyright © 2024 专一 | https://www.kieslect.com
 --------------------------------->

<template>
  <div class="containerv2" v-html="privacyPolicy">
  </div>
</template>



<script setup>

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const privacyPolicy = ref('');
import api from './api'
// 解析URL参数，获取语言字段标识
const route = useRoute();

const language = [
  { label: 'zh', value: 0 },
  { label: 'en', value: 1 },
]
const getFormatLanguageTypeValue = (label,type) =>{
  const foundType = type.find(item => item.label === label);
  return foundType ? foundType.value : 1;
}

onMounted(async () => {
  try {
    // 获取语言字段标识
    console.log(route.params.articleId);
    const articleId = route.params.articleId || '0';
    const languageType = route.params.languageType || 'en';
    console.log(route.params.languageType)
    const languageValue = getFormatLanguageTypeValue(languageType,language);
    const response = await api.getPrivacyPolicy(articleId,languageValue);
    console.log(response)
    privacyPolicy.value = response.data?.content;
    console.log(privacyPolicy.value);
  } catch (error) {
    console.error('Failed to fetch privacy policy:', error);
  }
});




</script>
<style>
.containerv2 {
  max-height: 100vh; /* 设置容器的最大高度 */
  overflow-y: auto; /* 添加垂直滚动条 */
  padding-right: 20px; /* 右边距用于留出滚动条的空间 */
}
</style>