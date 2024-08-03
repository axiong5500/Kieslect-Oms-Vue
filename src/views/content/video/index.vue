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
      :tableMaxHeight="620"
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

          <n-form-item label="视频标题">
            <n-input v-model:value="modalForm.videoTitle" placeholder="请输入视频标题" />
          </n-form-item>

          <n-form-item label="封面">

            <n-input
              v-model:value="modalForm.videoCover"
              placeholder="或输入封面地址"
            />
            <n-upload
              v-model:value="modalForm.videoCover"
              action="/api/file/upload"
              @finish="handleCoverFinish"
              :max="1"
              :show-download-button="true"
            >
              <n-button>上传封面</n-button>

            </n-upload>

          </n-form-item>
          <n-form-item label="视频">
            <n-input  v-model:value="modalForm.videoUrl" placeholder="或输入视频地址" />
<!--            <n-upload-->
<!--                      v-model:value="modalForm.videoUrl"-->
<!--                      action="/api/file/upload"-->
<!--                      @finish="handleVideoFinish"-->
<!--                      :max="1"-->
<!--                      :show-download-button="true"-->
<!--            >-->
<!--              <n-button>上传视频</n-button>-->
<!--            </n-upload>-->
          </n-form-item>

          <n-form-item label="视频状态">
            <n-space>
              <n-switch v-model:value="modalForm.status" :checked-value="1" :unchecked-value="2" size="large">
                <template #checked>
                  上架
                </template>
                <template #unchecked>
                  下架
                </template>
              </n-switch>
            </n-space>
          </n-form-item>


          <n-divider dashed @click="toggleCollapse" style="cursor: pointer;">
            {{ isCollapsed ? '展开更多设置' : '收起更多设置' }}
          </n-divider>
          <n-collapse :expanded-names="isCollapsed ? [] : ['settings']" class="my-collapse">

            <n-collapse-item name="settings">


              <n-form-item label="语言">
                <n-select
                  v-model:value="modalForm.language"
                  :options="language"
                  label-field="label"
                  value-field="value"
                  clearable
                  filterable
                />
              </n-form-item>
              <n-form-item label="兼容品牌">
                <n-select v-model:value="modalForm.brandTypeIds" multiple :options="appIdsOptions" />
              </n-form-item>
              <n-form-item label="方案商">
                <n-select v-model:value="modalForm.providerTypeIds" multiple :options="appIdsOptions" />
              </n-form-item>
              <n-form-item label="设备ID">
                <n-select v-model:value="modalForm.deviceIds" multiple :options="appIdsOptions" />
              </n-form-item>
              <n-form-item label="手机型号">
                <n-select v-model:value="modalForm.phoneModel" multiple :options="appIdsOptions" />
              </n-form-item>
              <n-form-item label="视频分类">
                <n-input v-model:value="modalForm.videoType" />
              </n-form-item>

            </n-collapse-item>
          </n-collapse>


        </n-form>

      </div>

    </MeModal>

  </CommonPage>
</template>


<script setup>
import { h, ref, onMounted } from 'vue'
import { NButton, NImage } from 'naive-ui'
import { MeCrud, MeModal } from '@/components'
import { useCrud } from '@/composables'
import { CommonPage } from '@/components/index.js'
import api from './api'
import { formatDateTime } from '@/utils/index.js'


const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})


onMounted(() => {
  $table.value?.handleSearch()
})


const handleCoverFinish = ({file, event}) => {
  console.log(event)
  const response = event?.target?.response;
  $message.success('文件上传成功')

  try {
    const parsedResponse = JSON.parse(response)
    if (parsedResponse.code === 200) {
        modalForm.value.videoCover = parsedResponse.data.fileUrl;
    } else {
      $message.error('上传失败')
    }
  } catch (error) {
    console.error('Failed to parse response', error)
    $message.error('上传失败')
  }

  return file
}

const handleVideoFinish = ({file, event}) => {
  console.log(event)
  const response = event?.target?.response;
  $message.success('文件上传成功')

  try {
    const parsedResponse = JSON.parse(response)
    if (parsedResponse.code === 200) {
      modalForm.value.videoUrl = parsedResponse.data.fileUrl;
    } else {
      $message.error('上传失败')
    }
  } catch (error) {
    console.error('Failed to parse response', error)
    $message.error('上传失败')
  }

  return file
}


const isCollapsed = ref(true)
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const videoStatus = ref([])
Promise.all([
  api.getAllDicData().then(({ data = [] }) => {
    if (Array.isArray(data)) {
      videoStatus.value = data
        .filter(item => item.type === 'video_manage_status_value')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value)
        }))
    } else {
      videoStatus.value = []
    }
  })
])


const domain_url = 'http://localhost:9999'
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
    title: '视频标题',
    key: 'videoTitle',
    align: 'center',
    width: 200,
    ellipsis: { tooltip: true }

  },
  {
    title: '封面',
    key: 'videoCover',
    align: 'center',
    width: 200,
    ellipsis: { tooltip: true },
    render(row){
      return h(NImage,
        {
          src: domain_url + row.videoCover,
          fit: 'cover',
          style: { width: '100%', height: 'auto' },
          lazy: true
        }
        )

    }
  },
  {
    title: '视频',
    key: 'videoUrl',
    align: 'center',
    width: 200, // 增加宽度以适应视频显示
    ellipsis: { tooltip: true },
    render(row) {
      return h('iframe', {
        src: row.videoUrl,
        width: '100%',
        height: '150',
        frameborder: '0',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        referrerpolicy: 'strict-origin-when-cross-origin',
        allowfullscreen: true
      })
    }
  },
  {
    title: '视频状态',
    key: 'status',
    align: 'center',
    width: 200,
    ellipsis: { tooltip: true },
    render(row) {
      return h('span', formatType(row['status'], videoStatus.value))
    }
  },
  {
    title: '视频上传时间',
    key: 'createTime',
    align: 'center',
    width: 200,
    render(row) {
      return h('span', formatDateTime(row['createTime'] * 1000))
    }
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    width: 200,
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

const handlePreview = row => {
  const modal = ref(null);
  modal.value = {
    title: '视频预览',
    content: h('video', {
      src: domain_url + row.videoUrl,
      controls: true,
      style: { width: '100%', height: 'auto' }
    })
  };
  $message.info(modal.value);
};


const formatType = (id, type) => {
  const foundType = type.find(item => item.value === id)
  return foundType ? foundType.label : ''
}

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
  { label: 'he', value: 39 }
]


defineOptions({ name: 'video' })
const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleEdit,
  handleDelete
} = useCrud({
  name: 'video',
  initForm: { language: 2 },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch()
})

</script>

<style>
/* 隐藏 n-collapse 的箭头 */
.my-collapse .n-collapse-item-arrow {
  display: none !important; /* 使用 !important 确保覆盖 */
}

.n-upload-trigger + .n-upload-file-list {
  margin-top: 0;
}
.n-upload {
  width:17%;
}
</style>


