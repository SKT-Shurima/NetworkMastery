# 图表升级迁移计划

## 📊 现状分析

- **Mermaid 图表总数**：84 个
- **涉及文档数**：18 个
- **库依赖**：已装 excalidraw@0.6.4、vis-network@10.0.2

## 🎯 迁移策略

### 分类规则

1. **逻辑/架构图** → Excalidraw (SVG 风格)
   - SD-WAN 架构、控制面设计
   - 网络分层、协议栈
   - 业务流程、决策树
   
2. **网络拓扑图** → vis-network (交互式)
   - 网络拓扑图、设备连接
   - 链路质量、流量路径
   - 故障传播、冗余设计

3. **流程/时序图** → Excalidraw
   - 封包流、握手过程
   - 故障切换流程
   - 部署流程

### 优先级排序

**Phase 1 (高优先)** - SD-WAN 核心文档
- [ ] docs/guide/sdwan/architecture.md (架构图)
- [ ] docs/guide/sdwan/concepts.md (概念图)
- [ ] docs/guide/sdwan/routing.md (路由决策图)
- [ ] docs/guide/sdwan/security.md (安全架构)
- [ ] docs/guide/sdwan/cases.md (拓扑图)

**Phase 2 (中优先)** - 基础知识核心图
- [ ] docs/guide/basics/tcpip.md (协议栈)
- [ ] docs/guide/basics/osi.md (七层模型)
- [ ] docs/guide/basics/routing.md (路由算法)
- [ ] docs/guide/architecture/topology.md (网络拓扑)

**Phase 3 (低优先)** - 其他文档
- [ ] docs/guide/advanced/*.md
- [ ] docs/guide/attacks/*.md
- [ ] docs/guide/ops/*.md

## 🛠️ 实施方式

### Excalidraw 集成
```
Excalidraw JSON → Vue 组件 → SVG 渲染
自动支持：亮/暗主题、缩放、导出
```

### vis-network 集成
```
网络数据 JSON → Vue 组件 → 交互式图谱
支持：鼠标拖拽、缩放、物理模拟、鼠标悬停提示
```

## 📝 工作清单

- [ ] 创建 Excalidraw 集成组件 (`ExcalidrawViewer.vue`)
- [ ] 创建 vis-network 集成组件 (`VisNetworkViewer.vue`)
- [ ] 转换 SD-WAN 架构图 (Phase 1)
- [ ] 测试渲染效果
- [ ] 提交到 GitHub

## 📌 进度跟踪

- 开始时间：2026-03-16 07:20 CST
- 目标完成：Phase 1 (5 个文档)
- 预期耗时：~2 小时

---

**状态**：开始实施 🚀
