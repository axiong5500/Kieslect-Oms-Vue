<template>
  <div ref="divRef" style="height: 600px"/>
</template>

<script setup lang="ts">
import {AiEditor} from "aieditor";
import "aieditor/dist/style.css"
import {onMounted, onUnmounted, ref} from "vue";

const divRef = ref();
let aiEditor: AiEditor | null = null;

onMounted(() => {
  aiEditor = new AiEditor({
    element: divRef.value as Element,
    placeholder: "点击输入内容...",
    content: '',
    ai: {
      models: {
        // openai: {
        //   endpoint: "https://api.moonshot.cn",
        //   model: "moonshot-v1-8k",
        //   apiKey: "sk-swm9fXk3R7kCSevqe4tOBEkVzGF9w3heXsLu6C8vFSM03ePM"
        // },
        custom: {
          url: "http://localhost:11434/api/chat",
          wrapPayload: (message: string) => {
            return JSON.stringify({model: "llama2-chinese:latest", messages: [{role:"user", content:message}]})
          },
          parseMessage: (message: string) => {
            const parsed = JSON.parse(message);
            return {
              role: parsed.message.role,
              content: parsed.message.content,
              index: 0, // 你可以根据实际需要设置 index 的值
              status: parsed.done ? 2 : 1 // 根据 done 状态设置 status，假设 2 表示完成，1 表示进行中
            }
          },
          protocol: "sse"
        }
      }
    },
  })
})

onUnmounted(() => {
  aiEditor && aiEditor.destroy();
})
</script>