---
title: 网络拓扑详解：从星形到网状的组网艺术
description: 星形、网状、树形等企业网络拓扑的特点、适用场景与组网设计要点。
---

---
title: 网络拓扑详解：从星形到网状的组网艺术
description: 详解星形、网状等企业网络拓扑的特点、优缺点与适用场景，辅助组网形态选型与设计理解。
---

# 网络拓扑详解：从星形到网状的组网艺术

## 三种主要拓扑

### 1. 星形（Star）拓扑

```mermaid
graph TB
    center["中心（总部）"]
    s1["分支 1"]
    s2["分支 2"]
    s3["分支 3"]
    s4["分支 4"]
    
    s1 --- center
    s2 --- center
    s3 --- center
    s4 --- center
    
    style center fill:#ffcccc
    style s1 fill:#ccccff
    style s2 fill:#ccccff
    style s3 fill:#ccccff
    style s4 fill:#ccccff
```

**特点**：
- <Icon name="check" color="green" /> 简单易管理
- <Icon name="check" color="green" /> 低成本（分支少时）
- <Icon name="x" color="danger" /> 单点故障（总部故障全网瘫痪）
- <Icon name="x" color="danger" /> 分支间通信需经过总部（Hair Pinning）
- <Icon name="check" color="green" /> 最常见的企业网络

### 2. 网状（Mesh）拓扑

#### 完全网状

```mermaid
graph TB
    s1["分支 1"]
    s2["分支 2"]
    s3["分支 3"]
    s4["分支 4"]
    
    s1 --- s2
    s1 --- s3
    s1 --- s4
    s2 --- s3
    s2 --- s4
    s3 --- s4
    
    style s1 fill:#ccffcc
    style s2 fill:#ccffcc
    style s3 fill:#ccffcc
    style s4 fill:#ccffcc
```

**特点**：
- <Icon name="check" color="green" /> 极高可靠性
- <Icon name="check" color="green" /> 最优路由
- <Icon name="x" color="danger" /> 成本巨高（N 个节点需 N×(N-1)/2 条链路）
- <Icon name="x" color="danger" /> 管理复杂

#### 部分网状

```
只连接关键节点：
总部 ←→ 一级分支
总部 ←→ 二级分支
一级分支 ←→ 一级分支（可选）
```

### 3. DP（Dual Path）组网

**概念**：每个分支有两条链路连接到两个不同的网络。

```mermaid
graph TB
    center1["总部 A"]
    center2["总部 B"]
    s1["分支"]
    
    s1 --> center1
    s1 --> center2
    
    style center1 fill:#ffcccc
    style center2 fill:#ffcccc
    style s1 fill:#ccccff
    
    linkStyle 0 stroke:green,stroke-width:2px
    linkStyle 1 stroke:blue,stroke-width:2px
```

**特点**：
- <Icon name="check" color="green" /> 高可靠（任一线路故障不影响）
- <Icon name="check" color="green" /> 负载均衡（两条链路都工作）
- <Icon name="check" color="green" /> 成本适中
- <Icon name="check" color="green" /> SD-WAN 时代的标准配置

---

## Spoke-Hub 模型

### 定义

```
Hub（中心）：
- 总部或主要数据中心
- 连接所有分支
- 进行流量汇聚和路由

Spoke（分支）：
- 只连接 Hub
- 相互通信必须经过 Hub
```

### 拓扑图

```mermaid
graph TB
    hub["Hub<br/>总部"]
    
    spoke1["Spoke 1<br/>分支 A"]
    spoke2["Spoke 2<br/>分支 B"]
    spoke3["Spoke 3<br/>分支 C"]
    spoke4["Spoke 4<br/>分支 D"]
    
    spoke1 --> hub
    spoke2 --> hub
    spoke3 --> hub
    spoke4 --> hub
    
    style hub fill:#ffcccc
    style spoke1 fill:#ccccff
    style spoke2 fill:#ccccff
    style spoke3 fill:#ccccff
    style spoke4 fill:#ccccff
```

### 应用场景

**适合**：
- 分支数量多但不经常互通
- 流量集中在分支 ↔ 总部
- 成本优先

**不适合**：
- 分支间频繁通信（延迟高）
- 需要高可靠性（单点故障）

---

## Full Mesh 组网

### 拓扑

```mermaid
graph TB
    s1["分支 1"]
    s2["分支 2"]
    s3["分支 3"]
    s4["分支 4"]
    s5["分支 5"]
    
    s1 ---|隧道| s2
    s1 ---|隧道| s3
    s1 ---|隧道| s4
    s1 ---|隧道| s5
    s2 ---|隧道| s3
    s2 ---|隧道| s4
    s2 ---|隧道| s5
    s3 ---|隧道| s4
    s3 ---|隧道| s5
    s4 ---|隧道| s5
    
    style s1 fill:#ccffcc
    style s2 fill:#ccffcc
    style s3 fill:#ccffcc
    style s4 fill:#ccffcc
    style s5 fill:#ccffcc
```

### 特点

| 方面 | 情况 |
|-----|------|
| 隧道数量 | N×(N-1)/2（5 分支需 10 条隧道） |
| 延迟 | 最低（直接连接） |
| 可靠性 | 最高（多路备份） |
| 成本 | 最高 |
| 管理 | 最复杂 |

### 适用场景

- 关键分支间高频通信
- 延迟敏感应用（金融交易）
- 灾备要求高
- 分支数量不超过 10 个

---

## 混合拓扑

### 常见模式

```
总部（Hub）
    ├─ 所有分支都连 Hub
    └─ 关键分支间也连接（Mesh）

示意：
        Hub
        / \
       /   \
      B1---B2    （B1 和 B2 关键，互连）
      /     \
     B3     B4   （普通分支，只连 Hub）
```

### 选择标准

```mermaid
graph TB
    A["选择拓扑"]
    
    A --> B{"分支数量？"}
    B -->|< 10| C["考虑 Full Mesh"]
    B -->|10-50| D["考虑混合拓扑"]
    B -->|> 50| E["Spoke-Hub + 层级"]
    
    C --> C1{"分支间通信频繁？"}
    C1 -->|是| C2["Full Mesh"]
    C1 -->|否| C3["Spoke-Hub"]
    
    D --> D1["关键分支 Mesh，普通分支 Star"]
    
    E --> E1["分层网络<br/>地区 Hub → 全局 Hub"]
```

---

## 总结对比

```
┌─────────────────────────────────────────┐
│ 拓扑对比总表                            │
├──────────┬────────┬────────┬────────────┤
│ 拓扑     │ 成本   │ 延迟   │ 可靠性     │
├──────────┼────────┼────────┼────────────┤
│ Star     │ 低 [$]  │ 中等   │ 低 (red)      │
│ Mesh     │ 高 [$][$]│ 最低   │ 高 (grn)      │
│ DP       │ 中 [$]  │ 低     │ 中高 (ylw)    │
│ Hybrid   │ 中 [$]  │ 低     │ 中 (ylw)      │
└──────────┴────────┴────────┴────────────┘
```

---

## 推荐阅读

- 下一章：[骨干网与分支网络](/guide/architecture/backbone)
- 相关：[SD-WAN 架构](/guide/sdwan/architecture)
