<!--------------------------------
 - @Author: Kieslect Fashion
 - @LastEditor: Kieslect Fashion
 - @LastEditTime: 2023/12/04 22:51:42
 - @Email: Kieslect Fashion@gmail.com
 - Copyright © 2024 专一 | https://www.kieslect.com
 --------------------------------->

<template>
<!--  <AppCard v-if="$slots.default" bordered bg="#fafafc dark:black" class="mb-30 min-h-60 rounded-4">-->
  <AppCard v-if="$slots.default"  bg=" dark:black" class="min-h-60 rounded-4">
    <form class="flex justify-between p-16" @submit.prevent="handleSearch()">
      <n-space wrap :size="[32, 16]">
        <slot />
      </n-space>
      <div class="flex-shrink-0">
        <!-- 可配置的按钮 -->
        <n-button v-if="isCustomButtonVisible" :type="buttonType" class="ml-20" @click="handleButtonClick" :loading="isButtonLoading">
          {{ buttonText }}
        </n-button>
        <!-- 结束可配置的按钮 -->
        <n-button ghost type="primary" class="ml-20" @click="handleReset">
          <i class="i-fe:rotate-ccw mr-4" />
          重置
        </n-button>
        <n-button attr-type="submit" class="ml-20" type="primary">
          <i class="i-fe:search mr-4" />
          搜索
        </n-button>
      </div>
    </form>
  </AppCard>

  <n-data-table
    :remote="remote"
    :loading="loading"
    :scroll-x="scrollX"
    :columns="columns"
    :data="tableData"
    :single-line="false"
    :row-key="(row) => row[rowKey]"
    :pagination="isPagination ? pagination : false"
    @update:checked-row-keys="onChecked"
    @update:page="onPageChange"
  />
</template>

<script setup>
import { NButton, NDataTable } from 'naive-ui'
import { utils, writeFile } from 'xlsx'
import { message } from 'ant-design-vue'
import { request } from '@/utils'
const isButtonLoading = ref(false);

const props = defineProps({
  /**
   * @remote true: 后端分页  false： 前端分页
   */
  remote: {
    type: Boolean,
    default: true,
  },
  /**
   * @remote 是否分页
   */
  isPagination: {
    type: Boolean,
    default: true,
  },
  scrollX: {
    type: Number,
    default: 1200,
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  columns: {
    type: Array,
    required: true,
  },
  /** queryBar中的参数 */
  queryItems: {
    type: Object,
    default() {
      return {}
    },
  },
  /**
   * ! 约定接口入参出参
   * * 分页模式需约定分页接口入参
   *    @pageSize 分页参数：一页展示多少条，默认10
   *    @pageNo   分页参数：页码，默认1
   * * 需约定接口出参
   *    @pageData 分页模式必须,非分页模式如果没有pageData则取上一层data
   *    @total    分页模式必须，非分页模式如果没有total则取上一层data.length
   */
  getData: {
    type: Function,
    required: true,
  },


  // 按钮文本
  buttonText: {
    type: String,
    default: 'Copy Json', // 默认按钮文本
  },
  // 按钮类型
  buttonType: {
    type: String,
    default: 'primary', // 默认按钮类型
  },
  // 点击按钮执行的函数
  handleButtonClick: {
    type: Function,
    required: true,
  },
  // 控制按钮显示与隐藏的 prop，默认为 false，即默认隐藏
  showCustomButton: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:queryItems', 'onChecked', 'onDataChange'])
const loading = ref(false)
const initQuery = { ...props.queryItems }
const tableData = ref([])
const pagination = reactive({ page: 1, pageSize: 10 })
// 是否显示自定义按钮
const isCustomButtonVisible = ref(props.showCustomButton);

async function handleQuery() {
  try {
    loading.value = true
    let paginationParams = {}
    // 如果非分页模式或者使用前端分页,则无需传分页参数
    if (props.isPagination && props.remote) {
      paginationParams = { pageNo: pagination.page, pageSize: pagination.pageSize }
    }
    const { data } = await props.getData({
      ...props.queryItems,
      ...paginationParams,
    })
    tableData.value = data?.pageData || data
    pagination.itemCount = data.total ?? data.length
  } catch (error) {
    tableData.value = []
    pagination.itemCount = 0
  } finally {
    emit('onDataChange', tableData.value)
    loading.value = false
  }
}
function handleSearch() {
  pagination.page = 1
  handleQuery()
}
async function handleReset() {
  const queryItems = { ...props.queryItems }
  for (const key in queryItems) {
    queryItems[key] = null
  }
  emit('update:queryItems', { ...queryItems, ...initQuery })
  await nextTick()
  pagination.page = 1
  handleQuery()
}
function onPageChange(currentPage) {
  pagination.page = currentPage
  if (props.remote) {
    handleQuery()
  }
}
function onChecked(rowKeys) {
  if (props.columns.some((item) => item.type === 'selection')) {
    emit('onChecked', rowKeys)
  }
}
function handleExport(columns = props.columns, data = tableData.value) {
  if (!data?.length) return $message.warning('没有数据')
  const columnsData = columns.filter((item) => !!item.title && !item.hideInExcel)
  const thKeys = columnsData.map((item) => item.key)
  const thData = columnsData.map((item) => item.title)
  const trData = data.map((item) => thKeys.map((key) => item[key]))
  const sheet = utils.aoa_to_sheet([thData, ...trData])
  const workBook = utils.book_new()
  utils.book_append_sheet(workBook, sheet, '数据报表')
  writeFile(workBook, '数据报表.xlsx')
}

async function handleButtonClick(){
  console.log('自定义按钮被点击了');
  try {
    isButtonLoading.value = true;
    let result = await  request.get('https://app.kieslect.top/kieslect-device/device/getList')
    if (result) {
      const jsonData = JSON.stringify(result, null, 2);
      console.log(jsonData)

      // navigator clipboard 需要https等安全上下文
      if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard 向剪贴板写文本
        navigator.clipboard.writeText(jsonData)
          .then(() => {
            message.success('JSON 数据已成功复制到剪贴板');
          })
          .catch((error) => {
            console.error('复制 JSON 数据失败:', error);
            message.error('复制 JSON 数据失败，请手动复制');
          });
      } else {
        // 创建text area
        let textArea = document.createElement("textarea");
        textArea.value = jsonData;
        // 使text area不在viewport，同时设置不可见
        textArea.style.position = "absolute";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
          // 执行复制命令并移除文本框
          message.success('JSON 数据已成功复制到剪贴板');
          document.execCommand('copy') ? res() : rej();
          textArea.remove();
        });

      }
    }



    console.log('结束')
  } catch (error) {
    console.error('获取数据失败:', error);
    message.error('获取数据失败，请稍后重试');
  }finally {
    isButtonLoading.value = false; // 不管请求成功与否，都要将按钮加载状态设置为false，隐藏加载中效果
  }
}


defineExpose({
  handleSearch,
  handleReset,
  handleExport,
  isCustomButtonVisible,
})
</script>
