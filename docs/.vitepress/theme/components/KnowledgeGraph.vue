<script setup>
import { ref, computed, reactive } from 'vue'
import GraphCanvas from './GraphCanvas.vue'
import ConceptDrawer from './ConceptDrawer.vue'
import SearchBar from './SearchBar.vue'
import LineToolbar from './LineToolbar.vue'

const props = defineProps({
  graphData: { type: Object, required: true },
})

const activeDomainId = ref(
  props.graphData.domains.find(d => d.default)?.id ?? props.graphData.domains[0]?.id
)
const activeConceptId = ref(null)
const drawerExpanded = ref(false)
const disabledPaths = reactive({})    // { pathId: true } if 该线被用户关闭

const activeDomain = computed(() =>
  props.graphData.domains.find(d => d.id === activeDomainId.value)
)

const visibleConcepts = computed(() =>
  Object.values(props.graphData.concepts).filter(c => c.domain === activeDomainId.value && c.x !== undefined)
)

const visibleSegments = computed(() => {
  const visibleIds = new Set(visibleConcepts.value.map(c => c.id))
  const segs = []
  for (const p of props.graphData.paths) {
    for (const seg of p.segments) {
      if (visibleIds.has(seg.from) && visibleIds.has(seg.to)) {
        segs.push({ ...seg, pathId: p.id, color: p.color, dimmed: !!disabledPaths[p.id] })
      }
    }
  }
  return segs
})

function togglePath(id) {
  disabledPaths[id] = !disabledPaths[id]
}

function selectConceptCrossDomain(id) {
  // 搜索结果可能不在当前域，需要先切换 tab
  const c = props.graphData.concepts[id]
  if (!c) return
  if (c.domain !== activeDomainId.value) {
    activeDomainId.value = c.domain
  }
  activeConceptId.value = id
}

const pathsById = computed(() => {
  const m = {}
  for (const p of props.graphData.paths) m[p.id] = p
  return m
})

const activeConcept = computed(() =>
  activeConceptId.value ? props.graphData.concepts[activeConceptId.value] : null
)

function selectConcept(id) {
  activeConceptId.value = id
}
function closeDrawer() {
  activeConceptId.value = null
  drawerExpanded.value = false
}
function toggleExpand() {
  drawerExpanded.value = !drawerExpanded.value
}
function gotoUrl(url) {
  if (typeof window !== 'undefined') window.location.href = url
}

defineExpose({ activeDomainId, activeConceptId, visibleConcepts, selectConcept, disabledPaths, togglePath })
</script>

<template>
  <div class="knowledge-graph">
    <nav class="tabs">
      <button
        v-for="d in graphData.domains"
        :key="d.id"
        class="domain-tab"
        :class="{ active: d.id === activeDomainId, [`color-${d.color}`]: true }"
        @click="activeDomainId = d.id; closeDrawer()"
      >{{ d.name_zh }}</button>
    </nav>

    <div class="control-bar">
      <LineToolbar
        :paths="graphData.paths"
        :disabled="disabledPaths"
        @toggle-path="togglePath"
      />
      <SearchBar
        :concepts-by-id="graphData.concepts"
        @select-concept="selectConceptCrossDomain"
      />
    </div>

    <GraphCanvas
      v-if="activeDomain"
      :domain="activeDomain"
      :concepts="visibleConcepts"
      :segments="visibleSegments"
      @select-concept="selectConcept"
    />

    <ConceptDrawer
      :concept="activeConcept"
      :paths-by-id="pathsById"
      :expanded="drawerExpanded"
      @close="closeDrawer"
      @toggle-expand="toggleExpand"
      @goto="gotoUrl"
      @select-neighbor="selectConcept"
    />
  </div>
</template>

<style scoped>
.knowledge-graph { width: 100%; }
.tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding: 10px 8px;
  background: rgba(5, 10, 30, 0.85);
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
}
.domain-tab {
  padding: 6px 14px;
  background: transparent;
  border: 1px solid rgba(180, 200, 230, 0.18);
  border-radius: 18px;
  color: rgba(180, 200, 230, 0.7);
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  white-space: nowrap;
  transition: all 180ms ease;
}
.domain-tab:hover { transform: translateY(-1px); }
.domain-tab.active.color-cyan    { color: #5cdcff; border-color: rgba(92, 220, 255, 0.6); background: rgba(0, 212, 255, 0.10); }
.domain-tab.active.color-magenta { color: #ff6bb6; border-color: rgba(255, 107, 182, 0.6); background: rgba(236, 72, 153, 0.12); }
.domain-tab.active.color-green   { color: #6fefc4; border-color: rgba(111, 239, 196, 0.5); background: rgba(16, 185, 129, 0.10); }

.control-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  background: rgba(5, 10, 30, 0.7);
  border-bottom: 1px solid rgba(0, 212, 255, 0.08);
  flex-wrap: wrap;
}
@media (max-width: 640px) {
  .control-bar { gap: 8px; padding: 8px; }
}
</style>
