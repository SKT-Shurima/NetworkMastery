<script setup>
import { ref, computed, onMounted } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  // 当前概念 id，渲染时它是中心 hex
  id: { type: String, required: true },
  // 紧凑模式：高度降低，标题外显
  compact: { type: Boolean, default: false },
})

const graphData = ref(null)
const error = ref(null)

onMounted(async () => {
  try {
    const resp = await fetch(withBase('/data/graph.json'))
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    graphData.value = await resp.json()
  } catch (e) {
    error.value = e.message
  }
})

const SQRT3 = Math.sqrt(3)
const R = 30 // 邻居 hex 半径
const CENTER = { x: 280, y: 140 }
const CORE_R = 38 // 中心 hex 略大

const concept = computed(() =>
  graphData.value ? graphData.value.concepts[props.id] : null
)

const neighborConcepts = computed(() => {
  if (!concept.value || !graphData.value) return []
  return (concept.value.neighbors || [])
    .slice(0, 6)
    .map(nid => graphData.value.concepts[nid])
    .filter(Boolean)
})

// 把邻居按 6 个方向平均分布在中心 hex 周围
const neighborPositions = computed(() => {
  // 6 个槽位（NE, E, SE, SW, W, NW），每个槽位距离中心约 1.8r
  const dist = (CORE_R + R) * 0.95 + 4
  const slots = [
    { dx: dist * Math.cos(-Math.PI / 6),     dy: dist * Math.sin(-Math.PI / 6),     dir: 'NE' },
    { dx: dist,                              dy: 0,                                 dir: 'E'  },
    { dx: dist * Math.cos(Math.PI / 6),      dy: dist * Math.sin(Math.PI / 6),      dir: 'SE' },
    { dx: dist * Math.cos(5 * Math.PI / 6),  dy: dist * Math.sin(5 * Math.PI / 6),  dir: 'SW' },
    { dx: -dist,                             dy: 0,                                 dir: 'W'  },
    { dx: dist * Math.cos(-5 * Math.PI / 6), dy: dist * Math.sin(-5 * Math.PI / 6), dir: 'NW' },
  ]
  return neighborConcepts.value.map((n, i) => {
    const slot = slots[i]
    return {
      ...n,
      x: CENTER.x + slot.dx,
      y: CENTER.y + slot.dy,
    }
  })
})

function hexPoints(cx, cy, size) {
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
}

// 简单连线：中心到每个邻居（取两 hex 中点连线，让线在 hex 之间）
function connectLine(target) {
  return { x1: CENTER.x, y1: CENTER.y, x2: target.x, y2: target.y }
}

const pathsOnCenter = computed(() => {
  if (!concept.value || !graphData.value) return []
  const ids = concept.value.on_paths || []
  return ids
    .map(id => graphData.value.paths.find(p => p.id === id))
    .filter(Boolean)
})

function go(target) {
  if (target?.canonical?.file) {
    const url = target.canonical.file + (target.canonical.anchor || '')
    if (typeof window !== 'undefined') window.location.href = withBase(url)
  }
}

function gotoFullGraph() {
  if (typeof window !== 'undefined') window.location.href = withBase('/graph.html')
}
</script>

<template>
  <figure class="concept-map" :class="{ compact }">
    <div v-if="error" class="status err">概念图加载失败：{{ error }}</div>
    <div v-else-if="!graphData" class="status">▣ 加载概念图…</div>
    <div v-else-if="!concept" class="status err">未找到概念：{{ id }}</div>

    <div v-else class="map-body">
      <!-- 左：图 -->
      <div class="map-stage">
        <svg viewBox="0 0 560 280" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="cm-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stop-color="rgba(236,72,153,0.22)"/>
              <stop offset="100%" stop-color="rgba(236,72,153,0)"/>
            </radialGradient>
            <filter id="cm-soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2"/>
            </filter>
          </defs>

          <!-- center halo -->
          <ellipse :cx="CENTER.x" :cy="CENTER.y" rx="160" ry="100" fill="url(#cm-glow)"/>

          <!-- 连线（中心到邻居） -->
          <g class="links">
            <line
              v-for="n in neighborPositions"
              :key="`l-${n.id}`"
              :x1="CENTER.x" :y1="CENTER.y" :x2="n.x" :y2="n.y"
              class="link-line"
            />
          </g>

          <!-- 邻居 hex -->
          <g class="neighbors">
            <g
              v-for="n in neighborPositions"
              :key="n.id"
              class="hex-group"
              @click="go(n)"
              role="button"
              tabindex="0"
            >
              <polygon class="neighbor-hex" :points="hexPoints(n.x, n.y, R)" />
              <title>{{ n.short || n.name_zh }}</title>
              <text class="neighbor-label" :x="n.x" :y="n.y - 2" text-anchor="middle">{{ n.name_zh }}</text>
              <text v-if="n.level" class="neighbor-sub" :x="n.x" :y="n.y + 11" text-anchor="middle">{{ n.level }}</text>
            </g>
          </g>

          <!-- 中心 hex -->
          <g class="hex-group center" @click="go(concept)">
            <polygon class="center-hex" :points="hexPoints(CENTER.x, CENTER.y, CORE_R)" />
            <text class="center-label" :x="CENTER.x" :y="CENTER.y - 4" text-anchor="middle">{{ concept.name_zh }}</text>
            <text class="center-sub" :x="CENTER.x" :y="CENTER.y + 12" text-anchor="middle">{{ concept.level }} · {{ concept.domain }}</text>
          </g>
        </svg>
      </div>

      <!-- 右：信息 -->
      <aside class="map-info">
        <header>
          <span class="pill-level">{{ concept.level }}</span>
          <h4>{{ concept.name_zh }}</h4>
          <small v-if="concept.name_en">{{ concept.name_en }}</small>
        </header>
        <p class="short">{{ concept.short }}</p>

        <div v-if="pathsOnCenter.length" class="paths">
          <div class="lbl">所在学习线路</div>
          <div class="path-tags">
            <span v-for="p in pathsOnCenter" :key="p.id"
                  :style="{ borderColor: p.color, color: p.color }">━ {{ p.name_zh }}</span>
          </div>
        </div>

        <button class="more-btn" @click="gotoFullGraph">在完整图谱中查看 →</button>
      </aside>
    </div>
  </figure>
</template>

<style scoped>
.concept-map {
  margin: 24px 0 32px;
  padding: 18px 20px;
  background: linear-gradient(155deg, rgba(20, 27, 52, 0.95) 0%, rgba(8, 12, 32, 0.98) 100%);
  border: 1px solid rgba(0, 212, 255, 0.18);
  border-radius: 12px;
  box-shadow: 0 0 32px rgba(0, 212, 255, 0.05), inset 0 0 60px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}
.concept-map::before {
  content: '◧ 概念图谱';
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(0, 212, 255, 0.55);
  letter-spacing: 2px;
  margin-bottom: 10px;
  text-transform: uppercase;
}
.status { padding: 40px; text-align: center; color: #8b9bba; font-size: 12px; font-family: 'JetBrains Mono', monospace; }
.status.err { color: #ff6b6b; }

.map-body {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 18px;
}
@media (max-width: 768px) {
  .map-body { grid-template-columns: 1fr; }
}

.map-stage {
  background: radial-gradient(ellipse at center, #0b1230 0%, #050818 80%);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.03);
}
.map-stage svg { display: block; width: 100%; height: auto; }

/* ---- center hex ---- */
.center-hex {
  fill: rgba(236, 72, 153, 0.32);
  stroke: #ec4899;
  stroke-width: 2;
  filter: drop-shadow(0 0 18px rgba(236, 72, 153, 0.7));
  animation: cm-pulse 3s ease-in-out infinite;
  cursor: pointer;
  transition: all 200ms ease;
}
.hex-group.center:hover .center-hex {
  fill: rgba(236, 72, 153, 0.5);
  stroke-width: 2.5;
}
.center-label { fill: #fff; font-weight: 700; font-size: 14px; pointer-events: none; }
.center-sub { fill: rgba(255, 255, 255, 0.6); font-size: 9px; font-family: 'JetBrains Mono', monospace; pointer-events: none; }

@keyframes cm-pulse {
  0%, 100% { filter: drop-shadow(0 0 12px rgba(236, 72, 153, 0.6)); }
  50%      { filter: drop-shadow(0 0 24px rgba(236, 72, 153, 1)); }
}

/* ---- neighbor hex ---- */
.neighbor-hex {
  fill: rgba(15, 23, 52, 0.7);
  stroke: rgba(0, 212, 255, 0.4);
  stroke-width: 1;
  cursor: pointer;
  transition: all 200ms ease;
}
.hex-group:hover .neighbor-hex {
  fill: rgba(0, 212, 255, 0.18);
  stroke: rgba(0, 212, 255, 1);
  stroke-width: 1.6;
  filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.6));
}
.neighbor-label { fill: #cfe8ff; font-weight: 600; font-size: 10.5px; pointer-events: none; }
.neighbor-sub   { fill: rgba(0, 212, 255, 0.55); font-size: 8px; font-family: 'JetBrains Mono', monospace; pointer-events: none; }

/* ---- links ---- */
.link-line {
  stroke: rgba(0, 212, 255, 0.18);
  stroke-width: 1;
  stroke-dasharray: 3 4;
}

/* ---- info aside ---- */
.map-info {
  padding: 12px 14px;
  background: rgba(5, 10, 30, 0.55);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.map-info header h4 {
  margin: 6px 0 2px;
  color: #ff6bb6;
  font-size: 16px;
}
.map-info header small { color: rgba(180, 200, 230, 0.55); font-size: 11px; }
.pill-level {
  display: inline-block;
  padding: 2px 8px;
  font-size: 10px;
  background: rgba(0, 212, 255, 0.10);
  color: #5cdcff;
  border-radius: 8px;
  font-family: 'JetBrains Mono', monospace;
}
.short { color: rgba(220, 230, 255, 0.85); font-size: 13px; line-height: 1.55; margin: 0; }
.lbl { font-size: 9.5px; text-transform: uppercase; letter-spacing: 1.2px; color: rgba(180, 200, 230, 0.5); margin-bottom: 5px; }
.path-tags span {
  display: inline-block;
  padding: 2px 8px;
  margin-right: 4px;
  margin-bottom: 4px;
  font-size: 10.5px;
  border: 1px solid;
  border-radius: 10px;
  font-family: 'JetBrains Mono', monospace;
}
.more-btn {
  margin-top: auto;
  padding: 8px 12px;
  background: transparent;
  color: rgba(180, 200, 230, 0.75);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 11.5px;
  font-family: inherit;
  transition: all 180ms ease;
}
.more-btn:hover {
  color: #5cdcff;
  border-color: rgba(0, 212, 255, 0.7);
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.25);
}
</style>
