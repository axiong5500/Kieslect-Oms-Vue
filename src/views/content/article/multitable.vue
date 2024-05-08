<!--------------------------------
 - @Author: Kieslect Fashion
 - @LastEditor: Kieslect Fashion
 - @LastEditTime: 2023/12/05 21:29:56
 - @Email: Kieslect Fashion@gmail.com
 - Copyright © 2024 专一 | https://www.kieslect.com
 --------------------------------->

<template>
  <CommonPage back>
    <template #title-suffix>
      <n-tag class="ml-12" type="warning">{{ route.params.id }}</n-tag>
      <n-tag class="ml-12" type="warning">{{ route.query.title }}</n-tag>

    </template>
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
      :get-data="api.getMultilingualismList"
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

            >
              <n-input v-model:value="modalForm.title" :disabled="true"/>
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
import { NButton, NTag } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import { h } from 'vue'
import { CommonPage } from '@/components/index.js'


defineOptions({ name: 'multitableManage' })

const route = useRoute()

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({
  id : route.params.id,
})

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

const formatType = (id, type) => {
  const foundType = type.find(item => item.value === id);
  return foundType ? foundType.label : '';
}


const columns = [


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
  name: 'ArticleMultilingualism',
  initForm: {
    enable: true ,
    title: route.query.title,
    articleTypeId:route.query.articleTypeId,
    appId:route.query.appId,
    fatherId:route.params.id
  },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch()
})

</script>
