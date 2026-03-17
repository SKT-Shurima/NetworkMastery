<template>
  <div class="rough-diagram" :class="{ 'dark-mode': isDark }">
    <canvas 
      ref="canvasRef" 
      :width="width" 
      :height="height"
      :style="{ width: width + 'px', height: height + 'px' }"
    />
    <div v-if="title" class="diagram-title">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useData } from 'vitepress'
import rough from 'roughjs'

interface Props {
  width?: number
  height?: number
  title?: string
  elements?: DiagramElement[]
}

interface DiagramElement {
  type: 'rectangle' | 'ellipse' | 'line' | 'curve' | 'text'
  x: number
  y: number
  width?: number
  height?: number
  x2?: number
  y2?: number
  text?: string
  options?: any
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 400,
  elements: () => []
})

const { isDark } = useData()
const canvasRef = ref<HTMLCanvasElement>()

const baseOptions = computed(() => ({
  roughness: 2,
  bowing: 1.5,
  strokeWidth: 2,
  stroke: isDark.value ? '#e5e7eb' : '#374151',
  fill: isDark.value ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
  fillStyle: 'zigzag',
  hachureAngle: 60,
  hachureGap: 8
}))

const drawDiagram = () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')!
  const rc = rough.canvas(canvas)
  
  // Clear canvas
  ctx.clearRect(0, 0, props.width, props.height)
  
  // Set canvas background
  ctx.fillStyle = isDark.value ? '#1f2937' : '#ffffff'
  ctx.fillRect(0, 0, props.width, props.height)
  
  // Draw elements
  props.elements.forEach(element => {
    const options = { ...baseOptions.value, ...element.options }
    
    switch (element.type) {
      case 'rectangle':
        rc.rectangle(element.x, element.y, element.width || 100, element.height || 50, options)
        break
      case 'ellipse':
        rc.ellipse(element.x, element.y, element.width || 100, element.height || 50, options)
        break
      case 'line':
        rc.line(element.x, element.y, element.x2 || element.x + 100, element.y2 || element.y, options)
        break
      case 'curve':
        if (element.x2 && element.y2) {
          rc.curve([[element.x, element.y], [element.x2, element.y2]], options)
        }
        break
      case 'text':
        if (element.text) {
          ctx.fillStyle = isDark.value ? '#e5e7eb' : '#374151'
          ctx.font = '14px system-ui, -apple-system, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(element.text, element.x, element.y)
        }
        break
    }
  })
}

onMounted(() => {
  drawDiagram()
})

watch([isDark, () => props.elements], () => {
  drawDiagram()
}, { deep: true })
</script>

<style scoped>
.rough-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  padding: 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.rough-diagram.dark-mode {
  background: var(--vp-c-bg-alt);
}

canvas {
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.diagram-title {
  margin-top: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .rough-diagram {
    padding: 0.5rem;
    margin: 1rem 0;
  }
  
  canvas {
    max-width: 100%;
    height: auto;
  }
}
</style>