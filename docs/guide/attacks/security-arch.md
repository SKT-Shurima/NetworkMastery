# 网络安全架构

## 核心理念：纵深防御

网络安全没有"万能锁"。纵深防御（Defense in Depth）的核心思想是：**假设任何一层都可能被突破，所以要层层设防**。

就像中世纪的城堡：护城河、城墙、箭塔、内城、密室——攻破一层不代表攻下全城。

```mermaid
graph TB
    subgraph "纵深防御模型"
        A["🌍 物理安全<br/>机房门禁 / 监控"]
        B["🌐 网络安全<br/>防火墙 / IDS/IPS"]
        C["💻 主机安全<br/>加固 / 补丁 / EDR"]
        D["📱 应用安全<br/>WAF / 代码审计"]
        E["📊 数据安全<br/>加密 / 备份 / DLP"]
        F["👤 身份安全<br/>MFA / IAM / 零信任"]
    end
    
    A --> B --> C --> D --> E --> F

    style A fill:#f0f9ff,stroke:#0ea5e9
    style B fill:#ecfdf5,stroke:#10b981
    style C fill:#fef3c7,stroke:#f59e0b
    style D fill:#fce7f3,stroke:#ec4899
    style E fill:#ede9fe,stroke:#8b5cf6
    style F fill:#fee2e2,stroke:#ef4444
```

## 三道防线

### 第一道：边界防御

目标：**阻止外部威胁进入内网**

| 设备 | 功能 | 部署位置 |
|-----|------|---------|
| **防火墙** | 基于规则过滤流量 | 内外网边界 |
| **IDS/IPS** | 检测/阻断入侵行为 | 防火墙之后 |
| **WAF** | 防护 Web 应用攻击 | Web 服务器前 |
| **Anti-DDoS** | 清洗异常流量 | 入口最前端 |
| **邮件网关** | 过滤钓鱼邮件/恶意附件 | 邮件入口 |

```mermaid
graph LR
    Internet["🌐 互联网"] --> FW["防火墙"]
    FW --> IPS["IDS/IPS"]
    IPS --> DMZ["DMZ 区"]
    IPS --> Internal["内网"]
    
    DMZ --> Web["Web 服务器"]
    DMZ --> Mail["邮件服务器"]
    
    Internal --> App["应用服务器"]
    Internal --> DB["数据库"]
    
    style FW fill:#d1fae5,stroke:#10b981
    style IPS fill:#fef3c7,stroke:#f59e0b
    style DMZ fill:#dbeafe,stroke:#3b82f6
    style Internal fill:#ede9fe,stroke:#8b5cf6
```

### 第二道：内网隔离

目标：**即使攻击者进入内网，也无法横向移动**

- **网络分区**：按业务划分 VLAN，不同区域之间需要通过防火墙通信
- **微分段**：在虚拟化/容器环境中，每个工作负载都有独立的安全策略
- **最小权限**：每个用户、每个服务只能访问它必须访问的资源
- **东西向流量检测**：监控内网之间的流量，不只是南北向

### 第三道：终端和数据

目标：**保护最终的资产——数据本身**

- **终端检测与响应（EDR）**：监控每台终端的行为，发现异常立即隔离
- **数据加密**：传输中用 TLS，存储用 AES-256
- **数据防泄漏（DLP）**：检测并阻止敏感数据外传
- **备份恢复**：即使数据被加密（勒索软件），也能从备份恢复

## 零信任架构

传统安全的问题：**进了公司网络就信任你**。这在远程办公时代已经不够了。

零信任（Zero Trust）的原则：**永远不信任，始终要验证。**

```mermaid
graph TB
    subgraph "传统模型"
        T1["✅ 公司网络内 = 信任"]
        T2["❌ 公司网络外 = 不信任"]
    end
    
    subgraph "零信任模型"
        Z1["🔐 每次访问都验证身份"]
        Z2["🔐 每次访问都检查设备"]
        Z3["🔐 每次访问都评估风险"]
        Z4["🔐 最小权限，仅授权必要资源"]
    end
    
    style T1 fill:#fee2e2,stroke:#ef4444
    style T2 fill:#fee2e2,stroke:#ef4444
    style Z1 fill:#d1fae5,stroke:#10b981
    style Z2 fill:#d1fae5,stroke:#10b981
    style Z3 fill:#d1fae5,stroke:#10b981
    style Z4 fill:#d1fae5,stroke:#10b981
```

### 零信任的核心组件

| 组件 | 作用 | 典型产品 |
|-----|------|---------|
| **身份提供商（IdP）** | 统一身份认证 | Okta、Azure AD |
| **设备信任评估** | 检查设备安全状态 | CrowdStrike、Jamf |
| **策略引擎** | 动态权限决策 | Google BeyondCorp |
| **安全网关** | 代理和加密所有访问 | Zscaler、Cloudflare |
| **持续监控** | 实时行为分析 | SIEM、UEBA |

## 安全架构设计原则

::: tip 设计原则
1. **最小权限**：只给必要的权限，没有例外
2. **纵深防御**：不依赖任何单一防护层
3. **默认拒绝**：没有明确允许的，一律拒绝
4. **持续验证**：不是"登录一次就完事"
5. **可审计**：所有操作都有日志，可追溯
6. **故障安全**：安全设备故障时，默认断开（Fail-Close）
:::

## 小结

网络安全架构不是买几台防火墙就完事。它是一个系统工程：

- **外围**用防火墙和 IPS 挡住大部分攻击
- **内部**用分区和微分段限制横向移动
- **终端**用 EDR 监控每台设备
- **数据**用加密和 DLP 保护核心资产
- **身份**用零信任确保每次访问都可信

层层叠叠，环环相扣。

---

**推荐阅读**：
- [DDoS 攻击与防御](/guide/attacks/ddos) — 最常见的外部攻击类型
- [加密与身份认证](/guide/attacks/encryption) — 零信任架构的基石
- [SD-WAN 安全设计](/guide/sdwan/security) — 企业广域网的安全策略
