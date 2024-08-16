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
      :isVirtualScroll="true"
      :tableMaxHeight="590"
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

          <n-form-item label="固件版本号" path="otaVersion">
            <n-input v-model:value="modalForm.otaVersion" placeholder="请输入固件版本号" />
          </n-form-item>
          <n-form-item label="固件文件">

            <n-upload v-model:value="modalForm.fileUrl"
                      :custom-request="handleUploadOtaFileUrl"
                      :default-file-list="modalForm.fileUrl ? [{ url: domain_url + modalForm.fileUrl,status: 'finished' }] : []"
                      :max="1"
                      list-type="image-card"
                      :show-download-button="true"
            />
          </n-form-item>
          <n-form-item label="固件描述">
            <n-input v-model:value="modalForm.otaDesc" placeholder="请输入固件描述" />
          </n-form-item>
          <n-form-item label="设备内部ID">
            <n-input v-model:value="modalForm.deviceInnerId" placeholder="请输入设备内部ID" />
          </n-form-item>

          <n-form-item label="版本">
            <n-space>
              <n-radio-group v-model:value="modalForm.mode">
                <n-radio :value=0>
                  内测
                </n-radio>
                <n-radio :value=1>
                  公测
                </n-radio>
                <n-radio :value=2>
                  正式
                </n-radio>
              </n-radio-group>
            </n-space>
          </n-form-item>

        </n-form>

      </div>

    </MeModal>
  </CommonPage>
</template>


<script setup>
import { h, ref, onMounted } from 'vue'
import { NButton, NSpace, NSwitch,NTag } from 'naive-ui'
import { MeCrud, MeModal } from '@/components'
import { useCrud } from '@/composables'
import { CommonPage } from '@/components/index.js'
import api from './api'
import { formatDateTime } from '@/utils/index.js'
import { message } from 'ant-design-vue'


const domain_url = 'https://app.kieslect.top'
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})


onMounted(() => {
  $table.value?.handleSearch()
})

async function handleUploadOtaFileUrl({ file}){
  if (!file || !file.type) {
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

  modalForm.value.fileUrl = fileUrl;

  $message.success('上传成功');
}

const handleFileUrlFinish = ({file, event}) => {
  console.log(event)
  const response = event?.target?.response;
  $message.success('文件上传成功')

  try {
    const parsedResponse = JSON.parse(response)
    if (parsedResponse.code === 200) {
      modalForm.value.fileUrl = parsedResponse.data.fileUrl;
    } else {
      $message.error('上传失败')
    }
  } catch (error) {
    console.error('Failed to parse response', error)
    $message.error('上传失败')
  }

  return file
}


const columns = [
  {
    title: '序号',
    key: 'index',
    align: 'center',
    width: 60,
    render(row, index) {
      return h('span', index + 1)
    }
  },

  {
    title: '固件描述',
    key: 'otaDesc',
    align: 'center',
    width: 200,

  },
  {
    title: '固件版本号',
    key: 'otaVersion',
    align: 'center',
    width: 100,
  },
  {
    title: '上架状态',
    key: 'otaStatus',
    align: 'center',
    width: 100,
    render(row) {
      if (row.otaStatus === null || row.otaStatus === undefined) {
        // 如果 otaStatus 无效，返回一个占位符或默认值
        return h('span', '无状态');
      }
      return h(NSpace, {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, {
        default: () => [
          h(NSwitch, {
            value: row.otaStatus,
            'checked-value': 1,
            'unchecked-value': 0,
            onUpdateValue: async (value) => {
              row.otaStatus = value;
              await api.update(row)
            }
          }, {
            checked: () => '上架',
            unchecked: () => '下架'
          })
        ]
      });
    }
  },
  {
    title: '系统版本',
    key: 'mode',
    align: 'center',
    width: 100,
    render(row) {
      const label = formatType(row['mode'], modes); // 获取label
      const type = row['mode'] === 0 ? 'warning' : row['mode'] === 1 ? 'default' : 'info';
      return h(NTag, {
          bordered: false,
          type: type, // 动态设置type
          size: 'medium',
          strong: true
        },
        {
          default: () => label,
        })
    }
  },
  {
    title: '发布时间',
    key: 'releaseDate',
    align: 'center',
    width: 200,
    render(row) {
      return h('span', formatDateTime(row['releaseDate'] * 1000))
    }

  },
  {
    title: '操作',
    align: 'center',
    width: 100,
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
            default: () => '编辑'
          }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 10px;',
            onClick: () => handleDelete(row)
          },
          {
            default: () => '删除'
          }
        )

      ]
    }
  }
]

const otaStatuss = ref([])
const otaUpgrades = ref([])
const modes = ref([])
Promise.all([
  api.getAllDicData().then(({ data = [] }) => {
    if (Array.isArray(data)) {
      otaStatuss.value = data
        .filter(item => item.type === 'ota_manage_otaStatus_values')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value)
        }))
      otaUpgrades.value = data
        .filter(item => item.type === 'ota_manage_otaUpgrade_values')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value)
        }))
      modes.value = data
        .filter(item => item.type === 'ota_manage_mode_values')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value)
        }))
    } else {
      otaStatuss.value = []
      otaUpgrades.value = []
      modes.value = []
    }
  })
])


const formatType = (id, type) => {
  const foundType = type.value.find(item => item.value === id);
  return foundType ? foundType.label : '';
}


defineOptions({ name: 'ota' })
const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleEdit,
  handleDelete
} = useCrud({
  name: 'ota',
  initForm: {
    mode: 0,
    otaStatus: 0,
    otaUpgrade: 0,
    sortId: 0,
  },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch()
})

</script>



