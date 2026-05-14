# SD-WAN 案例文档图表资源库

本目录包含 NetworkMastery 中三个 SD-WAN 实战案例的高质量可视化资源，包括增强的 Mermaid 图表、SVG 拓扑图和 Excalidraw 兼容格式。

## <Icon name="folder" color="cyan" /> 目录结构

```
diagrams/
├── README.md                          # 本文件
├── enhanced-mermaid/                  # 改进的 Mermaid 图表（含详细说明）
│   ├── case1-architecture.md         # 案例1：制造业集团架构
│   ├── case2-security.md             # 案例2：金融公司零信任框架
│   └── case3-global.md               # 案例3：互联网公司全球化网络
├── svg/                               # 高质量 SVG 拓扑图（可缩放矢量）
│   ├── case1-topology.svg            # 制造业拓扑示意图
│   ├── case2-zerotrust.svg           # 零信任框架架构图
│   └── case3-global.svg              # 全球网络拓扑图
└── excalidraw/                        # Excalidraw 兼容 JSON 格式（可编辑）
    ├── case1-architecture.json        # 制造业架构图
    └── (case2 和 case3 即将推出)
```

## <Icon name="target" color="magenta" /> 各案例概览

### 案例 1：制造业集团的成本优化与敏捷扩展

**主要特点**：
- 50 个工厂的 MPLS VPN 全面优化
- 成本降低 65%（年省 624 万）
- 部署周期减少 90%（3 周→3 天）
- ERP 延迟改进 60%（200ms→80ms）

**关键文件**：
- `enhanced-mermaid/case1-architecture.md` - 增强版 Mermaid 图表 + 详细说明
- `svg/case1-topology.svg` - 完整拓扑架构图
- `excalidraw/case1-architecture.json` - 可编辑版本

**图表要点**：
```
总部控制器 → 分别管理多个工厂网关
           ↓
    智能策略引擎 (ERP 优先级最高)
           ↓
    自动选路优化 (MPLS > 专网 > 宽带)
           ↓
    成本和性能双重优化
```

---

### 案例 2：金融公司的零信任安全升级

**主要特点**：
- 身份与设备信任四层验证
- 安全事件检测时间减少 98%（8h→2-5min）
- 数据泄露事件 100% 消除
- 合规审计覆盖率提升至 100%

**关键文件**：
- `enhanced-mermaid/case2-security.md` - 零信任详解 + 认证流程
- `svg/case2-zerotrust.svg` - 五层安全架构图
- `excalidraw/case2-security.json` - 可编辑版本（待生成）

**图表要点**：
```
用户与设备 → 身份认证 + 设备信任评估 + 风险评分
           ↓
    SD-WAN 安全网关
           ↓
    动态策略决策（三级权限）
           ↓
    微分段隔离 + 完整审计
```

---

### 案例 3：互联网公司的全球化网络

**主要特点**：
- 15 个全球技术中心智能互联
- 全球延迟优化 81%（800ms→150ms）
- CI/CD 周期提升 71%（45min→13min）
- 跨国带宽成本降低 45%

**关键文件**：
- `enhanced-mermaid/case3-global.md` - 全球网络 + 数据流向管理
- `svg/case3-global.svg` - 全球拓扑图 + 流量管理
- `excalidraw/case3-global.json` - 可编辑版本（待生成）

**图表要点**：
```
美国Hub ↔ 欧洲Hub (GDPR)
   ↓
中国Hub (数据主权隔离)
   ↓
亚太区域自治 (新加坡/日本/印度)
   ↓
智能路由 + 法规合规自动化
```

---

## <Icon name="refresh-cw" color="cyan" /> 使用指南

### 1. 在 Markdown 中嵌入 Mermaid 图表

直接使用 `enhanced-mermaid/` 中的 Markdown 文件内容：

```markdown
## 网络架构

# 复制 enhanced-mermaid/case1-architecture.md 中的 mermaid 代码块
```mermaid
graph TB
    ... 完整的 mermaid 代码 ...
```
```

### 2. 在网页中使用 SVG

SVG 文件可以直接嵌入 HTML：

```html
<!-- 案例1：制造业拓扑图 -->
<img src="svg/case1-topology.svg" alt="制造业 SD-WAN 拓扑" width="100%">

<!-- 或使用 iframe 来保留交互性 -->
<iframe src="svg/case1-topology.svg" width="100%" height="800"></iframe>
```

### 3. 在 Excalidraw 中编辑

1. 访问 https://excalidraw.com
2. 点击 "Open" → "Import"
3. 选择 `excalidraw/` 目录中的 JSON 文件
4. 进行编辑和定制

---

## <Icon name="bar-chart-3" color="cyan" /> 图表特性对比

| 特性 | Mermaid | SVG | Excalidraw JSON |
|------|---------|-----|-----------------|
| **可编辑性** | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ |
| **清晰度** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **文件大小** | 小 | 中 | 中等 |
| **渲染速度** | 快 | 极快 | 快 |
| **支持度** | GitHub/GitLab | 通用 | Excalidraw |
| **最佳用途** | 文档嵌入 | 演讲/打印 | 团队协作编辑 |

---

## <Icon name="palette" color="magenta" /> 设计说明

### 配色方案

- **总部/控制中心**：黄色 (`#fef3c7`) - 代表权力和控制
- **工厂/边界网关**：蓝色 (`#dbeafe`) - 代表信任和安全
- **小型设备**：浅黄 (`#fef3c7`) - 代表轻量级
- **安全框架**：紫色 (`#e8f5e9`) - 代表隐私和保护
- **互联网/出口**：粉色 (`#fce4ec`) - 代表开放和灵活

### 图表元素

- **实线** → 直接连接、单向信息流
- **虚线** → IPSec 加密隧道、法规隔离
- **粗线** → 关键链路、高优先级
- **细线** → 辅助链路、低优先级

---

## <Icon name="wrench" color="cyan" /> 维护与更新

### 如何更新图表

1. **修改 Mermaid** → 直接编辑 `enhanced-mermaid/` 下的 `.md` 文件
2. **修改 SVG** → 使用 Illustrator/Inkscape 编辑，或在 Excalidraw 中重新导出
3. **修改 Excalidraw** → 在 excalidraw.com 上编辑，然后导出为 JSON

### 集成到网站

如果使用 Docusaurus/VitePress，可以配置自动渲染：

```javascript
// 支持直接嵌入 SVG
import Case1Topology from './diagrams/svg/case1-topology.svg';

export function Architecture() {
  return <Case1Topology />;
}
```

---

## <Icon name="pencil-line" color="cyan" /> 相关文档

- [案例 1：制造业集团详解](../cases.md#案例-1制造业集团的成本优化与敏捷扩展)
- [案例 2：金融公司详解](../cases.md#案例-2金融公司的零信任安全升级)
- [案例 3：互联网公司详解](../cases.md#案例-3互联网公司的全球化网络)

---

## <Icon name="sparkles" color="magenta" /> 最佳实践

### 文档中使用

**推荐**：在 Markdown 文档中嵌入 Mermaid 图表，因为：
- 支持 GitHub/GitLab 原生渲染
- 便于版本控制和 diff 查看
- 易于更新和维护

### 演讲/展示

**推荐**：使用 SVG 或导出为 PNG，因为：
- 分辨率独立（无论多大都清晰）
- 文件体积小
- 支持所有演讲软件

### 协作编辑

**推荐**：使用 Excalidraw JSON，因为：
- 团队可以实时编辑
- 支持注释和版本历史
- 易于定制和扩展

---

## <Icon name="rocket" color="magenta" /> 快速开始

1. 选择合适的文件格式：
   - <Icon name="file-text" color="cyan" /> 需要在 Markdown 中？→ `enhanced-mermaid/`
   - <Icon name="image" color="cyan" /> 需要高质量展示？→ `svg/`
   - <Icon name="pencil" color="cyan" /> 需要编辑修改？→ `excalidraw/`

2. 复制相应的文件链接或内容

3. 集成到你的项目

4. 定期更新和维护

---

**最后更新**: 2025-01-15  
**维护者**: NetworkMastery 项目  
**版本**: 1.0  
