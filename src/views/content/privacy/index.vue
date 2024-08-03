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
  { label: 'invalid', value: 0 },
  { label: 'zh', value: 1 },
  { label: 'en', value: 2 },
  { label: 'fr', value: 3 },
  { label: 'de', value: 4 },
  { label: 'it', value: 5 },
  { label: 'es', value: 6 },
  { label: 'ja', value: 7 },
  { label: 'pl', value: 8 },
  { label: 'cs', value: 9 },
  { label: 'ro', value: 10 },
  { label: 'lt', value: 11 },
  { label: 'nl', value: 12 },
  { label: 'sl', value: 13 },
  { label: 'hu', value: 14 },
  { label: 'ru', value: 15 },
  { label: 'uk', value: 16 },
  { label: 'sk', value: 17 },
  { label: 'da', value: 18 },
  { label: 'hr', value: 19 },
  { label: 'id', value: 20 },
  { label: 'ko', value: 21 },
  { label: 'hi', value: 22 },
  { label: 'pt', value: 23 },
  { label: 'tr', value: 24 },
  { label: 'th', value: 25 },
  { label: 'vi', value: 26 },
  { label: 'my', value: 27 },
  { label: 'fil', value: 28 },
  { label: 'zh_Hant', value: 29 },
  { label: 'el', value: 30 },
  { label: 'ar', value: 31 },
  { label: 'sv', value: 32 },
  { label: 'fi', value: 33 },
  { label: 'fa', value: 34 },
  { label: 'nb', value: 35 },
  { label: 'km', value: 36 },
  { label: 'bn', value: 37 },
  { label: 'ms', value: 38 },
  { label: 'he', value: 39 },
];

const fetchPrivacyPolicy = async () => {
  try {
    const articleId = route.params.articleId || '0';
    const languageType = route.params.languageType || '2';
    const response = await api.getPrivacyPolicy(articleId, languageType);
    privacyPolicy.value = response.data?.content;

  } catch (error) {
    console.error('Failed to fetch privacy policy:', error);
  }
};
onMounted(fetchPrivacyPolicy);




</script>
<style>
.containerv2 {
  max-height: 100vh; /* 设置容器的最大高度 */
  overflow-y: auto; /* 添加垂直滚动条 */
  padding:15px;
}
canvas {
  border: 1px solid black;
  width: 100%; /* 使canvas宽度自适应容器 */
}
</style>