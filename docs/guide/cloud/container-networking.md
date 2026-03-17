# 容器网络深入：Docker、Kubernetes 网络模型

## 导言

容器改变了应用部署方式，但也带来了新的网络复杂性。

从 Docker 的单机容器网络，到 Kubernetes 的集群级网络编排，这一章讲解现代应用如何通过网络进行通信。

---

## Docker 容器网络基础

### 四种网络模式

#### 1. Bridge（桥接）- 默认

```
Host 网卡 ─┐
           ├─[Docker 虚拟网桥 docker0]
Container1 ┤  IP: 172.17.0.2
           │
Container2─┘  IP: 172.17.0.3

特点：
  ├─ 容器有独立 IP（172.17.0.0/16）
  ├─ 容器之间通过网桥通信
  ├─ 容器访问外网需要 NAT
  └─ 外网无法直接访问容器（除非端口映射）
```

#### 2. Host（宿主机模式）

```
Container 共享 Host 的网络命名空间
  ├─ Container 有 Host 的 IP 地址
  ├─ 性能最高（无 NAT 开销）
  └─ 但容器间容易冲突

适用场景：
  └─ 高性能网络应用（如 DNS、反向代理）
```

#### 3. Overlay（覆盖网络） - Docker Swarm

```
多个 Host 上的 Container 通过 VXLAN 隧道通信

Host A                  Host B
  │                       │
  └─ Docker1(172.18.0.2)──────── VXLAN 隧道 ────────── Docker2(172.18.0.3)

特点：
  ├─ 支持跨主机容器通信
  ├─ 通过 VXLAN 实现逻辑网络隔离
  └─ Swarm 原生支持
```

#### 4. None（无网络）

```
Container 没有网络接口（除了 lo）
  └─ 用于完全隔离的应用
```

### Port Mapping（端口映射）

```bash
docker run -p 8080:80 myapp
  └─ 宿主机 8080 端口 → 容器 80 端口

原理：
  iptables 规则
  └─ 宿主机收到 8080 上的流量 → 转发到容器 IP:80
```

---

## Kubernetes 网络模型

### Kubernetes 的网络要求

```
1. Pod 间通信：同一集群内的 Pod 可以直接通信
   └─ Pod A → Pod B（无需 Service）

2. Pod 与 Service 通信：通过 Service 做负载均衡
   └─ Pod A → Service → Pod B / Pod C / Pod D

3. External 到 Service：外网可以访问 Service
   └─ Internet → Service → Pod
```

### 网络架构

```
┌─────────────────────────────────────┐
│         Kubernetes 集群             │
├─────────────────────┬─────────────────┤
│     Node 1          │      Node 2     │
├─────────────────┬───┴────┬──────────┤
│ Pod A (10.0.1.2)│ Pod B  │Pod C    │
│                 │(10.0.1.3)(10.0.2.2)│
└─────────────────┴─────────┴──────────┘

Pod IP 分配：10.0.0.0/16
  ├─ Node 1：10.0.1.0/24
  ├─ Node 2：10.0.2.0/24
  └─ 任意 Pod 可以直接访问任意其他 Pod（no NAT）

核心 CNI（Container Network Interface）插件选择：
  ├─ Calico：基于 BGP，支持网络策略
  ├─ Flannel：简单的 vxlan 或 host-gw
  ├─ Weave：支持加密
  └─ Cilium：基于 eBPF，高性能
```

### Service 和 Endpoints

```
Service = 负载均衡器 + DNS 名称

示例：
  Service "api" (内部 DNS: api.default.svc.cluster.local)
    ├─ Cluster IP: 10.96.0.100
    └─ Endpoints:
       ├─ Pod A (10.0.1.2) - port 8080
       ├─ Pod B (10.0.1.3) - port 8080
       └─ Pod C (10.0.2.2) - port 8080

流量转发：
  访问 http://api:8080
  ├─ DNS 查询 → 10.96.0.100
  ├─ 到达 kube-proxy（每个 Node 上运行）
  ├─ kube-proxy 选择一个 Endpoint（负载均衡）
  └─ 转发到 Pod A/B/C 之一

实现：
  └─ iptables 规则 或 ipvs（高性能）
```

### Ingress（入站控制）

```
Internet traffic → Ingress Controller → Service → Pods

示例 Ingress 规则：
  api.example.com → api-service:8080
  web.example.com → web-service:3000

Ingress Controller（如 Nginx、Traefik）：
  ├─ 监听 Ingress 资源变化
  ├─ 动态更新负载均衡配置
  └─ 实现 URL 路由、SSL/TLS 终止等
```

---

## 网络隔离：Network Policy

### 默认行为

```
Kubernetes 默认：所有 Pod 可以互相通信
  └─ 危险！一个被入侵的 Pod 可以访问所有其他 Pod
```

### Network Policy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}  # 作用于所有 Pod
  policyTypes:
  - Ingress
  - Egress
  # 如果没有 Ingress rule，默认拒绝所有入站
  # 如果没有 Egress rule，默认拒绝所有出站
---
# 允许来自 frontend Pod 的入站流量
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-from-frontend
spec:
  podSelector:
    matchLabels:
      tier: backend  # 应用于标记为 tier=backend 的 Pod
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          tier: frontend  # 只允许来自 frontend 的流量
    ports:
    - protocol: TCP
      port: 8080  # 只允许 8080 端口
```

---

## 实战案例：微服务网络架构

### 三层架构

```
Internet
  ↓
[Ingress] - external-ip:443
  ↓ (HTTPS)
[Frontend Service] - api.example.com
  ↓
[Frontend Pods] - express.js web server
  ├─ 调用 API Service (内部)
  ↓
[API Service] - api-service:8080
  ↓
[API Pods] - nodejs backend
  ├─ 调用 Database Service (内部)
  ├─ 调用 Cache Service (内部)
  ↓
[Database Service] - postgresql:5432
[Cache Service] - redis:6379

配置：
  1. Ingress 只开放 443（HTTPS）
  2. Frontend Pods 只能访问 API Service（不能直接访问 DB）
  3. API Pods 只能访问 DB 和 Cache Service
  4. Database 只能被 API Pods 访问
```

### Network Policy 配置

```yaml
# 1. 拒绝所有流量
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress

# 2. 允许 Frontend 出站到 API Service
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-api
spec:
  podSelector:
    matchLabels:
      tier: frontend
  policyTypes:
  - Egress
  egress:
  - to:
    - podSelector:
        matchLabels:
          tier: api
    ports:
    - protocol: TCP
      port: 8080

# 3. 允许 API Service 入站来自 Frontend
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-from-frontend
spec:
  podSelector:
    matchLabels:
      tier: api
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          tier: frontend
    ports:
    - protocol: TCP
      port: 8080

# 4. 允许 API 访问 Database
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-db
spec:
  podSelector:
    matchLabels:
      tier: api
  policyTypes:
  - Egress
  egress:
  - to:
    - podSelector:
        matchLabels:
          tier: database
    ports:
    - protocol: TCP
      port: 5432

# 5. 允许 Database 入站来自 API
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-db-from-api
spec:
  podSelector:
    matchLabels:
      tier: database
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          tier: api
    ports:
    - protocol: TCP
      port: 5432
```

---

## 常见问题与故障排查

### 问题 1：Pod 间无法通信

```bash
诊断步骤：

1. 检查 CNI 插件是否安装
   $ kubectl get daemonsets -n kube-system
   └─ 应该看到 flannel/calico/weave 等

2. 检查 Node 间网络连通性
   $ ping node2-ip  (from node1)
   └─ 应该能 ping 通

3. 检查 Pod 是否分配了 IP
   $ kubectl get pods -o wide
   └─ STATUS 应该是 Running，IP 应该非空

4. 进入 Pod 并测试
   $ kubectl exec -it pod1 /bin/bash
   $ ping pod2-ip
   └─ 如果失败，可能是 CNI 配置问题

5. 检查 Network Policy
   $ kubectl get networkpolicies
   └─ 如果有 deny-all policy，可能被阻止

6. 检查 kube-proxy 状态
   $ kubectl get daemonsets -n kube-system kube-proxy
   └─ 应该是 Running
```

### 问题 2：Service 无法访问

```bash
诊断：

1. Service 是否存在
   $ kubectl get svc api-service
   
2. Endpoints 是否正确
   $ kubectl describe svc api-service
   └─ Endpoints 应该列出 Pod IP

3. Service ClusterIP 是否可达
   $ kubectl run -it debug --image=busybox -- sh
   $ wget http://10.96.0.100:8080  (Service ClusterIP)

4. 检查 kube-proxy iptables 规则
   $ iptables -L -t nat | grep 10.96.0.100
   └─ 应该有转发规则

5. Pod 内 DNS 是否正确
   $ nslookup api-service
   └─ 应该解析到 Service ClusterIP
```

---

## 性能优化

### 1. 选择高性能 CNI

| CNI | 性能 | 特点 |
|-----|------|------|
| Flannel | 中等 | 简单，适合小集群 |
| Calico | 高 | 支持 BGP，网络策略好 |
| Cilium | 最高 | eBPF，支持 L7 |

### 2. 使用 IPVS 而非 iptables

```bash
# 启用 IPVS（比 iptables 更高效）
kubeadm init --proxy-mode=ipvs

# 优势：
# ├─ O(1) 查找性能（vs iptables O(n)）
# ├─ 支持更多 Endpoints（iptables 有限制）
# └─ 更适合大集群
```

### 3. 配置资源限制

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: api
spec:
  containers:
  - name: api
    image: api:v1
    resources:
      requests:
        cpu: 500m
        memory: 256Mi
      limits:
        cpu: 1000m
        memory: 512Mi
    # 还应该配置 Network Policy 限制带宽
```

---

## 推荐阅读

- [SD-WAN 概念与价值](/guide/sdwan/concepts)
- [网络性能优化](/guide/qos/performance)
- [网络监控与可观测性](/guide/ops/monitoring)
- 返回目录：[首页](/)
