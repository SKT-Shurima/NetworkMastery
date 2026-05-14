<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import HexCell from './HexCell.vue'
import MetroEdge from './MetroEdge.vue'

const props = defineProps({
  domain: { type: Object, required: true },
  concepts: { type: Array, required: true },
  segments: { type: Array, required: true },
})

const emit = defineEmits(['select-concept'])

const stage = ref(null)
const tiltX = ref(0)
const tiltY = ref(0)

function onMove(e) {
  if (!stage.value) return
  const r = stage.value.getBoundingClientRect()
  tiltX.value = -((e.clientX - r.left) / r.width  - 0.5) * 8
  tiltY.value = -((e.clientY - r.top)  / r.height - 0.5) * 6
}
function onLeave() {
  tiltX.value = 0
  tiltY.value = 0
}

onMounted(() => {
  stage.value?.addEventListener('mousemove', onMove)
  stage.value?.addEventListener('mouseleave', onLeave)
})
onBeforeUnmount(() => {
  stage.value?.removeEventListener('mousemove', onMove)
  stage.value?.removeEventListener('mouseleave', onLeave)
})

function isFocus(c) {
  return props.domain.color === 'magenta' && c.domain === 'sdwan' && c.id !== 'sdwan-core'
}

function isCore(c) {
  return !!c.is_hub && c.domain === props.domain.id
}
</script>

<template>
  <div class="graph-stage" ref="stage">
    <svg viewBox="0 0 640 320" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stop-color="rgba(236,72,153,0.18)"/>
          <stop offset="100%" stop-color="rgba(236,72,153,0)"/>
        </radialGradient>
      </defs>
      <ellipse cx="320" cy="160" rx="180" ry="110" fill="url(#center-glow)" />

      <g :transform="`translate(${tiltX} ${tiltY})`">
        <g class="edges">
          <MetroEdge
            v-for="(seg, i) in segments"
            :key="`${seg.pathId}-${i}`"
            :x1="seg.x1" :y1="seg.y1" :x2="seg.x2" :y2="seg.y2"
            :color="seg.color"
            :delay="i * -0.3"
            :dimmed="seg.dimmed"
          />
        </g>
        <g class="cells">
          <HexCell
            v-for="c in concepts"
            :key="c.id"
            :cx="c.x" :cy="c.y" :size="26"
            :concept-id="c.id"
            :label="c.name_zh"
            :is-core="isCore(c)"
            :is-focus="isFocus(c)"
            :level="c.level"
            @select="(id) => emit('select-concept', id)"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.graph-stage {
  width: 100%;
  background: radial-gradient(ellipse at center, #0b1230 0%, #050818 70%, #02040c 100%);
  border-radius: 12px;
  border: 1px solid rgba(0, 212, 255, 0.12);
  box-shadow: 0 0 60px rgba(0, 212, 255, 0.06), inset 0 0 80px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}
.graph-stage svg { display: block; width: 100%; height: auto; }
.cells, .edges { transition: transform 200ms ease-out; }
</style>
