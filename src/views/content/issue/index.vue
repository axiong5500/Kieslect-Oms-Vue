<template>

  <CommonPage>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
      :isVirtualScroll="true"
      :tableMaxHeight="590"
    >
      <MeQueryItem label="手机" :label-width="70">
        <n-select v-model:value="queryItems.appSystem" clearable :options="appSystems" />
      </MeQueryItem>
    </MeCrud>

  </CommonPage>
</template>


<script setup>
import { h, ref, onMounted } from 'vue'
import { NButton, NImage, NPopover, NSpin } from 'naive-ui'
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import { CommonPage } from '@/components/index.js'
import api from './api'
import { formatDateTime } from '@/utils/index.js'
import zipImage from '@/assets/images/zip.webp'


const domain_url = 'https://app.kieslect.top'
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})


onMounted(() => {
  $table.value?.handleSearch()
})


const translateDescription = async (row) => {
  // 检查是否已经有翻译结果
  if (row.translatedDescription) {
    return
  }
  try {
    // 累积翻译内容
    let accumulatedTranslatedDescription = '';
    const updateProgress = (translated) => {
      accumulatedTranslatedDescription += translated;
      row.translatedDescription = accumulatedTranslatedDescription;
    };
    // 调用翻译函数
    await aiTranslateDescription(row.description,updateProgress) // 更新整个翻译内容
    row.showTranslateButton = false // 隐藏翻译按钮
  } catch (error) {
    console.error('Translation Error:', error)
  }
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
    title: '问题描述',
    key: 'description',
    align: 'center',
    ellipsis: { tooltip: true },
    render(row) {

      return h('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          maxWidth: '300px',
          padding: '0 10px' // 添加内边距避免按钮覆盖文本
        }
      }, [
        // 描述文本和按钮的容器
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'flex-start',
            flexWrap: 'wrap', // 允许换行
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            width: '100%'
          }
        }, [
          h(
            'span',
            {
              style: {
                display: 'inline-flex',
                alignItems: 'center',
                marginRight: '5px' // 确保按钮与描述文本之间有间距
              }
            },
            [
              h('span', { style: { wordBreak: 'break-word', whiteSpace: 'normal' } }, row.description), // 描述文本
              (row.showTranslateButton !== false ? h(
                NButton,
                {
                  size: 'tiny',
                  type: 'default',
                  style: {
                    background: 'linear-gradient(45deg, #D2BFFF, #BFECFF)',
                    color: 'white',
                    border: 'none',
                    boxShadow: 'none',
                    fontWeight: 'bold',
                    marginLeft: '5px', // 按钮与描述文本之间的间距
                    lineHeight: 'normal', // 确保按钮在文本的同一行
                    padding: '0 5px', // 按钮内边距，确保按钮不太大
                    whiteSpace: 'nowrap', // 确保按钮不换行
                    '--n-ripple-color': 'none', // 去掉水波纹颜色
                    '--n-text-color-hover': 'none', // 去掉悬停文本颜色
                    '--n-text-color-pressed': 'none', // 去掉点击文本颜色
                    '--n-text-color-focus': 'none', // 去掉聚焦文本颜色
                    '--n-border-hover': 'transparent', // 去掉悬停边框颜色
                    '--n-border-pressed': 'transparent', // 去掉点击边框颜色
                    '--n-border-focus': 'transparent' // 去掉聚焦边框颜色
                  },
                  onClick: () => {
                    translateDescription(row)
                  }
                },
                { default: () => 'AI 翻译' }
              ) : null)
            ]
          )
        ]),
        // 翻译结果
        h('div', {
          style: {
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            maxWidth: '300px',
            marginTop: '5px',
            fontStyle: 'italic',
            color: 'gray'
          }
        }, row.translatedDescription)
      ])
    }
  },
  {
    title: '图片展示',
    key: 'images',
    align: 'center',
    render(row) {
      const imageUrls = row.imagePaths ? row.imagePaths.split(',') : []
      return h('div',
        {
          style: { display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-start' }
        },
        imageUrls.map(url =>
          h(NImage, {
            src: `${domain_url}${url}`,
            alt: 'Image',
            style: { maxWidth: '60px', height: '100px', objectFit: 'cover' },
            lazy: true
          })
        )
      );
    }
  },
  {
    title: '日志包',
    key: 'shareLog',
    align: 'center',
    width: 100,
    render(row) {
      if (row.shareLog) {
        return h('div', {
          style: { position: 'relative', display: 'inline-block' }
        }, [
          h('img', {
            src: zipImage,
            alt: '日志',
            style: {
              width: '50px',
              height: '50px',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            },
            onMouseover(event) {
              event.target.style.transform = 'scale(1.1)';
            },
            onMouseout(event) {
              event.target.style.transform = 'scale(1)';
            },
            onClick() {
              const link = document.createElement('a');
              link.href = `${domain_url}${row.shareLog}`;
              link.download = `${row.issueNo}.zip`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }),
          h('div', {
            style: {
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              zIndex: '1',
              whiteSpace: 'nowrap',
              visibility: 'hidden', // 默认隐藏
              opacity: '0',
              transition: 'opacity 0.3s ease'
            },
            onMouseover(event) {
              event.target.style.visibility = 'visible';
              event.target.style.opacity = '1';
            },
            onMouseout(event) {
              event.target.style.visibility = 'hidden';
              event.target.style.opacity = '0';
            }
          }, '下载')
        ]);
      }
    }

  },
  {
    title: '手机',
    key: 'appSystem',
    align: 'center',
    width: 100,
    render(row) {
      return h('span', formatType(appSystems,row['appSystem']))
    }
  },
  {
    title: '手机型号',
    key: 'appType',
    align: 'center',
    width: 100,
  },
  {
    title: 'App版本',
    key: 'appVersion',
    align: 'center',
    width: 100,
  },
  {
    title: '系统版本',
    key: 'systemVersion',
    align: 'center',
    width: 100,
  },
  {
    title: '创建时间',
    key: 'createTime',
    align: 'center',
    width: 200,
    render(row) {
      return h('span', formatDateTime(row['createTime'] * 1000))
    }

  },
  {
    title: '问题状态',
    key: 'issueStatus',
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
            onClick: () => handleIssueStatus(row)
          }, formatType(issueStatus,row['issueStatus'])
        )

      ]
    }
  }
]

const issueStatus = ref([])
const appSystems = ref([])
Promise.all([
  api.getAllDicData().then(({ data = [] }) => {
    if (Array.isArray(data)) {
      issueStatus.value = data
        .filter(item => item.type === 'issue_issueStatus_values')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value)
        }))
      appSystems.value = data
        .filter(item => item.type === 'issue_manage_appSystem_value')
        .map(item => ({
          label: `${item.name}`,
          value: Number(item.value)
        }))
    } else {
      issueStatus.value = []
      appSystems.value = []
    }
  })
])

const aiTranslateText = '你是一个专业的翻译助手，只负责将文本从一种语言翻译成另一种语言。请仅翻译以下文本，不要添加任何解释或额外信息。1. 目标语言：中文2. 翻译文本： '

async function aiTranslateDescription(description, updateProgress) {
  const requestBody = {
    model: 'llama2:latest',
    messages: [{ role: 'user', content: aiTranslateText + description }]
  };

  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode the incoming chunk and accumulate content
      accumulatedContent = decoder.decode(value, { stream: true });
      console.log('Accumulated Content:', accumulatedContent)
      // 解析 JSON 并获取 content 值
      let parsedContent;
      try {
        parsedContent = JSON.parse(accumulatedContent);
        if (parsedContent.message && parsedContent.message.content) {
          const contentValue = parsedContent.message.content;
          updateProgress(contentValue);
        }
      } catch (error) {
        console.error('JSON Parsing Error:', error);
      }
    }

  } catch (error) {
    console.error('Translation Error:', error);
    throw error;
  }
}




function formatType(type,value) {
  const status = type.value.find(item => item.value === value)
  return status ? status.label : '未知'
}

async function handleIssueStatus(row) {
  if (!row.id && row.id !== 0) return
  const d = $dialog.warning({
    content: '是否已对问题ID：【' + row.issueNo + '】处理完成？',
    title: '提示',
    positiveText: '确定',
    negativeText: '取消',
    async onPositiveClick() {
      try {
        // 修改 issueStatus
        row.issueStatus = 2

        d.loading = true
        await api.update(row)
        $message.success('已成功处理')
        d.loading = false
        $table.value?.handleSearch()
      } catch (error) {
        d.loading = false
      }
    }
  })
}


defineOptions({ name: 'issue' })
const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleEdit,
  handleDelete
} = useCrud({
  name: 'issue',
  initForm: {},
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch()
})

</script>



