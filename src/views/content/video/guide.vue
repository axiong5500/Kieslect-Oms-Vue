<template>
  <div class="video-list-container">
    <n-space vertical>
      <n-space wrap class="video-list">
        <n-card
          v-for="(video, index) in videos"
          :key="index"
          class="video-card"
          :bordered="false"
          @click="openModal(video.url)"
        >
          <img
            :src="video.thumbnail"
            class="video-thumbnail"
            :alt="video.title"

          />
          <n-space vertical class="video-info">
            <h3 @click="openModal(video.url)">{{ video.title }}</h3>
            <p>{{ video.description }}</p>
          </n-space>
        </n-card>
      </n-space>
    </n-space>

    <!-- Modal for video playback -->
    <n-modal v-model:show="modalVisible" title="播放视频" :maskClosable="true" >
      <div class="modal-content-wrapper">
        <div class="modal-content">
          <iframe :src="currentVideoUrl" class="video-iframe" allowfullscreen></iframe>
        </div>
        <div class="modal-footer">
          <n-button @click="closeModal" >关闭</n-button>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { NCard, NSpace, NModal } from 'naive-ui'
const domain_url = 'http://192.168.0.106:9999'
const videos = ref([
  {
    title: '操作指引视频 1',
    description: '这是第一个操作指引视频。',
    thumbnail: 'https://ke-image.ljcdn.com/110000-inspection/pc1_5sVBArkes_1.jpg!m_fill,w_280,h_210,f_jpg?from=ke.com',
    url: 'https://www.youtube.com/embed/LGybR_CWVTU'
  },
  {
    title: '操作指引视频 2',
    description: '这是第二个操作指引视频。这是第二个操作指引视频。这是第二个操作指引视频。这是第二个操作指引视频。这是第二个操作指引视频。',
    thumbnail: domain_url + '/kieslect-file/file/v2/download/backgroundmanage/9999/b98bda424610476e889044c91463db59',
    url: 'https://www.youtube.com/embed/LGybR_CWVTU'
  },
  {
    title: '操作指引视频 1',
    description: '这是第一个操作指引视频。',
    thumbnail: domain_url + '/kieslect-file/file/v2/download/backgroundmanage/9999/b98bda424610476e889044c91463db59',
    url: 'https://www.youtube.com/embed/LGybR_CWVTU'
  },
  {
    title: '操作指引视频 2',
    description: '这是第二个操作指引视频。',
    thumbnail: domain_url + '/kieslect-file/file/v2/download/backgroundmanage/9999/b98bda424610476e889044c91463db59',
    url: 'https://www.youtube.com/embed/LGybR_CWVTU'
  },
  {
    title: '操作指引视频 1',
    description: '这是第一个操作指引视频。',
    thumbnail: 'https://ke-image.ljcdn.com/110000-inspection/pc1_5sVBArkes_1.jpg!m_fill,w_280,h_210,f_jpg?from=ke.com',
    url: 'https://www.youtube.com/embed/LGybR_CWVTU'
  },
  {
    title: '操作指引视频 2',
    description: '这是第二个操作指引视频。',
    thumbnail: domain_url + '/kieslect-file/file/v2/download/backgroundmanage/9999/b98bda424610476e889044c91463db59',
    url: 'https://www.youtube.com/embed/LGybR_CWVTU'
  },
  {
    title: '操作指引视频 1',
    description: '这是第一个操作指引视频。',
    thumbnail: domain_url + '/kieslect-file/file/v2/download/backgroundmanage/9999/b98bda424610476e889044c91463db59',
    url: 'https://www.youtube.com/embed/LGybR_CWVTU'
  },
  {
    title: '操作指引视频 2',
    description: '这是第二个操作指引视频。',
    thumbnail: domain_url + '/kieslect-file/file/v2/download/backgroundmanage/9999/b98bda424610476e889044c91463db59',
    url: 'https://www.youtube.com/embed/LGybR_CWVTU'
  },
  {
    title: '操作指引视频 1',
    description: '这是第一个操作指引视频。',
    thumbnail: 'https://ke-image.ljcdn.com/110000-inspection/pc1_5sVBArkes_1.jpg!m_fill,w_280,h_210,f_jpg?from=ke.com',
    url: 'https://www.youtube.com/embed/LGybR_CWVTU'
  },
  {
    title: '操作指引视频 2',
    description: '这是第二个操作指引视频。',
    thumbnail: domain_url + '/kieslect-file/file/v2/download/backgroundmanage/9999/b98bda424610476e889044c91463db59',
    url: 'https://www.youtube.com/embed/LGybR_CWVTU'
  },
  {
    title: '操作指引视频 1',
    description: '这是第一个操作指引视频。',
    thumbnail: domain_url + '/kieslect-file/file/v2/download/backgroundmanage/9999/b98bda424610476e889044c91463db59',
    url: 'https://www.youtube.com/embed/LGybR_CWVTU'
  },
  {
    title: '操作指引视频 2',
    description: '这是第二个操作指引视频。',
    thumbnail: domain_url + '/kieslect-file/file/v2/download/backgroundmanage/9999/b98bda424610476e889044c91463db59',
    url: 'https://www.youtube.com/embed/LGybR_CWVTU'
  }
])

const modalVisible = ref(false)
const currentVideoUrl = ref('')

function openModal(url) {
  currentVideoUrl.value = url
  modalVisible.value = true
}
function closeModal() {
  modalVisible.value = false
  currentVideoUrl.value = ''
}
</script>

<style scoped>
.video-list-container {
  /* 预留底部空间 */
  padding: 16px 16px 80px;
  background-color: #f5f5f5;
  max-height: 100vh; /* 确保容器高度不超出视口 */
  overflow-y: auto; /* 允许垂直滚动 */
}

.video-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center !important;
  gap: 16px !important;
}

.video-card {
  background-color: #fff; /* 卡片背景色 */
  overflow: hidden; /* 隐藏溢出内容 */
  border-radius: 8px; /* 圆角边框 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 卡片阴影 */
  cursor: pointer; /* 鼠标悬停时显示指针 */
  height: 350px; /* 固定卡片高度 */
  width: 300px; /* 固定卡片高度 */
}

.video-thumbnail {
  width: 100%; /* 使缩略图宽度适应其父容器 */
  min-height: 200px; /* 固定高度 */
  object-fit: cover; /* 保持缩略图的比例，并覆盖其容器 */
}
.video-info {
  padding: 6px; /* 内边距 */
  text-align: center; /* 居中对齐 */
  flex: 1; /* 使内容区域占据剩余空间 */
  display: flex; /* 使用 flexbox 布局 */
  flex-direction: column; /* 垂直布局 */
  justify-content: center; /* 居中对齐内容 */
}

h3 {
  margin: 6px 0;
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 显示省略号 */
  white-space: nowrap; /* 不换行 */
}

p {
  margin: 0 0 6px;
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 显示省略号 */
  white-space: nowrap; /* 不换行 */
}

.video-iframe {
  width: 100%;
  height: 60vh;
}

.custom-modal .n-modal__body {
  display: flex;
  flex-direction: column;
}

.modal-content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.modal-content {
  flex: 1; /* 让视频播放器占据主要空间 */
}

.modal-footer {
  display: flex;
  justify-content: center; /* 居中对齐 */
}
.n-button {
  --n-color: #fff
}

</style>
