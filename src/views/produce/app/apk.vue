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
      :get-data="api.apkRead"
    >
    </MeCrud>

    <MeModal ref="modalRef" width="800px" >
      <div class="scroll-container">
        <n-form
          ref="modalFormRef"
          label-placement="left"
          label-align="left"
          :label-width="260"
          :model="modalForm"
          :disabled="modalAction === 'view'"
        >
          <div>

            <n-form-item label="appId" path="appId" hidden >
              <n-input v-model:value="modalForm.appId" />
            </n-form-item>
            <n-form-item label="安装包文件（packageDownloadUrl）" path="packageDownloadUrl">
              <n-upload
                v-model:value="modalForm.packageDownloadUrl"
                :custom-request="handleUpload"
                :default-file-list="modalForm.packageDownloadUrl ? [{name:'安装包文件', url: domain_url + modalForm.packageDownloadUrl,status: 'finished' }] : []"
                :max="1"
                :show-download-button="true"
              >
                <n-button>上传文件</n-button>
              </n-upload>
            </n-form-item>
            <n-form-item label="应用系统（apkSystem）" path="apkSystem">
              <n-select v-model:value="modalForm.apkSystem" :options="apkSystemDic" label-field="label"
                        value-field="value" clearable filterable />
            </n-form-item>
            <n-form-item label="升级方式（updateStatus）" path="updateStatus">
              <n-select v-model:value="modalForm.updateStatus" :options="apkUpdateStatusDic" label-field="label"
                        value-field="value" clearable filterable />
            </n-form-item>
            <n-form-item label="发布渠道（channel）" path="channel">
              <n-select v-model:value="modalForm.channel" :options="apkChannelDic" label-field="label"
                        value-field="value" clearable filterable />
            </n-form-item>
            <n-form-item label="弹窗提示（prompt）" path="prompt">
              <n-select v-model:value="modalForm.prompt" :options="apkPromptDic" label-field="label" value-field="value"
                        clearable filterable />
            </n-form-item>
            <n-form-item label="安装包名（packageName）" path="packageName">
              <n-input v-model:value="modalForm.packageName" />
            </n-form-item>
            <n-form-item label="版本Code（versionCode）" path="versionCode"
                         :rule="{
                    required: true,
                    message: '请输入版本Code',
                    trigger: ['input', 'blur'],
                    }"
            >
              <n-input v-model:value="modalForm.versionCode" />
            </n-form-item>
            <n-form-item label="apk文件大小（apkSize）" path="apkSize">
              <n-input v-model:value="modalForm.apkSize" />
            </n-form-item>
            <n-form-item label="版本名称（versionName）" path="versionName">
              <n-input v-model:value="modalForm.versionName" />
            </n-form-item>
            <n-form-item label="升级内容（upgradeContent）" path="upgradeContent">
              <n-input v-model:value="modalForm.upgradeContent" />
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

defineOptions({ name: 'apk' })

const route = useRoute()

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({
  appId: parseInt(route.params.id)
})

const domain_url = 'https://app.kieslect.top'

onMounted(() => {
  $table.value?.handleSearch()

})

const apkSystemDic = ref([])
const apkUpdateStatusDic = ref([])
const apkChannelDic = ref([])
const apkPromptDic = ref([])


Promise.all([
  api.getAllDicData().then(({ data = [] }) => {
    if (Array.isArray(data)) {
      apkSystemDic.value = data
        .filter(item => item.type === 'app_apk_system_value')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value)
        }))
      apkUpdateStatusDic.value = data
        .filter(item => item.type === 'app_apk_updateStatus_value')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value)
        }))
      apkChannelDic.value = data
        .filter(item => item.type === 'app_apk_channel_value')
        .map(item => ({
          label: `${item.name}`,
          value: item.value
        }))
      apkPromptDic.value = data
        .filter(item => item.type === 'app_apk_prompt_value')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value)
        }))
    } else {
      apkSystemDic.value = []
      apkUpdateStatusDic.value = []
      apkChannelDic.value = []
      apkPromptDic.value = []
    }

  })
])


const formatType = (id, type) => {
  const foundType = type.find(item => item.value === id)
  return foundType ? foundType.label : ''
}

async function handleUpload({ file, onFinish }) {
  const packageDownloadUrl = modalForm.value.packageDownloadUrl
  console.log(packageDownloadUrl, file.file)
  if (!file || !file.type) {
    $message.error('请选择文件')
  }

  // 创建 FormData 对象，用于包装要上传的文件
  const formData = new FormData()
  formData.append('file', file)
  try {
    const response = await api.uploadFile(file.file)

    console.log(response)


    // 处理上传成功后的逻辑
    const responseData = await response
    if (responseData.code !== 200) {
      throw new Error('文件上传失败')
    }
    // 提取上传成功后的文件信息
    const { fileUrl, fileSize } = responseData.data

    console.log(fileUrl)

    modalForm.value.packageDownloadUrl = fileUrl // 赋值给 modalForm.packageDownloadUrl
    modalForm.value.apkSize = fileSize

    console.log('modalForm.packageDownloadUrl 更新为：', modalForm.value.packageDownloadUrl)

    $message.success('上传成功')
    onFinish({ url: fileUrl }) // 调用上传完成的回调函数并传递文件 URL
  } catch (error) {
    console.error('文件上传失败', error)
    $message.error('文件上传失败')
  }
}

const iconUrls = {
  google: 'https://img.icons8.com/color/32/google-logo.png',
  kieslect: new URL('../../../../src/assets/images/kieslect.png', import.meta.url).href,
  huawei: 'https://img.icons8.com/external-tal-revivo-color-tal-revivo/32/external-huawei-technologies-company-a-chinese-multinational-technology-provides-telecommunications-equipment-and-consumer-electronics-logo-color-tal-revivo.png',
  tencent: new URL('../../../../src/assets/images/apk/yingyongbao_icon.png', import.meta.url).href,
};

const columns = [
  {
    title: 'app名称',
    key: 'appName',
    align: 'center',
    render() {
      return h('span', route.query.title)
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
    title: '版本名称',
    key: 'versionName',
    align: 'center'
  },
  {
    title: '发布渠道',
    key: 'channel',
    align: 'center',
    render(row) {
      const iconUrl = iconUrls[row.channel] || new URL('../../../../src/assets/images/kieslect.png', import.meta.url).href; // 选择相应的图标 URL，如果没有找到则使用默认图标
      return h('img', {
        src: iconUrl,
        width: 32,
        height: 32,
        alt: `${row.channel}-logo`,
        style: {
          display: 'inline-block',
          verticalAlign: 'middle'
        }
      });
    }
  },
  {
    title: '安装包名',
    key: 'packageName',
    align: 'center'
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    width: 350,
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
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-10' })
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
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-10' })
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
  handleDelete
} = useCrud({
  name: 'Apk',
  initForm: {
    enable: true,
    appId: route.params.id,
    apkSystem: 0,
    updateStatus: 0,
    channel: 0,
    prompt: 0
  },
  doCreate: api.apkCreate,
  doDelete: api.apkDelete,
  doUpdate: api.apkUpdate,
  refresh: () => $table.value?.handleSearch()
})

</script>
