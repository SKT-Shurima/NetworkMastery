---
title: 故障排查方法论：系统化诊断
description: 分层排查框架与 ping、traceroute、tcpdump 等工具的实战用法与案例。
---

---
title: 故障排查方法论：系统化诊断
description: 分层排查框架与常见现象速查，结合 ping、traceroute、tcpdump 等工具的实战网络故障诊断方法。
---

# 故障排查方法论：系统化诊断

## 导言

网络问题如何高效地诊断和解决？员工说“网络很卡”，而 Dashboard 上曲线却波澜不惊——这是运维最常见的困境之一。本文先给出**分层排查框架**与**常见现象速查**，再深入 **ping、traceroute、tcpdump** 等工具的实战用法与真实案例；这里侧重实战中的 ==排查技能== 与 ==思维方式==，与分层列表对照使用。

---

## 故障排查的分层方法

从下到上逐层收敛，避免跳过低层直接猜应用：

1. **物理层** — 检查链路、光模块、接口灯、误码与协商。
2. **链路层** — 检查 VLAN、MAC、ARP、STP 状态等。
3. **网络层** — 用 Ping、Traceroute 验证连通性与路径。
4. **传输层** — 关注 TCP 重传、连接表、防火墙会话。
5. **应用层** — DNS、HTTP/TLS、数据库连接与慢查询等。

---

## 常见故障及解决方案（速查）

| 现象 | 可能原因 | 诊断方法 | 解决方案 |
|-----|--------|--------|--------|
| 无法 Ping 通 | 物理连接或网络层 | Ping + Traceroute | 检查网线、检查路由表 |
| 网页慢 | 链路拥塞或应用问题 | 看带宽利用率 | 调整 QoS 或扩容 |
| VoIP 断线 | 丢包或高延迟 | 看链路质量指标 | 优化路由或提升优先级 |

---

## 第一部分：ping——看似简单，实则深藏秘密

### 基础用法再审视

```bash
# 基础 ping
ping -c 10 google.com
  ├─ -c 10：发送 10 个 ICMP Echo Request
  └─ 观察：延迟、丢包率、是否能到达

# 实战技巧 1：检测是否是单向链路断开
ping -c 5 192.168.1.1
  └─ 如果收到 Reply，说明两向通道都畅通
  └─ 如果没有 Reply，可能是：
       ├─ 目标主机 down 了
       ├─ 目标主机禁用了 ICMP
       ├─ 中间路由断开（单向）
       └─ 防火墙阻止
```

### 进阶用法：检测 QoS 质量

```bash
# 技巧 2：检测丢包
ping -c 100 192.168.1.100 | tail -1
  └─ 输出：100 packets transmitted, 95 received, 5% loss
  └─ 5% 丢包 = 网络有问题！（正常应该 0%）

# 技巧 3：检测延迟抖动（网络不稳定的表现）
ping -c 100 -i 0.2 remote.server.com | grep "time="
  └─ 观察 time 值的波动
  └─ 如果从 50ms 跳到 500ms 再跳回 50ms = 网络抖动

# 技巧 4：大包探测（检测 MTU 问题）
ping -c 5 -s 1472 192.168.1.100
  ├─ -s 1472：发送 1472 字节数据（加 IP/ICMP 头 = 1500 字节总）
  └─ 如果这个大小通过但更大的失败 = MTU 问题
  
# 技巧 5：检测是否是 NAT 后的网络
ping -c 1 -R 192.168.1.100
  ├─ -R：请求回路（Record Route）
  └─ 查看返回的路径是否符合预期
```

### 实战案例：诡异的间歇性丢包

```
症状：
  员工报告：视频会议每隔几分钟就卡一下，然后恢复
  网络监控：看不到问题（网络利用率只有 30%）

诊断步骤：

Step 1: 基础 ping（在故障时间段执行）
  ping -c 300 -i 0.1 video.server.com > ping.log
  离线分析：
    $ cat ping.log | grep "from" | awk '{print $7}' | sort | uniq -c
    输出：
    100 time=45ms
    150 time=150ms （延迟毛刺）
    50  time=450ms
    
  结论：有间歇性延迟毛刺，不是丢包，是延迟问题

Step 2: 检测是否是客户端本地问题
  - Windows：ping -l 32 server  （l 表示缓冲区大小，不是 L）
  - 观察本地 CPU、内存
  
Step 3: 检测是否是链路饱和
  $ iftop  # 或 nethogs
  └─ 监控带宽实时使用情况
  
Step 4: 检测是否是特定应用
  $ tcpdump -i eth0 host video.server.com
  └─ 检查是否有重传 (Retransmission) 或丢包

解决：
  → 发现是：员工所在的分支，到运营商网关之间的链路
     有某台设备（可能是交换机或路由器）的 Buffer 溢出
  → 升级固件或更换设备解决
```

---

## 第二部分：traceroute——追踪数据包的路径

### 基础原理

```
traceroute 的工作原理：

发送 TTL=1 的数据包 → 第一个路由器回复 ICMP Time Exceeded
发送 TTL=2 的数据包 → 第二个路由器回复
...
直到到达目标

结果展示：
  traceroute google.com
  traceroute to google.com (142.250.185.46), 30 hops max
   1  192.168.1.1 (gateway)             2 ms     2 ms     2 ms
   2  10.0.0.1 (ISP)                   10 ms    10 ms    11 ms
   3  * * *   (路由器未回复，可能禁用了 ICMP)
   4  12.34.56.78 (backbone)           50 ms    50 ms    49 ms
   5  ... 142.250.185.46                89 ms    89 ms    88 ms
```

### 诊断技巧

#### 技巧 1：检测某一跳是否是瓶颈

```bash
$ traceroute -m 5 -q 3 192.168.1.100
  ├─ -m 5：只显示到第 5 跳
  ├─ -q 3：每跳发送 3 个包（默认 3 个）
  └─ 观察：是否某一跳的延迟突然增加

分析：
  Hop 1 (网关)：2 ms
  Hop 2 (ISP)：10 ms
  Hop 3：50 ms ← 延迟突增！
  Hop 4：51 ms ← 后续都高
  
  结论：Hop 3 是瓶颈（可能是跨域链路拥塞）
```

#### 技巧 2：检测路由环路（routing loop）

```bash
症状：ping 时看到 "TTL exceeded"
原因：配置错误导致数据包在网络中绕圈

检测：
  $ traceroute 目标地址
  └─ 如果显示出现重复的 IP，或 TTL 一直在增加
  └─ 就说明有环路
  
修复：检查路由表
  $ route -n  （Linux）
  或 
  netstat -r  （macOS）
  └─ 找出错误的路由条目，删除它
```

#### 技巧 3：UDP 和 TCP 的不同

```bash
# traceroute 默认用 UDP（某些 ISP 会限制）
traceroute google.com
  └─ 中途可能出现超时 (*)

# 改用 TCP（通过 -T 选项）
traceroute -T google.com
  └─ 通常能更好地穿过 ISP 的限制

# 改用 ICMP
traceroute -I google.com
  └─ 最可靠，但某些防火墙会阻止
```

### 实战案例：国际链路故障

```
症状：
  海外客户反映连接到中国总部的延迟非常高（800ms）
  而地理距离不应该造成这么高的延迟（应该 200-300ms）

诊断：

从美国加州运行：
  $ traceroute beijing.company.com
  
  1  local-gateway (ISP)          2 ms
  2  backbone.isp (美国)           15 ms
  3  international-link           200 ms ← 国际链路开始
  4  * * *  (太平洋链路，可能繁忙)
  5  hong-kong-gw                450 ms ← 延迟大增！
  6  china-isp                   600 ms
  7  beijing.company.com         800 ms

结论：
  - 预期：美国 → 太平洋 → 香港 → 北京（200 + 100 = 300ms）
  - 实际：多了一个香港节点，且到那里已经 450ms
  - 问题：链路可能有拥塞，或被路由到了低质量线路

解决：
  → 联系 ISP，要求使用高质量的国际线路
  → 或者考虑在新加坡/日本部署中转节点
```

---

## 第三部分：tcpdump——深入数据包

### 基础用法

```bash
# 基础命令：抓取所有 HTTP 流量
tcpdump -i eth0 tcp port 80

# 只看发往某个 IP 的流量
tcpdump -i eth0 host 192.168.1.100

# 以易读格式保存到文件
tcpdump -i eth0 -w capture.pcap host 192.168.1.100
tcpdump -r capture.pcap  # 读取文件

# 显示包的完整内容（16 进制）
tcpdump -i eth0 -X -x host 192.168.1.100
```

### 进阶技巧

#### 技巧 1：检测 TCP 重传和丢包

```bash
# 启用详细的 TCP 标志显示
tcpdump -i eth0 -S tcp port 3306
  ├─ -S：显示绝对序列号（而非相对）
  └─ 观察输出中的 [S] [.] [F] 等标志

正常的 TCP 三次握手：
  192.168.1.1.12345 > 192.168.1.100.3306: Flags [S], seq 1000
  192.168.1.100.3306 > 192.168.1.1.12345: Flags [S.], seq 5000, ack 1001
  192.168.1.1.12345 > 192.168.1.100.3306: Flags [.], ack 5001

异常：如果看到重复的 [S]
  192.168.1.1.12345 > 192.168.1.100.3306: Flags [S], seq 1000
  192.168.1.1.12345 > 192.168.1.100.3306: Flags [S], seq 1000  ← 重传
  └─ 说明 SYN 包丢失，TCP 在重试
```

#### 技巧 2：分析 DNS 问题

```bash
# 只看 DNS 查询
tcpdump -i eth0 port 53

输出格式：
  192.168.1.1.54321 > 8.8.8.8.53: 12345+ A? google.com (33)
  8.8.8.8.53 > 192.168.1.1.54321: 12345 2/0/0 A 142.250.185.46 (49)
  
说明：
  ├─ 12345：DNS Transaction ID
  ├─ +：标准查询
  ├─ A?：查询 A 记录（IPv4 地址）
  ├─ 2/0/0：返回 2 个答案、0 个权限记录、0 个附加记录
  └─ 142.250.185.46：IP 地址

故障排查：
  □ 没有看到 response → DNS 服务器不回应
  □ 看到 NXDOMAIN → 域名不存在
  □ 多次查询同一个 DNS → 可能是 DNS timeout
```

#### 技巧 3：检测 SSL/TLS 握手问题

```bash
# 抓取 HTTPS（443 端口）的流量
tcpdump -i eth0 -A -X port 443

看到的握手过程：
  1. Client Hello（客户端发起）
  2. Server Hello（服务器响应）
  3. Certificate（证书）
  4. Server Key Exchange（密钥交换）
  5. Server Hello Done
  6. Client Key Exchange
  7. Change Cipher Spec
  8. Encrypted Handshake Message

问题排查：
  □ 看不到 Server Hello → 服务器不响应
  □ Certificate 错误 → 证书问题
  □ 多次 Client Hello 但不握手成功 → TLS 版本或密码套件不匹配
```

### 实战案例：诊断 SSH 连接缓慢

```
症状：
  ssh 登录到远程服务器时，输入密码后卡住 5 秒才能进入

在 SSH 客户端执行：
  tcpdump -i eth0 -n host remote.server.com

同时在另一个窗口尝试 ssh remote.server.com

观察输出：
  第 1 秒：三次握手 [S] [S.] [.]
  第 2 秒：SSH Banner 交互（SSH-2.0-...）
  第 3 秒：Key Exchange Init
  第 4 秒：Diffie-Hellman 密钥交换
  第 9 秒：最后一个数据包
  ↑ 握手总耗时：8 秒
  
  输入密码后：
  第 10-12 秒：加密的登录包
  第 12-17 秒：卡住不动！
  第 18 秒：服务器回复，会话建立

分析：
  → 握手本身很快（8 秒是正常的）
  → 问题在"输入密码后到服务器认证"这段（5 秒）
  → 可能是：PAM 认证、LDAP 查询、或 DNS 反查缓慢

解决：
  1. 在服务器端检查：ssh -v 输出，看是否在 "Authentications" 卡住
  2. 在服务器执行：strace -e trace=network ssh-connection-command
     → 看 ssh 服务进程在网络上做什么
  3. 如果是 DNS 反查：在 sshd_config 加 UseDNS no
```

---

## 第四部分：综合案例——解决生产网络故障

### 案例：突发的间歇性超时

```
时间：下午 2:00 PM
症状：
  - 用户反映：API 调用偶尔超时
  - 监控显示：应用响应时间突然飙升到 5-10 秒
  - 服务器 CPU、内存、磁盘都正常
  - 数据库连接池没有满

我的诊断流程：

Step 1: 验证是否真的是网络问题（2 分钟）
  $ ping -c 100 -i 0.1 db-server
  → 结果：0% 丢包，延迟 2-3ms，正常
  
Step 2: 检查链路负载（3 分钟）
  $ iftop -i eth0
  → 看到：网络利用率只有 5%，没有问题
  
Step 3: 检查是否是 DNS 问题（5 分钟）
  $ tcpdump port 53 | head -50
  → 没看到 DNS 超时
  
Step 4: 检查应用到数据库的连接（7 分钟）
  $ tcpdump -i eth0 host db-server -c 100
  → 看到大量的 TCP 重传！
  
Step 5: 深入分析 TCP 重传（10 分钟）
  $ tcpdump -i eth0 -S host db-server | grep "retransmission"
  
  输出：
  [TCP Retransmission] app.server.12345 > db.server.3306, seq 1000000
  [TCP Retransmission] app.server.12345 > db.server.3306, seq 1000000 (100ms 后)
  [TCP Retransmission] ...（多次）
  
  结论：应用发往数据库的某些包被丢掉了，引发 TCP 重传
          应用层面会经历 timeout（TCP 重传耗时）

Step 6: 检查是否是特定的数据库命令导致（12 分钟）
  $ tcpdump -i eth0 -A host db.server | grep -A 5 "SELECT"
  → 看到所有 SELECT 查询都很小，不是大查询问题
  
Step 7: 排查网络链路问题（15 分钟）
  $ traceroute db-server
  → 查看是否某个路由器有问题
  
  但这需要时间...决定先应急，后诊断

应急方案（实施）：
  1. 重启应用服务：释放可能泄露的连接
  2. 检查防火墙日志：看是否有限速或异常拦截
  3. 检查交换机日志：看是否有端口错误或队列溢出
  
最终发现：
  → 某台交换机的某个端口 Buffer 满了
  → 导致发往数据库的某些包被丢弃
  → 升级交换机固件后恢复正常
```

---

## 工具速查表

| 工具 | 主要用途 | 常用选项 |
|------|--------|---------|
| ping | 测试连通性和延迟 | `-c N`：次数，`-s 大小`：包大小，`-i 间隔`：发包间隔 |
| traceroute | 追踪路径 | `-m N`：最多跳数，`-T`：用 TCP，`-I`：用 ICMP |
| tcpdump | 抓包分析 | `-i 网卡`：指定网卡，`-w 文件`：保存，`-r 文件`：读取 |
| mtr | 综合诊断 | 结合了 ping 和 traceroute |
| netstat | 查看连接 | `-an`：所有连接，`protocol`：筛选协议 |
| iftop | 看实时带宽 | `-i 网卡`：指定网卡 |
| tcptrack | 看 TCP 连接 | 实时看连接建立/断开 |

---

## 推荐阅读

- [网络监控与可观测性](/guide/ops/monitoring)
- [网络安全架构](/guide/attacks/security-arch)
- 返回目录：[首页](/)
