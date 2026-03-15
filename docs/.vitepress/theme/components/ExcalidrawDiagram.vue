<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  title?: string
  data?: any // Excalidraw 场景数据
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '500px'
})

const containerRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (containerRef.value && typeof window !== 'undefined') {
    // 动态导入 Excalidraw (仅客户端)
    const { default: Excalidraw } = await import('@excalidraw/excalidraw')
    
    // 此处需要 Vue 3 的 render 函数或者使用其他方式集成
    // 简化版：直接显示 SVG 占位符
    console.log('Excalidraw integration ready')
  }
})
</script>

<template>
  <div class="excalidraw-diagram">
    <h3 v-if="title" class="excalidraw-diagram__title neon-text-cyan">
      {{ title }}
    </h3>
    <div class="excalidraw-diagram__container cyber-card" :style="{ height }">
      <div ref="containerRef" class="excalidraw-diagram__canvas">
        <!-- Excalidraw 渲染区 -->
        <div class="excalidraw-placeholder">
          <div class="excalidraw-placeholder__icon">✏️</div>
          <p class="excalidraw-placeholder__text neon-text-purple">
            Excalidraw 逻辑图
          </p>
          <p class="excalidraw-placeholder__hint">
            [ 手绘风格流程图 · 支持导出 SVG ]
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.excalidraw-diagram {
  margin: 2rem 0;
}

.excalidraw-diagram__title {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

.excalidraw-diagram__container {
  position: relative;
  width: 100%;
  background: var(--bg-dark-secondary);
  border-radius: 12px;
  overflow: hidden;
}

.excalidraw-diagram__canvas {
  width: 100%;
  height: 100%;
}

.excalidraw-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
}

.excalidraw-placeholder__icon {
  font-size: 4rem;
  filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.5));
}

.excalidraw-placeholder__text {
  font-size: 1.5rem;
  font-weight: 700;
}

.excalidraw-placeholder__hint {
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  color: var(--text-cyber-muted);
}
</style>
