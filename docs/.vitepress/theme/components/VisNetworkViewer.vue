<template>
  <div class="vis-network-container">
    <div ref="containerRef" class="vis-network-wrapper"></div>
    <div class="vis-legend" v-if="showLegend">
      <div class="legend-item">
        <span class="legend-color" style="background: #10b981;"></span>
        <span>核心设备</span>
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background: #3b82f6;"></span>
        <span>分支设备</span>
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background: #f59e0b;"></span>
        <span>链路</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Network } from 'vis-network'

interface VisNetworkData {
  nodes: Array<{
    id: string | number
    label: string
    color?: string
    title?: string
    [key: string]: any
  }>
  edges: Array<{
    from: string | number
    to: string | number
    label?: string
    color?: string
    title?: string
    [key: string]: any
  }>
}

const props = defineProps<{
  data: VisNetworkData | string // JSON string or object
  showLegend?: boolean
}>()

const containerRef = ref<HTMLDivElement>()
const showLegend = ref(props.showLegend ?? true)
let networkInstance: Network | null = null

const parseData = () => {
  if (typeof props.data === 'string') {
    try {
      return JSON.parse(props.data)
    } catch (e) {
      console.error('Failed to parse vis-network data:', e)
      return { nodes: [], edges: [] }
    }
  }
  return props.data
}

const initNetwork = () => {
  if (!containerRef.value) return
  
  const data = parseData()
  const { nodes = [], edges = [] } = data
  
  // 设置默认样式
  const styledNodes = nodes.map(node => ({
    ...node,
    color: node.color || {
      background: '#10b981',
      border: '#059669',
      highlight: { background: '#6ee7b7', border: '#10b981' },
      hover: { background: '#6ee7b7', border: '#10b981' }
    },
    font: { size: 14, color: '#000' },
    shape: 'box',
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
  }))
  
  const styledEdges = edges.map(edge => ({
    ...edge,
    color: edge.color || { color: '#f59e0b', highlight: '#dc2626' },
    width: 2,
    smooth: {
      type: 'continuous',
      forceDirection: 'none'
    }
  }))
  
  const options = {
    autoResize: true,
    height: '100%',
    physics: {
      enabled: true,
      stabilization: {
        iterations: 200,
        fit: true
      },
      barnesHut: {
        gravitationalConstant: -26000,
        centralGravity: 0.005,
        springLength: 200,
        springConstant: 0.04
      }
    },
    interaction: {
      hover: true,
      navigationButtons: true,
      keyboard: true,
      zoomView: true,
      dragView: true
    }
  }
  
  if (networkInstance) {
    networkInstance.destroy()
  }
  
  networkInstance = new Network(
    containerRef.value,
    {
      nodes: styledNodes,
      edges: styledEdges
    },
    options
  )
  
  // 让物理模拟稳定后再停止
  networkInstance.once('stabilizationIterationsDone', () => {
    networkInstance?.setOptions({ physics: false })
  })
}

onMounted(() => {
  // 仅在浏览器环境运行
  if (typeof window !== 'undefined') {
    initNetwork()
  }
})

watch(() => props.data, () => {
  initNetwork()
}, { deep: true })

// 清理
onMounted(() => {
  return () => {
    if (networkInstance) {
      networkInstance.destroy()
      networkInstance = null
    }
  }
})
</script>

<style scoped>
.vis-network-container {
  width: 100%;
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  position: relative;
}

.vis-network-wrapper {
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vis-legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  font-size: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  display: inline-block;
}

/* 暗色模式适配 */
:global(.dark) .vis-network-container {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

:global(.dark) .vis-legend {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-1);
}
</style>
