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
    textSelectionBubbleMenu: {
      enable: false,
    },
    ai: {
      models: {
        bubblePanelEnable: false,
        menus:[
          {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"></path><path d="M4 18.9997H20V13.9997H22V19.9997C22 20.552 21.5523 20.9997 21 20.9997H3C2.44772 20.9997 2 20.552 2 19.9997V13.9997H4V18.9997ZM16.1716 6.9997L12.2218 3.04996L13.636 1.63574L20 7.9997L13.636 14.3637L12.2218 12.9495L16.1716 8.9997H5V6.9997H16.1716Z"></path></svg>`,
            name: "AI 续写",
            prompt: "请帮我继续扩展一些这段话的内容",
            text: "focusBefore",
            model:"auto",
          },

        ],
        custom: {
          url: "/aiChat/api/chat",
          wrapPayload: (message: string) => {
            return JSON.stringify({model: "llama2:latest", messages: [{role:"user", content:message}]})
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