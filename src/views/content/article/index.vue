<!--------------------------------
 - @Author: Kieslect Fashion
 - @LastEditor: Kieslect Fashion
 - @LastEditTime: 2023/12/05 21:29:56
 - @Email: Kieslect Fashion@gmail.com
 - Copyright © 2024 专一 | https://www.kieslect.com
 --------------------------------->

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
          <div>
            <n-form-item
              label="标题"
              path="title"
              :rule="{
            required: true,
            message: '请输入标题',
            trigger: ['input', 'blur'],
            }"
            >
              <n-input v-model:value="modalForm.title" />
            </n-form-item>
            <n-form-item
              label="语言"
              path="language"

            >
              <n-select
                v-model:value="modalForm.language"
                :options="language"
                label-field="label"
                value-field="value"
                clearable
                filterable
              />
            </n-form-item>
            <n-form-item
              label="文章分类"
              path="articleTypeId"

            >
              <n-select
                v-model:value="modalForm.articleTypeId"
                :options="articleType"
                label-field="label"
                value-field="value"
                clearable
                filterable
              />
            </n-form-item>
            <n-form-item
              label="所属App"
              path="appId"

            >
              <n-select
                v-model:value="modalForm.appId"
                :options="appManage"
                label-field="label"
                value-field="value"
                clearable
                filterable
              />
            </n-form-item>

            <n-form-item
              label="文章内容"
              path="content"

            >
              <n-input v-model:value="modalForm.content" />
            </n-form-item>
          </div>

        </n-form>

      </div>

    </MeModal>



  </CommonPage>
</template>

<script setup>
import {  NButton, NQrCode } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import { h } from 'vue'
import { CommonPage } from '@/components/index.js'

defineOptions({ name: 'articleManage' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

const language = [
  { label: 'zh', value: 0 },
  { label: 'en', value: 1 },
]
const articleType = [
  { label: 'App首页', value: 0 },
]
const appManage = [
  { label: 'fashion', value: 2 },
]

onMounted(() => {
  $table.value?.handleSearch()
})


const columns = [
  {
    title: 'Id',
    key: 'id',
    align: 'center'
  },

  {
    title: '标题',
    key: 'title',
    align: 'center',
  },
  {
    title: '语言',
    key: 'language',
    align: 'center',
    render(row) {
      const languageId = row['language'];
      console.log(language.find(item => item.value === languageId))
      const foundLanguage = language.find(item => item.value === languageId) ;
      return h('span', foundLanguage ? foundLanguage.label : '');
    }
  },
  {
    title: '文章分类',
    key: 'articleTypeId',
    align: 'center',
    render(row) {
      const articleTypeId = row['articleTypeId'];
      const foundArticleType =  articleType.find(item => item.value === articleTypeId);
      return h('span', foundArticleType ? foundArticleType.label : '');
    }
  },
  {
    title: '所属App',
    key: 'appId',
    align: 'center',
    render(row) {
      const appId = row['appId'];
      const foundAppManage = appManage.find(item => item.value === appId) ;
      return h('span', foundAppManage ? foundAppManage.label : '');
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    align: 'center',
    render(row) {
      return h('span', formatDateTime(row['createTime'] * 1000))
    }
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
            style: 'margin-left: 12px;',
            onClick: () => handleEdit(row)
          },
          {
            default: () => '编辑',
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-14' })
          }
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: () => handleDelete(row.id)
          },
          {
            default: () => '删除',
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' })
          }
        )
      ]
    }
  }
]



const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleEdit,
  handleDelete,
} = useCrud({
  name: 'Article',
  initForm: { enable: true },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch()
})

</script>
