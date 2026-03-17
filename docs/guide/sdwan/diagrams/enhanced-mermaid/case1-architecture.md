# 案例 1：制造业集团 SD-WAN 架构（改进版）

## 网络拓扑 - 增强版

```mermaid
graph TB
    subgraph HQ["🏢 总部（苏州）"]
        Controller["📊 SD-WAN Controller<br/>控制器 + 分析引擎<br/><br/>核心功能：<br/>• 策略下发<br/>• 流量分析<br/>• 故障检测<br/>• 成本优化"]
        Monitor["📈 监控与分析<br/>实时仪表板<br/>• 链路质量<br/>• 成本追踪<br/>• 告警管理"]
    end
    
    subgraph Factory1["🏭 大工厂 1 (华东)"]
        GW1["SD-WAN 网关<br/>规格：中端设备<br/>接口：千兆×4<br/>吞吐：500 Mbps+<br/><br/>链路配置：<br/>• MPLS 600 Mbps<br/>• 宽带 200 Mbps<br/>• 4G 备份"]
        ERP1["ERP 应用<br/>数据库副本"]
    end
    
    subgraph Factory2["🏭 大工厂 2 (华北)"]
        GW2["SD-WAN 网关<br/>配置：同工厂1<br/>吞吐：500 Mbps+<br/><br/>链路配置：<br/>• MPLS 600 Mbps<br/>• 宽带 150 Mbps<br/>• 4G 备份"]
        ERP2["ERP 应用<br/>生产制造系统"]
    end
    
    subgraph Factory3["🏭 小工厂 3 (西南)"]
        GW3["SD-WAN 微型网关<br/>规格：低功耗<br/>接口：千兆×2<br/>吞吐：100 Mbps<br/><br/>链路配置：<br/>• 宽带 50 Mbps<br/>• 4G 10 Mbps<br/>• 无 MPLS 专线"]
        ERP3["ERP 客户端<br/>库存查询系统"]
    end
    
    subgraph Internet["☁️ 互联网出口"]
        Router["智能路由选择<br/>• 公网（ISP）<br/>• 运营商 MPLS<br/>• 云服务接入<br/>• QoS 管控"]
    end
    
    subgraph Policy["⚙️ 智能策略引擎"]
        P1["📌 规则 1: ERP 流量<br/>优先级：最高<br/>路径：MPLS > 专网 > 宽带<br/>SLA：延迟&lt;100ms, 丢包&lt;0.1%"]
        P2["📌 规则 2: WEB 应用<br/>优先级：中等<br/>路径：智能漂移<br/>SLA：自适应"]
        P3["📌 规则 3: 日志备份<br/>优先级：低<br/>时间：非工作时间<br/>成本优化"]
    end
    
    Controller -->|🔄 策略下发| GW1
    Controller -->|🔄 策略下发| GW2
    Controller -->|🔄 策略下发| GW3
    
    Monitor -->|📊 实时监控| Controller
    
    GW1 <-->|🔐 IPSec 隧道| GW2
    GW2 <-->|🔐 IPSec 隧道| GW3
    GW1 <-->|📡 IPSec 隧道| GW3
    
    GW1 -->|🚀 智能路由| Router
    GW2 -->|🚀 智能路由| Router
    GW3 -->|🚀 智能路由| Router
    
    Controller -->|应用策略| P1
    Controller -->|应用策略| P2
    Controller -->|应用策略| P3
    
    ERP1 -->|查询请求| GW1
    ERP2 -->|生产数据| GW2
    ERP3 -->|库存查询| GW3
    
    style HQ fill:#e1f5ff
    style Factory1 fill:#f3e5f5
    style Factory2 fill:#f3e5f5
    style Factory3 fill:#fff3e0
    style Policy fill:#e8f5e9
    style Internet fill:#fce4ec
```

## 流量路径示例

### 案例场景 1：ERP 查询（高优先级）

```
小工厂3 员工查询库存数据库（总部）

传统 MPLS（迁移前）:
小工厂 --(回源)--> 总部 --(回源)--> 小工厂
延迟: 200ms+，高成本

SD-WAN 优化后:
小工厂3 --[QoS优先级最高]--> GW3
GW3 --[MPLS隧道优先]--> GW1
GW1 --[本地访问]--> ERP数据库
延迟: 80ms，自动选路，成本最优
```

### 案例场景 2：OA 应用（中等优先级）

```
大工厂内员工访问邮件系统

触发：
① 办公高峰期，MPLS 可能饱和
② SD-WAN 检测到 MPLS 链路 >80% 利用率
③ 自动漂移到宽带链路
④ OA 系统仍然可用，用户无感知

好处:
✓ 保护 MPLS 链路给关键业务
✓ 利用宽带的成本优势
✓ 网络自动优化，运维无需干预
```

## 成本效益对比

| 维度 | 迁移前（MPLS） | 迁移后（SD-WAN） | 节省 |
|------|--------------|----------------|------|
| **月度费用** | 800K 元 | 280K 元 | 520K ↓ |
| **年度成本** | 960 万 | 336 万 | **624 万** |
| **新工厂部署周期** | 3-4 周 | 3 天 | 90%↓ |
| **ERP 延迟** | 200ms | 80ms | 60%↓ |
| **设备投资** | 0（外包） | 150K（一次性） | 2 年回本 |

---

**关键收获**：
- 成本降低的同时，性能反而提升
- 灰度迁移策略降低风险
- 自动化运维，人力成本下降
