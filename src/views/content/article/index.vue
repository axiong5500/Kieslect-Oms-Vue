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
<!--              <n-input v-model:value="modalForm.content" />-->
              <textarea v-model="modalForm.content" rows="50" cols="150"></textarea>
            </n-form-item>
          </div>



        </n-form>

      </div>

    </MeModal>



  </CommonPage>
</template>



<script setup>
import {  NButton } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import { h } from 'vue'
import { CommonPage } from '@/components/index.js'
import { router } from '@/router/index.js'


defineOptions({ name: 'articleManage' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

const language = [
  { label: 'invalid', value: 0 },
  { label: 'zh', value: 1 },
  { label: 'en', value: 2 },
  { label: 'fr', value: 3 },
  { label: 'de', value: 4 },
  { label: 'it', value: 5 },
  { label: 'es', value: 6 },
  { label: 'ja', value: 7 },
  { label: 'pl', value: 8 },
  { label: 'cs', value: 9 },
  { label: 'ro', value: 10 },
  { label: 'lt', value: 11 },
  { label: 'nl', value: 12 },
  { label: 'sl', value: 13 },
  { label: 'hu', value: 14 },
  { label: 'ru', value: 15 },
  { label: 'uk', value: 16 },
  { label: 'sk', value: 17 },
  { label: 'da', value: 18 },
  { label: 'hr', value: 19 },
  { label: 'id', value: 20 },
  { label: 'ko', value: 21 },
  { label: 'hi', value: 22 },
  { label: 'pt', value: 23 },
  { label: 'tr', value: 24 },
  { label: 'th', value: 25 },
  { label: 'vi', value: 26 },
  { label: 'my', value: 27 },
  { label: 'fil', value: 28 },
  { label: 'zh_Hant', value: 29 },
  { label: 'el', value: 30 },
  { label: 'ar', value: 31 },
  { label: 'sv', value: 32 },
  { label: 'fi', value: 33 },
  { label: 'fa', value: 34 },
  { label: 'nb', value: 35 },
  { label: 'km', value: 36 },
  { label: 'bn', value: 37 },
  { label: 'ms', value: 38 },
  { label: 'he', value: 39 },
];
const articleType = [
  { label: 'App首页', value: 0 },
]
const appManage = [
  { label: 'fashion', value: 2 },
]



onMounted(() => {
  $table.value?.handleSearch()

})

const formatType = (id, type) => {
  const foundType = type.find(item => item.value === id);
  return foundType ? foundType.label : '';
}


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
      return h('span', formatType(row['language'],language));
    }
  },
  {
    title: '文章分类',
    key: 'articleTypeId',
    align: 'center',
    render(row) {
      return h('span', formatType(row['articleTypeId'],articleType));
    }
  },
  {
    title: '所属App',
    key: 'appId',
    align: 'center',
    render(row) {
      return h('span', formatType(row['appId'],appManage));
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
            onClick: () =>
              router.push({ path: `/content/article/multitable/${row.id}`, query: { title: row.title,articleTypeId:row.articleTypeId,appId:row.appId,language:row.language} }),
          },
          {
            default: () => '多语言',
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-14' })
          }
        ),
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
