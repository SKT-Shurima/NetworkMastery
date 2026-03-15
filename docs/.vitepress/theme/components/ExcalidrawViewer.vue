<template>
  <div class="excalidraw-container" v-if="mounted">
    <div ref="containerRef" class="excalidraw-wrapper"></div>
  </div>
  <div v-else class="excalidraw-placeholder">
    加载中...
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'

interface ExcalidrawData {
  elements: any[]
  appState?: any
}

const props = defineProps<{
  data: ExcalidrawData | string // JSON string or object
}>()

const containerRef = ref<HTMLDivElement>()
const mounted = ref(false)
let Excalidraw: any = null

const parseData = () => {
  if (typeof props.data === 'string') {
    try {
      return JSON.parse(props.data)
    } catch (e) {
      console.error('Failed to parse Excalidraw data:', e)
      return { elements: [] }
    }
  }
  return props.data
}

const isDarkMode = () => {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

onMounted(async () => {
  // 仅在客户端加载
  if (typeof window === 'undefined') return
  
  // 延迟加载 Excalidraw（减少构建时的 SSR 问题）
  try {
    const module = await import('excalidraw')
    Excalidraw = module.Excalidraw
    mounted.value = true
    
    // 初始化
    if (containerRef.value && Excalidraw) {
      const data = parseData()
      const { elements = [], appState = {} } = data
      
      containerRef.value.style.width = '100%'
      containerRef.value.style.minHeight = '400px'
      
      // 这里可以集成 Excalidraw
      // 由于 Excalidraw 组件复杂，暂时用 SVG 替代
      containerRef.value.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Excalidraw 图表预留位置</p>'
    }
  } catch (e) {
    console.error('Failed to load Excalidraw:', e)
  }
})

watch(() => props.data, () => {
  // 当数据变化时重新渲染
  if (containerRef.value && mounted.value) {
    // 重新初始化
  }
}, { deep: true })
</script>

<style scoped>
.excalidraw-container {
  width: 100%;
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.excalidraw-wrapper {
  width: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.excalidraw-placeholder {
  width: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin: 1.5rem 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

/* 暗色模式适配 */
:global(.dark) .excalidraw-container {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

:global(.dark) .excalidraw-placeholder {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-2);
}
</style>
