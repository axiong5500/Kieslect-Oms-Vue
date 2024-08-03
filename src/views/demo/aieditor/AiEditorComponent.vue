<template>
  <div ref="divRef" style="height: 400px"/>
</template>

<script setup lang="ts">
import { AiEditor } from "aieditor";
import "aieditor/dist/style.css";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";
import { debounce } from 'lodash-es';

// 定义 props 和 emits
const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', content: string): void;
}>();

const divRef = ref<HTMLElement>();
let aiEditor: AiEditor | null = null;
let isUpdatingContent = false;
let isComposing = false;

// AiEditorOptions 类型定义
interface AiEditorOptions {
  element: string | Element;
  content?: string;
  placeholder?: string;
  ai: {
    models: {
      custom: {
        url: string;
        wrapPayload: (message: string) => string;
        parseMessage: (message: string) => { role: string; content: string; index: number; status: number };
        protocol: string;
      };
    };
  };
  onChange?: (editor: AiEditor) => void;
}

// 防抖函数
const debounceEmit = debounce((content: string) => {
  emit('update:modelValue', content);
}, 300);


onMounted(() => {
  const options: AiEditorOptions = {
    element: divRef.value as Element,
    placeholder: props.placeholder || "点击输入内容...",
    content: props.modelValue,
    ai: {
      models: {
        custom: {
          url: "/aiChat/api/chat",
          wrapPayload: (message: string) => {
            return JSON.stringify({ model: "qwen2:latest", messages: [{ role: "user", content: message }] });
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
    onChange: (editor: AiEditor) => {
      if (!isUpdatingContent && !isComposing) {
        const newContent = editor.getText(); // Assuming getText method exists to get the current content
        if (newContent !== props.modelValue) {
          debounceEmit(newContent);
        }
      }
    }
  };

  aiEditor = new AiEditor(options);



  // 监听输入法输入的开始和结束事件
  const editorElement = divRef.value as Element;
  editorElement.addEventListener('compositionstart', () => {
    isComposing = true;
  });
  editorElement.addEventListener('compositionend', () => {
    isComposing = false;
    if (aiEditor) {
      const newContent = aiEditor.getText();
      if (newContent !== props.modelValue) {
        debounceEmit(newContent);
      }
    }
  });
});

onUnmounted(() => {
  aiEditor && aiEditor.destroy();
});
</script>


