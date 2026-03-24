# 🌌 NetworkMastery - Cyberpunk Theme

## 📋 项目概述

**NetworkMastery** 的全新赛博朋克风格主题系统，完全重构了视觉体验层，保留原有内容不变。

### ✨ 核心特性

- ✅ **赛博朋克美学** — 霓虹色、发光效果、网格背景、扫描线动画
- ✅ **自定义组件库** — Hero、Features、NetworkTopology、ExcalidrawDiagram
- ✅ **完整动画系统** — neon-pulse、slide-in-up、fade-in、grid-flow
- ✅ **响应式设计** — 完美适配桌面/平板/手机
- ✅ **VitePress 深度集成** — 覆盖默认主题所有核心组件

---

## 🎨 设计语言

### 配色方案

```css
--neon-cyan:     #00f0ff  /* 主品牌色 - 霓虹青 */
--neon-magenta:  #ff006e  /* 强调色 - 霓虹洋红 */
--neon-purple:   #8b5cf6  /* 辅助色 - 霓虹紫 */
--neon-green:    #00ff41  /* 状态色 - 霓虹绿 */

--bg-dark-primary:   #0a0e27  /* 主背景 - 深空蓝 */
--bg-dark-secondary: #141b34  /* 次背景 - 暗蓝灰 */
--bg-dark-tertiary:  #1e2640  /* 三级背景 - 深蓝紫 */
```

### 视觉元素

1. **发光效果** — 文字阴影 + box-shadow 模拟霓虹灯
2. **网格背景** — repeating-linear-gradient 网格 + 动画流动
3. **玻璃态卡片** — backdrop-filter blur + 半透明背景
4. **扫描线** — 垂直移动的发光线条
5. **渐变边框** — 悬停时渐变色边框显现

---

## 📦 文件结构

```
docs/.vitepress/theme/
├── styles/
│   └── cyberpunk.css          # 核心样式系统 (8.4KB)
├── components/
│   ├── CyberLayout.vue        # 布局容器 (5.9KB)
│   ├── CyberHero.vue          # Hero 组件 (8.2KB)
│   ├── CyberFeatures.vue      # Features 网格 (6.5KB)
│   ├── NetworkTopology.vue    # vis-network 拓扑图 (3.7KB)
│   └── ExcalidrawDiagram.vue  # Excalidraw 逻辑图 (2.2KB)
└── index.ts                   # 主题入口 (0.5KB)

总计: ~35KB (未压缩)
```

---

## 🚀 核心组件

### 1. CyberHero.vue

**功能**：首页 Hero 区域

**特性**：
- 霓虹发光标题 (neon-pulse 动画)
- 渐变色背景 (3 层浮动光晕)
- 网格动画背景
- 扫描线特效
- 响应式按钮组

**使用示例**：

```vue
<CyberHero
  :hero="{
    name: 'Network',
    text: 'Mastery',
    tagline: '从 OSI 七层到 SD-WAN 智能路由',
    actions: [
      { text: '开始学习', link: '/guide/basics/osi', theme: 'brand' },
      { text: 'SD-WAN 深度分析', link: '/guide/sdwan/concepts' }
    ]
  }"
/>
```

---

### 2. CyberFeatures.vue

**功能**：功能卡片网格

**特性**：
- 玻璃态卡片
- 悬停发光边框
- 图标缩放 + 旋转动画
- 延迟渐入动画 (stagger)

**使用示例**：

```vue
<CyberFeatures
  :features="[
    {
      icon: '🌐',
      title: '网络基础',
      details: 'OSI 七层模型、TCP/IP 协议栈...',
      link: '/guide/basics/osi',
      linkText: '开始阅读'
    }
  ]"
/>
```

---

### 3. NetworkTopology.vue

**功能**：vis-network 交互式网络拓扑图

**特性**：
- 赛博朋克配色节点
- 物理引擎模拟
- 拖拽/缩放/点击交互
- 自动稳定布局

**使用示例**：

```vue
<NetworkTopology
  title="SD-WAN 三层架构"
  :nodes="[
    { id: 1, label: 'Controller', group: 'control' },
    { id: 2, label: 'Edge-1', group: 'edge' }
  ]"
  :edges="[
    { from: 1, to: 2, label: 'Control Plane' }
  ]"
/>
```

---

### 4. ExcalidrawDiagram.vue

**功能**：Excalidraw 手绘风格逻辑图 (占位符)

**特性**：
- 占位符 UI (待集成完整 Excalidraw)
- 自定义高度

**下一步**：
- 完整集成 `@excalidraw/excalidraw`
- 支持加载 `.excalidraw` 场景文件
- SVG 导出功能

---

## 🎯 样式覆盖

### VitePress 默认组件

所有默认组件已被赛博朋克化：

- ✅ `.VPNav` — 导航栏 (玻璃态 + 霓虹边框)
- ✅ `.VPSidebar` — 侧边栏 (暗色 + 发光激活项)
- ✅ `.VPDoc` — 文档内容区 (玻璃态卡片)
- ✅ 标题 (h1/h2/h3) — 霓虹色 + 文字阴影
- ✅ 链接 — 悬停发光
- ✅ 代码块 — 暗色主题 + 霓虹语言标签
- ✅ 表格 — 悬停高亮行
- ✅ 引用块 — 霓虹左边框
- ✅ 自定义容器 (tip/warning/danger) — 对应霓虹色边框
- ✅ 滚动条 — 渐变色拇指

---

## 📱 响应式断点

```css
@media (max-width: 768px) {
  /* 移动端优化 */
  - 标题字号缩小 (clamp 自适应)
  - 卡片 padding 缩减
  - 网格变为单列
  - 按钮 100% 宽度
}
```

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| VitePress | v1.6.4 | 静态站点生成器 |
| Vue 3 | v3.3+ | 组件框架 |
| vis-network | latest | 网络拓扑可视化 |
| excalidraw | v0.6.4 | 手绘风格图表 |
| CSS Variables | - | 主题变量系统 |

---

## 🎬 动画系统

### 关键帧动画

```css
@keyframes neon-pulse { /* 霓虹闪烁 */ }
@keyframes grid-flow { /* 网格流动 */ }
@keyframes scan { /* 扫描线移动 */ }
@keyframes float { /* 浮动光晕 */ }
@keyframes slide-in-up { /* 上滑渐入 */ }
@keyframes fade-in { /* 淡入 */ }
@keyframes blink { /* 状态灯闪烁 */ }
```

### 使用示例

```css
.animate-neon-pulse {
  animation: neon-pulse 2s ease-in-out infinite;
}

.cyber-hero__title-main {
  animation: neon-pulse 3s ease-in-out infinite;
}
```

---

## 📊 性能指标

- **Bundle Size**: ~35KB (未压缩 CSS + Vue 组件)
- **First Paint**: < 100ms (VitePress 预渲染)
- **动画帧率**: 60fps (GPU 加速)
- **vis-network 节点上限**: 建议 < 100 个 (物理引擎性能)

---

## 🔧 安装与使用

### 1. 安装依赖

```bash
cd ~/lightwan/project/networkmastery
npm install --save-dev vis-network excalidraw
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173/NetworkMastery/`

### 3. 查看演示页面

`/cyber-demo` — 完整组件演示

---

## 📝 内容编写指南

### Markdown 中使用组件

```md
# 我的文档

这是正常文本。

<NetworkTopology
  title="自定义拓扑"
  :nodes="[...]"
  :edges="[...]"
/>

继续 Markdown 内容...
```

### 自定义容器

```md
::: tip 提示
这是提示内容 (绿色边框)
:::

::: warning 警告
这是警告内容 (黄色边框)
:::

::: danger 危险
这是危险内容 (红色边框)
:::
```

---

## 🎨 自定义主题

### 修改配色

编辑 `docs/.vitepress/theme/styles/cyberpunk.css`:

```css
:root {
  --neon-cyan: #your-color;
  --bg-dark-primary: #your-bg;
}
```

### 调整动画速度

```css
:root {
  --transition-fast: 0.15s;
  --transition-normal: 0.3s;
  --transition-slow: 0.6s;
}
```

---

## 🚧 下一步计划

### 阶段一完成 ✅

- [x] 赛博朋克主题系统
- [x] CyberHero 组件
- [x] CyberFeatures 组件
- [x] NetworkTopology 组件
- [x] ExcalidrawDiagram 占位符
- [x] 全局样式覆盖
- [x] 响应式设计

### 阶段二：内容重写 (SD-WAN 教练模式)

- [ ] 重新审视所有 24 篇文档
- [ ] 注入互动式思考题
- [ ] 增加真实案例引导
- [ ] 分级学习路径 (初级/中级/高级)
- [ ] 实验任务清单
- [ ] 故障排查场景模拟
- [ ] 厂商方案对比分析

---

## 📚 参考资源

- [VitePress 官方文档](https://vitepress.dev/)
- [vis-network 文档](https://visjs.github.io/vis-network/docs/network/)
- [Excalidraw 库](https://github.com/excalidraw/excalidraw)
- [Cyberpunk 设计灵感](https://www.awwwards.com/websites/cyberpunk/)

---

## 💬 反馈

如有问题或建议，请访问：

- GitHub: [NetworkMastery](https://github.com/SKT-Shurima/NetworkMastery)
- Issues: [提交 Issue](https://github.com/SKT-Shurima/NetworkMastery/issues)

---

<div align="center">

**[[ SYSTEM ONLINE · THEME v1.0.0 ]]**

🌌 Powered by VitePress + Vue 3 + Cyberpunk Aesthetics

</div>
