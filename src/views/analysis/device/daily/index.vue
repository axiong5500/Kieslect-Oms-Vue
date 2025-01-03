<template>

  <CommonPage>
    <template #action>
      <div>
        <n-button type="primary" @click="exportData">导出数据</n-button>
      </div>
    </template>


    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="360"
      :columns="columns"
      :get-data="handleSearch"
      :tableMaxHeight="465"
      :isVirtualScroll=true
    >

      <MeQueryItem label="日期" :label-width="70" :contentWidth="980">
        <n-radio-group v-model:value="queryItems.rangeType" @update:value="onRangeTypeChange">
          <n-space>
            <n-radio v-for="song in songs" :key="song.value" :value="song.value">
              {{ song.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </MeQueryItem>
      <MeQueryItem label="日期" :label-width="70" >
        <n-date-picker v-model:value="queryItems.dateRange" type="daterange" clearable @update:value="onDateRangeChange"/>
      </MeQueryItem>
      <MeQueryItem label="国家" :label-width="70">
        <n-select v-model:value="queryItems.countryCode" clearable :options="countryCodeOptions" :filterable="true" />
      </MeQueryItem>
      <MeQueryItem label="不包含国家" :label-width="110">
        <n-select v-model:value="queryItems.noIncludeCountryCode" clearable :options="countryCodeOptions" :filterable="true" />
      </MeQueryItem>
      <MeQueryItem label="品牌" :label-width="70" :contentWidth="220" style="height: 34px;padding-top: 3px">
        <n-radio-group v-model:value="queryItems.brand" @update:value="brandChange">
          <n-space>
            <n-radio v-for="brandKey in brandOptions" :key="brandKey.value" :value="brandKey.value">
              {{ brandKey.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </MeQueryItem>
      <MeQueryItem label="总数量" :label-width="70" :contentWidth="980" >
        <label class="font-900 items-center flex " style="font-size: 18px;"  >{{deviceAnalysisCount}}</label>
      </MeQueryItem>
    </MeCrud>

  </CommonPage>

</template>

<script setup>
import { MeCrud, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import { CommonPage } from '@/components/index.js'
import { ref } from 'vue'



defineOptions({ name: '' })



const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const deviceAnalysisCount = ref(0)

onMounted(() => {
  $table.value?.handleSearch()
})

function onRangeTypeChange(newValue) {
  if (newValue) {
    queryItems.value.dateRange = null
  }
}

function onDateRangeChange(newValue) {
  if (newValue) {
    queryItems.value.rangeType = null
  }
}

function brandChange(newValue) {
  if (newValue) {
    queryItems.value.brand = newValue
  }
  $table.value?.handleSearch()
}

const songs = ref([
  { label: '昨天', value: 'yesterday' },
  { label: '过去一周', value: 'last_7_days' },
  { label: '过去30天', value: 'last_30_days' },
  { label: '上一个月', value: 'last_month' },
  { label: '本月', value: 'current_month' },
  { label: '去年', value: 'last_year' },
  { label: '今年', value: 'this_year' },
  { label: '本季度', value: 'current_quarter' },
  { label: '上一季度', value: 'last_quarter' }
])
const columns = ref([
  {
    title: '日期',
    key: 'activationDate',
    align: 'center',
    width: 30 // 可以根据需要调整列宽

  },
  {
    title: '总数',
    key: 'totalSum',
    align: 'center',
    width: 30 // 可以根据需要调整列宽

  },
  {
    title: 'Kieslect',
    align: 'center',
    children: [
      {
        title: 'Actor',
        key: 'Actor',
        align: 'center',
        width: 30 // 可以根据需要调整列宽

      },
      {
        title: 'KS3',
        key: 'KS3',
        align: 'center',
        width: 30 // 可以根据需要调整列宽

      },
      {
        title: 'BALANCS',
        key: 'Balancs',
        align: 'center',
        width: 30 // 可以根据需要调整列宽

      },
      {
        title: 'PURA',
        key: 'Kieslect Pura',
        align: 'center',
        width: 30 // 可以根据需要调整列宽

      },
      {
        title: 'KS2',
        key: 'KS2',
        align: 'center',
        width: 30 // 可以根据需要调整列宽

      },
    ]
  },
  {
    title: 'Scykei',
    align: 'center',
    children: [
      {
        title: 'MOVIS',
        key: 'Scykei Movis',
        align: 'center',
        width: 30 // 可以根据需要调整列宽

      },
      {
        title: 'CIVIS',
        key: 'Scykei Civis',
        align: 'center',
        width: 30 // 可以根据需要调整列宽

      },
      {
        title: 'FEEL',
        key: 'Scykei Feel',
        align: 'center',
        width: 30 // 可以根据需要调整列宽

      }
    ]
  },

])
const brandOptions = ref([
  { label: 'Kieslect', value: 'kieslect' },
  { label: 'Scykei', value: 'scykei' }
])


async function handleSearch(params) {
  try {
    const { data } = await api.readCount(params)
    deviceAnalysisCount.value = data
    return await api.read(params)
  } catch (error) {
    console.error('数据请求失败:', error)
    return 0
  }
}

const countryCodeOptions = ref([])
Promise.all([
  api.getAllDicData().then(({ data = [] }) => {
    if (Array.isArray(data)) {

      countryCodeOptions.value = data
        .filter(item => item.type === 'countryCode_options')
        .map(item => ({
          label: `${item.name}`,
          value: `${item.value}`
        }))

    } else {
      countryCodeOptions.value = []
    }
  })
])

// 导出数据
function exportData() {
  if ($table.value) {
    $table.value.handleExport() // 调用子组件的 handleExport 方法
  }
}



const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleDelete,
  handleOpen,
  handleEdit,
  handleSave,
} = useCrud({
  name: '',
  initForm: { enable: true },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})

</script>

