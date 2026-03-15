<template>
  <div class="diagram-viewer">
    <div v-if="type === 'mermaid'" class="mermaid" v-html="content" />
    <div v-else-if="type === 'svg'" v-html="content" class="svg-diagram" />
    <div v-else class="diagram-placeholder">
      无法识别的图表类型: {{ type }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type: 'mermaid' | 'svg' | 'excalidraw' | 'vis-network'
  content: string
  title?: string
}>()

// 可以根据需要扩展处理逻辑
</script>

<style scoped>
.diagram-viewer {
  width: 100%;
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  padding: 1rem;
}

.svg-diagram {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.svg-diagram :deep(svg) {
  max-width: 100%;
  height: auto;
}

.diagram-placeholder {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

/* Mermaid 渲染适配 */
:deep(.mermaid) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.mermaid svg) {
  max-width: 100%;
  height: auto;
}

/* 暗色模式 */
:global(.dark) .diagram-viewer {
  background: var(--vp-c-bg-soft);
}
</style>
