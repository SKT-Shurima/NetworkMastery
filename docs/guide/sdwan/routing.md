---
title: 智能路由与流量优化
description: 掌握 SD-WAN 应用感知路由、路径选择与流量工程，设计与优化企业流量策略。
---

<ConceptMap id="sdwan-routing" />

> 📋 **前置知识**：[SD-WAN 架构与控制面](/guide/sdwan/architecture)、[IP 寻址与路由](/guide/basics/routing)
> ⏱️ **阅读时间**：约 15 分钟

# 智能路由与流量优化

> **学习目标**: 掌握 SD-WAN 的应用感知路由原理、路径选择算法、流量工程技术，能够设计和优化企业级流量策略。

---

## 🤔 开场问题：为什么需要"智能"路由？

周一早上 9 点，某公司 IT 运维接到 3 个投诉：

**场景 1**: 财务部经理："ERP 系统慢得要死！"  
**场景 2**: 销售总监："Teams 视频会议一卡一卡的！"  
**场景 3**: HR："下载员工简历附件超慢！"  

你查了一下网络状况：
- MPLS 专线：10Mbps，延迟 20ms，利用率 95% 🔥
- 宽带链路：100Mbps，延迟 50ms，利用率 30%

**问题出在哪？**

传统路由器看到 MPLS "稳定"，把所有流量都往 MPLS 扔：
```
ERP (关键业务)  ┐
Teams (视频会议) ├─→ MPLS (10M) ← 拥塞！
文件下载        ┘

宽带 (100M) ← 闲置 70%
```

**理想情况应该是**：
```
ERP (低延迟)     → MPLS (10M, 20ms)
Teams (低延迟)   → MPLS (10M, 20ms)
文件下载 (大带宽) → 宽带 (100M, 50ms)
```

这就是 **应用感知路由** 的价值：**让合适的流量走合适的路径**。

<!-- ThinkingQuestion
  question="为什么不能简单地把所有流量平均分到两条链路上？"
  hint="想一下：视频会议的数据包如果分散到两条延迟不同的链路上，会发生什么？"
  answer="简单负载均衡会导致三大问题：1) TCP 乱序 - 包1走MPLS 20ms先到，包2走宽带50ms后到，接收端认为丢包触发重传；2) 抖动增大 - 视频会议需要稳定延迟，包延迟从20ms跳到50ms导致卡顿；3) QoS失效 - MPLS有优先级，宽带没有，混合后优先级混乱。SD-WAN的智能做法：按流分类（同一TCP连接走同一链路）、按应用分流（视频走MPLS低延迟，下载走宽带大带宽）、动态调整（MPLS拥塞时次要业务切宽带）。类比：简单负载均衡像左脚跑鞋右脚高跟鞋，应用感知路由像跑步穿跑鞋跳舞穿舞鞋。"
-->

---

## 🧠 应用感知路由的三大支柱

### 1. 应用识别 (DPI)

**DPI (Deep Packet Inspection)** - 深度包检测

```
传统路由器看数据包：
┌──────────────────┐
│ 源 IP: 10.1.1.5  │
│ 目的 IP: 52.x.x  │  ← 只看这些
│ 协议: TCP        │
└──────────────────┘
判断：这是发往 52.x.x 的流量 → 查路由表 → 转发

SD-WAN 设备看数据包（DPI）：
┌──────────────────┐
│ 源 IP: 10.1.1.5  │
│ 目的 IP: 52.x.x  │
│ 目的端口: 443    │
│ TLS SNI: teams.microsoft.com  ← 看到应用层信息
│ User-Agent: ... │
└──────────────────┘
判断：这是 Microsoft Teams 视频 → 查应用策略 → 选择最优链路
```

**DPI 识别方法**：

| 方法 | 准确率 | 速度 | 适用场景 |
|------|--------|------|----------|
| **端口号** | 50% | 极快 | HTTP (80), HTTPS (443) 基础判断 |
| **协议特征** | 80% | 快 | SIP/RTP (VoIP), RTMP (直播) |
| **TLS SNI** | 95% | 快 | HTTPS 流量，看域名 |
| **流量模式** | 90% | 中 | 视频（大包连续），下载（单向大流量） |
| **机器学习** | 98% | 慢 | 加密流量，行为分析 |

**示例：识别 Netflix 视频流**

```python
class ApplicationIdentifier:
    def identify(self, packet):
        # 方法 1: 端口号
        if packet.dst_port == 443:
            # 可能是 HTTPS，继续深入
            
            # 方法 2: TLS SNI
            if packet.tls_sni and 'netflix.com' in packet.tls_sni:
                return "Netflix"
            
            # 方法 3: 流量模式
            if self.is_video_pattern(packet):
                # 大包（>1400 字节）
                # 连续发送
                # 单向流量（服务器→客户端）
                return "Video Streaming"
        
        return "Unknown"
    
    def is_video_pattern(self, packet):
        # 视频流量特征：
        # 1. 包大小接近 MTU (1500 字节)
        # 2. 每秒包数稳定（如 30fps 视频）
        # 3. 服务器→客户端流量 >> 客户端→服务器
        if packet.size > 1400 and \
           self.packet_rate_stable() and \
           self.is_unidirectional():
            return True
        return False
```

---

### 2. 链路质量监测

**实时监测关键指标**：

```
SD-WAN 设备间的探测机制：

每 1-5 秒：
┌────────────┐                    ┌────────────┐
│  vEdge A   │─── 探测包 (BFD) ──→│  vEdge B   │
│            │                    │            │
│  记录:     │←── 响应包 ────────│  记录:     │
│  RTT: 23ms │                    │  RTT: 23ms │
└────────────┘                    └────────────┘

计算指标：
- Latency (延迟): RTT / 2 = 11.5ms
- Jitter (抖动): |RTT_current - RTT_avg|
- Loss (丢包率): (发送包数 - 接收包数) / 发送包数
- Bandwidth (可用带宽): 探测 + 实际流量统计
```

**链路评分算法**：

```python
class LinkQuality:
    def __init__(self, name):
        self.name = name
        self.metrics = {
            'latency': [],      # 延迟历史
            'jitter': [],       # 抖动历史
            'loss': [],         # 丢包历史
            'bandwidth_used': 0,
            'bandwidth_total': 0
        }
    
    def calculate_score(self, app_requirements):
        """
        计算链路对特定应用的适配分数 (0-100)
        """
        score = 100
        
        # 延迟评分（权重 40%）
        avg_latency = mean(self.metrics['latency'][-10:])  # 最近 10 次
        if avg_latency > app_requirements['max_latency']:
            score -= 40 * (avg_latency / app_requirements['max_latency'])
        
        # 抖动评分（权重 30%）
        avg_jitter = mean(self.metrics['jitter'][-10:])
        if avg_jitter > app_requirements['max_jitter']:
            score -= 30
        
        # 丢包评分（权重 20%）
        avg_loss = mean(self.metrics['loss'][-10:])
        if avg_loss > app_requirements['max_loss']:
            score -= 20 * (avg_loss / app_requirements['max_loss'])
        
        # 带宽可用性（权重 10%）
        available_bw = self.metrics['bandwidth_total'] - self.metrics['bandwidth_used']
        if available_bw < app_requirements['min_bandwidth']:
            score -= 10
        
        return max(0, score)

# 示例：评估链路是否适合视频会议
mpls_link = LinkQuality("MPLS")
mpls_link.metrics['latency'] = [22, 23, 21, 24, 22]  # ms
mpls_link.metrics['jitter'] = [2, 3, 1, 2, 2]        # ms
mpls_link.metrics['loss'] = [0.1, 0.0, 0.1, 0.0, 0.0]  # %

teams_requirements = {
    'max_latency': 150,      # ms
    'max_jitter': 30,        # ms
    'max_loss': 5,           # %
    'min_bandwidth': 2       # Mbps
}

score = mpls_link.calculate_score(teams_requirements)
# 结果: 98 分 （非常适合）
```

---

### 3. 路径选择算法

**智能选择最优路径**：

```python
class PathSelector:
    def __init__(self, controller):
        self.controller = controller
        self.links = []  # 所有可用链路
    
    def select_best_path(self, application, packet):
        """
        为应用选择最优链路
        """
        # 1. 过滤不可用链路
        available_links = [
            link for link in self.links 
            if link.is_active() and link.has_capacity()
        ]
        
        if not available_links:
            return None  # 无可用链路
        
        # 2. 根据应用需求评分
        app_policy = self.controller.get_policy(application)
        
        scored_links = []
        for link in available_links:
            score = link.calculate_score(app_policy.requirements)
            scored_links.append((link, score))
        
        # 3. 按分数排序
        scored_links.sort(key=lambda x: x[1], reverse=True)
        
        # 4. 选择最高分链路
        best_link = scored_links[0][0]
        
        # 5. 如果最高分 < 阈值，尝试多路径
        if scored_links[0][1] < 60:
            # 链路质量都不理想，考虑负载均衡
            return self.multipath_selection(scored_links)
        
        return best_link
    
    def multipath_selection(self, scored_links):
        """
        多路径选择（链路聚合）
        """
        # 选择分数 > 50 的链路
        good_links = [link for link, score in scored_links if score > 50]
        
        if len(good_links) >= 2:
            # 使用两条链路做负载均衡
            return good_links[:2]
        else:
            # 只能用一条
            return good_links[0]
```

**决策流程图**：

```
新数据流到达
    ↓
应用识别 (DPI)
    ↓
┌─────────────────────────────────┐
│ 查询应用策略                     │
│                                 │
│ Microsoft Teams:                │
│   max_latency: 150ms           │
│   max_jitter: 30ms             │
│   max_loss: 5%                 │
│   min_bandwidth: 2Mbps         │
│   preferred_link: MPLS         │
└─────────────────────────────────┘
    ↓
评估所有链路
    ↓
┌─────────────┬─────────────┬─────────────┐
│ MPLS        │ 宽带        │ 4G          │
│ 延迟: 23ms  │ 延迟: 45ms  │ 延迟: 120ms │
│ 抖动: 2ms   │ 抖动: 10ms  │ 抖动: 40ms  │
│ 丢包: 0%    │ 丢包: 0.2%  │ 丢包: 2%    │
│ 可用: 8M    │ 可用: 80M   │ 可用: 15M   │
│ 分数: 98    │ 分数: 85    │ 分数: 60    │
└─────────────┴─────────────┴─────────────┘
    ↓
选择 MPLS（分数最高 + 首选）
    ↓
建立流表项，后续包走 MPLS
```

::: tip 💡 思考题
**如果 MPLS 链路突然中断，SD-WAN 如何在秒级切换到备用链路？**

关键词：BFD 快速故障检测 + 流表更新
:::

**秒级故障切换流程**：

**1. 故障检测（< 1 秒）**

使用 BFD (Bidirectional Forwarding Detection)：
- 探测间隔：100ms - 1s
- 连续 3 次探测失败 → 判定链路故障
- 检测时间：300ms - 3s

```python
# BFD 故障检测
class BFDMonitor:
    def __init__(self, link):
        self.link = link
        self.probe_interval = 1000  # ms
        self.failure_threshold = 3
        self.failures = 0
    
    def monitor(self):
        while True:
            if not self.send_probe():
                self.failures += 1
                if self.failures >= self.failure_threshold:
                    self.link.mark_down()
                    self.trigger_failover()
            else:
                self.failures = 0  # 重置计数
            
            sleep(self.probe_interval / 1000)
```

**2. 流量切换（< 100ms）**

方法 A：预建隧道（推荐）
```
平时：
流量 → MPLS 隧道（活跃）
       宽带隧道（预建，待命）

MPLS 故障后：
流量 → 宽带隧道（立即激活）

切换时间：< 100ms（仅更新转发表）
```

方法 B：现场建隧道
```
MPLS 故障 → 建立宽带 IPSec 隧道 → 切换流量

切换时间：1-3 秒（包含隧道协商时间）
```

**3. 流表更新**

```python
class FlowTable:
    def failover(self, failed_link, backup_link):
        # 找出所有使用故障链路的流
        affected_flows = [
            flow for flow in self.flows 
            if flow.current_link == failed_link
        ]
        
        # 批量更新到备用链路
        for flow in affected_flows:
            flow.current_link = backup_link
            flow.last_switch_time = now()
        
        log(f\"Switched {len(affected_flows)} flows from {failed_link} to {backup_link}\")
```

**4. 上层应用感知**

| 应用类型 | TCP 重传超时 | 用户体验 |
|---------|------------|----------|
| 视频会议 | 200ms | 短暂卡顿 1-2 秒 |
| Web 浏览 | 3s | 几乎无感知 |
| 文件下载 | 5s | 速度短暂下降后恢复 |
| 数据库查询 | 1s | 需要重试 |

**优化技巧**：
1. **预建所有隧道** - 减少切换延迟
2. **BFD 快速检测** - 100ms 探测间隔
3. **应用层重传** - 上层协议自动恢复
4. **用户通知** - 严重故障时告警

---

## 🎯 流量工程技术

### 1. 按应用分类 (Application-Based Routing)

**策略示例**：

```yaml
# SD-WAN 应用策略配置
application_policies:
  - name: "关键业务"
    applications:
      - "SAP ERP"
      - "Oracle Database"
      - "Microsoft Exchange"
    requirements:
      max_latency: 50
      max_jitter: 10
      max_loss: 0.5
      min_bandwidth: 5
    path_selection:
      preferred: ["MPLS", "专线"]
      fallback: ["宽带"]
      mode: "active-standby"  # 主备模式

  - name: "实时通信"
    applications:
      - "Microsoft Teams"
      - "Zoom"
      - "Webex"
    requirements:
      max_latency: 150
      max_jitter: 30
      max_loss: 5
      min_bandwidth: 2
    path_selection:
      preferred: ["MPLS", "宽带"]
      mode: "load-balance"  # 负载均衡

  - name: "互联网访问"
    applications:
      - "HTTP"
      - "HTTPS"
      - "Email"
    requirements:
      min_bandwidth: 1
    path_selection:
      preferred: ["宽带", "4G"]
      mode: "cost-optimized"  # 成本优先

  - name: "批量传输"
    applications:
      - "FTP"
      - "Backup"
      - "Cloud Sync"
    requirements:
      min_bandwidth: 10
    path_selection:
      preferred: ["宽带"]
      schedule: "off-peak"  # 仅在非高峰时段
```

### 2. 动态 QoS

```python
class QoSScheduler:
    def __init__(self, link):
        self.link = link
        self.queues = {
            'realtime': Queue(priority=7),    # 实时（VoIP）
            'critical': Queue(priority=6),    # 关键业务
            'high': Queue(priority=5),        # 重要
            'medium': Queue(priority=4),      # 普通
            'low': Queue(priority=3),         # 低优先级
            'bulk': Queue(priority=2),        # 批量传输
            'scavenger': Queue(priority=1)    # 垃圾流量
        }
    
    def enqueue(self, packet, application):
        # 根据应用策略决定队列
        policy = get_policy(application)
        queue_name = policy.qos_class
        
        self.queues[queue_name].push(packet)
    
    def dequeue(self):
        # 严格优先级调度
        for priority in [7, 6, 5, 4, 3, 2, 1]:
            for queue_name, queue in self.queues.items():
                if queue.priority == priority and not queue.empty():
                    return queue.pop()
        return None

# 示例：
# Teams 视频 → realtime 队列（优先级 7）
# ERP 查询 → critical 队列（优先级 6）
# 文件下载 → bulk 队列（优先级 2）
```

### 3. 链路聚合 (Bonding)

**场景**: 单条链路带宽不足时，聚合多条链路

```
场景：下载 500MB 文件

单链路：
宽带 (100M) → 40 秒

链路聚合：
MPLS (10M) ┐
宽带 (100M) ├─→ 并行传输 → 36 秒
4G (20M)    ┘

实现：
1. 拆分文件为小块（如 1MB/块）
2. 块 1 → MPLS
3. 块 2 → 宽带
4. 块 3 → 4G
5. 接收端重组
```

**注意事项**：
- 只适用于非实时应用（文件传输、备份）
- 实时应用（视频）会因为抖动而卡顿
- 需要接收端支持包重组

---

## 📊 真实案例：某金融企业优化实战

### 背景

- 200 个网点
- 业务: 核心交易系统 + 视频会议 + 互联网访问
- 链路: 每个网点 MPLS 10M + 宽带 100M

### 问题

早高峰（9:00-11:00）：
- 交易系统响应慢（延迟 > 500ms）
- 视频会议卡顿严重
- 原因：所有流量都走 MPLS，拥塞

### SD-WAN 优化方案

**策略配置**：

```yaml
policies:
  # P1: 核心交易（最高优先级）
  - application: "交易系统"
    path: MPLS
    qos: realtime
    guaranteed_bandwidth: 5M  # 保底 5M
  
  # P2: 视频会议（高优先级）
  - application: "视频会议"
    path: 
      primary: MPLS
      secondary: 宽带  # MPLS 拥塞时切到宽带
    qos: high
    latency_threshold: 150ms
  
  # P3: 互联网访问（普通）
  - application: "HTTP/HTTPS"
    path: 宽带  # 直接走宽带
    qos: medium
```

### 效果

| 指标 | 优化前 | 优化后 | 改善 |
|------|--------|--------|------|
| 交易系统延迟 | 500ms | 80ms | ↓ 84% |
| 视频会议卡顿率 | 35% | 5% | ↓ 86% |
| MPLS 利用率 | 95% | 60% | ↓ 35% |
| 宽带利用率 | 10% | 70% | ↑ 600% |
| 月度 WAN 成本 | 120万 | 50万 | ↓ 58% |

**关键优化**：
1. 核心业务独占 MPLS 带宽
2. 视频会议溢出到宽带
3. 互联网访问全部卸载到宽带
4. 动态 QoS 保证关键业务 SLA

---

## 🎓 知识检查点

确保你能回答：

1. **应用识别**
   - [ ] 说出 3 种 DPI 识别方法
   - [ ] 解释为什么简单负载均衡会导致 TCP 乱序
   - [ ] 描述视频流量的特征

2. **链路选择**
   - [ ] 画出路径选择算法的流程图
   - [ ] 计算链路评分
   - [ ] 解释 BFD 快速故障检测原理

3. **流量优化**
   - [ ] 设计一个企业的应用策略
   - [ ] 配置 QoS 队列
   - [ ] 说明链路聚合的适用场景

---

## 🚀 下一步

掌握了智能路由后，接下来学习：

→ **[SD-WAN 安全设计](/guide/sdwan/security)** - 加密隧道、微分段、零信任架构  
→ **[SD-WAN 实战案例](/guide/sdwan/cases)** - 真实企业部署方案与踩坑经验  

---

<div style="text-align: center; margin-top: 3rem; padding: 2rem; background: rgba(10, 14, 39, 0.9); border: 2px solid var(--neon-green); border-radius: 12px;">
  <p style="font-family: var(--font-display); font-size: 1.2rem; color: var(--neon-green); margin: 0;">
    💡 智能路由 = 应用识别 + 链路评估 + 最优决策，三者缺一不可
  </p>
</div>

## 总结与下一步

| 维度 | 要点 |
|------|------|
| 核心价值 | 基于应用类型和链路质量的动态路由决策，告别静态路由 |
| 关键技术 | DPI 应用识别、多维链路探测、策略路由引擎 |
| 对比传统 | 传统看 IP 地址选路，SD-WAN 看应用+性能选路 |

> 📖 **下一步学习**：[SD-WAN 安全设计](/guide/sdwan/security) — 了解 SD-WAN 如何在开放网络上构建安全通道
