<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Network } from 'vis-network/standalone'

interface Node {
  id: number | string
  label: string
  group?: string
  title?: string
}

interface Edge {
  from: number | string
  to: number | string
  label?: string
  arrows?: string
}

const props = defineProps<{
  nodes: Node[]
  edges: Edge[]
  title?: string
  options?: any
}>()

const containerRef = ref<HTMLElement | null>(null)
let network: Network | null = null

const defaultOptions = {
  nodes: {
    shape: 'dot',
    size: 16,
    font: {
      size: 14,
      color: '#00f0ff',
      face: 'Inter, sans-serif'
    },
    borderWidth: 2,
    borderWidthSelected: 4,
    color: {
      border: '#00f0ff',
      background: '#1e2640',
      highlight: {
        border: '#00ff41',
        background: '#0a0e27'
      },
      hover: {
        border: '#8b5cf6',
        background: '#141b34'
      }
    }
  },
  edges: {
    color: {
      color: 'rgba(0, 240, 255, 0.5)',
      highlight: '#00ff41',
      hover: '#8b5cf6',
      inherit: false
    },
    width: 2,
    selectionWidth: 4,
    font: {
      size: 12,
      color: 'rgba(255, 255, 255, 0.8)',
      face: 'Fira Code, monospace',
      align: 'middle'
    },
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5
      }
    },
    smooth: {
      type: 'continuous',
      roundness: 0.5
    }
  },
  physics: {
    enabled: true,
    barnesHut: {
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 150,
      springConstant: 0.04,
      damping: 0.09
    },
    stabilization: {
      iterations: 150
    }
  },
  interaction: {
    hover: true,
    tooltipDelay: 100,
    navigationButtons: false,
    zoomView: true,
    dragView: true
  },
  layout: {
    improvedLayout: true,
    randomSeed: 42
  }
}

onMounted(() => {
  if (containerRef.value) {
    const data = {
      nodes: props.nodes,
      edges: props.edges
    }
    
    const options = {
      ...defaultOptions,
      ...props.options
    }
    
    network = new Network(containerRef.value, data, options)
    
    // 添加点击事件
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        console.log('Selected node:', params.nodes[0])
      }
    })
    
    // 物理引擎稳定后停止
    network.on('stabilizationIterationsDone', () => {
      network?.setOptions({ physics: false })
    })
  }
})

onUnmounted(() => {
  if (network) {
    network.destroy()
    network = null
  }
})
</script>

<template>
  <div class="network-topology">
    <h3 v-if="title" class="network-topology__title neon-text-cyan">
      {{ title }}
    </h3>
    <div class="network-topology__container cyber-card">
      <div ref="containerRef" class="network-topology__canvas"></div>
    </div>
    <div class="network-topology__hint">
      <span class="neon-text-purple">[</span>
      拖拽节点 · 滚轮缩放 · 点击查看详情
      <span class="neon-text-purple">]</span>
    </div>
  </div>
</template>

<style scoped>
.network-topology {
  margin: 2rem 0;
}

.network-topology__title {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

.network-topology__container {
  position: relative;
  width: 100%;
  height: 500px;
  background: var(--bg-dark-secondary);
  border-radius: 12px;
  overflow: hidden;
}

.network-topology__canvas {
  width: 100%;
  height: 100%;
}

.network-topology__hint {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  font-family: 'Fira Code', monospace;
  color: var(--text-cyber-muted);
}

@media (max-width: 768px) {
  .network-topology__container {
    height: 400px;
  }
}
</style>
