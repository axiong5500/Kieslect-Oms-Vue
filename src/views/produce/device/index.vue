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
        创建新配置
      </n-button>
    </template>


    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
      :show-custom-button=true
    >
      <MeQueryItem label="变量标题" :label-width="70">
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
      </MeQueryItem>


    </MeCrud>




    <MeModal ref="modalRef" width="800px"  >
      <div class="scroll-container" >
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="220"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <div  v-if="modalAction === 'edit' ||  modalAction === 'add'">
          <n-form-item
            label="内部Id（innerId）"
            path="id"

          >
            <n-input v-model:value="modalForm.id" disabled />
          </n-form-item>
        <n-form-item
          label="项目名称（projectName）"
          path="projectName"
          :rule="{
            required: true,
            message: '请输入项目名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.projectName" />
        </n-form-item>
        <n-form-item
          label="设备id（deviceId）"
          path="firmwareId"

        >
          <n-input  v-model:value="modalForm.firmwareId" />
        </n-form-item>
        <n-form-item
          label="蓝牙名称（bluetoothName）"
          path="bluetoothName"
          :rule="{
            required: true,
            message: '请输入蓝牙名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.bluetoothName" />
        </n-form-item>
          <n-form-item
            label="兼容App（appIds）"
            path="appIds"

          >

            <n-select v-model:value="modalForm.appIdsOptions" multiple :options="appIdsOptions" />
          </n-form-item>

        <n-form-item
          label="产商（producers）"
          path="form"

        >
          <n-select
            v-model:value="modalForm.form"
            :options="form"
            label-field="label"
            value-field="value"
            clearable
            filterable
          />

        </n-form-item>
        <n-form-item
          label="表盘形状（dialShape）"
          path="dialShape"

        >
          <n-select
            v-model:value="modalForm.dialShape"
            :options="dialShape"
            label-field="label"
            value-field="value"
            clearable
            filterable
          />
        </n-form-item>
          <n-form-item
            label="OTA升级（otaUpgrade）"
            path="otaUpgrade"
          >
            <n-select
              v-model:value="modalForm.btStatus"
              :options="otaUpgrade"
              label-field="label"
              value-field="value"
              clearable
              filterable
            />
          </n-form-item>
        <n-form-item
          label="宽度（width）"
          path="width"
          :rule="{
            required: true,
            message: '请输入宽度',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.width" />
        </n-form-item>
        <n-form-item
          label="高度（height）"
          path="height"
          :rule="{
            required: true,
            message: '请输入高度',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.height" />
        </n-form-item>

        <n-form-item label="表盘图片（dialPhoto）" path="dialPhoto" >

          <n-upload v-model:value="modalForm.dialPhoto"
                    :custom-request="handleUpload"
                    :default-file-list="modalForm.dialPhoto ? [{ url: domain_url + modalForm.dialPhoto,status: 'finished' }] : []"
                    max = 1
                    list-type="image-card"
                    :show-download-button="true"
          />

        </n-form-item>
        <n-form-item label="表带图片（strapsPhoto）" path="strapsPhoto" >

          <n-upload v-model:value="modalForm.strapsPhoto"
                    :custom-request="handleUpload"
                    :default-file-list="modalForm.strapsPhoto ? [{ url: domain_url + modalForm.strapsPhoto,status: 'finished' }] : []"
                    max = 1
                    list-type="image-card"
                    :show-download-button="true"
          />
        </n-form-item>


        <n-form-item
          label="产品描述（productDesc）"
          path="productDesc"
          :rule="{
            required: true,
            message: '请输入产品描述',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.productDesc" />
        </n-form-item>


        <n-collapse :default-expanded-names="defaultExpandedNames">

          <n-checkbox-group v-model:value="modalForm.paramIdsArray">

            <n-collapse-item v-for="(item, index) in items" :key="index" :title="item.label" :name="item.label">
              <div>
                <n-grid :y-gap="8" :cols="2">
                  <n-gi v-for="(item2, index2) in item.contents" :key="index2">

                    <n-checkbox :label="item2.text" :value="item2.id"/>
                  </n-gi>
                </n-grid>
              </div>
            </n-collapse-item>

          </n-checkbox-group>

        </n-collapse>
        </div>
        <div v-if="modalAction === 'editParam'">

          <n-collapse :default-expanded-names="defaultExpandedNames">

            <n-collapse-item v-for="(item, index) in modalForm.paramCollectionObject" :key="index" :title="item.label" :name="item.label" >
              <div>
                <n-grid :y-gap="8" :cols="1">
                  <n-gi v-for="(item2, index2) in item.contents" :key="index2">
                    <n-form-item :label="item2.text + '('+ item2.paramName + ')'"  label-width="200" >
                      <n-input v-model:value="item2.value" />
                    </n-form-item>
                  </n-gi>
                </n-grid>
              </div>
            </n-collapse-item>

          </n-collapse>
      </div>
      </n-form>


      </div>


    </MeModal>



  </CommonPage>
</template>

<style scoped>

.scroll-container {
  height: 600px; /* 固定高度 */
  overflow-y: auto; /* 垂直滚动条 */
  margin-right: -22px; /* 调整右侧间距，为滚动条留出空间 */
  padding-right: 22px;
}
/* 自定义滚动条样式 */
.scroll-container::-webkit-scrollbar {
  width: 6px; /* 设置滚动条宽度 */
  height: 6px; /* 设置滚动条高度 */
}

.scroll-container::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 3px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

/* 调整滚动条位置到靠右 */
.scroll-container::-webkit-scrollbar {
  background: #bfbfbf;
}
</style>

<script setup>
import { NButton } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import { h } from 'vue'
import { CommonPage } from '@/components/index.js'


defineOptions({ name: 'deviceManage' })


const items = ref([]); // 定义 ref 类型的 items 数组
const otaUpgrade = [
  { label: '爱都（数值：0）', value: 0 },
  { label: '瑞昱RTK（数值：1）', value: 1 },
]
const dialShape = [
  { label: '圆形（数值：0）', value: 0 },
  { label: '方形（数值：1）', value: 1 },
]
const form = [
  { label: '爱都（数值：1）', value: 1 },
  { label: '优创亿（数值：2）', value: 2 },
]
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const paramIds = ref([])
const paramItems = ref([])
const appIdsOptions = ref([
  { label: '圆形（数值：0）', value: 0 },
  { label: '方形（数值：1）', value: 1 },
])
const domain_url = "http://192.168.0.106:9999"

onMounted(() => {
  $table.value?.handleSearch()
})

const paramType = ref([])
const paramGroup = ref([])
const attributeType = ref([])
// 默认展开
const defaultExpandedNames = ref([])


// 等待 paramGroup 和 paramType 数组的数据获取完成后，再进行组合生成 items 数组
Promise.all([
  api.getAllParamType().then(({ data = [] }) => (paramType.value = data)),
  api.getAllAttribute().then(({ data = [] }) => (attributeType.value = data)),
]).then(() => {
  // 遍历 paramGroup 数组，生成 items 数组
  items.value = paramType.value.map((type) => {
    // 获取当前 paramGroup 对应的 label
    const label = type.label;


    // 根据 param 的 groupId 筛选出对应的 attributeType
    const groupAttributes = attributeType.value.filter((attr) => attr.paramType == type.value);
    // 将筛选出的 attributeType 转换成 contents 数组的格式
    const contents = groupAttributes.map((attr) => ({
      id: attr.id,
      text: attr.paramTitle +" （"+ attr.paramName +"）", // 假设 attributeType 中有 text 字段作为内容的文本
      isChecked: true
    }));

    // 返回组合好的折叠项对象
    return {
      label: label,
      contents: contents,
      selected: [] // 初始为空数组
    };
  });
  defaultExpandedNames.value = paramType.value.map((type) => {
    return type.label;
  })
});
const columns = [
  {
    title: 'ID',
    key: 'id',
    align: 'center',
    width: 80,
    ellipsis: { tooltip: true }
  },
  { title: '蓝牙名称',align: 'center', key: 'bluetoothName', ellipsis: { tooltip: true } },
  {
    title: '产商',
    key: 'form',
    align: 'center',
    ellipsis: { tooltip: true },
    render(row) {
      return h('span', formateForm(row['form']))
    }
  },
  {
    title: '项目名称',
    key: 'projectName',
    align: 'center'

  },
  { title: '设备id', key: 'firmwareId', align: 'center', ellipsis: { tooltip: true } },

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
    fixed: 'center',
    width: 290,
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            onClick: () => handleEditParam(row)
          },
          {
            default: () => '配置表',
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


function formateForm(formid) {
  const foundItem = form.find(item => item.value === formid);
  return foundItem ? foundItem.label : '未知';
}


async function handleUpload({ file, onFinish }) {
  console.log(file.file)
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

  $message.success('上传成功');
  onFinish(); // 调用上传完成的回调函数
}



const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleOpen,
  handleAdd,
  handleDelete,
  handleEdit,
  handleEditParam,
  handleSave
} = useCrud({
  name: '属性',
  initForm: { enable: true },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  doUpdateParam :api.updateParam,
  refresh: () => $table.value?.handleSearch()
})


</script>
