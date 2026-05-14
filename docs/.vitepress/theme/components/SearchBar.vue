<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import MiniSearch from 'minisearch'

const props = defineProps({
  conceptsById: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['select-concept'])

const query = ref('')
const ms = ref(null)
const focused = ref(false)
const loading = ref(true)
const error = ref(null)

const results = computed(() => {
  if (!ms.value || !query.value.trim()) return []
  return ms.value.search(query.value, {
    fuzzy: 0.2,
    prefix: true,
    boost: { name_zh: 3, name_en: 2, aliases: 2 },
  }).slice(0, 8)
})

onMounted(async () => {
  try {
    const resp = await fetch('/data/search-index.json')
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const json = await resp.json()
    ms.value = MiniSearch.loadJSON(JSON.stringify(json), {
      idField: 'id',
      fields: ['name_zh', 'name_en', 'short', 'aliases'],
      storeFields: ['id', 'name_zh', 'name_en', 'short', 'domain', 'level'],
      tokenize: (text) => {
        if (!text) return []
        const tokens = []
        for (const t of text.split(/[\s,，。.;:]+/).filter(Boolean)) {
          if (/^[\x00-\x7F]+$/.test(t)) tokens.push(t.toLowerCase())
        }
        const chinese = text.replace(/[\x00-\x7F]/g, ' ')
        for (let i = 0; i < chinese.length; i++) {
          const c = chinese[i]
          if (c.trim() && /[一-鿿]/.test(c)) {
            tokens.push(c)
            if (i + 1 < chinese.length && /[一-鿿]/.test(chinese[i + 1])) {
              tokens.push(c + chinese[i + 1])
            }
          }
        }
        return tokens
      },
      processTerm: (term) => term.toLowerCase(),
    })
    loading.value = false
  } catch (e) {
    error.value = e.message
    loading.value = false
  }
})

function pick(r) {
  emit('select-concept', r.id)
  query.value = ''
  focused.value = false
}

function clear() {
  query.value = ''
}

function onBlur() {
  // Delay so click events on results fire first
  setTimeout(() => { focused.value = false }, 200)
}
</script>

<template>
  <div class="search-bar">
    <div class="input-wrap">
      <span class="icon">🔍</span>
      <input
        v-model="query"
        :placeholder="loading ? '加载中…' : '模糊搜索 (例如: 三次握手 / DPI / sd wan)'"
        :disabled="loading"
        @focus="focused = true"
        @blur="onBlur"
      />
      <button v-if="query" class="clear" @click="clear">✕</button>
    </div>
    <Transition name="results">
      <div v-if="focused && results.length" class="results">
        <button
          v-for="r in results"
          :key="r.id"
          class="result-row"
          @mousedown.prevent="pick(r)"
        >
          <div class="row-main">
            <span class="level" :class="`lv-${r.level}`">{{ r.level }}</span>
            <span class="name">{{ r.name_zh }}</span>
            <span v-if="r.name_en" class="en">{{ r.name_en }}</span>
          </div>
          <div class="short">{{ r.short }}</div>
        </button>
      </div>
    </Transition>
    <div v-if="error" class="err">搜索索引加载失败：{{ error }}</div>
  </div>
</template>

<style scoped>
.search-bar { position: relative; flex: 1; min-width: 200px; }
.input-wrap {
  display: flex;
  align-items: center;
  background: rgba(15, 23, 52, 0.6);
  border: 1px solid rgba(0, 212, 255, 0.22);
  border-radius: 18px;
  padding: 0 10px;
  transition: all 180ms ease;
}
.input-wrap:focus-within {
  border-color: rgba(0, 212, 255, 0.6);
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.22);
}
.icon { opacity: 0.55; margin-right: 6px; font-size: 12px; }
input {
  flex: 1;
  padding: 6px 4px;
  background: transparent;
  border: 0;
  color: #cfe8ff;
  font-size: 12px;
  font-family: inherit;
  outline: none;
}
input::placeholder { color: rgba(180, 200, 230, 0.45); }
input:disabled { opacity: 0.55; cursor: wait; }
.clear {
  background: transparent;
  border: 0;
  color: rgba(180, 200, 230, 0.5);
  cursor: pointer;
  font-size: 12px;
  padding: 2px 4px;
}
.clear:hover { color: #ff6bb6; }

.results {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: rgba(5, 10, 30, 0.98);
  border: 1px solid rgba(0, 212, 255, 0.32);
  border-radius: 10px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(14px);
  z-index: 300;
  max-height: 360px;
  overflow-y: auto;
}
.result-row {
  display: block;
  width: 100%;
  padding: 10px 14px;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  text-align: left;
  cursor: pointer;
  color: #cfe8ff;
  font-family: inherit;
  transition: background 140ms ease;
}
.result-row:hover { background: rgba(0, 212, 255, 0.08); }
.result-row:last-child { border-bottom: 0; }
.row-main { display: flex; align-items: center; gap: 8px; }
.level {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 8px;
  background: rgba(0, 212, 255, 0.12);
  color: #5cdcff;
}
.level.lv-L3, .level.lv-L4 { background: rgba(236, 72, 153, 0.14); color: #ff6bb6; }
.name { font-weight: 600; font-size: 13px; }
.en { color: rgba(180, 200, 230, 0.5); font-size: 11px; }
.short { font-size: 11px; color: rgba(180, 200, 230, 0.7); margin-top: 4px; }

.err {
  position: absolute; top: calc(100% + 6px); left: 0;
  font-size: 11px; color: #ff6b6b; padding: 4px 10px;
}

.results-enter-active, .results-leave-active { transition: all 180ms ease; }
.results-enter-from, .results-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
