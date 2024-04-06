<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:29:56
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建新模块
      </n-button>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
<!--      <MeQueryItem label="变量标题" :label-width="70">
        <n-input
          v-model:value="queryItems.paramTitle"
          type="text"
          placeholder="请输入变量标题"
          clearable
        />
      </MeQueryItem>

      <MeQueryItem label="所属模块" :label-width="70">
        <n-select v-model:value="queryItems.paramType" clearable :options="paramType" />
      </MeQueryItem>

      <MeQueryItem label="分组" :label-width="50">
        <n-select v-model:value="queryItems.paramGroup" clearable :options="paramGroup" />
      </MeQueryItem>-->
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
          label="模块名称"
          path="moduleName"
          :rule="{
            required: true,
            message: '请输入模块名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.moduleName"  />
        </n-form-item>


        <n-form-item  label="分组" path="paramGroup"
        >
          <n-select
            v-model:value="modalForm.fatherId"
            :options="paramGroup"
            label-field="label"
            value-field="value"
            clearable
            filterable
          />
        </n-form-item>

<!--        <n-form-item v-if="['add', 'setRole'].includes(modalAction)" label="角色" path="roleIds">-->
<!--          <n-select-->
<!--            v-model:value="modalForm.roleIds"-->
<!--            :options="roles"-->
<!--            label-field="name"-->
<!--            value-field="id"-->
<!--            clearable-->
<!--            filterable-->
<!--            multiple-->
<!--          />-->
<!--        </n-form-item>-->
<!--        <n-form-item v-if="modalAction === 'add'" label="状态" path="enable">-->
<!--          <n-switch v-model:value="modalForm.enable">-->
<!--            <template #checked>启用</template>-->
<!--            <template #unchecked>停用</template>-->
<!--          </n-switch>-->
<!--        </n-form-item>-->
      </n-form>
<!--      <n-alert v-if="modalAction === 'add'" type="warning" closable>-->
<!--        详细信息需由用户本人补充修改-->
<!--      </n-alert>-->
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import { h } from 'vue'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

// const paramType = [
//   { label: '心率模块', value: 0 },
//   { label: '心电模块', value: 1 },
//   { label: '升级', value: 2 },
// ]
// const paramGroup = [
//   { label: '设备模块', value: 0 },
//   { label: 'App模块', value: 1 },
// ]
const roles = ref([])
const paramType = ref([])
const paramGroup = ref([])
api.getAllRoles().then(({ data = [] }) => (roles.value = data))
api.getAllParamType().then(({ data = [] }) => (paramType.value = data))
api.getAllParamGroup().then(({ data = [] }) => (paramGroup.value = data))

const columns = [
  {
    title: 'ID',
    key: 'id',
    align: 'center',
    width: 80,
    ellipsis: { tooltip: true }
  },

  {
    title: '所属模块',
    key: 'moduleName',
    align: 'center',
    ellipsis: { tooltip: true }
  },
  {
    title: '分组',
    key: 'fatherId',
    align: 'center',
    ellipsis: { tooltip: true }
  },
  {
    title: '创建时间',
    key: 'createTime',
    align: 'center',
    render(row) {
      return h('span', formatDateTime(row['createTime'] * 1000))
    },
  },

  {
    title: '操作',
    key: 'actions',
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

async function handleEnable(row) {
  row.enableLoading = true
  try {
    await api.update({ id: row.id, enable: !row.enable })
    row.enableLoading = false
    $message.success('操作成功')
    $table.value?.handleSearch()
  } catch (error) {
    row.enableLoading = false
  }
}

function handleOpenRolesSet(row) {
  const roleIds = row.roles.map((item) => item.id)
  handleOpen({
    action: 'setRole',
    title: '分配角色',
    row: { id: row.id, username: row.username, roleIds },
    onOk: onSave,
  })
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
  name: '属性',
  initForm: { },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})

function onSave() {
  if (modalAction.value === 'setRole') {
    return handleSave({
      api: () => api.update(modalForm.value),
      cb: () => $message.success('分配成功'),
    })
  } else if (modalAction.value === 'reset') {
    return handleSave({
      api: () => api.resetPwd(modalForm.value.id, modalForm.value),
      cb: () => $message.success('密码重置成功'),
    })
  }
  handleSave()
}
</script>
