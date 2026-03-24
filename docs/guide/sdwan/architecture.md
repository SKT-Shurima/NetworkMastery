---
title: SD-WAN 架构与控制面
description: 讲解 SD-WAN 三平面分离、Controller、Orchestrator、vEdge 职责与企业级部署思路。
---

> 📋 **前置知识**：[SD-WAN 概念与价值](/guide/sdwan/concepts)、[SDN 控制器架构](/guide/sdn/controllers)
> ⏱️ **阅读时间**：约 15 分钟

# SD-WAN 架构与控制面

> **学习目标**: 理解 SD-WAN 的三平面分离架构，掌握 Controller、Orchestrator、vEdge 的职责，能够设计企业级 SD-WAN 部署方案。

---

## 🤔 开场思考：为什么需要"控制器"？

传统路由器是**分布式决策**：每个路由器各自为政，只看自己的路由表。

想象一个十字路口，4 个交警各自指挥，互不沟通：
- 东边的交警不知道西边堵车了
- 结果：车流全往西边挤，越堵越厉害

**SD-WAN 引入了"交通指挥中心"（Controller）**：
- 所有路口的交警向中心汇报路况
- 中心计算最优路线
- 统一下发指令给各路口

这就是 **控制平面与数据平面分离** 的本质。

<!-- ThinkingQuestion
  question="传统路由器为什么无法做到全局最优路由？"
  hint="想一下：单个路由器能看到整个网络的拓扑吗？能知道其他路由器的链路质量吗？"
  answer="**传统路由器的视野局限**：

1. **只知道邻居** - OSPF/BGP 只能感知直连或邻居路由器，看不到全局
2. **静态权重** - 路由优先级是预配置的（如 OSPF cost），不会根据实时流量调整
3. **无应用感知** - 看不到上层应用，无法针对不同应用优化

**举例**：
```
A 路由器 ── 链路1（10ms, 10Mbps）── B 路由器
         ┗━ 链路2（50ms, 100Mbps）━┛

场景：视频会议 + 文件下载同时发生
传统路由器：看到链路2带宽大，全部流量走链路2
结果：视频卡顿（因为延迟高）

SD-WAN Controller：
- 识别视频会议 → 走链路1（低延迟）
- 识别文件下载 → 走链路2（高带宽）
```

**SD-WAN Controller 的优势**：
- 全局视野：知道所有设备、所有链路的状态
- 实时决策：根据当前流量和链路质量动态调整
- 应用感知：不同应用走不同最优路径"
-->

---

## 🏗️ 三平面分离架构

### 架构总览

![SD-WAN 三平面分离架构](./arch-diagram.svg)

上图为高质量架构图，展示了 SD-WAN 的核心设计：
- **管理平面** (Management) - 人机交互和配置管理
- **控制平面** (Control) - 决策和策略下发  
- **数据平面** (Data) - 流量转发和隧道建立

或者查看详细的文本版本：

```
┌────────────────────────────────────────────────────────┐
│             Management Plane (管理平面)                 │
│   ┌──────────────────────────────────────────┐         │
│   │  Orchestrator (编排器)                   │         │
│   │  - 图形化界面                            │         │
│   │  - 策略配置                              │         │
│   │  - 监控告警                              │         │
│   │  - 日志分析                              │         │
│   └──────────────────────────────────────────┘         │
└────────────────────────────────────────────────────────┘
           │ API 调用
           ↓
┌────────────────────────────────────────────────────────┐
│             Control Plane (控制平面)                    │
│   ┌──────────────────────────────────────────┐         │
│   │  SD-WAN Controller (控制器)              │         │
│   │  - 拓扑发现                              │         │
│   │  - 应用识别策略                          │         │
│   │  - 路由决策                              │         │
│   │  - 链路质量监测                          │         │
│   └──────────────────────────────────────────┘         │
└────────────────────────────────────────────────────────┘
           │ 控制协议 (OMP/NETCONF)
           ↓
┌────────────────────────────────────────────────────────┐
│             Data Plane (数据平面)                       │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐          │
│   │  vEdge1  │   │  vEdge2  │   │  vEdge3  │          │
│   │ (分支A)  │   │ (分支B)  │   │ (总部)   │          │
│   │          │   │          │   │          │          │
│   │ - 流量   │   │ - IPSec  │   │ - QoS    │          │
│   │   转发   │   │   隧道   │   │   调度   │          │
│   └──────────┘   └──────────┘   └──────────┘          │
└────────────────────────────────────────────────────────┘
```

### 职责分工

| 平面 | 核心职责 | 类比 |
|------|----------|------|
| **Management** | 人机交互 | 汽车的仪表盘和方向盘 |
| **Control** | 做决策 | 汽车的 CPU |
| **Data** | 执行任务 | 汽车的发动机和轮子 |

---

## 🎛️ 核心组件详解

### 1. Orchestrator (编排器)

**定位**: 管理员的操作界面

**核心功能**:

```
┌─────────────────────────────────────────────┐
│         Orchestrator 功能模块                │
├─────────────────────────────────────────────┤
│                                             │
│  📊 Dashboard (仪表板)                      │
│   ├─ 网络拓扑可视化                         │
│   ├─ 实时流量监控                           │
│   ├─ 告警事件                               │
│   └─ 性能 KPI                               │
│                                             │
│  ⚙️ Configuration (配置管理)                │
│   ├─ 设备模板                               │
│   ├─ 应用策略                               │
│   ├─ 安全策略                               │
│   └─ QoS 策略                               │
│                                             │
│  🔍 Analytics (分析)                        │
│   ├─ 应用流量分析                           │
│   ├─ 链路性能趋势                           │
│   ├─ 故障根因分析                           │
│   └─ 容量规划建议                           │
│                                             │
│  🚨 Monitoring (监控告警)                   │
│   ├─ 链路状态监测                           │
│   ├─ 设备健康检查                           │
│   ├─ 阈值告警                               │
│   └─ 日志审计                               │
└─────────────────────────────────────────────┘
```

**典型操作流程**:

```
管理员需求：新增分支办公室

1. Orchestrator 界面操作：
   - 选择 "新增站点"
   - 输入站点信息（地址、设备型号）
   - 选择应用模板（办公室标准配置）
   - 点击 "部署"

2. Orchestrator → Controller：
   API 调用：POST /api/sites
   {
     "site_id": "branch_100",
     "template": "office_standard",
     "device_serial": "FTX1234ABCD"
   }

3. Controller → vEdge：
   设备收到配置（自动建立 IPSec 隧道）

4. 完成：
   Orchestrator 显示 "站点已上线"
```

---

### 2. SD-WAN Controller (控制器)

**定位**: 网络的"大脑"

**核心职责**:

#### A. 拓扑发现与维护

```python
# 控制器的拓扑发现流程（伪代码）
class SDWANController:
    def __init__(self):
        self.topology = {}  # 网络拓扑图
        self.devices = {}   # 所有设备
        self.tunnels = {}   # 所有隧道
    
    def discover_topology(self):
        # 1. 设备上线时，主动连接 Controller
        for device in self.devices.values():
            # 2. 设备上报自己的链路信息
            links = device.report_links()
            # 例如: [
            #   {"type": "MPLS", "ip": "10.1.1.1", "bandwidth": "10M"},
            #   {"type": "宽带", "ip": "202.1.1.1", "bandwidth": "100M"}
            # ]
            
            # 3. Controller 记录拓扑
            self.topology[device.id] = links
        
        # 4. Controller 计算所有设备间的可达路径
        self.build_overlay_mesh()
    
    def build_overlay_mesh(self):
        # 为每对设备建立 IPSec 隧道
        for dev_a in self.devices.values():
            for dev_b in self.devices.values():
                if dev_a != dev_b:
                    tunnel = self.create_ipsec_tunnel(dev_a, dev_b)
                    self.tunnels[f"{dev_a.id}-{dev_b.id}"] = tunnel
```

#### B. 应用识别与策略下发

```python
# 应用策略管理
class ApplicationPolicy:
    def __init__(self, controller):
        self.controller = controller
        self.policies = {}
    
    def add_policy(self, app_name, requirements):
        # 管理员配置策略
        self.policies[app_name] = requirements
        
        # 下发到所有 vEdge
        for device in self.controller.devices.values():
            device.install_policy(app_name, requirements)
    
    # 示例：配置 Microsoft Teams 策略
    def configure_teams_policy(self):
        self.add_policy(
            app_name="Microsoft Teams",
            requirements={
                "max_latency": 50,        # ms
                "min_bandwidth": 2,       # Mbps
                "preferred_link": "MPLS", # 优先链路
                "fallback": "宽带",       # 备用链路
                "priority": "high",       # QoS 优先级
                "encryption": True        # 必须加密
            }
        )
```

#### C. 链路质量监测

```python
# 链路质量监测
class LinkMonitor:
    def __init__(self, controller):
        self.controller = controller
        self.metrics = {}
    
    def monitor_links(self):
        while True:
            for tunnel_id, tunnel in self.controller.tunnels.items():
                # 发送探测包
                probe_result = tunnel.send_probe()
                
                # 记录指标
                self.metrics[tunnel_id] = {
                    "latency": probe_result.rtt,       # 往返延迟
                    "jitter": probe_result.jitter,     # 抖动
                    "loss": probe_result.packet_loss,  # 丢包率
                    "bandwidth": probe_result.available_bw,  # 可用带宽
                    "timestamp": now()
                }
                
                # 如果质量下降，触发重路由
                if probe_result.rtt > 100:  # 延迟超过 100ms
                    self.controller.reroute_traffic(tunnel_id)
            
            sleep(5)  # 每 5 秒监测一次
```

<!-- ThinkingQuestion
  question="如果 Controller 宕机了，数据平面还能工作吗？"
  hint="想一下：数据转发是谁在执行？vEdge 已经收到了策略，Controller 离线后，vEdge 能继续转发流量吗？"
  answer="**答案：能，但功能受限**

**能继续工作的部分**：
1. **已建立的隧道继续转发**
   - vEdge 之间的 IPSec 隧道是点对点的
   - Controller 离线不影响已有隧道

2. **已下发的策略继续生效**
   - 应用识别规则已缓存在 vEdge
   - 路由策略继续执行

3. **本地链路故障切换**
   - vEdge 可以自主检测链路中断
   - 自动切换到备用链路

**受影响的部分**：
1. **无法新增设备** - 需要 Controller 认证和配置
2. **无法全局优化** - 失去全局视野，无法动态调整
3. **无法响应网络变化** - 拓扑变化时，无法更新路由
4. **无法查看监控数据** - Orchestrator 依赖 Controller 的数据

**高可用方案**：
- 部署多个 Controller（主备或集群）
- Controller 间数据同步
- vEdge 同时连接多个 Controller
- 主 Controller 故障时，秒级切换到备 Controller

**类比**：
- Controller = 交通指挥中心
- vEdge = 路口的红绿灯

指挥中心故障后：
- 红绿灯按原有配置继续工作（能通行，但不是最优）
- 无法应对新的路况变化（如临时封路）
- 无法全局协调（可能多个路口同时放行导致拥堵）"
-->

---

### 3. vEdge (虚拟边缘设备)

**定位**: 数据平面的执行者

**部署形式**:

| 类型 | 使用场景 | 优缺点 |
|------|----------|--------|
| **物理设备** | 分支办公室 | ✅ 性能高<br>❌ 成本高 |
| **虚拟机** | 数据中心 | ✅ 灵活<br>❌ 性能中等 |
| **云原生** | 公有云 | ✅ 弹性扩展<br>❌ 延迟稍高 |

**核心功能模块**:

```
vEdge 设备架构
┌────────────────────────────────────────────┐
│             应用识别引擎                    │
│  ┌──────────────────────────────────┐      │
│  │ DPI (Deep Packet Inspection)    │      │
│  │ - 识别应用协议                   │      │
│  │ - 提取流量特征                   │      │
│  │ - 匹配应用策略                   │      │
│  └──────────────────────────────────┘      │
├────────────────────────────────────────────┤
│             路由引擎                        │
│  ┌──────────────────────────────────┐      │
│  │ 智能路径选择                     │      │
│  │ - 评估链路质量                   │      │
│  │ - 匹配应用需求                   │      │
│  │ - 选择最优路径                   │      │
│  └──────────────────────────────────┘      │
├────────────────────────────────────────────┤
│             隧道管理                        │
│  ┌──────────────────────────────────┐      │
│  │ IPSec/GRE 隧道                   │      │
│  │ - 建立加密隧道                   │      │
│  │ - 维护隧道状态                   │      │
│  │ - 故障自动切换                   │      │
│  └──────────────────────────────────┘      │
├────────────────────────────────────────────┤
│             QoS 调度                        │
│  ┌──────────────────────────────────┐      │
│  │ 流量整形与优先级                 │      │
│  │ - 队列管理                       │      │
│  │ - 带宽分配                       │      │
│  │ - 拥塞控制                       │      │
│  └──────────────────────────────────┘      │
└────────────────────────────────────────────┘
```

**工作流程示例**:

```
用户发起视频会议（Microsoft Teams）：

1. 应用识别
   vEdge 检查数据包：
   - 目的 IP: 52.x.x.x (Microsoft)
   - 目的端口: 3478 (STUN)
   - TLS SNI: teams.microsoft.com
   → 识别为 "Microsoft Teams"

2. 策略匹配
   查询本地策略表：
   Microsoft Teams:
     preferred_link: MPLS
     max_latency: 50ms
     priority: high

3. 链路选择
   评估可用链路：
   - MPLS: 延迟 30ms, 带宽 10M, 利用率 40%  ✓
   - 宽带: 延迟 80ms, 带宽 100M, 利用率 20% ✗ (延迟超标)
   → 选择 MPLS

4. 隧道转发
   将数据包封装进 IPSec 隧道：
   原始包: [Teams 数据]
   封装后: [IPSec 头 | [Teams 数据]]
   → 通过 MPLS 链路发往对端 vEdge

5. QoS 调度
   在 MPLS 链路的发送队列中：
   - 优先级队列: [Teams 视频] ← 高优先级
   - 普通队列: [文件下载、邮件]
   → 视频流量优先发送
```

---

## 🔄 控制流与数据流

### 控制流（Control Flow）

```
设备上线流程：

1. vEdge 开机
   ↓
2. DHCP 获取 IP 地址
   ↓
3. DNS 解析 Controller 地址
   （通常是 controller.company.com）
   ↓
4. 建立 DTLS 连接到 Controller
   （设备证书认证）
   ↓
5. Controller 验证设备序列号
   ↓
6. Controller 下发配置
   - 隧道参数
   - 应用策略
   - 路由策略
   ↓
7. vEdge 应用配置，建立隧道
   ↓
8. 上报状态：ONLINE
```

### 数据流（Data Flow）

```
用户访问云服务：

用户 PC
  ↓ (HTTP 请求)
vEdge (分支)
  ↓ (应用识别 → 选择链路 → 封装隧道)
Internet / MPLS
  ↓
vEdge (总部/云网关)
  ↓ (解封装)
云服务 (AWS/Azure)
```

**关键点**：
- 控制流走 Controller（HTTPS/DTLS）
- 数据流直接在 vEdge 间传输（不经过 Controller）
- Controller 只负责策略，不处理用户流量

---

## 📐 部署架构模式

### 模式一：集中式 Controller

```
                 ┌─────────────┐
                 │ Controller  │
                 │ (数据中心)  │
                 └─────────────┘
                   ↑  ↑  ↑  ↑
        ┌──────────┘  │  │  └──────────┐
        │             │  │             │
    ┌───────┐   ┌───────┐   ┌───────┐
    │vEdge 1│   │vEdge 2│   │vEdge 3│
    │(分支A)│   │(分支B)│   │(分支C)│
    └───────┘   └───────┘   └───────┘

优点：
✓ 集中管理简单
✓ 策略一致性强

缺点：
✗ Controller 成为单点故障
✗ 分支到 Controller 的链路依赖
```

### 模式二：云托管 Controller

```
         ┌──────────────────────────┐
         │  Controller (AWS/Azure)  │
         └──────────────────────────┘
               ↑  ↑  ↑  ↑
    ┌──────────┘  │  │  └──────────┐
    │             │  │             │
┌───────┐   ┌───────┐   ┌───────┐
│vEdge 1│   │vEdge 2│   │vEdge 3│
│(分支A)│   │(分支B)│   │(分支C)│
└───────┘   └───────┘   └───────┘

优点：
✓ 无需自建基础设施
✓ 厂商负责维护
✓ 高可用性（云服务 SLA）

缺点：
✗ 依赖互联网连接
✗ 数据在云端（合规性考虑）
```

### 模式三：混合架构

```
┌────────────────┐       ┌────────────────┐
│  Controller    │←─────→│  Controller    │
│  (主数据中心)  │ 同步  │  (备用云端)    │
└────────────────┘       └────────────────┘
    ↑  ↑                       ↑
    │  └───────────┐           │
    │              │           │
┌───────┐    ┌───────┐   ┌───────┐
│vEdge 1│    │vEdge 2│   │vEdge 3│
└───────┘    └───────┘   └───────┘

优点：
✓ 高可用性
✓ 就近接入（延迟最低）
✓ 灾备能力

缺点：
✗ 架构复杂
✗ 成本较高
```

---

## 🎓 知识检查点

学完本章，确保你能回答：

1. **架构理解**
   - [ ] 说出三平面分离的好处
   - [ ] 解释 Controller 和 Orchestrator 的区别
   - [ ] 描述 vEdge 的核心功能模块

2. **工作原理**
   - [ ] 画出设备上线的控制流
   - [ ] 解释数据流如何在 vEdge 间传输
   - [ ] 说明 Controller 宕机后的影响

3. **部署设计**
   - [ ] 对比三种部署模式的优缺点
   - [ ] 为特定场景选择合适的架构
   - [ ] 设计高可用方案

---

## 🚀 下一步

理解了 SD-WAN 的架构后，下一章将深入探讨：

→ **[智能路由与流量优化](/guide/sdwan/routing)** - DPI 技术细节、路径选择算法、流量工程实战  
→ **[SD-WAN 安全设计](/guide/sdwan/security)** - 加密隧道、微分段、与 SASE 的融合  
→ **[SD-WAN 实战案例](/guide/sdwan/cases)** - 真实企业的部署方案和踩坑经验  

---

<div style="text-align: center; margin-top: 3rem; padding: 2rem; background: rgba(10, 14, 39, 0.9); border: 2px solid var(--neon-purple); border-radius: 12px;">
  <p style="font-family: var(--font-display); font-size: 1.2rem; color: var(--neon-purple); margin: 0;">
    💡 三平面分离是 SD-WAN 的核心设计哲学：决策者、执行者、管理者各司其职
  </p>
</div>

## 总结与下一步

| 维度 | 要点 |
|------|------|
| 核心价值 | 三平面分离架构实现网络可编程化与集中管理 |
| 关键组件 | Controller（控制面）、Orchestrator（管理面）、CPE（数据面） |
| 设计要点 | Controller 高可用、CPE 零接触部署、API 驱动自动化 |

> 📖 **下一步学习**：[智能路由与流量优化](/guide/sdwan/routing) — 了解 SD-WAN 如何实现应用感知的动态路径选择
