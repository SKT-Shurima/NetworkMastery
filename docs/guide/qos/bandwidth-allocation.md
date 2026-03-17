# 带宽分配策略：如何公平分配有限资源

## 导言

办公室有 100 Mbps 的互联网，但 200 个员工。怎样分配才公平？

如果都平均分配，每人 0.5 Mbps。但有人在视频会议，有人在发邮件，他们的需求不同。

==带宽分配==就是在有限的资源中，根据优先级和公平性进行分配。

---

## 第一部分：分配策略

### 策略 1：平均分配

```
总带宽 100 Mbps / 200 员工 = 0.5 Mbps/人

优点：
  ✓ 简单
  ✓ 公平

缺点：
  ✗ 不公平（CEO 和实习生一样）
  ✗ 有人不用，有人饥渴
```

### 策略 2：按部门分配

```
市场部：30 Mbps（人多）
技术部：40 Mbps（工作需要高带宽）
财务部：20 Mbps（邮件为主）
其他：10 Mbps

优点：
  ✓ 考虑了业务需求

缺点：
  ✗ 市场部有人浪费，技术部有人渴望
  ✗ 部门间资源闲置
```

### 策略 3：动态分配（推荐）

```
总带宽 100 Mbps

基础分配（保证）：
  ├─ 每个部门最少 5 Mbps
  └─ 剩余 80 Mbps 根据需求动态分配

动态规则：
  1. 每个部门监测当前使用率
  2. 如果某部门需求高，动态增加
  3. 如果某部门空闲，让出资源
  4. 每 5 分钟重新评估一次

效果：
  ├─ 技术部在忙的时候可以用到 60 Mbps
  ├─ 市场部在忙的时候也能用到 60 Mbps
  ├─ 没人浪费资源
  └─ 整体吞吐量最大化
```

---

## 第二部分：按应用优先级分配

### 场景：企业 WAN 链路（总容量 100 Mbps）

```
分配方案：

优先级 1（关键业务）：ERP、Database - 保证 30 Mbps
优先级 2（重要业务）：Email、Web - 保证 20 Mbps
优先级 3（非关键）：下载、流媒体 - 保证 10 Mbps
优先级 4（最低）：P2P、备份 - 使用剩余

日常流量分布：

工作时间（9-18 点）：
  └─ ERP：20 Mbps ✓ 满足
  └─ Email：15 Mbps ✓ 满足
  └─ 下载：10 Mbps ✓ 满足
  └─ P2P：55 Mbps ✗ 超限 → 降速到 剩余带宽

非工作时间（18-9 点）：
  └─ 备份任务使用 80 Mbps（其他应用休眠）
  └─ P2P 使用 20 Mbps
  └─ 完全充分利用
```

---

## 第三部分：公平性算法

### 算法 1：Max-Min 公平

```
保证最差的用户也能获得最大可能的带宽

过程：

初始状态：
  用户 A 需求：100 Mbps
  用户 B 需求：80 Mbps
  用户 C 需求：50 Mbps
  总容量：100 Mbps

Step 1: 所有用户平均分配
  100 / 3 ≈ 33 Mbps per user
  但 C 只需要 50 Mbps
  
Step 2: C 用不完 17 Mbps，分给 A 和 B
  (100 - 50) / 2 = 25 Mbps
  每个用户 50 + 25 = 75 Mbps
  
但 B 只需要 80，所以 B 得 75，剩余 5 Mbps 给 A
  
最终：
  用户 A：80 Mbps
  用户 B：15 Mbps（已满足）
  用户 C：5 Mbps（已满足）
```

---

## 第四部分：实施工具

### Cisco QoS

```
定义带宽分配：

priority-queue outgoing-interface
  priority level 1 bandwidth 30  (ERP, 30%)
  priority level 2 bandwidth 20  (Email, 20%)
  priority level 3 bandwidth 10  (Web, 10%)
  priority level 4 bandwidth 40  (其他, 40%)
```

### Linux TC

```
创建 HTB（分层令牌桶）规则：

# 根 qdisc，总容量 100 Mbps
tc qdisc add dev eth0 root handle 1: htb default 40
tc class add dev eth0 parent 1: classid 1:1 htb rate 100mbit

# 每个优先级
tc class add dev eth0 parent 1:1 classid 1:10 htb rate 30mbit
tc class add dev eth0 parent 1:1 classid 1:20 htb rate 20mbit
tc class add dev eth0 parent 1:1 classid 1:30 htb rate 10mbit
tc class add dev eth0 parent 1:1 classid 1:40 htb rate 40mbit

# 根据应用分类
tc filter add dev eth0 protocol ip parent 1: prio 1 u32 \
  match ip dport 3389 flowid 1:10  # 远程桌面优先级 1
```

---

## 最佳实践

1. **保证 vs 最大**
   - 保证（硬保证）给关键应用
   - 剩余带宽让应用竞争（动态获得）

2. **监控和调整**
   - 定期检查带宽使用分布
   - 根据业务需求调整策略

3. **透明度**
   - 让用户知道带宽限制的原因
   - 在必要时进行沟通

4. **应急预案**
   - 突然的带宽需求（紧急会议）
   - 临时调整优先级

---

## 推荐阅读

- [QoS 与流量工程](/guide/qos/qos)
- [流量整形与带宽管理](/guide/qos/traffic-shaping)
- [网络性能优化](/guide/qos/performance)
- 返回目录：[首页](/)
