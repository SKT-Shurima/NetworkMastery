---
title: 知识图谱
description: NetworkMastery 交互式知识图谱 · SD-WAN 为中心
sidebar: false
aside: false
outline: false
---

<script setup>
import { onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

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
</script>

<div class="graph-page-wrap">
  <div v-if="error" class="graph-status err">加载失败：{{ error }}</div>
  <div v-else-if="!graphData" class="graph-status">▣ 加载知识图谱中…</div>
  <KnowledgeGraph v-else :graph-data="graphData" />
</div>

<style scoped>
.graph-page-wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 16px;
}
.graph-status {
  padding: 80px 20px;
  text-align: center;
  color: #8b9bba;
  font-family: 'JetBrains Mono', monospace;
}
.graph-status.err {
  color: #ff6b6b;
}
</style>
