<template><!--  <AppCard v-if="$slots.default" bordered bg="#fafafc dark:black" class="mb-30 min-h-60 rounded-4">-->
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
<!--  <n-watermark-->
<!--    content="Kieslect内部系统"-->
<!--    cross-->
<!--    selectable-->
<!--    :font-size="16"-->
<!--    :line-height="16"-->
<!--    :width="192"-->
<!--    :height="128"-->
<!--    :x-offset="12"-->
<!--    :y-offset="28"-->
<!--    :rotate="-15"-->
<!--  >-->
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
    :max-height="tableMaxHeight"
    :virtual-scroll="isVirtualScroll"
    :striped="isStriped"
  />
<!--  </n-watermark>-->
</template>

<script setup>
import { NButton, NDataTable } from 'naive-ui'
import { utils, writeFile } from 'xlsx'
import { message } from 'ant-design-vue'

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
  // 表格最大宽度
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
  // 查询参数
  queryItems: {
    type: Object,
    default() {
      return {}
    },
  },
  // 获取数据
  getData: {
    type: Function,
    required: true,
  },
  // 按钮文本
  buttonText: {
    type: String,
    default: '复制JSON',
  },
  // 按钮类型
  buttonType: {
    type: String,
    default: 'primary', // 默认按钮类型
  },
  // 点击按钮执行的函数
  handleButtonClick: {
    type: Function,
    default: () => {}, // 默认值为空函数
  },
  // 控制按钮显示与隐藏的 prop，默认为 false，即默认隐藏
  showCustomButton: {
    type: Boolean,
    default: false,
  },
  // 表格最大高度
  tableMaxHeight: {
    type: Number,
    default: null,
  },
  // 是否虚拟滚动
  isVirtualScroll: {
    type: Boolean,
    default: false,
  },
  // 是否斑马纹
  isStriped: {
    type: Boolean,
    default: true,
  }
})

const emit = defineEmits(['update:queryItems', 'onChecked', 'onDataChange'])
const loading = ref(false)
const initQuery = { ...props.queryItems }
const tableData = ref([])
const pagination = reactive({ page: 1, pageSize: 1000 })
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
  if (!data?.length) {
    return $message.warning('没有数据');
  }

  // 生成包含序号列的列数据
  const columnsData = [
    ...columns.filter((item) => !!item.title && !item.hideInExcel)
  ];

  // 提取列标题和键
  const thKeys = columnsData.map((item) => item.key);
  const thData = columnsData.map((item) => item.title);


  // 判断是否需要添加序号
  const hasSerialNumber = thData.some((title) => title.includes("序号"));

  // 生成数据行，如果没有序号标题，则在开头添加序号
  const trData = data.map((item, index) => {
    if (!hasSerialNumber) {
      return thKeys.map((key) => item[key]); // 不添加序号
    } else {
      return [index + 1, ...thKeys.slice(1).map((key) => item[key])]; // 添加序号
    }
  });

  // 生成工作表
  const sheet = utils.aoa_to_sheet([thData, ...trData]);
  const workBook = utils.book_new();
  utils.book_append_sheet(workBook, sheet, '数据报表');

  // 获取当前日期并格式化
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD 格式
  const title = '数据报表'; // 替换为实际标题或动态标题

  // 动态生成文件名
  const fileName = `${title}_${formattedDate}.xlsx`;

  // 导出 Excel 文件
  writeFile(workBook, fileName);
}


async function handleButtonClick() {
  if (typeof props.handleButtonClick === 'function') {
    isButtonLoading.value = true;
    try {
      await props.handleButtonClick();
    } catch (error) {
      message.error('处理失败，请稍后重试');
    } finally {
      isButtonLoading.value = false;
    }
  }
}




defineExpose({
  tableData,
  handleSearch,
  handleReset,
  handleExport,
  isCustomButtonVisible,
  handleButtonClick
})
</script>
