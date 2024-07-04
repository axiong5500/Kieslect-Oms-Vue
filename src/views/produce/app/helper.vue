<template>
  <CommonPage :showHeader=false :back="selectedHelpItem !== null">
    <div :class="{ 'rtl': isRtl }" class="mb-12">
      <n-input type="text" placeholder="Search" v-model:value="searchQuery" class="mb-8" />
      <h4 class="mb-8">{{helpGuideParentTitle}}</h4>
    </div>

    <div v-if="!searchQuery && showDivId === 0">
      <n-grid x-gap="12" :cols="2" :y-gap="8">
        <n-gi v-for="(item, index) in helpGuideItems" :key="index">
          <n-card hoverable @click="selectGuideItem(item)">
            <div style="display: flex; justify-content: center;" class="mb-12">
              <!-- 放置图标并使其居中 -->
              <img :src="item.iconPath" alt="Icon" style="width: 40px; height: 40px;">
            </div>
            <div style="display: flex; justify-content: center;">
              <h5 style="min-height: 38px;">{{ item.guideTitle }}</h5>
            </div>
          </n-card>
        </n-gi>

      </n-grid>
    </div>

    <div v-else-if="showDivId === 1">
      <n-collapse arrowPlacement="right">
        <n-collapse-item
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
      <h3>{{ selectedHelpItem.title }}</h3>
      <n-divider />
      <p class="content" v-html="selectedHelpItem.content.replace(/\n/g, '<br><br>')"></p>
    </div>

  </CommonPage>
</template>

<script>
import api from './api'
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { NCollapse, NCollapseItem } from 'naive-ui'
import { CommonPage } from '@/components/index.js'

export default defineComponent({
  components: {
    CommonPage,
    NCollapse,
    NCollapseItem
  },
  setup() {
    const userLanguage = navigator.language || navigator.userLanguage;
    // const userLanguage = 'ar';
    const isRtl = computed(() => ['ar', 'fa'].includes(userLanguage.split('-')[0]))
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

    /**
     * 搜索命中title后的问题
     * @type {ComputedRef<[UnwrapRefSimple<{guideId: number, title: string, content: string}>, UnwrapRefSimple<{guideId: number, title: string, content: string}>, UnwrapRefSimple<{guideId: number, title: string, content: string}>, UnwrapRefSimple<{guideId: number, title: string, content: string}>, UnwrapRefSimple<{guideId: number, title: string, content: string}>, null, null, null]|*>}
     */
    const filteredHelpItems = computed(() => {
      if (!searchQuery.value) {
        return helpItems.value.filter(item => item.guideId === selectedGuideId.value);
      }
      const lowerCaseQuery = searchQuery.value.toLowerCase()
      return helpItems.value.filter((item) => item.title.toLowerCase().includes(lowerCaseQuery))
    })


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

    onMounted(() => {
      window.addEventListener('popstate', handlePopState)
    })

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

/* RTL Styles */
.rtl {
  direction: rtl;
  text-align: right;
}
</style>
