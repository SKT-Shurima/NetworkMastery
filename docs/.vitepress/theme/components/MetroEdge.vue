<script setup>
defineProps({
  x1: { type: Number, required: true },
  y1: { type: Number, required: true },
  x2: { type: Number, required: true },
  y2: { type: Number, required: true },
  color: { type: String, required: true },
  delay: { type: Number, default: 0 },
  dimmed: { type: Boolean, default: false },
})
</script>

<template>
  <g class="metro-edge-group" :class="{ dimmed }">
    <line
      class="metro-edge-glow"
      :x1="x1" :y1="y1" :x2="x2" :y2="y2"
      :stroke="color"
    />
    <line
      class="metro-edge"
      :x1="x1" :y1="y1" :x2="x2" :y2="y2"
      :stroke="color"
      :style="{ animationDelay: `${delay}s` }"
    />
  </g>
</template>

<style scoped>
.metro-edge-glow {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
  opacity: 0.35;
  filter: blur(2.5px);
  pointer-events: none;
}
.metro-edge {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  opacity: 0.95;
  pointer-events: none;
  stroke-dasharray: 6 8;
  animation: dash-flow 1.6s linear infinite;
}
@keyframes dash-flow {
  to { stroke-dashoffset: -14; }
}
.metro-edge-group.dimmed .metro-edge,
.metro-edge-group.dimmed .metro-edge-glow {
  opacity: 0.08;
  animation: none;
}
</style>
