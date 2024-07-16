<template>
  <div ref="divRef" style="height: 600px"/>
</template>

<script setup lang="ts">
import { AiEditor } from "aieditor";
import "aieditor/dist/style.css";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";

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

onMounted(() => {
  const options: AiEditorOptions = {
    element: divRef.value as Element,
    placeholder: props.placeholder || "点击输入内容...",
    content: props.modelValue,
    ai: {
      models: {
        custom: {
          url: "http://localhost:11434/api/chat",
          wrapPayload: (message: string) => {
            return JSON.stringify({ model: "llama2-chinese:latest", messages: [{ role: "user", content: message }] });
          },
          parseMessage: (message: string) => {
            const parsed = JSON.parse(message);
            return {
              role: parsed.message.role,
              content: parsed.message.content,
              index: 0,
              status: parsed.done ? 2 : 1
            };
          },
          protocol: "sse"
        }
      }
    },
    onChange: (editor: AiEditor) => {
      const newContent = editor.getText(); // Assuming getContent method exists to get the current content
      emit('update:modelValue', newContent);
    }
  };

  aiEditor = new AiEditor(options);

  watch(() => props.modelValue, (newContent) => {
    if (aiEditor) {
      aiEditor.setContent(newContent);
    }
  });
});

onUnmounted(() => {
  aiEditor && aiEditor.destroy();
});
</script>
