# 网络安全架构

现代网络安全采用纵深防御策略。

## 三道防线

```mermaid
graph TB
    Internet["互联网<br/>威胁环境"]
    Internet --> F1["第一道防线<br/>外围防护<br/>防火墙"]
    F1 --> F2["第二道防线<br/>入侵检测<br/>IDS/IPS"]
    F2 --> F3["第三道防线<br/>应用防护<br/>WAF"]
    F3 --> App["应用系统<br/>最后的堡垒"]
```

## 关键组件

| 组件 | 功能 |
|-----|------|
| 防火墙 | 基于规则过滤 |
| IDS/IPS | 特征识别检测 |
| WAF | 应用层防护 |
| DLP | 数据损失防护 |
| SIEM | 安全事件管理 |

推荐阅读：[加密与认证](/guide/attacks/encryption)
