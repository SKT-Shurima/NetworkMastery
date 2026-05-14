<script setup>
import { computed } from 'vue'

const props = defineProps({
  cx: { type: Number, required: true },
  cy: { type: Number, required: true },
  size: { type: Number, required: true },
  conceptId: { type: String, required: true },
  label: { type: String, default: '' },
  isCore: { type: Boolean, default: false },
  isFocus: { type: Boolean, default: false },
  level: { type: String, default: 'L1' },
})

const emit = defineEmits(['select'])

const SQRT3 = Math.sqrt(3)

const points = computed(() => {
  const { cx, cy, size } = props
  const dx = SQRT3 * size / 2
  const dy = size / 2
  return [
    [cx, cy - size],
    [cx + dx, cy - dy],
    [cx + dx, cy + dy],
    [cx, cy + size],
    [cx - dx, cy + dy],
    [cx - dx, cy - dy],
  ].map(([x, y]) => `${x},${y}`).join(' ')
})

const polygonClass = computed(() => ({
  'hex-cell': true,
  'sdwan-core': props.isCore,
  'sdwan-focus': props.isFocus && !props.isCore,
}))

const labelClass = computed(() => ({
  'hex-label': true,
  'core': props.isCore,
  'bright': props.isFocus,
}))

function onClick() {
  emit('select', props.conceptId)
}
</script>

<template>
  <g class="hex-group">
    <polygon
      :points="points"
      :class="polygonClass"
      @click="onClick"
    />
    <text
      :x="cx"
      :y="cy + 3"
      :class="labelClass"
      text-anchor="middle"
      pointer-events="none"
    >{{ label }}</text>
  </g>
</template>

<style scoped>
.hex-cell {
  fill: rgba(15, 23, 52, 0.55);
  stroke: rgba(120, 200, 240, 0.22);
  stroke-width: 1;
  transition: all 220ms ease;
  cursor: pointer;
}
.hex-cell:hover {
  fill: rgba(0, 212, 255, 0.18);
  stroke: rgba(0, 212, 255, 0.9);
  stroke-width: 1.4;
  filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.6));
}
.hex-cell.sdwan-focus {
  fill: rgba(236, 72, 153, 0.10);
  stroke: rgba(236, 72, 153, 0.5);
}
.hex-cell.sdwan-focus:hover {
  fill: rgba(236, 72, 153, 0.25);
  stroke: rgba(236, 72, 153, 1);
  filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.7));
}
.hex-cell.sdwan-core {
  fill: rgba(236, 72, 153, 0.35);
  stroke: #ec4899;
  stroke-width: 2;
  filter: drop-shadow(0 0 14px rgba(236, 72, 153, 0.8));
  animation: pulse 3s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { filter: drop-shadow(0 0 12px rgba(236, 72, 153, 0.7)); }
  50%      { filter: drop-shadow(0 0 24px rgba(236, 72, 153, 1)); }
}
.hex-label {
  fill: rgba(220, 230, 255, 0.85);
  font-family: -apple-system, "PingFang SC", sans-serif;
  font-size: 9.5px;
  font-weight: 500;
}
.hex-label.bright { fill: #fff; font-weight: 600; }
.hex-label.core   { fill: #fff; font-weight: 700; font-size: 11.5px; letter-spacing: 0.3px; }
</style>
