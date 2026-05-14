<script setup>
import { computed } from 'vue'
import * as Lucide from 'lucide-vue-next'
import { toPascalCase } from '../icons/emoji-map.mjs'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [String, Number], default: '1em' },
  color: { type: String, default: '' },     // cyan|green|magenta|purple|warn|danger or any CSS color
  glow: { type: Boolean, default: false },
  stroke: { type: [String, Number], default: 1.75 },
  filled: { type: Boolean, default: false }, // for status dots — fills the icon
})

const colorMap = {
  cyan:    'var(--neon-cyan)',
  green:   'var(--neon-green)',
  magenta: 'var(--neon-magenta)',
  purple:  'var(--neon-purple)',
  warn:    '#facc15',
  danger:  '#ef4444',
}

const resolvedColor = computed(() => colorMap[props.color] || props.color || 'currentColor')

const sizeValue = computed(() => {
  if (typeof props.size === 'number') return `${props.size}px`
  if (/^\d+$/.test(props.size)) return `${props.size}px`
  return props.size
})

const glowShadow = computed(() => {
  if (!props.glow) return 'none'
  const c = resolvedColor.value
  return `drop-shadow(0 0 6px ${c}) drop-shadow(0 0 12px ${c})`
})

const fillValue = computed(() => (props.filled ? resolvedColor.value : 'none'))

const component = computed(() => {
  const pascal = toPascalCase(props.name)
  return Lucide[pascal] || Lucide.CircleHelp
})

const iconStyle = computed(() => ({
  width: sizeValue.value,
  height: sizeValue.value,
  color: resolvedColor.value,
  filter: glowShadow.value,
  display: 'inline-block',
  verticalAlign: '-0.15em',
  flexShrink: 0,
}))
</script>

<template>
  <component
    :is="component"
    :stroke-width="stroke"
    :fill="fillValue"
    :style="iconStyle"
    aria-hidden="true"
    class="nm-icon"
  />
</template>

<style scoped>
.nm-icon {
  transition: color 0.2s ease, filter 0.2s ease;
}
</style>
