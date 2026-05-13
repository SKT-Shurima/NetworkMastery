# NetworkMastery · 知识图谱驱动的站点重构

**日期**：2026-05-13
**状态**：设计待最终评审
**类型**：全面重构（保留现有 17 章 md 内容，新增图谱驱动层）

---

## 1. 背景与目标

NetworkMastery 是一个基于 VitePress 的网络知识深度文档站，现有 17 个章节，重点在 SD-WAN（5 篇深度文章）。当前痛点：

1. 通俗化解释碎片化、术语关联是隐式的（靠链接）
2. 没有可视化导航，章节是平铺列表
3. 全文搜索仅子串匹配，无模糊容错
4. "由浅入深"是隐含的，没有显式难度等级或学习路径
5. SD-WAN 虽是核心内容，但在 17 个章节里只是其中之一

### 1.1 目标（用户的 6 条诉求）

1. **通俗语言 + 术语关联**：专业术语在正文出现处自动有"通俗解释"卡，且能看到术语之间的关系
2. **现代感思维导图**：可缩放的图谱，富科技感、不传统
3. **好维护 + 模糊查询**：作者改动成本低；用户支持拼写容错的搜索
4. **手机 / PC 双端**：响应式
5. **由浅入深**：显式学习路径，标注难度
6. **SD-WAN 为中心**：图谱、首页、默认视图都以 SD-WAN 为焦点

### 1.2 非目标

- 不重写现有 17 章 markdown 内容（作为深度展开内容继续存在）
- 不替换 VitePress（在它的 theme 和 build pipeline 上做扩展）
- 不做账户系统 / 评论 / 学习进度持久化（本期范围外）
- 不做 AI 问答（本期范围外）

---

## 2. 核心设计决策

| # | 维度 | 决策 | 备选与放弃理由 |
|---|------|------|----------|
| D1 | 图谱形态 | Hex 主图谱（六边形战术格）+ Metro 线沿 hex **共享边**走 | 力导向图（关系优先但不表达深度）、放射星盘（信息密度过高）、地铁线路图（重叠混乱）均不满足"现代感+清晰" |
| D2 | 配色 | 2 种主霓虹色：青蓝（默认）+ 洋红（SD-WAN 焦点区）+ 一条绿色辅助线 | 9 种领域色被否决（"花里胡哨"） |
| D3 | 节点颗粒度 | **概念级**：1 hex = 1 概念，全站 200-400 个 | 文章级（手机密度过高）、章节级（太粗、看不到 SD-WAN 内部 5 篇） |
| D4 | 布局策略 | **标签页切换**：7 个域，每域 ≤50 hex | 单巨幅画布（手机不友好）、域分簇缩放（交互复杂）、默认聚焦 SD-WAN（其他域埋藏太深） |
| D5 | 入口策略 | 保留 Cyberpunk Hero + 「进入图谱」CTA 按钮 | 直接 = 图谱（损失仪式感）、星礁总览（多一步引导） |
| D6 | 点击行为 | 侧边抽屉概念卡，两个出口：①「展开为全屏」继续在图谱上下文里大窗读；②「深入阅读」跳转到 canonical md | 直接跳文章页（图谱上下文丢失）、悬停预览（手机不支持） |
| D7 | 移动端 | 同一张图 + 双指缩放（不做单独移动 UI） | 列表降级（两套 UI 维护成本）、单一路线模式（探索感丢失） |
| D8 | 术语解释 | Build 时**自动扫描** + 每篇 md 内**该术语首次出现**加下划线+hover 卡（再次出现不标） | 手动 `<TermRef>`（额外写作成本）、全文每次出现都标记（视觉噪音） |
| D9 | 学习路线 | 手工策划 `paths.yaml` | 算法生成（机械感、不够人性）、混合（增加复杂度） |
| D10 | 实现栈 | 纯 SVG + Vue 组件 + CSS keyframes + 自写 hex 数学 | D3 + d3-hexbin（90KB 包重）、Cytoscape.js（260KB、过度框架） |
| D11 | 搜索 | MiniSearch（pure JS，~10KB） | Algolia（需 API key + 外部依赖）、FlexSearch（中文支持弱）、VitePress 原生（无模糊容错） |
| D12 | 数据组织 | `data/concepts/<domain>.yaml` + `data/paths.yaml` + `data/layouts/<domain>.yaml` | md frontmatter 内嵌（耦合、不能跨文章引用） |

---

## 3. 系统架构

四层架构，自下而上：

```
┌─────────────────────────────────────────────────────┐
│  L4 · 交互层 (Interaction)                          │
│  ConceptDrawer · TermTooltip · SearchBar · LineToolbar │
├─────────────────────────────────────────────────────┤
│  L3 · 渲染层 (Render)                               │
│  <KnowledgeGraph> <DomainTabs> <GraphCanvas>        │
│  <HexCell> <MetroEdge>                              │
│  原生 SVG + CSS keyframes + Vue 3 Composition       │
├─────────────────────────────────────────────────────┤
│  L2 · 构建层 (Build)                                │
│  build-graph.mjs    (yaml → graph.json + 邻接验证)  │
│  build-search.mjs   (MiniSearch index 生成)         │
│  term-scanner.js    (markdown-it 插件，注入 hover)  │
├─────────────────────────────────────────────────────┤
│  L1 · 数据层 (Data)                                 │
│  data/concepts/<domain>.yaml  (200-400 个概念定义)  │
│  data/paths.yaml              (学习路线序列)        │
│  data/layouts/<domain>.yaml   (hex 轴坐标)          │
│  docs/guide/**/*.md           (现有文章 = 深度内容) │
└─────────────────────────────────────────────────────┘
```

### 3.1 关键原则

1. **数据 / 渲染解耦**：概念库是独立 yaml，不写在 md frontmatter。一个 md 可解释多个概念；一个概念可横跨多个 md。
2. **构建时计算，运行时只读**：所有 hex 坐标、邻接关系、路线段几何、搜索索引都在 build 时算好。前端只下载 `graph.json` + `search-index.json`，零运行时计算。
3. **现有 17 章 md 不动**：作为"深度展开"内容，通过 `concept.canonical.file` 引用。
4. **VitePress 仍是骨架**：不替换。只在 theme 加新组件，在 build 加预处理脚本。

---

## 4. 数据 Schema

### 4.1 `data/concepts/<domain>.yaml`

```yaml
domain:
  id: sdwan
  name_zh: SD-WAN
  name_en: Software-Defined WAN
  color: magenta            # 该域 hex 主色（cyan / magenta / green / ...）
  default: true             # 是否默认进入的标签页（最多 1 个）
  order: 3                  # tab 排列顺序

concepts:
  - id: sdwan-core                        # 全局唯一
    name_zh: SD-WAN
    name_en: Software-Defined WAN
    short: 用软件智能调度多条物理链路的广域网技术    # 1-2 句通俗解释（用于 hover）
    long: |                                  # 段落级展开（用于抽屉卡）
      想象你管 200 家门店的网络，每家有 MPLS 专线 + 普通宽带 + 4G 备份。
      传统路由器只会按 IP 选路，不知道视频会议应该走哪条。SD-WAN 给每条
      链路打分（延迟/丢包/抖动），按业务类型动态选路。
    level: L2                               # L1/L2/L3/L4
    aliases: [软件定义广域网, sd wan, sdwan]      # 模糊搜索同义词
    neighbors:                              # 用 id 引用，不写坐标
      - sdwan-concept
      - sdwan-arch
      - sdwan-routing
      - sdwan-security
      - sdwan-case
      - wan
    canonical:
      file: /guide/sdwan/concepts.md
      anchor: '#sd-wan-概念与价值'
    is_hub: true                            # 该域核心节点（视觉放大 + 脉冲）
```

### 4.2 `data/paths.yaml`

```yaml
paths:
  - id: entry
    name_zh: 入门线
    color: '#00d4ff'
    description: 从 OSI 到 SD-WAN 的零基础路径
    stops: [osi, tcpip, ip-routing, wan, sdwan-core]

  - id: sdwan-deep
    name_zh: SD-WAN 主线
    color: '#ec4899'
    stops: [sdwan-core, sdwan-concept, sdwan-arch, sdwan-routing, sdwan-security, sdwan-case]

  - id: advanced
    name_zh: 进阶线
    color: '#10b981'
    stops: [sdn, sdwan-case, sdwan-core, sdwan-arch, container-network, multi-cloud]
```

### 4.3 `data/layouts/<domain>.yaml`

```yaml
sdwan:
  hex_size: 26              # 单 hex 半径（轴向）
  origin: [320, 160]        # SVG 中心点
  cells:
    - { id: osi,        row: 0, col: -3 }
    - { id: tcpip,      row: 0, col: -2 }
    - { id: ip-routing, row: 0, col: -1 }
    - { id: wan,        row: 1, col: -1 }    # 奇数 row 自动右偏
    - { id: sdwan-core, row: 2, col:  0 }
    # ...
```

### 4.4 构建产物 `docs/.vitepress/data/graph.json`

```json
{
  "domains": [
    { "id": "sdwan", "name_zh": "SD-WAN", "color": "magenta", "default": true, "order": 3 }
  ],
  "concepts": {
    "sdwan-core": {
      "...all yaml fields...": "",
      "domain": "sdwan",
      "x": 320, "y": 160,
      "shared_edges": [
        { "with": "wan", "dir": "NW", "x1": 297.49, "y1": 147, "x2": 320, "y2": 134 },
        { "with": "sdwan-concept", "dir": "NE", "x1": 320, "y1": 134, "x2": 342.52, "y2": 147 }
      ],
      "on_paths": ["entry", "sdwan-deep", "advanced"]
    }
  },
  "paths": [
    {
      "id": "sdwan-deep",
      "color": "#ec4899",
      "segments": [
        { "from": "sdwan-core", "to": "sdwan-concept", "x1": 320, "y1": 134, "x2": 342.52, "y2": 147 }
      ]
    }
  ]
}
```

---

## 5. 构建管线

```
yaml sources                     build pipeline                    runtime artifacts
─────────────                    ──────────────                    ──────────────────

concepts/*.yaml ──┐
paths.yaml ───────┼──→  build-graph.mjs  ────→  docs/.vitepress/data/graph.json
layouts/*.yaml ───┘    (轴坐标→像素, 邻接, 路径, 共享边几何, 校验)

concepts/*.yaml ─────→  build-search.mjs ────→  docs/.vitepress/data/search-index.json
docs/guide/**/*.md       (MiniSearch index: 概念 + 文章正文片段)

docs/guide/**/*.md ──→  term-scanner (md-it plugin) ──→  编译期 wrap 术语首次出现
                                                          <span class="term-ref" data-id="tcp">TCP</span>
```

### 5.1 接入方式

- `package.json`:
  ```json
  "scripts": {
    "prebuild": "node scripts/build-graph.mjs && node scripts/build-search.mjs",
    "predev":   "node scripts/build-graph.mjs && node scripts/build-search.mjs"
  }
  ```
- `vitepress.config.js`:
  - `markdown.config(md)` 注册 `term-scanner` 插件
  - 用 `chokidar` 在 dev 模式监听 `data/**` 变更，HMR

### 5.2 构建期校验（失败即报错，阻断 build）

| 校验 | 错误信息 |
|------|---------|
| 路线 stops 相邻性 | `paths.entry: stops[2] 'ip-routing' 和 stops[3] 'wan' 在 layout 中不是 hex 邻居` |
| 概念 id 唯一性 | `Duplicate concept id 'tcp' in concepts/basics.yaml and concepts/sdwan.yaml` |
| `canonical` 链接有效性 | `concept 'sdwan-arch' canonical file '/guide/sdwan/architecture.md#xxx' 锚点不存在` |
| 邻居引用对称性 | `concept 'tcp' 列了 'ip' 为邻居，但 'ip' 未列 'tcp'` |

---

## 6. 渲染组件

### 6.1 组件树

```
<KnowledgeGraph>                    # 顶层容器，负责 tab 状态 + 路由解析
├── <DomainTabs>                    # 顶部 7 个域 tab
├── <LineToolbar>                   # 路线开关 pills
├── <SearchBar>                     # MiniSearch 模糊搜索
├── <GraphCanvas>                   # SVG 主体（每个域一份）
│   ├── <HexCell v-for>             # 单个 hex，含 hover/click 行为
│   ├── <MetroEdge v-for>           # 路线段（沿共享边）
│   └── <Endpoint v-for>            # 路线起止标记
├── <ConceptDrawer>                 # 侧边抽屉（点击 hex 触发）
│   ├── 概念卡（short / long / level / 邻居 chips / on_paths）
│   └── "深入阅读" 按钮 → 跳转 canonical
└── <SearchResults>                 # 搜索结果浮层
```

全局组件（在每个 md 页面上自动启用）：
- `<TermTooltip>` — hover `.term-ref` 时弹出概念卡

### 6.2 视觉规则

- **hex 样式**：默认青蓝半透明边框；SD-WAN 焦点区（7 个 hex）洋红
- **核心 hex**：放大 1.2x + 强发光 + 3s 呼吸动画
- **metro 边**：沿 hex 共享边，3px 实线 + 6px 模糊辉光底，1.6s 流动 dash
- **hover hex**：浮起 + 主色辉光 + 邻居 hex 微高亮
- **click hex**：青色涟漪扩散 + 抽屉滑入
- **整图 3D 视差**：鼠标移动时 translate `(-8 ~ +8, -6 ~ +6)`

### 6.3 抽屉概念卡布局

```
┌─────────────────────────────────────────┐
│  ⚡ SD-WAN · L2       关闭 ✕           │
│  Software-Defined WAN                   │
├─────────────────────────────────────────┤
│                                         │
│  用软件智能调度多条物理链路的广域网技术    │
│                                         │
│  想象你管 200 家门店的网络...（long）     │
│                                         │
├─────────────────────────────────────────┤
│  邻居概念                                │
│  [概念] [架构] [智能路由] [安全] [案例] [WAN]│
│                                         │
│  在 3 条学习线上                         │
│  ━ 入门线  ━ SD-WAN主线  ━ 进阶线        │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  ⛶ 展开全屏  │  深入阅读 →     │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

- 展开全屏：drawer 由 30% 宽放大到 100%，仍保持在 `/graph` 上下文，
  关闭即可回到 hex 网格
- 深入阅读：navigate 到 `concept.canonical.file#anchor`，离开图谱
```

---

## 7. 用户流程

### 7.1 主流程

```
[首页 Cyberpunk Hero]
       │ 点「进入图谱」
       ▼
[/graph · 默认 SD-WAN 域]
       │ 看到 ~30 个 hex + 3 条 metro 线
       │
       ├── 点击 hex 「sdwan-arch」
       │       ▼
       │  [ConceptDrawer] 滑入
       │       │ 点「深入阅读」
       │       ▼
       │  /guide/sdwan/architecture.md（VitePress 原生）
       │       │ hover「DPI」
       │       ▼
       │  [TermTooltip] 弹出 DPI 概念卡
       │       │ 点「在图谱中查看」
       │       ▼
       │  /graph/sdwan?focus=dpi → 跳回图谱并打开 DPI 抽屉
       │
       ├── 切换 tab「安全」→ 平滑切到安全域 hex 网格
       │
       └── 搜索「三次握手」→ MiniSearch 结果
               │
               ├── 概念命中 → 跳到对应域 + 打开抽屉
               └── 文章片段命中 → 跳到该 md 锚点
```

### 7.2 URL 路由

| URL | 行为 |
|-----|------|
| `/` | Cyberpunk Hero 落地页 |
| `/graph` | 图谱视图，默认 SD-WAN 域 |
| `/graph/<domain>` | 图谱特定域 |
| `/graph/<domain>?focus=<id>` | 进入域并打开抽屉到指定概念（深链接） |
| `/guide/sdwan/architecture` | 原 VitePress 文章页（不变） |

---

## 8. 移动端适配

- **同一份 SVG**，`viewBox` 固定不变（保证布局一致）
- 双指 pinch-to-zoom 和单指拖拽用**自写 ~50 行 touch handler**（避免新依赖）
- 抽屉在移动端从底部滑入（bottom sheet），占屏 70%；展开全屏时占 100%
- 顶部 tab 改为横向可滚动条
- LineToolbar 在 <600px 收起为图标，点击展开
- 默认缩放级别 = 视口宽度 / SVG viewBox 宽度，初始进入时整图可见

---

## 9. 落地迁移计划（5 个 Phase）

| Phase | 范围 | 风险 | 可独立发布 |
|-------|------|------|-----------|
| P0 · 基础设施 | yaml schema / build 脚本 / MiniSearch / `_template.yaml` / 空图谱组件 | 低 | ✅ |
| P1 · SD-WAN 域优先 | 写 SD-WAN 域 ~40 个概念 + 布局 + 3 条 metro 线 + `/graph` 路由 | 中（内容工作量） | ✅ |
| P2 · 其他 6 域 | 基础 / 安全 / 云原生 / 运维 / 进阶 / 前沿 | 中 | ✅ |
| P3 · 术语 hover + 搜索 | term-scanner / MiniSearch UI / TermTooltip | 中（误匹配） | ✅ |
| P4 · 抛光 | 移动端 pinch zoom / 路线动画微调 / 深链接 / SEO meta | 低 | ✅ |

每个 Phase 单独 commit + 部署，可独立回滚。

---

## 10. 风险与缓解

| 风险 | 缓解 |
|------|------|
| 概念库膨胀（200-400 项工作量大） | P1 只做 SD-WAN 域（~40），快速看到效果 |
| Term scanner 误匹配（如"IPSec"出现在 IPSec 文章自身仍标） | ①匹配规则：每篇 md 仅首次出现 wrap；②md frontmatter 可写 `noTermRefs: [ipsec]` 排除自身；③build 时打印每篇 md 的待 wrap 清单供 review |
| Hex 邻接冲突（手画布局时常见） | build 时严格校验路线相邻性，错误指向具体 yaml 行号 |
| 移动端 pinch zoom 性能（>100 hex 时） | 用 CSS `transform` + `will-change`；HexCell 数量超 80 时启用 visibility culling |
| 学习路线维护 | 校验脚本提示"路线 X 中 stops A→B 不相邻"，作者按提示调坐标 |
| 颜色/对比度对色弱不友好 | 路线开关支持"灰阶模式"，用纹理（实线/虚线/点）区分 |

---

## 11. 测试策略

| 类型 | 范围 | 工具 |
|------|------|------|
| 单元测试 | hex 坐标换算 / 邻接判定 / 路径校验 | vitest |
| 构建测试 | yaml schema 校验 / 跨文件引用 / canonical 链接 | vitest |
| 组件测试 | HexCell / MetroEdge / ConceptDrawer 渲染 | vitest + @vue/test-utils |
| 端到端 | 点击 hex → 抽屉 → 文章 → tooltip → 返回 | playwright |
| 视觉回归 | 每个域的图谱截图比对 | playwright screenshot |
| 性能 | FPS during pan/zoom @ 80 hex / 5 metro lines | manual + Chrome DevTools |

---

## 12. 出口标准（每个 Phase 完成的判据）

每个 Phase 完成 = 全部满足以下：
1. 该 Phase 所属代码合并到 main
2. CI 通过（构建 + 单元/构建测试 + 视觉回归）
3. 至少一个 E2E 流程跑通
4. 在 PC 和手机（iPhone Safari + Android Chrome）各跑通主流程
5. 文档：`.meta/dev-guides/` 加该 Phase 的开发笔记

---

## 13. 待定问题

无。所有架构决策均已对齐。Phase 内的具体实现细节将在 writing-plans 阶段细化。
