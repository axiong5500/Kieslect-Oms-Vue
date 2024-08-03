<template>
  <CommonPage>
    <template #action>

    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
      >
      <MeQueryItem></MeQueryItem>
    </MeCrud>

  </CommonPage>
</template>

<script setup>
import { MeCrud, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import { h } from 'vue'
import { formatDateTime } from '@/utils/index.js'

defineOptions({ name: 'operationLog' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})



const columns = [
  {
    title: '日志ID',
    key: 'logId',
    align: 'center',
    width: 80,
  },
  {
    title: '用户名',
    key: 'username',
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: '操作',
    key: 'operation',
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: '方法',
    key: 'method',
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: '参数',
    key: 'params',
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: '结果',
    key: 'result',
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: '异常',
    key: 'exception',
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: '操作时间',
    key: 'operationTime',
    align: 'center',
    ellipsis: { tooltip: true },
    render(row) {
      return h('span', formatDateTime(row['operationTime'] * 1000))
    }
  },
  {
    title: 'IP地址',
    key: 'ipAddress',
    align: 'center',
    ellipsis: { tooltip: true },
  },

];




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
  name: 'operationLog',
  initForm: { enable: true },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})

</script>
