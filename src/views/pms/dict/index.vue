<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建新字典
      </n-button>
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

    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          label="字典名"
          path="name"
          :rule="{
            required: true,
            message: '请输入用户名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name"  />
        </n-form-item>
        <n-form-item
          label="字典值"
          path="value"
          :rule="{
            required: true,
            message: '请输入字典值',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.value"  />
        </n-form-item>

        <n-form-item
          label="字典分组"
          path="type"
        >
          <n-input v-model:value="modalForm.type"  />
        </n-form-item>


      </n-form>

    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NButton } from 'naive-ui'
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import { h } from 'vue'

defineOptions({ name: 'Dic' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})



const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: '字典名',
    key: 'name',
    ellipsis: { tooltip: true }
  },
  {
    title: '字典值',
    key: 'value',
    ellipsis: { tooltip: true },
  },
  {
    title: '字典分组',
    key: 'type',
    ellipsis: { tooltip: true },
  },

  {
    title: '操作',
    key: 'actions',
    width: 320,
    align: 'center',
    fixed: 'center',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            onClick: () => handleEdit(row),
          },
          {
            default: () => '编辑',
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-14' }),
          }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: () => handleDelete(row.id),
          },
          {
            default: () => '删除',
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          }
        ),
      ]
    },
  },
]



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
  name: 'Dic',
  initForm: { enable: true },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})

</script>
