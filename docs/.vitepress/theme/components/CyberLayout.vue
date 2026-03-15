<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import CyberHero from './CyberHero.vue'
import CyberFeatures from './CyberFeatures.vue'

const { frontmatter } = useData()
</script>

<template>
  <div class="cyber-layout">
    <!-- Hero 区域 -->
    <CyberHero v-if="frontmatter.hero" :hero="frontmatter.hero" />
    
    <!-- Features 区域 -->
    <CyberFeatures v-if="frontmatter.features" :features="frontmatter.features" />
    
    <!-- 默认内容插槽 -->
    <div v-if="frontmatter.layout !== 'home'" class="cyber-layout__content">
      <DefaultTheme.Layout />
    </div>
  </div>
</template>

<style>
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📄 全局布局覆盖
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.cyber-layout {
  min-height: 100vh;
  background: var(--bg-dark-primary);
}

/* 覆盖 VitePress 默认样式 */
.VPHome {
  background: transparent !important;
}

.VPFeatures {
  background: transparent !important;
}

/* 导航栏赛博朋克化 */
.VPNav {
  background: rgba(10, 14, 39, 0.8) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 240, 255, 0.2);
}

.VPNavBar {
  background: transparent !important;
}

/* Logo 文字发光 */
.VPNavBarTitle .title {
  background: var(--gradient-cyber);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  transition: all var(--transition-normal) ease;
}

.VPNavBarTitle .title:hover {
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.8);
  filter: brightness(1.2);
}

/* 导航链接 */
.VPNavBarMenuLink {
  color: var(--text-cyber-secondary) !important;
  transition: all var(--transition-normal) ease;
}

.VPNavBarMenuLink:hover {
  color: var(--neon-cyan) !important;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

/* 侧边栏 */
.VPSidebar {
  background: rgba(10, 14, 39, 0.95) !important;
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(0, 240, 255, 0.2);
}

.VPSidebarItem.level-0 .text {
  color: var(--text-cyber-primary);
  font-weight: 600;
}

.VPSidebarItem.is-active > .item > .link > .text {
  color: var(--neon-cyan);
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.4);
}

/* 内容区域 */
.VPDoc {
  background: var(--bg-dark-primary) !important;
}

.VPDoc .container {
  max-width: 1200px;
}

.VPDoc .content {
  background: var(--bg-dark-card);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 240, 255, 0.1);
  border-radius: 16px;
  padding: 3rem;
  margin: 2rem 0;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

/* 标题样式 */
.vp-doc h1 {
  color: var(--neon-cyan);
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
  border-bottom: 2px solid rgba(0, 240, 255, 0.3);
  padding-bottom: 0.5rem;
}

.vp-doc h2 {
  color: var(--text-cyber-primary);
  margin-top: 2.5rem;
  position: relative;
  padding-left: 1rem;
}

.vp-doc h2::before {
  content: '▶';
  position: absolute;
  left: 0;
  color: var(--neon-cyan);
  font-size: 0.8em;
}

.vp-doc h3 {
  color: var(--text-cyber-secondary);
  font-weight: 600;
}

/* 链接 */
.vp-doc a {
  color: var(--neon-cyan);
  text-decoration: none;
  border-bottom: 1px solid rgba(0, 240, 255, 0.3);
  transition: all var(--transition-fast) ease;
}

.vp-doc a:hover {
  color: var(--neon-green);
  border-bottom-color: var(--neon-green);
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
}

/* 引用块 */
.vp-doc blockquote {
  background: var(--bg-dark-secondary);
  border-left: 4px solid var(--neon-cyan);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.1);
}

/* 表格 */
.vp-doc table {
  background: var(--bg-dark-secondary);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

.vp-doc th {
  background: var(--bg-dark-tertiary);
  color: var(--neon-cyan);
  border-bottom: 2px solid rgba(0, 240, 255, 0.3);
  font-weight: 700;
}

.vp-doc tr:hover {
  background: rgba(0, 240, 255, 0.05);
}

/* 行内代码 */
.vp-doc code {
  background: var(--bg-dark-tertiary);
  color: var(--neon-cyan);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: 'Fira Code', 'Monaco', monospace;
  font-size: 0.9em;
  border: 1px solid rgba(0, 240, 255, 0.2);
}

/* 代码块 */
.vp-doc div[class*='language-'] {
  background: var(--bg-dark-secondary) !important;
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 12px;
  margin: 1.5rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.vp-doc div[class*='language-']::before {
  color: var(--neon-cyan);
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
}

/* 列表 */
.vp-doc ul,
.vp-doc ol {
  color: var(--text-cyber-secondary);
}

.vp-doc li::marker {
  color: var(--neon-cyan);
}

/* 自定义容器 */
.vp-doc .custom-block {
  background: var(--bg-dark-secondary);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
}

.vp-doc .custom-block.tip {
  border-left: 4px solid var(--neon-green);
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.1);
}

.vp-doc .custom-block.warning {
  border-left: 4px solid var(--neon-yellow);
  box-shadow: 0 0 20px rgba(255, 255, 0, 0.1);
}

.vp-doc .custom-block.danger {
  border-left: 4px solid var(--neon-magenta);
  box-shadow: 0 0 20px rgba(255, 0, 110, 0.1);
}

/* 页脚 */
.VPFooter {
  background: var(--bg-dark-secondary);
  border-top: 1px solid rgba(0, 240, 255, 0.2);
  color: var(--text-cyber-secondary);
}

/* 滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-dark-secondary);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--neon-cyan), var(--neon-purple));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, var(--neon-green), var(--neon-cyan));
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .VPDoc .content {
    padding: 1.5rem;
    margin: 1rem 0;
  }
}
</style>
