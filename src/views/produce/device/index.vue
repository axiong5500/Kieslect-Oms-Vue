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
      :handleButtonClick ="handleButtonClick"
      :tableMaxHeight="550"
    >
      <MeQueryItem>
        <n-button v-if='copyOne === 0' type="success" @click="handleCopyOne">复制条目</n-button>
        <n-button v-if='copyOne === 1' type="warning" @click="handleParseOne">黏贴条目</n-button>
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
          label="设备名（bluetoothName）"
          path="bluetoothName"
          :rule="{
            required: true,
            message: '请输入设备名',
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
          label="方案商（producers）"
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
            label="集成商（integrator）"
            path="integrator"

          >
            <n-select
              v-model:value="modalForm.integrator"
              :options="integratorOptions"
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
                    :custom-request="handleUploadDialPhoto"
                    :default-file-list="modalForm.dialPhoto ? [{ url: domain_url + modalForm.dialPhoto,status: 'finished' }] : []"
                    :max="1"
                    list-type="image-card"
                    :show-download-button="true"
          />

        </n-form-item>
<!--        <n-form-item label="表带图片（strapsPhoto）" path="strapsPhoto" >-->

<!--          <n-upload v-model:value="modalForm.strapsPhoto"-->
<!--                    :custom-request="handleUploadStrapsPhoto"-->
<!--                    :default-file-list="modalForm.strapsPhoto ? [{ url: domain_url + modalForm.strapsPhoto,status: 'finished' }] : []"-->
<!--                    :max="1"-->
<!--                    list-type="image-card"-->
<!--                    :show-download-button="true"-->
<!--          />-->
<!--        </n-form-item>-->


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

          <n-form-item
            label="模板标识（templateFlag）"
            path="templeFlag"
          >
            <n-space>
              <n-switch v-model:value="modalForm.templateFlag" />
            </n-space>
          </n-form-item>

        <!-- 折叠面板 Collapse default-expanded-names 非受控模式下展开的面板 name -->
        <n-collapse :default-expanded-names="defaultExpandedNames" >

          <!-- 复选框 Checkbox组 绑定选中的值到 modalForm.paramIdsArray -->
          <n-checkbox-group v-model:value="modalForm.paramIdsArray">

            <!--  循环生成折叠面板项 Collapse Item，根据 items 数组生成每一项 -->
            <n-collapse-item v-for="(item, index) in items" :key="index" :title="item.label" :name="item.label">
              <div>
                <!-- 网格布局，用于排列复选框 -->
                <n-grid :y-gap="8" :cols="2">

                  <!-- 循环生成网格项 Grid Item，根据 item.contents 数组生成每一项 -->
                  <n-gi v-for="(item2, index2) in item.contents" :key="index2">

                    <!-- 复选框 Checkbox，绑定 label 和 value -->
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



<script setup>
import { NButton, NRadio, NTag } from 'naive-ui'
import { formatDateTime, request } from '@/utils'
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import api from './api'
import { h } from 'vue'
import { CommonPage } from '@/components/index.js'
import { message } from 'ant-design-vue'
import { random } from 'lodash-es'


defineOptions({ name: 'deviceManage' })

const copyOne = ref(0);
const items = ref([]); // 定义 ref 类型的 items 数组
const otaUpgrade = ref([]);
const dialShape = ref([]);
const form = ref([]);
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const paramIds = ref([])
const paramItems = ref([])
const appIdsOptions = ref([])
const domain_url = "https://app.kieslect.top"

onMounted(() => {
  $table.value?.handleSearch()
})

const paramType = ref([])
const paramGroup = ref([])
const attributeType = ref([])
// 默认展开
const defaultExpandedNames = ref([])
const integratorOptions = ref([])
const deviceStatusOptions = ref([])

Promise.all([
  api.getAllDicData().then(({ data = [] }) => {
    if (Array.isArray(data)) {
      otaUpgrade.value = data
        .filter(item => item.type === 'device_manage_otaUpgrade_values')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value),
        }));
      dialShape.value = data
        .filter(item => item.type === 'device_manage_dialShape_values')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value),
        }));
      form.value = data
        .filter(item => item.type === 'device_manage_form_values')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value),
        }));
      appIdsOptions.value = data
        .filter(item => item.type === 'device_manage_appIdsOptions_values')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value),
        }));
      integratorOptions.value = data
        .filter(item => item.type === 'device_manage_integratorOptions_values')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value),
        }));
      deviceStatusOptions.value = data
        .filter(item => item.type === 'device_manage_deviceStatusOptions_values')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value),
        }));
    } else {
      otaUpgrade.value = [];
      dialShape.value = [];
      form.value = [];
      appIdsOptions.value = [];
      integratorOptions.value = [];
      deviceStatusOptions.value = [];
    }

  }),
])
// 等待 paramGroup 和 paramType 数组的数据获取完成后，再进行组合生成 items 数组
Promise.all([
  api.getAllParamType().then(({ data = [] }) => (paramType.value = data)),
  api.getAllAttribute().then(({ data = [] }) => (attributeType.value = data)),
]).then(() => {
  // 遍历 paramGroup 数组，生成 items 数组
  items.value = paramType.value
    .filter(type => type.label !== "文章管理")
    .map((type) => {
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
  defaultExpandedNames.value = paramType.value
    .filter(type => type.label !== "文章管理")
    .map(type => type.label);
});
const columns = [
  {
    width: 50,
    align: 'center',
    render(row) {
      return h(NRadio, {
        value: row.id, // 根据具体的需求，可以用 row.id 或其他唯一标识符
        checked: selectedRow.value?.id === row.id, // 判断是否选中
        onUpdateChecked: () => handleRadioChange(row) // 当选中时调用
      })
    }
  },
  {
    title: 'ID',
    key: 'id',
    align: 'center',
    width: 50,
    ellipsis: { tooltip: true }
  },
  { title: '设备名',
    align: 'center',
    key: 'bluetoothName',
    ellipsis: { tooltip: true }
  },
  {
    title: '方案商',
    key: 'form',
    align: 'center',
    ellipsis: { tooltip: true },
    render(row) {
      if (row.templateFlag) {
        return h(
          NTag,
          { type: 'error', round: true },
          { default: () => formatForm(row['form']) }
        )
      } else {
        return h('span', formatForm(row['form']))
      }
    }
  },
  {
    title: '设备ID',
    key: 'firmwareId',
    align: 'center',
    ellipsis: { tooltip: true }
  },
  {
    title: '表盘',
    key: 'dialPhoto',
    align: 'center',
    render(row) {
      return h('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' } },
        h('img', {
          src: `${domain_url}${row.dialPhoto}`,
          alt: 'Image',
          style: { maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' },
        })
      );
    }
  },
  {
    title: '集成商',
    key: 'integrator',
    align: 'center',
    width: 100,
    render(row) {
      return h(NTag, {
          bordered: false,
          type: 'info',
          size: 'medium',
          strong: true
        },
        {
          default: () => formatType(integratorOptions,row['integrator']),
        })
    }
  },
  {
    title: '状态',
    key: 'deviceStatus',
    align: 'center',
    width: 100,
    render(row) {
      const label = formatType(deviceStatusOptions, row['deviceStatus']); // 获取label
      const type = row['deviceStatus'] === 0 ? 'default' : row['deviceStatus'] === 1 ? 'success' : 'default';
      return h(NTag, {
          bordered: false,
          type: type,
          size: 'medium',
          strong: true
        },
        {
          default: () => label,
        })
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

      ]
    }
  }
]
function formatType(type,value) {
  const status = type.value.find(item => item.value === value)
  return status ? status.label : ''
}
function handleCopyOne(){
  if (selectedRow.value == null){
    copyOne.value = 0
    return message.error('请选择需要拷贝的数据行');
  }
  copyOne.value = 1
}
function handleParseOne(){
  // 检查有没有选中行数据
  if (selectedRow.value == null){
    copyOne.value = 0
    return message.error('请选择需要拷贝的数据行');
  }
  //弹框确认
  const d = $dialog.warning({
    content: '确定黏贴？',
    title: '提示',
    positiveText: '确定',
    negativeText: '取消',
    async onPositiveClick() {
      try {
        d.loading = true
        // 这里处理请求后端接口
        await api.insertRow(selectedRow.value)
        copyOne.value = 0
        selectedRow.value = null
        $message.success('黏贴成功')
        d.loading = false
        $table.value?.handleSearch()
      } catch (error) {
        d.loading = false
      }
    },
  })
}

const selectedRow = ref(null); // 存储选中行
function handleRadioChange(row) {
  selectedRow.value = row;
}

function formatForm(formId) {
  const foundItem = form.value.find(item => item.value === formId);
  return foundItem ? foundItem.label : '未知';
}

async function handleButtonClick(){
  console.log('复制JSON按钮被点击了');
  try {
    let result = await  request.get('https://app.kieslect.top/kieslect-device/device/getList')
    if (result) {
      const jsonData = JSON.stringify(result, null, 2);

      // navigator clipboard 需要https等安全上下文
      if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard 向剪贴板写文本
        navigator.clipboard.writeText(jsonData)
          .then(() => {
            message.success('JSON 数据已成功复制到剪贴板');
          })
          .catch((error) => {
            console.error('复制 JSON 数据失败:', error);
            message.error('复制 JSON 数据失败，请手动复制');
          });
      } else {
        // 创建text area
        let textArea = document.createElement("textarea");
        textArea.value = jsonData;
        // 使text area不在viewport，同时设置不可见
        textArea.style.position = "absolute";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
          // 执行复制命令并移除文本框
          message.success('JSON 数据已成功复制到剪贴板');
          document.execCommand('copy') ? res() : rej();
          textArea.remove();
        });
      }
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    message.error('获取数据失败，请稍后重试');
  }
}


async function handleUploadDialPhoto({ file,photoType}){
  console.log(photoType)
  if (!file || !file.type) {
    $message.error('请选择文件')
  }

  // 创建 FormData 对象，用于包装要上传的文件
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.uploadFile(file.file,5);

  console.log(response);


  // 处理上传成功后的逻辑
  const responseData = await response;
  if (responseData.code !== 200) {
    throw new Error('文件上传失败');
  }
  // 提取上传成功后的文件信息
  const { fileUrl } = responseData.data;

  console.log(fileUrl);

  modalForm.value.dialPhoto = fileUrl;

  $message.success('上传成功');
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
  initForm: {
    enable: true,
    deviceStatus : 0
  },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  doUpdateParam :api.updateParam,
  refresh: () => $table.value?.handleSearch()
})


</script>
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