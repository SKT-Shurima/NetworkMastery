<!--
  组件模板 - 确保所有标签正确闭合
  
  使用前检查清单：
  ✅ <script setup> 有对应的 </script>
  ✅ <template> 有对应的 </template>
  ✅ <style scoped> 有对应的 </style>
  ✅ 所有 HTML 标签正确闭合
  ✅ props 类型定义完整
  ✅ ref/computed 正确导入
-->

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'

// Props 定义
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})

// 响应式数据
const isVisible = ref(false)

// 计算属性
const displayTitle = computed(() => {
  return props.title.toUpperCase()
})

// 生命周期
onMounted(() => {
  isVisible.value = true
})
</script>

<template>
  <div class="component-wrapper">
    <h3 class="component-title">{{ displayTitle }}</h3>
    <p v-if="description" class="component-description">
      {{ description }}
    </p>
    <div class="component-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.component-wrapper {
  padding: 2rem;
  background: rgba(10, 14, 39, 0.9);
  border: 2px solid var(--neon-cyan);
  border-radius: 12px;
  margin: 2rem 0;
}

.component-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--neon-cyan);
  margin: 0 0 1rem 0;
  text-shadow: 0 0 15px rgba(0, 240, 255, 0.6);
}

.component-description {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.component-content {
  /* 子内容样式 */
}
</style>
