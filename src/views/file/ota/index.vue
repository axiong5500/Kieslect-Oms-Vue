<template>

  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        新增
      </n-button>
    </template>
    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
      :isVirtualScroll="true"
      :tableMaxHeight="590"
    >

    </MeCrud>
    <MeModal ref="modalRef" width="800px">

      <div class="scroll-container">
        <n-form
          ref="modalFormRef"
          label-placement="left"
          label-align="left"
          :label-width="150"
          :model="modalForm"
          :disabled="modalAction === 'view'"
        >

          <n-form-item label="视频标题">
            <n-input v-model:value="modalForm.videoTitle" placeholder="请输入视频标题" />
          </n-form-item>

          <n-form-item label="封面">
            <n-input
              v-model:value="modalForm.videoCover"
              placeholder="或输入封面地址"
            />
          </n-form-item>
          <n-form-item label="视频">
            <n-input  v-model:value="modalForm.videoUrl" placeholder="或输入视频地址" />
          </n-form-item>

          <n-form-item label="视频状态">
            <n-space>
              <n-switch v-model:value="modalForm.status" :checked-value="1" :unchecked-value="2" size="large">
                <template #checked>
                  上架
                </template>
                <template #unchecked>
                  下架
                </template>
              </n-switch>
            </n-space>
          </n-form-item>

        </n-form>

      </div>

    </MeModal>
  </CommonPage>
</template>


<script setup>
import { h, ref, onMounted } from 'vue'
import { NButton } from 'naive-ui'
import { MeCrud, MeModal } from '@/components'
import { useCrud } from '@/composables'
import { CommonPage } from '@/components/index.js'
import api from './api'
import { formatDateTime } from '@/utils/index.js'


const domain_url = 'https://app.kieslect.top'
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})


onMounted(() => {
  $table.value?.handleSearch()
})




const columns = [
  {
    title: '序号',
    key: 'index',
    align: 'center',
    width: 60,
    render(row, index) {
      return h('span', index + 1)
    }
  },

  {
    title: 'OTA描述',
    key: 'otaDesc',
    align: 'center',
    width: 200,

  },
  {
    title: 'OTA版本号',
    key: 'otaVersion',
    align: 'center',
    width: 100,
  },
  {
    title: '上架状态',
    key: 'otaStatus',
    align: 'center',
    width: 100,
    render(row) {
      return h('span', formatType(row['otaStatus'],otaStatuss))
    }
  },
  {
    title: '版本',
    key: 'mode',
    align: 'center',
    width: 100,
    render(row) {
      return h('span', formatType(row['mode'],modes))
    }
  },
  {
    title: 'OTA升级策略',
    key: 'otaUpgrade',
    align: 'center',
    width: 100,
    render(row) {
      return h('span', formatType(row['otaUpgrade'],otaUpgrades))
    }
  },
  {
    title: '创建时间',
    key: 'releaseDate',
    align: 'center',
    width: 200,
    render(row) {
      return h('span', formatDateTime(row['releaseDate'] * 1000))
    }

  },
  {
    title: '操作',
    align: 'center',
    width: 100,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 10px;',
            onClick: () => handleEdit(row)
          },
          {
            default: () => '编辑'
          }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 10px;',
            onClick: () => handleDelete(row)
          },
          {
            default: () => '删除'
          }
        )

      ]
    }
  }
]

const otaStatuss = ref([])
const otaUpgrades = ref([])
const modes = ref([])
Promise.all([
  api.getAllDicData().then(({ data = [] }) => {
    if (Array.isArray(data)) {
      otaStatuss.value = data
        .filter(item => item.type === 'ota_manage_otaStatus_values')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value)
        }))
      otaUpgrades.value = data
        .filter(item => item.type === 'ota_manage_otaUpgrade_values')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value)
        }))
      modes.value = data
        .filter(item => item.type === 'ota_manage_mode_values')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value)
        }))
    } else {
      otaStatuss.value = []
      otaUpgrades.value = []
      modes.value = []
    }
  })
])


const formatType = (id, type) => {
  const foundType = type.value.find(item => item.value === id);
  return foundType ? foundType.label : '';
}


defineOptions({ name: 'ota' })
const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleEdit,
  handleDelete
} = useCrud({
  name: 'ota',
  initForm: {},
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch()
})

</script>



