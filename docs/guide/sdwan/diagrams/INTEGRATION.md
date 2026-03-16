# 图表资源集成指南

本文档说明如何将生成的高质量图表资源集成到 `docs/guide/sdwan/cases.md` 中。

## 📋 资源清单

已生成的文件：

```
diagrams/
├── README.md                          ✅ 资源库总览
├── COMPARISON.md                      ✅ 三个案例对比表
├── INTEGRATION.md                     ✅ 本文件（集成指南）
├── enhanced-mermaid/
│   ├── case1-architecture.md         ✅ 案例1 - 增强Mermaid图表
│   ├── case2-security.md             ✅ 案例2 - 零信任框架详解
│   └── case3-global.md               ✅ 案例3 - 全球网络拓扑
├── svg/
│   ├── case1-topology.svg            ✅ 制造业拓扑图
│   ├── case2-zerotrust.svg           ✅ 零信任安全框架
│   └── case3-global.svg              ✅ 全球网络拓扑
└── excalidraw/
    ├── case1-architecture.json        ✅ 制造业架构（可编辑）
    ├── case2-zerotrust.json          ✅ 零信任框架（可编辑）
    └── case3-global.json             ✅ 全球网络（可编辑）
```

## 🔄 集成方式

### 选项 1: 最小化改动（推荐）

保留原 `cases.md` 的文本内容和基础 Mermaid 图表，在相关位置添加指向高质量资源的链接。

**修改位置**：在原有 Mermaid 图表后添加一行：

```markdown
### 案例 1：制造业集团的成本优化与敏捷扩展

#### 架构设计

```mermaid
[原有的 Mermaid 代码]
```

**📊 详细资源**: 
- [增强版 Mermaid 图表 + 说明](./diagrams/enhanced-mermaid/case1-architecture.md)
- [高质量 SVG 拓扑图](./diagrams/svg/case1-topology.svg)
- [可编辑 Excalidraw 版本](./diagrams/excalidraw/case1-architecture.json)
```

**优点**：
- 改动最小，保持原文档结构
- 用户可自主选择查看详细资源
- 易于版本控制

**缺点**：
- 图表显示质量相对基础

---

### 选项 2: 完全替换（推荐用于网页）

将原 Mermaid 图表替换为更详细的版本（从 `enhanced-mermaid/` 中复制内容）。

**修改步骤**：

1. 打开 `docs/guide/sdwan/diagrams/enhanced-mermaid/case1-architecture.md`
2. 复制完整的 Mermaid 代码块（```mermaid ... ```）
3. 替换原 `cases.md` 中对应的 Mermaid 代码块
4. 在 Mermaid 代码块后添加：

```markdown
📍 **架构说明**：
- **总部**：集中控制和策略下发
- **大工厂**：MPLS + 宽带 + 4G 多链路
- **小工厂**：仅需宽带 + 4G（成本最优）
- **智能策略**：ERP 优先，其他应用自适应选路

查看详细资源：[SVG高质量图](./diagrams/svg/case1-topology.svg) | [可编辑版本](./diagrams/excalidraw/case1-architecture.json)
```

**优点**：
- 图表更详细，包含完整标注
- 用户在 GitHub 上也能看到好的效果
- 专业感强

**缺点**：
- 需要更新原文档
- Mermaid 代码会更长

---

### 选项 3: 混合方案（最佳体验）

对于静态文档保持 Mermaid（便于 GitHub 渲染），对于网页版本使用 SVG。

**Markdown 中**：

```markdown
### 案例 1：制造业集团的成本优化与敏捷扩展

#### 架构设计

```mermaid
graph TB
    HQ["🏢 总部（苏州）<br/>SD-WAN Controller"]
    [简化的 Mermaid 代码]
```

> 💡 **想要更详细的图表吗？** 
> - [增强版 Mermaid](./diagrams/enhanced-mermaid/case1-architecture.md) - 包含详细说明
> - [高清 SVG 图](./diagrams/svg/case1-topology.svg) - 用于演讲和打印
> - [可编辑版本](./diagrams/excalidraw/case1-architecture.json) - 在 Excalidraw 中自定义
```

**HTML 网页中**（如果使用 Docusaurus/VitePress）：

```html
<!-- 用高质量 SVG 替代 Mermaid -->
<div class="diagram-container">
  <img src="./diagrams/svg/case1-topology.svg" 
       alt="制造业 SD-WAN 架构" 
       class="diagram-image">
</div>
```

---

## 🎯 具体集成步骤

### 步骤 1: 准备文档

在 `cases.md` 最后添加：

```markdown
---

## 📚 详细资源库

本文档的所有图表已生成高质量版本，包括：

- **Mermaid 增强版**：在 Markdown 中即时渲染，包含详细标注
- **SVG 拓扑图**：矢量图形，无限缩放无损，适合演讲和打印
- **Excalidraw 版本**：可编辑的交互式图表，支持团队协作

👉 [查看完整资源库](./diagrams/README.md)
```

### 步骤 2: 更新各个案例

对于每个案例，在原 Mermaid 代码块后添加：

**案例 1**：
```markdown
详细的图表和说明可查看 [这里](./diagrams/enhanced-mermaid/case1-architecture.md)。

对应的高质量 SVG 图：[制造业拓扑图](./diagrams/svg/case1-topology.svg)
```

**案例 2**：
```markdown
详细的零信任框架可查看 [这里](./diagrams/enhanced-mermaid/case2-security.md)。

对应的高质量 SVG 图：[零信任安全框架](./diagrams/svg/case2-zerotrust.svg)
```

**案例 3**：
```markdown
详细的全球网络架构可查看 [这里](./diagrams/enhanced-mermaid/case3-global.md)。

对应的高质量 SVG 图：[全球网络拓扑](./diagrams/svg/case3-global.svg)
```

### 步骤 3: 创建总体对比表

在文档适当位置添加：

```markdown
---

## 🔄 三个案例快速对比

需要快速比较三个案例？查看 [详细对比表](./diagrams/COMPARISON.md)

| 企业类型 | 主要价值 | 成本节省 | ROI 周期 |
|---------|---------|---------|---------|
| 制造业 | 成本优化 + 敏捷扩展 | 65% | 2 年 |
| 金融 | 安全增强 + 合规 | 30% | 1 年 |
| 互联网 | 全球化 + 高性能 | 45% | 1 年 |

[👉 查看完整对比分析](./diagrams/COMPARISON.md)
```

---

## 📱 对不同平台的优化

### GitHub/GitLab

✅ Mermaid 图表会自动渲染  
✅ SVG 图片会显示  
⚠️ Excalidraw JSON 需要外链打开

**优化建议**：在 GitHub 中使用 Mermaid + SVG 组合

### Docusaurus

```javascript
// docusaurus.config.js
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // 启用 Mermaid 支持
          remarkPlugins: [
            [require('@docusaurus/remark-plugins/lib/mermaid'), {}],
          ],
        },
      },
    ],
  ],
};
```

### VitePress

```javascript
// .vitepress/config.js
export default {
  markdown: {
    // 启用 Mermaid
    config: (md) => {
      md.use(require('markdown-it-mermaid').default);
    },
  },
};
```

### 静态 HTML

```html
<!-- 方案 1: 使用 SVG -->
<img src="diagrams/svg/case1-topology.svg" alt="案例1拓扑">

<!-- 方案 2: 使用 Mermaid CDN -->
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<div class="mermaid">
  graph TB
  ...
</div>
```

---

## 🔧 维护指南

### 更新流程

1. **修改 Mermaid** 
   - 编辑 `enhanced-mermaid/*.md`
   - 自动在 Markdown 中渲染

2. **修改 SVG**
   - 在 Excalidraw 中打开 JSON
   - 进行修改
   - 导出为 SVG (File → Export → SVG)
   - 覆盖原 SVG 文件

3. **修改 Excalidraw JSON**
   - 打开 https://excalidraw.com
   - 导入 JSON 文件
   - 修改
   - 导出为 JSON
   - 覆盖原 JSON 文件

4. **同步 cases.md**
   - 如果改动了 Mermaid，更新 cases.md 中的对应代码块
   - 如果只改动 SVG/JSON，无需修改 cases.md（只需更新指向链接）

### 版本控制

所有文件都在 Git 中跟踪：

```bash
# 查看图表文件的历史
git log --follow docs/guide/sdwan/diagrams/svg/case1-topology.svg

# 对比两个版本
git diff HEAD~1 docs/guide/sdwan/diagrams/enhanced-mermaid/case1-architecture.md
```

---

## ✅ 集成检查清单

- [ ] 所有 `diagrams/` 文件已添加到 Git
- [ ] `cases.md` 已添加指向资源库的链接
- [ ] 每个案例都有相应的 Mermaid + SVG + JSON 资源
- [ ] 链接在本地验证无误
- [ ] README.md 已更新，包含使用说明
- [ ] COMPARISON.md 已添加，提供对比分析
- [ ] 网站构建不报错（如有静态生成）

---

## 🚀 快速启动

### 对于急着集成的人：

1. 复制以下内容到 `cases.md` 最后：

```markdown
---

## 📊 高质量图表资源

本文档的所有架构图已生成高质量版本：

| 格式 | 用途 | 位置 |
|------|------|------|
| **Mermaid** | GitHub/文档中即时渲染 | [`diagrams/enhanced-mermaid/`](./diagrams/enhanced-mermaid/) |
| **SVG** | 演讲、打印、网页 | [`diagrams/svg/`](./diagrams/svg/) |
| **Excalidraw** | 团队协作编辑 | [`diagrams/excalidraw/`](./diagrams/excalidraw/) |

👉 [进入资源库](./diagrams/README.md)

[三个案例对比分析](./diagrams/COMPARISON.md)
```

2. Done! 所有资源已可用。

---

## 📞 常见问题

**Q: SVG 太大了怎么办？**  
A: 可以在网页中加 CSS：
```css
.diagram-image { max-width: 100%; height: auto; }
```

**Q: 如何在 PowerPoint 中使用这些图表？**  
A: 推荐使用 SVG，可直接拖入 PowerPoint 或转换为 PNG/PDF

**Q: 是否可以自定义颜色方案？**  
A: 
- Mermaid: 编辑 `.md` 文件中的代码
- SVG: 在 Illustrator 中编辑
- Excalidraw: 打开 JSON，修改后重新导出

**Q: 如何将这些资源发布到网站？**  
A: 确保 `diagrams/` 目录复制到构建输出中

---

**最后更新**: 2025-01-15  
**相关文件**: 
- [资源库 README](./README.md)
- [三个案例对比](./COMPARISON.md)
