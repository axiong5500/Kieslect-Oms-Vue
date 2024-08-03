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
      handle-button-click="">
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

          <n-form-item label="序号code" >
            <n-input v-model:value="modalForm.code" placeholder="请输入序号code" />
          </n-form-item>
          <n-form-item label="应用包名" >
            <n-input v-model:value="modalForm.savePackName" placeholder="请输入应用包名" />
          </n-form-item>
          <n-form-item label="value" >
            <n-input v-model:value="modalForm.uteValue" placeholder="请输入标识" />
          </n-form-item>
          <n-form-item label="desc" >
            <n-input v-model:value="modalForm.desc" placeholder="请输入应用描述" />
          </n-form-item>
          <n-form-item label="应用图标" >
            <n-input v-model:value="modalForm.icon" placeholder="请输入应用图标" hidden/>
            <n-upload v-model:value="modalForm.icon"
                      :custom-request="handleUpload"
                      :default-file-list="modalForm.icon ? [{ url: domain_url + modalForm.icon,status: 'finished' }] : []"
                      max="1"
                      list-type="image-card"
                      :show-download-button="true"
                      :on-remove="handleRemove"
            />
          </n-form-item>
        </n-form>

      </div>

    </MeModal>

  </CommonPage>
</template>

<script setup>
import { NButton, NAvatar } from 'naive-ui'
import { MeCrud, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import { h } from 'vue'
import { CommonPage } from '@/components/index.js'

defineOptions({ name: 'appicons' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const domain_url = 'https://app.kieslect.top'




onMounted(() => {
  $table.value?.handleSearch()
})



/** 删除icon */
function handleRemove(file) {
  modalForm.value.icon = '';
  return true;
}

async function handleUpload({ file, onFinish }) {
  console.log(file.file)
  if (!file.file || !file.file.type) {
    $message.error('请选择文件')
  }

  // 创建 FormData 对象，用于包装要上传的文件
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.uploadFile(file.file);

  console.log(response);

  // 处理上传成功后的逻辑
  const responseData = await response;
  if (responseData.code !== 200) {
    throw new Error('文件上传失败');
  }
  // 提取上传成功后的文件信息
  const { fileUrl } = responseData.data;

  console.log(fileUrl);

  modalForm.value.icon = fileUrl;

  $message.success('上传成功');
  onFinish({ url: fileUrl }); // 调用上传完成的回调函数并传递文件 URL
}



const columns = [

  {
    title: 'code',
    key: 'code',
    align: 'center',
    ellipsis: { tooltip: true }
  },
  {
    title: 'savePackName',
    key: 'savePackName',
    align: 'center',
    ellipsis: { tooltip: true }

  },{
    title: 'uteValue',
    key: 'uteValue',
    align: 'center',
    ellipsis: { tooltip: true }

  },{
    title: 'desc',
    key: 'desc',
    align: 'center',
    ellipsis: { tooltip: true }

  },{
    title: 'icon',
    key: 'icon',
    align: 'center',
    ellipsis: { tooltip: true },
    render: ( row ) =>
      h(NAvatar, {
        src: domain_url + row.icon,
      })
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



const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleEdit,
  handleDelete,
} = useCrud({
  name: 'AppIcon',
  initForm: {
  },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch()
})

</script>
