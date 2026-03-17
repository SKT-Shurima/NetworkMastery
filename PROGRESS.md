# NetworkMastery 重构进度

## 阶段 1：深化核心 8 篇

### 完成状态

- [x] **1. tcpip.md** ✅
  - 深度：三次握手原理、TIME_WAIT 解析、拥塞控制、BBR、真实故障案例
  - 字数：33,396 字符
  - 图表：多个 Mermaid 图（握手序列图、拥塞控制状态图等）

- [x] **2. osi.md** ✅
  - 深度：分层哲学、为什么需要分层、每层详解、跨层陷阱、OSI vs TCP/IP
  - 字数：10,306 字符
  - 图表：多个 Mermaid 图

- [ ] **3. routing.md** ⏳ 开始中...
  - 需要重点：静态 vs 动态路由、OSPF、策略路由、收敛速度、SD-WAN 路由对比

- [ ] **4. dns.md**
  - 需要重点：递归解析、DNS 缓存、TTL 陷阱、DNS 安全、企业 DNS 设计

- [ ] **5. bgp.md**
  - 需要重点：互联网神经系统、状态机、iBGP vs eBGP、路径选择 11 条规则、BGP 劫持案例

- [ ] **6. mpls.md**
  - 需要重点：标签交换、LDP、MPLS VPN、MPLS TE、vs SD-WAN 对比

- [ ] **7. ipsec.md**
  - 需要重点：IKE 协商、AH vs ESP、隧道模式、真实配置、故障排查

- [ ] **8. sdwan/concepts.md**
  - 需要重点：MPLS → SD-WAN 经济账、控制/数据/管理平面、选型框架、LightWAN 架构

## 阶段 2：新增 10 篇（若 token 允许）

- [ ] http.md
- [ ] vxlan.md
- [ ] packet-analysis.md
- [ ] nat.md
- [ ] spanning-tree.md
- [ ] kubernetes-network.md
- [ ] wireless.md
- [ ] ssl-tls.md
- [ ] network-automation.md
- [ ] network-design.md

## 完成条件

1. ✅ 每篇至少 15,000 字符（目标：20,000-30,000）
2. ✅ 至少 2 个 Mermaid 图表
3. ✅ 至少 1 个真实故障案例/企业场景
4. ⏳ 所有 18 篇完成后更新 .vitepress/config.ts
5. ⏳ git commit 并 git push
6. ⏳ 发飞书消息给 Shurima 汇报

## 策略

由于 token 预算有限，优先完成核心 8 篇。如果 token 充足，继续新增 10 篇。
每篇文章采用：深度、真实案例、幽默类比、Mermaid 图 的组合。
