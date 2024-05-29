<template>
  <CommonPage :showHeader=false :back="selectedHelpItem !== null">
    <div  v-if="showDivId === 1" class="mb-12">
      <n-input type="text" placeholder="Search" class="mb-8" />
      <p class="mb-4">使用指引</p>
      <n-grid x-gap="12" :cols="2" :y-gap="8">
        <n-gi v-for="(item, index) in helpItems" :key="index">
          <n-card hoverable @click="selectHelpItem(item,2)">
            <div style="display: flex; justify-content: center;" class="mb-12">
              <!-- 放置图标并使其居中 -->
              <n-icon size="40" color="#E52424FF">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l6.72-6.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </n-icon>
            </div>
            <div style="display: flex; justify-content: center;" >
              <h5>{{ item.guideTitle }}</h5>
            </div>
          </n-card>
        </n-gi>

      </n-grid>
    </div>
    <div  v-else-if="showDivId === 2">
      <n-collapse arrowPlacement='right'>
        <n-collapse-item
          v-for="(item, index) in helpItems"
          :key="index"
          :title="item.title"
          @click="selectHelpItem(item,3)"
        >
        </n-collapse-item>
      </n-collapse>
    </div>
    <div  v-else-if="showDivId === 3">
      <h3>{{ selectedHelpItem.title }}</h3>
      <n-divider />
      <p class="content" v-html="selectedHelpItem.content.replace(/\n/g, '<br><br>')" ></p>
    </div>

  </CommonPage>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount,watch  } from 'vue'
import { NCollapse, NCollapseItem } from 'naive-ui'
import { CommonPage } from '@/components/index.js'

export default defineComponent({
  components: {
    CommonPage,
    NCollapse,
    NCollapseItem
  },
  setup() {
    const helpItems = ref([
      { id: 1,guideTitle: 'App操作', title: '版本如何更新？', content: '1.App版本更新\n' +
          '有新版本可更新时，打开App时【发现新版本】的弹窗通知，用户可直接进行版本更新升级。\n' +
          '2.手表版本更新\n' +
          'a.打开App进入【设备】页面，找到【系统更新】：若有【NEW】红色字体标注时，表示有新的版本可供更新；\n' +
          'b.设备升级之前，请确保您的设备有至少30%电量。\n' +
          'c.设备升级时间需要3-5分钟，请保证手表、手机电量充足。\n' },
      { id: 2,guideTitle: '运动记录', title: '如何设置常用运动模式？', content: '1、App端：点击【锻炼】页面：\n' +
          'a.选择需要运动方式；\n' +
          'b.运动类型的编辑：点击右上角【+】-【运动类型】-【可选运动】；\n' +
          '2.手表端：按击中间键进入【菜单】-【锻练】-【更多运动】。\n' }
      // 更多项目...
    ])
    const helpGuideItems = ref([
      { id: 1, guideTitle: '蓝牙连接'},
      { id: 2, guideTitle: '功耗问题'},
      { id: 3, guideTitle: 'App操作' },
      { id: 4, guideTitle: '功能使用' },
      { id: 5, guideTitle: '健康数据' },
      { id: 6, guideTitle: '运动记录' },
      { id: 7, guideTitle: '信息与天气' },
      { id: 8, guideTitle: '同步数据' },

    ])

    const showDivId = ref(1)
    const selectedHelpItem = ref(null)

    function selectHelpItem(item,divId) {
      showDivId.value = divId
      selectedHelpItem.value = item
      window.history.pushState({ id: item.id }, '', `#help-detail-${item.id}`)
    }

    function deselectHelpItem() {
      showDivId.value = 1
      selectedHelpItem.value = null
      window.history.pushState({}, '', '#help')
    }

    function handlePopState(event) {
      if (event.state && event.state.id) {
        const item = helpItems.value.find(item => item.id === event.state.id)
        selectedHelpItem.value = item
      } else {
        selectedHelpItem.value = null
        showDivId.value = 1
      }
    }

    onMounted(() => {
      window.addEventListener('popstate', handlePopState)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('popstate', handlePopState)
    })

    watch(selectedHelpItem, (newValue, oldValue) => {
      if (newValue !== null) {
        window.history.replaceState({ id: newValue.id }, '', `#help-detail-${newValue.id}`)
      } else {
        window.history.replaceState({}, '', '#/public/produce/app/helper')
      }
    })

    return {
      helpItems,
      selectedHelpItem,
      selectHelpItem,
      showDivId,
    }
  }
})
</script>

<style>
button {
  margin-top: 20px;
}
.n-collapse .n-collapse-item.n-collapse-item--right-arrow-placement .n-collapse-item__header .n-collapse-item-arrow {
  margin-left: auto;
}
.content {
  white-space: pre-wrap;
}
</style>
