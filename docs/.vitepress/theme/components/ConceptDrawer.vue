<script setup>
import { computed } from 'vue'

const props = defineProps({
  concept: { type: Object, default: null },
  pathsById: { type: Object, default: () => ({}) },
  expanded: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'toggle-expand', 'goto', 'select-neighbor'])

const visible = computed(() => !!props.concept)

const onPaths = computed(() => {
  if (!props.concept) return []
  return (props.concept.on_paths || []).map(id => props.pathsById[id]).filter(Boolean)
})

function goToCanonical() {
  if (props.concept?.canonical?.file) {
    const url = props.concept.canonical.file + (props.concept.canonical.anchor || '')
    emit('goto', url)
  }
}
</script>

<template>
  <Transition name="drawer">
    <aside v-if="visible" class="concept-drawer" :class="{ expanded }">
      <header>
        <span class="level-pill">{{ concept.level }}</span>
        <h3>{{ concept.name_zh }}</h3>
        <small v-if="concept.name_en">{{ concept.name_en }}</small>
        <button class="close" aria-label="关闭" @click="emit('close')"><Icon name="x" color="cyan" /></button>
      </header>

      <section class="short">{{ concept.short }}</section>

      <section v-if="concept.long" class="long">
        <p v-for="(line, i) in concept.long.split('\n').filter(l => l.trim())" :key="i">{{ line }}</p>
      </section>

      <section v-if="concept.neighbors?.length" class="neighbors">
        <div class="label">邻居概念</div>
        <div class="chips">
          <button v-for="nb in concept.neighbors" :key="nb" class="chip" @click="emit('select-neighbor', nb)">
            {{ nb }}
          </button>
        </div>
      </section>

      <section v-if="onPaths.length" class="paths">
        <div class="label">在 {{ onPaths.length }} 条学习线上</div>
        <div class="path-list">
          <span v-for="p in onPaths" :key="p.id" class="path-tag" :style="{ borderColor: p.color, color: p.color }">
            ━ {{ p.name_zh }}
          </span>
        </div>
      </section>

      <footer>
        <button class="expand-btn" @click="emit('toggle-expand')">
          <Icon :name="expanded ? 'minimize-2' : 'maximize-2'" color="cyan" />
          {{ expanded ? '收起' : '展开全屏' }}
        </button>
        <button v-if="concept.canonical?.file" class="deep-btn" @click="goToCanonical">深入阅读 →</button>
      </footer>
    </aside>
  </Transition>
</template>

<style scoped>
.concept-drawer {
  position: fixed;
  top: 60px;
  right: 0;
  bottom: 0;
  width: min(380px, 100vw);
  background: rgba(5, 10, 30, 0.96);
  border-left: 1px solid rgba(236, 72, 153, 0.35);
  backdrop-filter: blur(14px);
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.5);
  color: #d8e3f5;
  display: flex;
  flex-direction: column;
  z-index: 200;
  overflow-y: auto;
}
.concept-drawer.expanded {
  width: 100vw;
  border-left: none;
}
@media (max-width: 640px) {
  .concept-drawer {
    top: auto;
    bottom: 0;
    width: 100%;
    height: 70vh;
    border-left: none;
    border-top: 1px solid rgba(236, 72, 153, 0.35);
    border-radius: 14px 14px 0 0;
  }
}
header {
  padding: 16px 18px 12px;
  border-bottom: 1px solid rgba(236, 72, 153, 0.18);
  position: relative;
}
header h3 { margin: 8px 0 2px; color: #ff6bb6; font-size: 19px; }
header small { color: #8b9bba; font-size: 12px; }
.level-pill {
  display: inline-block;
  padding: 2px 8px;
  font-size: 11px;
  background: rgba(0, 212, 255, 0.12);
  color: #5cdcff;
  border-radius: 10px;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
}
.close {
  position: absolute;
  top: 14px;
  right: 14px;
  background: transparent;
  border: 0;
  color: #8b9bba;
  font-size: 18px;
  cursor: pointer;
}
.close:hover { color: #fff; }
section { padding: 14px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.short { color: #cfe8ff; font-size: 14px; line-height: 1.55; }
.long p { font-size: 13px; line-height: 1.65; color: #b8c5dc; margin: 0 0 8px; }
.label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: #8b9bba; margin-bottom: 8px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip {
  background: rgba(0, 212, 255, 0.10);
  border: 1px solid rgba(0, 212, 255, 0.30);
  color: #5cdcff;
  padding: 4px 10px;
  font-size: 11px;
  border-radius: 14px;
  cursor: pointer;
  font-family: inherit;
}
.chip:hover { background: rgba(0, 212, 255, 0.20); }
.path-tag {
  display: inline-block;
  margin-right: 6px;
  padding: 2px 8px;
  font-size: 11px;
  border: 1px solid;
  border-radius: 10px;
  font-family: 'JetBrains Mono', monospace;
}
footer {
  padding: 14px 18px;
  display: flex;
  gap: 10px;
  background: rgba(0, 0, 0, 0.25);
  margin-top: auto;
}
footer button {
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  transition: all 180ms ease;
}
.expand-btn { color: #5cdcff; border-color: rgba(92, 220, 255, 0.4); }
.deep-btn { color: #ff6bb6; border-color: rgba(255, 107, 182, 0.5); }
footer button:hover { transform: translateY(-1px); box-shadow: 0 0 12px currentColor; }

.drawer-enter-active, .drawer-leave-active { transition: transform 280ms cubic-bezier(.2,.9,.4,1), opacity 280ms; }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); opacity: 0; }
@media (max-width: 640px) {
  .drawer-enter-from, .drawer-leave-to { transform: translateY(100%); }
}
</style>
