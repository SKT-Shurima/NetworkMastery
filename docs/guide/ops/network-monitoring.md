# 网络监控完整指南：SNMP、NetFlow、Syslog

## 导言

你无法管理你看不见的东西。网络监控就是给你一双眼睛，实时看到网络发生了什么。

这一章讲解 SNMP、NetFlow、Syslog 三大网络监控技术及其企业部署。

---

## 第一部分：SNMP（简单网络管理协议）

### SNMP 是什么？

```
SNMP = 网络设备的"体检工具"

可以获取：
  ├─ CPU 使用率
  ├─ 内存使用率
  ├─ 接口流量
  ├─ 设备温度
  ├─ 电源状态
  └─ 自定义的任何指标

工作方式：
  监控站点 → 定期查询 → 网络设备
              或等待告警
  
版本：
  ├─ SNMPv2c：社区名鉴权（不加密，不安全）
  ├─ SNMPv3：用户名密码，支持加密（推荐）
  └─ 我们这里用 v2c（更常见）
```

### SNMP 配置

```bash
# 交换机配置示例（Cisco）
snmp-server community public RO    # 读community
snmp-server community private RW   # 写community
snmp-server trap-source Vlan 100   # 告警源
snmp-server enable traps           # 启用告警

# Linux 配置（net-snmp）
apt-get install snmp-server
编辑 /etc/snmp/snmpd.conf:
  rocommunity public
  sysdescr My Router
  
# 重启服务
systemctl restart snmpd

# 测试
snmpwalk -c public 192.168.1.1    # 查询所有 OID
snmpget -c public 192.168.1.1 1.3.6.1.2.1.1.1.0  # 查询系统描述
```

### 常用 OID（对象标识符）

```
OID = 网络设备中数据的地址（如文件系统中的路径）

常用 OID：

1.3.6.1.2.1.1.1.0          系统描述
1.3.6.1.2.1.1.3.0          系统运行时间
1.3.6.1.2.1.1.5.0          系统名称

1.3.6.1.2.1.25.3.2.1.5.1   CPU 使用率（%）
1.3.6.1.2.1.25.2.3.1.6.1   内存总量
1.3.6.1.2.1.25.2.3.1.7.1   内存可用量

1.3.6.1.2.1.2.2.1.10       接口输入字节数
1.3.6.1.2.1.2.2.1.16       接口输出字节数

1.3.6.1.2.1.2.2.1.20       接口输入错误
1.3.6.1.2.1.2.2.1.23       接口输出错误
```

---

## 第二部分：NetFlow（网络流量采样）

### NetFlow 是什么？

```
SNMP：看到"某个接口有 100 Mbps 流量"（总体）
NetFlow：看到"Bob 在 download.com 下载 1GB"（详细）

NetFlow 采样网络流量，告诉你：
  ├─ 谁（源 IP）
  ├─ 给谁（目标 IP）
  ├─ 用什么（应用协议）
  ├─ 花了多少流量
  ├─ 持续了多长时间
  └─ 什么时候

应用：
  ├─ 流量分析（哪个应用耗流量）
  ├─ 安全监测（异常流量）
  ├─ 容量规划（需要多少带宽）
  ├─ 计费（用户 A 用了多少流量）
  └─ 故障排查（流量为什么卡）
```

### NetFlow 工作流程

```
数据包流过路由器 / 交换机
  ↓
NetFlow 引擎采样（可能采 1/100 的包）
  ↓
生成 Flow Record（流记录）
  ├─ 源 IP:端口
  ├─ 目标 IP:端口
  ├─ 协议
  ├─ 开始/结束时间
  ├─ 字节数
  └─ 包数
  
Flow Record 发送到 NetFlow 收集器
  ↓
收集器聚合和分析
  └─ 显示：哪些流占用最多带宽
```

### NetFlow 部署

```bash
# 交换机配置（Cisco）
ip flow-export version 9
ip flow-export destination 192.168.1.100 2055
ip flow-export source Vlan 100

# 在接口启用 NetFlow
interface Gi0/1
  ip flow ingress

# 收集器（Nginx、Grafana 等可视化）
# 可选开源工具：nfcapd（采集）、nfstat（分析）

# 测试
show ip flow cache | head  # 查看活跃的流
```

---

## 第三部分：Syslog（系统日志）

### Syslog 是什么？

```
设备生成的文本日志：

Oct 15 10:23:45 router1 %SYS-5-CONFIG_I: 
  Configured from console by admin on vty0 (192.168.1.100)

Oct 15 10:24:12 router1 %LINK-3-UPDOWN: 
  Interface GigabitEthernet0/1, changed state to up

Oct 15 10:25:33 switch1 %OSPF-4-BADTYPE: 
  Invalid OSPF packet type 255, source 10.0.0.1

Syslog 级别（从高到低）：
  0 - Emergency  (系统无法使用)
  1 - Alert      (立即采取行动)
  2 - Critical   (严重情况)
  3 - Error      (错误)
  4 - Warning    (警告)
  5 - Notice     (注意)
  6 - Info       (信息)
  7 - Debug      (调试)
```

### Syslog 配置

```bash
# 设备端（发送日志）
# 交换机配置
logging host 192.168.1.50    # Syslog 服务器
logging trap warnings        # 只发送 warning 及以上级别
logging facility local0      # 使用 local0 设施

# Linux Syslog 服务器（接收日志）
apt-get install rsyslog
编辑 /etc/rsyslog.conf:
  $UDPServerRun 514          # 监听 UDP 514 端口
  :FROMHOST,"!=" "127.0.0.1" /var/log/network.log  # 非本地日志
  
# 重启
systemctl restart rsyslog

# 查看日志
tail -f /var/log/network.log

# 日志分析（grep、awk 等）
grep ERROR /var/log/network.log | head
# 统计错误数量
grep ERROR /var/log/network.log | wc -l
```

---

## 第四部分：企业监控系统

### 典型架构

```
数据收集层：
  ├─ SNMP 采集器（汇总 CPU、内存、接口）
  ├─ NetFlow 采集器（应用级流量）
  └─ Syslog 服务器（日志收集）

数据处理层：
  ├─ 数据库（InfluxDB、Prometheus）
  └─ 日志引擎（Elasticsearch）

可视化层：
  ├─ Grafana（仪表盘）
  ├─ Kibana（日志分析）
  └─ Netbox（资产管理）

告警层：
  ├─ 阈值告警（CPU > 80%）
  ├─ 异常检测（流量突增 300%）
  ├─ 关联告警（多台设备同时故障）
  └─ 通知（邮件、Slack、短信）

完整架构示意：

  [路由器/交换机]
    ├─ SNMP → SNMP 采集器
    ├─ NetFlow → NetFlow 采集器
    └─ Syslog → Syslog 服务器
    
    ↓ 汇聚到
    
  [数据库] (Prometheus / InfluxDB / ELK)
    
    ↓ 可视化
    
  [Grafana 仪表盘]
    ├─ 实时流量图
    ├─ 应用分布
    ├─ 告警列表
    └─ 历史对比
```

### 实战：配置一个简单的监控系统

```bash
# Step 1: 安装 Prometheus（时间序列数据库）
docker run -d -p 9090:9090 prom/prometheus

# Step 2: 配置 Prometheus 收集 SNMP（使用 snmp-exporter）
docker run -d -p 9116:9116 prom/snmp-exporter

# Step 3: 配置 Prometheus 查询 SNMP exporter
编辑 prometheus.yml:
  scrape_configs:
    - job_name: 'snmp'
      static_configs:
        - targets:
          - 192.168.1.1  # 要监控的设备
      metrics_path: /snmp
      params:
        module: [if_mib]  # SNMP 模块
      relabel_configs:
        - source_labels: [__address__]
          target_label: __param_target
        - source_labels: [__param_target]
          target_label: instance
        - target_label: __address__
          replacement: 127.0.0.1:9116

# Step 4: 安装 Grafana（可视化）
docker run -d -p 3000:3000 grafana/grafana

# Step 5: 在 Grafana 中添加 Prometheus 数据源
http://localhost:3000
登录（admin/admin）
配置数据源 → Prometheus
URL: http://prometheus:9090

# Step 6: 创建仪表板
查询：
  up{job="snmp"}  # 设备是否在线
  ifInOctets      # 接口输入字节
  ifOutOctets     # 接口输出字节
  
可视化：
  ├─ 折线图（流量趋势）
  ├─ 仪表板（CPU 当前值）
  ├─ 热力图（流量时间分布）
  └─ 告警规则
```

---

## 最佳实践

1. **分层采集**
   - 近端设备高频率采集
   - 远端设备低频率采集
   - 节省带宽和存储

2. **日志保留**
   - 实时日志：7 天
   - 归档日志：1 年
   - 定期清理防止磁盘满

3. **告警优化**
   - 避免告警风暴（频繁的无用告警）
   - 告警分级（Critical/Warning/Info）
   - 关联多个指标做聪明的告警

4. **安全**
   - SNMP community 改强密码
   - 限制谁可以查询 SNMP
   - 日志分离（敏感日志单独存储）

5. **容量规划**
   - 监控系统本身也需要资源
   - 1000 台设备 → 监控系统需要 4GB 内存
   - 预留 30% 冗余

---

## 推荐阅读

- [网络监控与可观测性](/guide/ops/monitoring)
- [故障排查方法论](/guide/ops/troubleshooting)
- [网络性能优化](/guide/qos/performance)
- 返回目录：[首页](/)
