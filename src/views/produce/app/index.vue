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
          <div v-if="modalAction === 'edit' ||  modalAction === 'add'">
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
                        :max="1"
                        list-type="image-card"
                        :show-download-button="true"
              />
            </n-form-item>



            <!-- 新增时 下载地址  -->
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

            <!-- 新增时 App描述  -->
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







            <!-- 编辑时 下载地址  -->
            <template v-for="(item, index) in modalForm.appUrls" :key="index" v-if="modalAction === 'edit'">
              <n-form-item :label="formatType(item.appChannel,appChannelDic)">
                <n-input v-model:value="item.appDownloadLink" />
              </n-form-item>
            </template>

            <!-- 编辑时 App描述  -->
            <template v-for="(item, index) in modalForm.appDescriptions" :key="index" v-if="modalAction === 'edit'">
              <n-form-item :label="formatType(item.languageVersion,appDescriptionDic)">
                <n-input v-model:value="item.appProductDescription" />
              </n-form-item>
            </template>


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

    <n-modal v-model:show="showQrCodeModal">
      <n-qr-code :value="largeQrCodeUrl" :icon-src="largeQrCodeIconSrc" :icon-size="120"  :size="400"  alt="Large QR Code" style="padding: 0;"/>
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
import { router } from '@/router/index.js'

defineOptions({ name: 'AppManage' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

const paramType = ref([])
const attributeType = ref([])
// 默认展开的面板
const defaultExpandedNames= ref([])
// 已选中的ID，需保存入库
const paramIdsArray= ref([])
//加载面板所有选择项
const items= ref([])


// 等待 paramGroup 和 paramType 数组的数据获取完成后，再进行组合生成 items 数组
Promise.all([
  api.getAllParamType().then(({ data = [] }) => (paramType.value = data)),
  api.getAllAttribute().then(({ data = [] }) => (attributeType.value = data)),
]).then(() => {
  // 遍历 paramGroup 数组，生成 items 数组
  items.value = paramType.value.map((type) => {
    // 获取当前 paramGroup 对应的 label
    const label = type.label;
    // 判断label是否包含文章字符串

    // 只有当 label 为 "文章管理" 时才继续执行逻辑
    if (label === "文章管理") {
      // 根据 paramType 的 value 筛选出对应的 attributeType
      const groupAttributes = attributeType.value.filter((attr) => attr.paramType == type.value);

      // 将筛选出的 attributeType 转换成 contents 数组的格式
      const contents = groupAttributes.map((attr) => ({
        id: attr.id,
        text: `${attr.paramTitle} （${attr.paramName}）`, // 假设 attributeType 中有 paramTitle 和 paramName 字段
        isChecked: true
      }));

      // 返回组合好的折叠项对象
      return {
        label: label,
        contents: contents,
        selected: [] // 初始为空数组
      };
    } else {
      return null;
    }
  }).filter(item => item !== null); // 过滤掉非 "文章管理" 的项

  // 生成默认展开的折叠项名称数组
  defaultExpandedNames.value = paramType.value
    .filter(type => type.label === "文章管理")
    .map(type => type.label);
});

onMounted(() => {
  $table.value?.handleSearch()
})

const domain_url = 'http://localhost:9999'
const showQrCodeModal = ref(false) // 定义模态框显示状态
const largeQrCodeUrl = ref('') // 定义放大后的二维码地址
const largeQrCodeIconSrc = ref('') // 放大后的二维码图标
const appChannelDic = ref([]) // app下载路径
const appDescriptionDic = ref([])
// const qrCodeValue = 'https://admin.kieslect.top/public/produce/app/qrcode'
const qrCodeValue = 'http://192.168.0.106:3200/#/public/produce/app/qrcode'

Promise.all([
  api.getAllDicData().then(({ data = [] }) => {
    if (Array.isArray(data)) {
      appChannelDic.value = data
        .filter(item => item.type === 'app_manage_title')
        .map(item => ({
        label: `${item.name}`,
        value: Number(item.value),
      }));
      appDescriptionDic.value = data
        .filter(item => item.type === 'app_manage_desc_title')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value),
        }));
    } else {
      appChannelDic.value = [];
      appDescriptionDic.value = [];
    }

  }),
]).then(() => {
  console.log(11,appChannelDic.value);
  console.log(22,appDescriptionDic.value);
});



const formatType = (id, type) => {
  const foundType = type.find(item => item.value === id);
  return foundType ? foundType.label : '';
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

  modalForm.value.appLogo = fileUrl;

  $message.success('上传成功');
  onFinish({ url: fileUrl }); // 调用上传完成的回调函数并传递文件 URL
}


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
        value: qrCodeValue,
        iconSrc: domain_url + appLogo,
        iconSize: 20,
        size: 50,
        onClick: () => handleQrCodeClick(qrCodeValue,domain_url + appLogo),
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
    width: 450,
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 10px;',
            onClick: () =>
              router.push({ path: `/produce/app/apk/${row.id}`, query: { title: row.appName,} }),
          },
          {
            default: () => 'App包管理',
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-10' })
          }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 10px;',
            onClick: () => handleEditParam(row)
          },
          {
            default: () => '配置表',
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-10' })
          }
        ),
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
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-10' })
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
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-10' })
          }
        )
      ]
    }
  }
]

function handleQrCodeClick(qrCodeUrl, qrCodeIconSrc) {
  // 在这里打开一个模态框或者弹出层来展示放大后的二维码
  showQrCodeModal.value = true // 显示模态框
  largeQrCodeUrl.value = qrCodeUrl // 设置放大后的二维码内容
  largeQrCodeIconSrc.value = qrCodeIconSrc; // 设置放大后的二维码图标
}

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleEdit,
  handleEditParam,
  handleDelete,
} = useCrud({
  name: 'App',
  initForm: {
    enable: true,
  },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  doUpdateParam :api.updateParam,
  refresh: () => $table.value?.handleSearch()
})

</script>
