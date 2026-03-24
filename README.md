# NetworkMastery — 网络知识详解

深入探讨网络架构与 SD-WAN 技术的权威知识库，覆盖从基础协议到前沿技术的完整体系。

## 项目结构

```
docs/guide/
├── basics/        第一篇·网络基石：OSI、TCP/IP、HTTP、DNS、DHCP、QUIC/HTTP3、TLS 等
├── routing/       路由协议：OSPF、BGP、IS-IS、策略路由、EVPN、段路由
├── architecture/  企业网络架构：拓扑、骨干网、负载均衡、最佳实践
├── security/      安全体系：防火墙、IPSec、零信任、IDS/IPS、NAC、PKI、SIEM
├── attacks/       攻防：DDoS、加密、安全架构
├── qos/           QoS 与优化：流量整形、带宽分配、冗余、WAN 优化
├── sdn/           SDN：基础理论、控制器架构
├── sdwan/         SD-WAN：概念、架构、路由、安全、案例
├── vpn/           VPN：WireGuard
├── advanced/      隧道与 Overlay：MPLS、VXLAN、组播、网络切片
├── cloud/         云原生网络：容器、混合云、AWS、Azure、K8s、服务网格、多云
├── enterprise/    企业云网：传统演进、WAN、数字化转型
├── ops/           网络运维：监控、故障排查、抓包、应急响应、NetFlow、eBPF
├── wireless/      无线网络：Wi-Fi 6/7、WPA3、Mesh、企业规划
├── automation/    网络自动化：NETCONF/YANG、Python、Ansible、IaC、CI/CD
├── datacenter/    数据中心：Spine-Leaf、DCI、存储网络、NFV
└── emerging/      前沿技术：5G、IBN、AIOps、IoT 协议
```

## 开发文档

项目内部文档位于 `.meta/` 目录（不发布到站点）：

- `.meta/planning/` — 内容规划与写作规范（OUTLINE、MASTER_PROMPT 等）
- `.meta/reports/` — 各阶段完成报告
- `.meta/dev-guides/` — 开发者技术指南（主题、图表、Markdown 集成）

## 本地开发

```bash
npm install
npm run dev    # 启动开发服务器
npm run build  # 构建静态站点
```
