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
              label="app名称"
              path="appName"
              :rule="{
            required: true,
            message: '请输入app名称',
            trigger: ['input', 'blur'],
            }"
            >
              <n-input v-model:value="modalForm.appName" />
            </n-form-item>
            <n-form-item
              label="app标识"
              path="appMark"
              :rule="{
            required: true,
            message: '请输入app标识',
            trigger: ['input', 'blur'],
            }"
            >
              <n-input v-model:value="modalForm.appMark" />
            </n-form-item>
            <n-form-item
              label="logo"
              path="appLogo"

            >
              <n-upload v-model:value="modalForm.appLogo"
                        :custom-request="handleUpload"
                        :default-file-list="modalForm.appLogo ? [{ url: domain_url + modalForm.appLogo,status: 'finished' }] : []"
                        max=1
                        list-type="image-card"
                        :show-download-button="true"
              />
            </n-form-item>

            <template v-for="(item, index) in modalForm.appUrls" :key="index" v-if="modalAction === 'edit'">
              <n-form-item :label="item.appChannel.toString()">
                <n-input v-model:value="item.appDownloadLink" />
              </n-form-item>
            </template>

            <template v-if="modalAction === 'add'">
              <n-form-item
                label="ios下载地址"
                path="iosUrl"
                :rule="{
            required: true,
            message: '请输入ios下载地址',
            trigger: ['input', 'blur'],
            }"
              >
                <n-input v-model:value="modalForm.iosUrl" />
              </n-form-item>
              <n-form-item
                label="google下载地址"
                path="androidUrl"
                :rule="{
            required: true,
            message: '请输入google下载地址',
            trigger: ['input', 'blur'],
            }"
              >
                <n-input v-model:value="modalForm.androidUrl" />
              </n-form-item>
              <n-form-item
                label="鸿蒙下载地址"
                path="harmonyUrl"
                :rule="{
            required: true,
            message: '请输入鸿蒙下载地址',
            trigger: ['input', 'blur'],
            }"
              >
                <n-input v-model:value="modalForm.harmonyUrl" />
              </n-form-item>
            </template>


            <template v-for="(item, index) in modalForm.appDescriptions" :key="index" v-if="modalAction === 'edit'">
              <n-form-item :label="item.languageVersion.toString()">
                <n-input v-model:value="item.appProductDescription" />
              </n-form-item>
            </template>

            <template v-if="modalAction === 'add'">
              <n-form-item
                label="产品描述（中文版）"
                path="appDescCh"
                :rule="{
            required: true,
            message: '请输入产品描述（中文版）',
            trigger: ['input', 'blur'],
            }"
              >
                <n-input v-model:value="modalForm.appDescCh" />
              </n-form-item>
              <n-form-item
                label="产品描述（英文版）"
                path="appDescEn"
                :rule="{
            required: true,
            message: '请输入产品描述（英文版）',
            trigger: ['input', 'blur'],
            }"
              >
                <n-input v-model:value="modalForm.appDescEn" />
              </n-form-item>

            </template>
          </div>

        </n-form>

      </div>

    </MeModal>

    <n-modal v-model:show="showQrCodeModal">
      <img :src="largeQrCodeUrl" alt="Large QR Code">
    </n-modal>

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

defineOptions({ name: 'AppManage' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

const domain_url = 'http://192.168.0.106:9999'
const showQrCodeModal = ref(false) // 定义模态框显示状态
const largeQrCodeUrl = ref('') // 定义放大后的二维码地址


const columns = [
  {
    title: 'Id',
    key: 'id',
    align: 'center'
  },

  {
    title: 'app名称',
    key: 'appName',
    align: 'center',
    ellipsis: { tooltip: true }
  },
  {
    title: 'app标识',
    key: 'appMark',
    align: 'center',
    ellipsis: { tooltip: true }

  },
  {
    title: 'app二维码',
    key: 'qrCodeUrl',
    align: 'center',
    render: ({ appLogo }) =>
      h(NQrCode, {
        value: domain_url + appLogo,
        iconSrc: domain_url + appLogo,
        iconSize: 20,
        size: 50,
        onClick: () => handleQrCodeClick(domain_url + appLogo),
        style: { padding: '0px' }
      })

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

function handleQrCodeClick(qrCodeUrl) {
  // 在这里打开一个模态框或者弹出层来展示放大后的二维码
  showQrCodeModal.value = true
  largeQrCodeUrl.value = qrCodeUrl
}

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleEdit,
  handleDelete,
} = useCrud({
  name: 'App',
  initForm: { enable: true },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch()
})

</script>
