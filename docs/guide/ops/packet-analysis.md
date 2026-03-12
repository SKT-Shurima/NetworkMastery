# 网络诊断工具完全指南：从 tcpdump 到 Wireshark

## 导言：网络工程师的武器库

"网络不通"可能有 100 种原因：
- DNS 没解析
- 防火墙拦截
- TCP 连接超时
- UDP 丢包
- 路由不通
- NAT 转换失败
- TLS 握手失败
...

没有工具，你就是盲子。

本章将教你：
- tcpdump 的 50+ 个命令
- Wireshark 的高级过滤器
- 如何用抓包诊断真实故障
- 性能分析的方法论

---

## 第一部分：tcpdump 命令大全

### 基础命令

```bash
# 最简单：抓所有包
sudo tcpdump

# 指定网卡
sudo tcpdump -i eth0

# 抓 100 个包就停止
sudo tcpdump -c 100 -i eth0

# 保存到文件（pcap 格式，可用 Wireshark 打开）
sudo tcpdump -w capture.pcap -i eth0

# 读取已保存的文件
tcpdump -r capture.pcap

# 显示详细信息
sudo tcpdump -v -i eth0

# 显示 IP 地址和端口（默认）
sudo tcpdump -n -i eth0

# 显示十六进制 + ASCII
sudo tcpdump -A -i eth0

# 显示链路层头部（MAC 地址）
sudo tcpdump -e -i eth0
```

### 过滤器：host（IP 地址过滤）

```bash
# 只抓来自或去往 8.8.8.8 的包
sudo tcpdump host 8.8.8.8

# 只抓源自 8.8.8.8 的包
sudo tcpdump src 8.8.8.8

# 只抓去往 1.1.1.1 的包
sudo tcpdump dst 1.1.1.1

# 只抓主机之间的通信（排除其他）
sudo tcpdump host 10.0.0.1 and host 10.0.0.2

# 抓去往 10.0.0.0/24 子网的包
sudo tcpdump dst net 10.0.0.0/24
```

### 过滤器：port（端口过滤）

```bash
# 抓 HTTP 流量（端口 80）
sudo tcpdump port 80

# 抓 HTTPS（端口 443）
sudo tcpdump port 443

# 抓 SSH（端口 22）
sudo tcpdump port 22

# 抓 DNS（端口 53）
sudo tcpdump port 53

# 抓 UDP 端口 4789（VXLAN）
sudo tcpdump udp port 4789

# 抓 TCP 端口范围
sudo tcpdump tcp portrange 8000-9000

# 不抓 SSH
sudo tcpdump "not port 22"
```

### 过滤器：protocol（协议过滤）

```bash
# 只抓 TCP 包
sudo tcpdump tcp

# 只抓 UDP 包
sudo tcpdump udp

# 只抓 ICMP（ping）
sudo tcpdump icmp

# 只抓 IP 层（排除 ARP、VLAN 等）
sudo tcpdump ip

# 抓 HTTPS（TCP + port 443）
sudo tcpdump "tcp and port 443"

# 复杂过滤：TCP 或 UDP，但不是 DNS
sudo tcpdump "(tcp or udp) and not port 53"
```

### 过滤器：flags（TCP 标志过滤）

```bash
# 只抓 SYN 包（TCP 握手开始）
sudo tcpdump "tcp[tcpflags] & tcp-syn != 0"

# 只抓 SYN + ACK（握手回复）
sudo tcpdump "tcp[tcpflags] & (tcp-syn|tcp-ack) == (tcp-syn|tcp-ack)"

# 只抓 RST 包（连接重置）
sudo tcpdump "tcp[tcpflags] & tcp-rst != 0"

# 只抓 FIN 包（连接关闭）
sudo tcpdump "tcp[tcpflags] & tcp-fin != 0"

# 只抓 ACK 包（确认）
sudo tcpdump "tcp[tcpflags] & tcp-ack != 0"
```

### 高级过滤：字节匹配

```bash
# 抓目标端口为 8080 的包
# TCP 头：源 IP (20B) + 源端口 (2B) + 目标端口 (2B)
# = 从偏移 22 开始读 2 字节
sudo tcpdump "tcp[22:2] == 8080"

# 抓 HTTP GET 请求
# TCP 载荷偏移 = TCP 头长度（通常 20）+ IP 头（20）
# HTTP GET = 0x47 0x45 0x54（"GET" 的 ASCII）
sudo tcpdump "tcp[20:3] == 0x474554"

# 抓特定的数据包大小（排除小包）
sudo tcpdump "ip[2:2] > 1000"
```

### 实战例子

**例 1：诊断 DNS 问题**

```bash
# 查看 DNS 查询和响应
sudo tcpdump -n port 53

# 保存 DNS 流量供分析
sudo tcpdump -w dns.pcap port 53 -c 50

# 实时显示 DNS 查询内容
sudo tcpdump -A port 53
```

**例 2：诊断连接超时**

```bash
# 看 TCP 三次握手是否成功
sudo tcpdump "tcp[tcpflags] & (tcp-syn|tcp-ack|tcp-fin) != 0 and host 8.8.8.8"

# 或简化
sudo tcpdump "tcp[tcpflags] != tcp-ack and host 8.8.8.8"
```

**例 3：找出丢包原因**

```bash
# 抓 ICMP 错误（网络不可达、超时等）
sudo tcpdump icmp and "icmp[0] != 8 and icmp[0] != 0"

# 查看具体是哪种错误
sudo tcpdump -v icmp
```

**例 4：监测网络扫描/攻击**

```bash
# 大量 SYN 包（可能是 SYN flood 攻击）
sudo tcpdump "tcp[tcpflags] == tcp-syn" -c 100

# 计算来自同一源的 SYN 数量
sudo tcpdump "tcp[tcpflags] == tcp-syn" -nn | awk '{print $1}' | sort | uniq -c | sort -rn
```

---

## 第二部分：Wireshark 过滤器语法

### 基础 vs 高级过滤器

```
tcpdump（捕获过滤器）：在数据包进入内存前过滤
  = 减少磁盘 I/O

Wireshark（显示过滤器）：在内存中过滤已捕获的包
  = 更灵活，可以查看详细信息
```

### Wireshark 显示过滤器

```
# IP 地址过滤
ip.src == 192.168.1.1
ip.dst == 8.8.8.8

# TCP 端口过滤
tcp.port == 443
tcp.dstport == 8080

# HTTP 状态码
http.response.code == 200
http.response.code == 404

# DNS
dns.qry.name == "example.com"
dns.flags.response == 1  # 只显示 DNS 响应

# TCP 标志
tcp.flags.syn == 1  # 只显示 SYN 包
tcp.flags.fin == 1  # 只显示 FIN 包

# 组合过滤
tcp.port == 443 and ip.src == 192.168.1.1

# 排除
!(tcp.port == 22)  # 不显示 SSH
```

### 高级技巧：协议分层

```
# 只看 TCP 载荷（跳过 TCP 头）
tcp.payload

# 只看 HTTP 请求（排除响应）
http.request

# 看特定 HTTP 头部
http.host
http.user_agent

# 看 TLS/SSL 握手
ssl.handshake

# 看 TLS 版本
ssl.version

# 看 TLS 加密套件
ssl.handshake.ciphersuite
```

---

## 第三部分：真实故障诊断案例

### 案例 1：TCP 三次握手分析

**症状**：客户端访问 example.com:443 超时

```bash
# 抓取三次握手包
sudo tcpdump -w handshake.pcap host example.com and port 443 -c 10

# 用 Wireshark 打开，看时间序列
```

**抓包结果分析**：

```
时间轴：

T=0ms    客户端 → 服务器
         [SYN] SEQ=1000 (客户端说："我要连接，我的初始序列号是 1000")

T=50ms   服务器 → 客户端
         [SYN + ACK] SEQ=2000 ACK=1001
         (服务器说："好的，我的初始序列号是 2000，我确认收到你的包")

T=100ms  客户端 → 服务器
         [ACK] SEQ=1001 ACK=2001
         (客户端说："好的，握手完成")

T=500ms  ⏳ 等待，没有进一步的数据
         连接建立，但没有应用层数据

问题诊断：

情况 1：只看到 [SYN] → [RST]（服务器拒绝）
  原因：
  - 防火墙阻止
  - 服务器没有在这个端口监听
  - 服务器 IP 地址错误

情况 2：看到 [SYN] → 没有回复
  原因：
  - 路由不通
  - 服务器宕机
  - 网络延迟（看时间差）

情况 3：[SYN] → [SYN+ACK] → [ACK]，然后无数据
  原因：
  - 握手成功，但应用层有问题
  - 检查 TLS 握手（HTTP/HTTPS 需要 TLS）
```

### 案例 2：DNS 解析失败

**症状**：ping example.com 无法解析

```bash
# 抓 DNS 流量
sudo tcpdump -A port 53 and host example.com

# 或用 Wireshark
# 过滤：dns.qry.name == "example.com"
```

**分析方法**：

```
正常的 DNS 解析：

T=0ms    客户端 → DNS 服务器 (1.1.1.1:53)
         [DNS Query] ID=0x1234
         Question: example.com (A 记录)

T=50ms   DNS 服务器 → 客户端
         [DNS Response] ID=0x1234
         Answer: example.com A 1.2.3.4

故障情况：

1. 没有看到 DNS 查询
   原因：
   - 客户端使用了本地缓存
   - 检查 /etc/hosts 文件
   - 检查 systemd-resolved 的缓存

2. 看到查询，但没有响应
   原因：
   - DNS 服务器无法访问
   - 防火墙阻止了 DNS (port 53)
   - DNS 服务器过载

3. 看到响应，但是 NXDOMAIN（不存在）
   原因：
   - 域名确实不存在
   - DNS 记录删除了
   - DNS 配置错误

4. 响应来自多个 DNS 服务器，答案不一致
   原因：
   - DNS 缓存不一致（旧记录）
   - DNS 解析器配置多个 NS
   - 检查 /etc/resolv.conf
```

### 案例 3：网络延迟诊断

**症状**：网络"卡"，但能连接

```bash
# 看 TCP Retransmission（重传）
# 在 Wireshark 中：
# 列 "Info" 中看 "[TCP Retransmission]"

# 用 tcpdump 检查重传
sudo tcpdump -nn "tcp[tcpflags] & tcp-ack != 0" | grep -i retrans
```

**诊断步骤**：

```
1. 计算 RTT（Round Trip Time）
   从 [SYN] 到 [SYN+ACK] 的时间
   = 网络延迟
   
   正常：50-100ms
   糟糕：> 500ms
   
2. 看重传比例
   计算：重传包数 / 总包数
   
   < 1%：正常
   1-5%：偶发丢包（可接受）
   > 5%：网络质量差（需要优化）

3. 看重传间隔
   如果重传时间越来越长（3ms → 6ms → 12ms → 24ms...）
   = TCP 的指数退避算法在工作
   = 网络严重丢包

4. 看接收窗口大小
   Window 字段逐渐缩小 → 接收方跟不上
   检查 CPU 使用率、内存

5. 看 MTU 问题
   是否有分片？
   在 Wireshark 中：More fragments = true
   
   如果大包被频繁分片 → MTU 设置不对
```

---

## 第四部分：网络诊断工具全家桶

### ping（基础连通性）

```bash
# 基础 ping
ping example.com

# ping 特定次数
ping -c 5 example.com

# 显示统计（丢包率、延迟）
ping -c 10 example.com  # 最后显示统计

# 检查 IPv6 连接
ping6 2001:db8::1

# 指定源 IP（多网卡时）
ping -I 192.168.1.100 example.com
```

### traceroute（路由路径）

```bash
# 追踪到 example.com 的路由
traceroute example.com

# 用 UDP（某些防火墙可能拦截 ICMP traceroute）
traceroute -U example.com

# 用 TCP
traceroute -T -p 80 example.com

# 显示 IP 和主机名
traceroute example.com  # 默认行为

# 只显示 IP
traceroute -n example.com

# 诊断：找出最慢的跳跃
# 如果跳跃 3 → 4 延迟突增（从 50ms 到 500ms）
# = 问题在跳跃 4 或网络 3-4 之间
```

### mtr（综合诊断）

```bash
# 连续测试路由，显示丢包率
mtr example.com

# 非交互模式，测试 10 个包
mtr -c 10 -r example.com

# 显示详细信息
mtr -v example.com

# CSV 输出（导入表格分析）
mtr -c 100 --csv example.com > report.csv
```

### ss（Socket 统计）

```bash
# 显示所有连接
ss

# 显示监听端口
ss -l

# 显示 TCP 连接
ss -t

# 显示 UDP 连接
ss -u

# 显示进程（需要 root）
sudo ss -tlnp

# 显示特定端口的连接
ss -tlnp sport = :8080

# 显示连接状态分布
ss -s

# 看 TCP 拥塞窗口（ca_name）
ss -ti

# 看连接计数
ss -s  # ESTAB, TIME-WAIT 等
```

### netstat（传统网络统计）

```bash
# 显示所有连接和监听端口
netstat -an

# 显示连接数汇总
netstat -s

# 显示 TCP 连接统计
netstat -st

# 显示数据包丢失（需要 root）
sudo netstat -i  # 看 RX-ERR、TX-ERR 列

# 看 TCP 状态
netstat -tan | grep ESTABLISHED | wc -l
```

### iperf3（性能测试）

```bash
# 服务器端监听
iperf3 -s

# 客户端连接
iperf3 -c <server_ip>

# 测试 UDP 带宽（而不是 TCP）
iperf3 -c <server_ip> -u

# 测试双向（上下行）
iperf3 -c <server_ip> -R -b 10M

# 长时间测试（300 秒）
iperf3 -c <server_ip> -t 300

# 显示 RTT 和拥塞窗口
iperf3 -c <server_ip> -J  # JSON 输出
```

---

## 总结：诊断方法论

### 网络问题的决策树

```
问题：无法连接

1. 能 ping 通吗？
   ├─ 不能 → DNS 问题？
   │  ├─ 不能解析 → DNS 服务器问题
   │  └─ 能解析但 ping 不通 → IP 路由问题
   │
   └─ 能 → 继续...

2. 能建立 TCP 连接吗？
   ├─ 不能 → 防火墙拦截？
   │  └─ 看 [SYN] → [RST] 或超时
   │
   └─ 能 → 继续...

3. 应用层能响应吗？
   ├─ 不能 → 应用进程问题
   │  └─ SSH 连接成功，但 bash 无响应
   │     → 应用堆栈溢出或死锁
   │
   └─ 能 → 继续...

4. 性能正常吗？
   ├─ 不正常 → 丢包？延迟？
   │  └─ 用 mtr/iperf3 诊断
   │
   └─ 正常 → 问题解决！
```

### 快速诊断速记

```
症状 → 诊断工具 → 关键指标

无法访问网站：
  ping → 能到达
  traceroute → 路由正常
  tcpdump → TLS 握手是否成功
  
DNS 慢：
  dig example.com → 时间
  tcpdump port 53 → 有无超时重传
  
内网通信慢：
  iperf3 → 实际吞吐量
  ss -ti → 拥塞控制窗口
  tcpdump → 丢包率
  
丢包：
  mtr → 哪个跳跃丢包
  tcpdump → 具体是哪些包
  netstat -i → 接口层丢包
```

---

## 推荐工具和资源

- Wireshark：图形化抓包分析
- tshark：Wireshark 命令行版本
- nethogs：按进程显示网络占用
- nload：实时网络流量
- vnstat：网络流量统计
- bmon：网络带宽监视器

---

## 下一步

- [TCP/IP 深度解析](../../basics/tcpip.md)
- [HTTP 协议分析](../../basics/http.md)
- [网络安全基础](../../security/ipsec.md)
