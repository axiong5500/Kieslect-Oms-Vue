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
      virtual-scroll
      handle-button-click="">
    </MeCrud>
<!--    <div ref="divRef" style="height: 600px"></div>-->
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

          <n-form-item label="问题标题" >
            <n-input v-model:value="modalForm.helpTitle" placeholder="请输入问题标题" />
          </n-form-item>
          <n-form-item label="解决步骤" >
<!--            <n-input v-model:value="modalForm.helpDetail" placeholder="请输入解决步骤" />-->
            <AiEditorComponent v-model="modalForm.helpDetail" placeholder="请输入内容"/>
          </n-form-item>
          <n-form-item label="语言" >
            <n-input v-model:value="modalForm.language" placeholder="请输入语言" />
          </n-form-item>
          <n-form-item label="问题归类类别" >
            <n-input v-model:value="modalForm.helpTypeId" placeholder="请输入问题归类类别" />
          </n-form-item>
          <n-form-item label="所属App" >
            <n-input v-model:value="modalForm.appId" placeholder="请输入所属App" />
          </n-form-item>


        </n-form>

      </div>

    </MeModal>

  </CommonPage>
</template>


<script setup >
import { h, ref, onMounted } from 'vue'
import { NButton } from 'naive-ui'
import { MeCrud, MeModal } from '@/components'
import { useCrud } from '@/composables'
import { CommonPage } from '@/components/index.js'
import api from './api'

import AiEditorComponent from '../../demo/aieditor/AiEditorComponent.vue';




const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})



onMounted(() => {
  $table.value?.handleSearch()
})





const columns = [
  {
    title: 'id',
    key: 'id',
    align: 'center',
    ellipsis: { tooltip: true }

  },
  {
    title: 'appId',
    key: 'appId',
    align: 'center',
    ellipsis: { tooltip: true }
  },{
    title: 'helpTitle',
    key: 'helpTitle',
    align: 'center',
    ellipsis: { tooltip: true }

  },
 {
    title: 'helpTypeId',
    key: 'helpTypeId',
    align: 'center',
    ellipsis: { tooltip: true }

  },{
    title: 'language',
    key: 'language',
    align: 'center',
    ellipsis: { tooltip: true }

  },

  {
    title: 'createTime',
    key: 'createTime',
    align: 'center',
    ellipsis: { tooltip: true }

  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    hideInExcel: true,
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
            default: () => '编辑',
          }
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 10px;',
            onClick: () => handleDelete(row.id)
          },
          {
            default: () => '删除',
          }
        )
      ]
    }
  }
]


defineOptions({ name: 'appHelpInfo' })
const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleEdit,
  handleDelete,
} = useCrud({
  name: 'appHelpInfo',
  initForm: {},
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch()
})

</script>
