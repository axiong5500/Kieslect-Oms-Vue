<template>
  <CommonPage>
<!--    <template #action>-->
<!--      <div>-->
<!--        <n-button type="primary" @click="exportData">导出数据</n-button>-->
<!--      </div>-->
<!--    </template>-->



    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :columns="columns"
      :get-data="handleSearch"
      :tableMaxHeight="500"
      :isVirtualScroll=true
    >

      <MeQueryItem label="日期" :label-width="70" :contentWidth="1080">
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
      <MeQueryItem label="型号" :label-width="70">
        <n-select v-model:value="queryItems.category" clearable :options="categoryOptions" />
      </MeQueryItem>
      <MeQueryItem label="国家" :label-width="70">
        <n-select v-model:value="queryItems.countryCode" clearable :options="countryCodeOptions" :filterable="true" />
      </MeQueryItem>
      <MeQueryItem label="不包含国家" :label-width="110">
        <n-select v-model:value="queryItems.noIncludeCountryCode" clearable :options="countryCodeOptions" :filterable="true" />
      </MeQueryItem>

    </MeCrud>


  </CommonPage>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { MeCrud, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import { CommonPage } from '@/components/index.js'

defineOptions({ name: '' });

const $table = ref(null);
const queryItems = ref({
  rangeType: 'last_30_days',
});

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

const countryCodeOptions = ref([])
const categoryOptions = ref([])
Promise.all([
  api.getAllDicData().then(({ data = [] }) => {
    if (Array.isArray(data)) {

      countryCodeOptions.value = data
        .filter(item => item.type === 'countryCode_options')
        .map(item => ({
          label: `${item.name}`,
          value: `${item.value}`
        }))

      categoryOptions.value = data
        .filter(item => item.type === 'device_category_options')
        .map(item => ({
          label: `${item.name}`,
          value: `${item.value}`
        }))

    } else {
      countryCodeOptions.value = []
    }
  })
])

onMounted(() => {
  $table.value?.handleSearch(queryItems.value);
});

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

// 你的数据
const rawData = ref([]); // 确保 rawData 是响应式的

// 获取数据的函数
async function handleSearch(params) {
  try {
    const { data } = await api.read(params)
    rawData.value = data
    return {
      data: rawData.value,
      code: 0,
      message: "OK",
    };
  } catch (error) {
    console.error('数据请求失败:', error)
    return {
      data: [],
      code: 1,
      message: error.message,
    };
  }
}


// 定义表格列
const columns = ref([
  { title: '日期',key: 'activationDate',align: 'center',width: 100,},
  { title: '总激活数',key: 'total_daily_activations',align: 'center', width: 100,},
  { title: '国家', key: 'country', align: 'center', width: 100 },
  { title: '各国激活数', key: 'daily_total_activations', align: 'center', width: 100 },
  { title: 'Actor', key: 'Actor', align: 'center', width: 100},
  { title: 'KS3', key: 'KS3', align: 'center', width: 100 },
  { title: 'BALANCS', key: 'Balancs', align: 'center', width: 100 },
  { title: 'PURA', key: 'Kieslect Pura', align: 'center', width: 100 },
  { title: 'KS2', key: 'KS2', align: 'center', width: 100 },
  { title: 'CIVIS', key: 'Scykei Civis', align: 'center', width: 100 },
  { title: 'FEEL', key: 'Scykei Feel', align: 'center', width: 100 },

]);


const { modalRef } = useCrud({
  name: '',
  initForm: { enable: true },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
});
</script>
