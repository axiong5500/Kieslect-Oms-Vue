<template >
  <CommonPage :showHeader=false :back="selectedHelpItem !== null" :class="{ 'rtl': isRtl }">
    <div  class="mb-12">
      <n-input type="text" placeholder="Search" v-model:value="searchQuery" class="mb-8" />
      <h4 class="mb-8" :class="{ 'rtl': isRtl }">{{helpGuideParentTitle}}</h4>
    </div>

    <div v-if="!searchQuery && showDivId === 0">
      <n-grid x-gap="12" :cols="2" :y-gap="8">
        <n-gi v-for="(item, index) in helpGuideItems" :key="index">
          <n-card hoverable @click="selectGuideItem(item)">
            <div style="display: flex; justify-content: center;"  >
              <!-- 放置图标并使其居中 -->
              <img :src="getIconPath(item.iconPath)" alt="Icon" style="width: 40px; height: 40px;">
            </div>

            <div class="title-container" >
              <h5  class="guide-title" >{{ item.guideTitle }}</h5>
            </div>
          </n-card>
        </n-gi>

      </n-grid>
    </div>

    <div v-else-if="showDivId === 1">
      <n-collapse class="no-arrow" >
        <n-collapse-item
          :class="{ 'rtl': isRtl }"
          v-for="(item, index) in filteredHelpItems"
          :key="index"
          @click="selectHelpItem(item)"
        >
          <template #header>
            <span v-html="highlightText(item.title)"></span>
          </template>
        </n-collapse-item>
      </n-collapse>
    </div>

    <div v-else-if="showDivId === 2">
      <h3 :class="{ 'rtl': isRtl }">{{ selectedHelpItem.title }}</h3>
      <n-divider />
      <p class="content" :class="{ 'rtl': isRtl }" v-html="selectedHelpItem.content.replace(/\n/g, '<br><br>')"></p>
    </div>

  </CommonPage>
</template>

<script>
import api from './api'
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { NCollapse, NCollapseItem } from 'naive-ui'
import { CommonPage } from '@/components/index.js'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    CommonPage,
    NCollapse,
    NCollapseItem
  },
  setup() {
    const languageArray = ref([
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
    ]);
    const route = useRoute()
    // 获取路由参数,找不到默认为英文
    const routerLanguageId = route.params.langId || 2;
    const userLanguage = languageArray.value.find(item => item.value === Number(routerLanguageId))?.label;

    const isRtl = computed(() => ['ar', 'fa','he'].includes(userLanguage.split('-')[0]))
    console.log('isRtl:', isRtl.value);
    const helpItems = ref([])// 存储帮助条目
    const helpGuideParentTitle = ref(null)
    const helpGuideItems = ref([])// 存储帮助指南条目

    const showDivId = ref(0)
    const selectedHelpItem = ref(null)
    const searchQuery = ref('')
    const selectedGuideId = ref(null);

    Promise.all([
      // 获取帮助条目
      api.getAllHelperData().then(({ data = [] }) => {
        if (Array.isArray(data)) {

          // 首先过滤出符合用户语言的条目
          let filteredItems = data.filter(item => item.language === userLanguage);

          // 如果没有符合用户语言的条目，则使用英语 'en'
          if (filteredItems.length === 0) {
            filteredItems = data.filter(item => item.language === 'en');
          }

          // 映射符合条件的条目
          helpItems.value = filteredItems.map(item => ({
            guideId: Number(item.helpTypeId),
            title: `${item.helpTitle}`,
            content: `${item.helpDetail}`,
          }));

        } else {
          helpItems.value = [];
        }

      }),
      api.getAllHelperGuideData().then(({ data = [] }) => {
        // 获取帮助指南条目
        if (Array.isArray(data)) {
          // 首先过滤出符合用户语言的条目
          let filteredGuideItems = data.filter(item => item.language === userLanguage);

          // 如果没有符合用户语言的条目，则使用英语 'en'
          if (filteredGuideItems.length === 0) {
            filteredGuideItems = data.filter(item => item.language === 'en');
          }

          // 获取guideTitle,guideId为0的条目
          const parentGuideItem = filteredGuideItems.find(item => item.guideId === 0);

          helpGuideParentTitle.value = parentGuideItem ? parentGuideItem.guideTitle : null;

          console.log('helpGuideParentTitle',helpGuideParentTitle.value)

          //二次过滤，过滤掉guideId为0的条目
          filteredGuideItems = filteredGuideItems.filter(item => item.guideId !== 0);

          // 映射符合条件的条目
          helpGuideItems.value = filteredGuideItems.map(item => ({
            id: Number(item.guideId),
            guideTitle: `${item.guideTitle}`,
            iconPath: `${item.iconPath}`,
          }));

        } else {
          helpGuideItems.value = [];
        }

      }),
    ]).then(() => {
      console.log(11,helpItems.value);
      console.log(22,helpGuideItems.value);
    });

    const iconPaths = {
      '@/assets/images/helper/lanya.png': new URL('@/assets/images/helper/lanya.png', import.meta.url).href,
      '@/assets/images/helper/shandian.png': new URL('@/assets/images/helper/shandian.png', import.meta.url).href,
      '@/assets/images/helper/app.png': new URL('@/assets/images/helper/app.png', import.meta.url).href,
      '@/assets/images/helper/y.png': new URL('@/assets/images/helper/y.png', import.meta.url).href,
      '@/assets/images/helper/tongji.png': new URL('@/assets/images/helper/tongji.png', import.meta.url).href,
      '@/assets/images/helper/shizhong.png': new URL('@/assets/images/helper/shizhong.png', import.meta.url).href,
      '@/assets/images/helper/liaotian.png': new URL('@/assets/images/helper/liaotian.png', import.meta.url).href,
      '@/assets/images/helper/xuanhuan.png': new URL('@/assets/images/helper/xuanhuan.png', import.meta.url).href
    };

    const getIconPath = (path) => iconPaths[path] || '';

    /**
     * 搜索命中高亮字
     * @param title
     * @returns {*}
     */
    function highlightText(title) {
      if (!searchQuery.value) return title
      return title.replace(
        new RegExp(searchQuery.value, 'gi'),
        match => `<span class="text-red">${match}</span>`
      );
    }

    // 搜索命中title结果
    const filteredHelpItems = computed(() => {
      if (!searchQuery.value) {
        return helpItems.value.filter(item => item.guideId === selectedGuideId.value);
      }
      const lowerCaseQuery = searchQuery.value.toLowerCase()
      return helpItems.value.filter((item) => item.title.toLowerCase().includes(lowerCaseQuery))
    })


    // 监听搜索框输入变化
    watch(searchQuery, () => {
      console.log(showDivId.value, selectedGuideId.value)
      if (!searchQuery.value) {
        showDivId.value = 0; // Show help items of the selected guide
      } else {
        showDivId.value = 1;
      }
    });

    function selectGuideItem(item) {
      selectedGuideId.value = item.id;
      showDivId.value = 1;
      history.pushState({ divId: 1, id: item.id }, null, '');
    }

    function selectHelpItem(item) {
      selectedHelpItem.value = item;
      showDivId.value = 2;
      history.pushState({ divId: 2, id: item.guideId }, null, '');
    }

    // 监听浏览器前进后退事件
    function handlePopState(event) {
      const state = event.state || {};
      if (state && state.id) {
        if (state.divId === 1) {
          selectedGuideId.value = state.id;
          showDivId.value = state.divId;
        } else if (state.divId === 2) {
          const helpItem = helpItems.value.find(helpItem => helpItem.guideId === state.id);
          selectedHelpItem.value = helpItem;
          showDivId.value = state.divId;
        }
      } else {
        selectedHelpItem.value = null;
        showDivId.value = 0;
      }
      searchQuery.value = ''; // 回退时清除输入框的值
    }

    // 在组件挂载时监听浏览器前进后退事件
    onMounted(() => {
      window.addEventListener('popstate', handlePopState)
    })

    // 在组件卸载时移除监听
    onBeforeUnmount(() => {
      window.removeEventListener('popstate', handlePopState)
    })


    return {
      helpItems,
      selectedHelpItem,
      selectGuideItem,
      selectHelpItem,
      helpGuideItems,
      helpGuideParentTitle,
      getIconPath,
      showDivId,
      searchQuery,
      filteredHelpItems,
      highlightText,
      isRtl
    }
  }
})
</script>

<style>
/* 隐藏箭头 */
.no-arrow .n-collapse-item-arrow .n-base-icon{
  display: none;
}

button {
  margin-top: 20px;
}

// 使用说明的右操作图标靠右
.n-collapse .n-collapse-item.n-collapse-item--right-arrow-placement .n-collapse-item__header .n-collapse-item-arrow {
  margin-left: auto;
}

.content {
  white-space: pre-wrap;
}

.title-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 100%; /* 确保容器宽度填满卡片 */
  min-height: 55.78px;
  line-height: 1.3;
}

.guide-title {
  margin: 0; /* 去掉默认的 margin */
  text-align: center; /* 确保文本居中对齐 */
  display: inline-block; /* 使文本可水平居中 */
}

/* RTL Styles */
.rtl {
  direction: rtl;
  text-align: right;
}
.rtl .title-container {
  justify-content: flex-end; /* 在 RTL 时右对齐 */
}

.rtl .guide-title {
  text-align: right; /* 在 RTL 时文本右对齐 */
}
</style>
