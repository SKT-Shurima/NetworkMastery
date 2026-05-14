<script setup>
defineProps({
  paths: { type: Array, required: true },          // [{id, name_zh, color}]
  disabled: { type: Object, required: true },      // { entry: true, ... } => 该线被关闭
})

const emit = defineEmits(['toggle-path'])
</script>

<template>
  <div class="line-toolbar">
    <button
      v-for="p in paths"
      :key="p.id"
      class="line-pill"
      :class="{ off: disabled[p.id] }"
      :style="{
        '--line-color': p.color,
        color: disabled[p.id] ? 'rgba(180,200,230,0.4)' : p.color,
        borderColor: disabled[p.id] ? 'rgba(180,200,230,0.18)' : p.color + '99',
      }"
      @click="emit('toggle-path', p.id)"
    >
      <span class="bar" :style="{ background: disabled[p.id] ? 'rgba(180,200,230,0.4)' : p.color }"></span>
      {{ p.name_zh }}
    </button>
  </div>
</template>

<style scoped>
.line-toolbar {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}
.line-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: transparent;
  border: 1px solid;
  border-radius: 18px;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  transition: all 180ms ease;
  user-select: none;
}
.line-pill:hover { transform: translateY(-1px); }
.line-pill:not(.off) { box-shadow: 0 0 12px rgba(0, 0, 0, 0); }
.line-pill:not(.off):hover { box-shadow: 0 0 12px var(--line-color); }
.line-pill.off { opacity: 0.65; }
.bar { width: 16px; height: 3px; border-radius: 2px; }
</style>
