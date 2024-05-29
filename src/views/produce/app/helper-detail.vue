<template>
  <div>
    <h2>{{ helpDetail.title }}</h2>
    <p>{{ helpDetail.content }}</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

const helpItems = [
  { id: 1, title: '如何安装软件？', content: '这是关于如何安装软件的详细说明。' },
  { id: 2, title: '如何使用软件？', content: '这是关于如何使用软件的详细说明。' },
  // 更多项目...
];

export default defineComponent({
  setup() {
    const route = useRoute();
    const id = parseInt(route.params.id, 10);
    console.log(id);
    console.log(helpItems);
    console.log(helpItems.find(item => item.id === id));
    const helpDetail = helpItems.find(item => item.id === id);
    if (!helpDetail) {
      return { helpDetail: { title: '未找到', content: '该帮助项未找到。' } };
    }

    return {
      helpDetail,
    };
  },
});
</script>
