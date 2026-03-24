# Markdown 图表集成示例

本文件展示如何在 Markdown 文档中集成各种新的图表格式。

---

## 示例 1: 使用 SVG 高质量架构图

### 方式 A: 简单的 HTML img 标签（推荐）

```markdown
## SD-WAN 三平面架构

![SD-WAN 架构](./arch-diagram.svg)

*图1: SD-WAN 三平面分离架构，展示了 Management Plane（管理平面）、Control Plane（控制平面）和 Data Plane（数据平面）的分离与配合。*

上面的图表展示了...
```

**优点**:
- 简洁，无需额外组件
- SVG 自动响应式
- 支持所有 Markdown 渲染器

**缺点**:
- 无法在 Markdown 中添加复杂的交互

### 方式 B: 使用 HTML img 标签（带标题和说明）

```markdown
<figure>
  <img src="./arch-diagram.svg" alt="SD-WAN 三平面架构" style="width: 100%; max-width: 900px; margin: 1.5rem auto; display: block;">
  <figcaption style="text-align: center; color: #666; margin-top: 0.5rem;">
    图1: SD-WAN 三平面分离架构
  </figcaption>
</figure>
```

**优点**:
- 更语义化
- 可自定义样式

---

## 示例 2: 使用 vis-network 交互式拓扑

### 实现一个可交互的网络拓扑

```markdown
## 网络拓扑可视化

下面是一个交互式的网络拓扑图。你可以拖拽节点、缩放和平移查看。

<VisNetworkViewer 
  :data="JSON.stringify({
    nodes: [
      { 
        id: 'hq',
        label: '总部（苏州）',
        color: '#10b981',
        title: '总部数据中心<br/>部署 Controller 和 Orchestrator'
      },
      { 
        id: 'f1',
        label: '工厂 1',
        color: '#3b82f6',
        title: '大型工厂<br/>500 Mbps MPLS + 宽带'
      },
      { 
        id: 'f2',
        label: '工厂 2',
        color: '#3b82f6',
        title: '大型工厂<br/>500 Mbps MPLS + 宽带'
      },
      { 
        id: 'f3',
        label: '小工厂群',
        color: '#06b6d4',
        title: '45 个小工厂<br/>宽带 + 4G（无 MPLS）'
      },
      { 
        id: 'isp',
        label: 'ISP',
        color: '#f59e0b',
        title: '互联网服务提供商'
      }
    ],
    edges: [
      { 
        from: 'hq',
        to: 'f1',
        label: 'MPLS + ISP',
        color: { color: '#ef4444', highlight: '#dc2626' },
        title: '总部到工厂1的混合链路'
      },
      { 
        from: 'hq',
        to: 'f2',
        label: 'MPLS + ISP',
        color: { color: '#ef4444', highlight: '#dc2626' },
        title: '总部到工厂2的混合链路'
      },
      { 
        from: 'hq',
        to: 'f3',
        label: 'ISP + 4G',
        color: { color: '#10b981', highlight: '#059669' },
        title: '总部到小工厂的互联网与备份'
      },
      { 
        from: 'hq',
        to: 'isp',
        label: '互联网出口',
        color: '#f59e0b',
        title: 'Controller 管理'
      },
      { 
        from: 'f1',
        to: 'f2',
        label: 'IPSec',
        color: { color: '#06b6d4', highlight: '#0891b2' },
        title: '工厂间直连隧道'
      },
      { 
        from: 'f1',
        to: 'f3',
        label: 'IPSec',
        color: { color: '#06b6d4', highlight: '#0891b2' },
        title: '工厂间直连隧道'
      },
      { 
        from: 'f2',
        to: 'f3',
        label: 'IPSec',
        color: { color: '#06b6d4', highlight: '#0891b2' },
        title: '工厂间直连隧道'
      }
    ]
  })"
  :showLegend="true"
/>

**交互提示**:
- 🖱️ **拖拽节点** - 移动网络中的任意节点
- 🔍 **滚轮缩放** - 放大或缩小视图
- 🖱️ **拖拽背景** - 平移整个拓扑
- ℹ️ **悬停查看** - 鼠标悬停在节点或边上查看详情
```

**优点**:
- 高度交互，用户体验好
- 实时响应，无需重新加载
- 支持复杂的网络拓扑展示

**参数说明**:

| 参数 | 类型 | 说明 |
|------|------|------|
| `nodes` | Array | 网络节点数组 |
| `nodes[i].id` | String | 节点唯一标识 |
| `nodes[i].label` | String | 节点显示文本 |
| `nodes[i].color` | String | 节点颜色 |
| `nodes[i].title` | String | 悬停提示（支持 HTML） |
| `edges` | Array | 网络连接数组 |
| `edges[i].from` | String | 连接源节点 ID |
| `edges[i].to` | String | 连接目标节点 ID |
| `edges[i].label` | String | 连接标签 |
| `edges[i].color` | Object \| String | 连接颜色 |
| `showLegend` | Boolean | 是否显示图例（默认 true） |

---

## 示例 3: 保留并优化的 Mermaid 图表

### 简单的流程图

```markdown
## 应用路由决策流程

\`\`\`mermaid
graph TD
    A["应用流量进入"] --> B["DPI 深包检测"]
    B --> C{"识别应用"}
    
    C -->|ERP 系统| D["优先级: 最高"]
    C -->|Web 应用| E["优先级: 中"]
    C -->|文件下载| F["优先级: 低"]
    
    D --> G["选择最优链路<br/>MPLS > VPN > 宽带"]
    E --> H["平衡链路<br/>MPLS / 宽带"]
    F --> I["最经济链路<br/>宽带"]
    
    G --> J["评估链路质量<br/>延迟 / 丢包 / 带宽"]
    H --> J
    I --> J
    
    J --> K["IPSec 加密"]
    K --> L["转发到目标"]
    
    style A fill:#0ea5e9,color:#fff
    style B fill:#0284c7,color:#fff
    style C fill:#0c4a6e,color:#fff
    style D fill:#ef4444,color:#fff
    style E fill:#f59e0b,color:#fff
    style F fill:#10b981,color:#fff
    style J fill:#0284c7,color:#fff
    style L fill:#059669,color:#fff
\`\`\`

这个 Mermaid 图表展示了应用流量的完整决策过程。系统会根据应用类型自动选择最合适的链路...
```

**优点**:
- 文本格式，易于版本控制
- 自动应用主题样式
- VitePress Mermaid 插件已支持

---

## 示例 4: 组合使用多种图表

### 在同一个章节中混合使用

```markdown
## SD-WAN 实战案例：制造业集团

### 网络架构演进

#### 改造前：传统 MPLS 架构

下面是改造前的网络架构，存在成本高、性能差、扩展难等问题：

![改造前的网络架构](./cases-case1-topo-before.svg)

**问题分析**:
- 成本：年费 960 万元，按工厂平均 19.2 万元/年
- 性能：Hair Pinning 回源导致延迟高（200ms+）
- 扩展：新工厂部署周期 3-4 周

#### 改造后：SD-WAN 架构

下面是 SD-WAN 改造后的拓扑，实现了智能选路和成本优化：

![改造后的网络架构](./cases-case1-topology.svg)

#### 网络流量可视化

下面的交互式拓扑展示了改造后的网络拓扑和流量走向：

<VisNetworkViewer 
  :data="JSON.stringify({
    // ... 节点和边的定义
  })"
/>

#### 应用路由决策

改造后，不同应用采用不同的路由策略：

\`\`\`mermaid
graph LR
    A["ERP 系统"] --> B["MPLS"]
    C["Web 应用"] --> D["宽带"]
    E["文件备份"] --> F["最便宜"]
\`\`\`

### 效果对比

| 指标 | 改造前 | 改造后 | 改进 |
|------|--------|--------|------|
| 年成本 | 960 万 | 280 万 | ⬇️ 71% |
| 部署周期 | 3-4 周 | 2-3 天 | ⬇️ 90% |
| 延迟（ERP） | 200ms | <100ms | ⬆️ 50% |
| 链路利用率 | 30% | 85% | ⬆️ 183% |
```

---

## 最佳实践

### ✅ 推荐做法

1. **使用 SVG 用于复杂架构图**
   - 高质量、可缩放
   - 支持亮/暗主题
   - 文件大小小

2. **使用 vis-network 用于交互式拓扑**
   - 用户可探索网络
   - 支持悬停提示
   - 实时响应

3. **保留 Mermaid 用于简单流程图**
   - 快速编写
   - 易于维护
   - 自动主题应用

4. **为每个图表提供清晰的标题和说明**
   - 帮助读者理解
   - 改善可访问性
   - 支持搜索索引

### ❌ 避免的做法

1. 不要在一个页面放太多图表（容易分散注意力）
2. 不要使用低分辨率或模糊的图表
3. 不要省略 alt 文本和标题
4. 不要在 SVG 中放入过多文本（难以维护）

---

## 性能建议

### SVG 图表优化

```bash
# 压缩 SVG 文件
npm install -g svgo
svgo --multipass arch-diagram.svg
```

### vis-network 优化

- 限制节点数（>500 个会很慢）
- 使用 `physics: false` 禁用物理模拟（如果不需要）
- 启用 `cache` 选项复用布局

### 加载性能

- 使用懒加载加载图表
- 压缩 JSON 数据
- 考虑使用 CDN 加速 SVG

---

## 故障排查

### SVG 不显示

- 检查文件路径是否正确
- 确保 SVG 有 `viewBox` 属性
- 在浏览器控制台查看错误信息

### vis-network 不渲染

- 检查节点和边的数据格式
- 确保至少有一个节点和一条边
- 在浏览器控制台查看 JavaScript 错误

### 暗色模式不适配

- 确保 SVG 使用 CSS 变量（如 `fill="var(--color)"`）
- 检查 `.dark` 类是否被应用到根元素
- 使用浏览器开发工具的暗色模式预览

---

## 更多资源

- [SVG 教程](https://developer.mozilla.org/zh-CN/docs/Web/SVG)
- [vis-network 文档](https://visjs.github.io/vis-network/)
- [Mermaid 主题配置](https://mermaid.js.org/syntax/themes.html)
- [VitePress 静态资源处理](https://vitepress.dev/guide/asset-handling)

---

**最后更新**: 2026-03-16 CST
