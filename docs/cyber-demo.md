# <Icon name="palette" color="magenta" /> Cyberpunk Theme Demo

这是 NetworkMastery 赛博朋克风格主题的完整展示页面。

## <Icon name="globe" color="cyan" /> 网络拓扑示例

<NetworkTopology
  title="SD-WAN 三层架构拓扑"
  :nodes="[
    { id: 1, label: 'Controller', group: 'control' },
    { id: 2, label: 'Orchestrator', group: 'control' },
    { id: 3, label: 'Edge-1', group: 'edge' },
    { id: 4, label: 'Edge-2', group: 'edge' },
    { id: 5, label: 'Edge-3', group: 'edge' },
    { id: 6, label: 'Branch-A', group: 'branch' },
    { id: 7, label: 'Branch-B', group: 'branch' },
    { id: 8, label: 'Branch-C', group: 'branch' }
  ]"
  :edges="[
    { from: 1, to: 3, label: 'Control' },
    { from: 1, to: 4, label: 'Control' },
    { from: 1, to: 5, label: 'Control' },
    { from: 2, to: 1, label: 'Config' },
    { from: 3, to: 6, label: 'Data' },
    { from: 4, to: 7, label: 'Data' },
    { from: 5, to: 8, label: 'Data' },
    { from: 3, to: 4, label: 'Mesh' },
    { from: 4, to: 5, label: 'Mesh' }
  ]"
/>

## <Icon name="pencil" color="cyan" /> Excalidraw 逻辑图

<ExcalidrawDiagram
  title="IPSec 隧道建立流程"
  height="400px"
/>

## <Icon name="save" color="cyan" /> 代码示例

```python
# SD-WAN 路由策略示例
class SDWANRouter:
    def __init__(self, name):
        self.name = name
        self.tunnels = []
    
    def add_tunnel(self, tunnel):
        self.tunnels.append(tunnel)
        print(f"[v] Tunnel {tunnel} added to {self.name}")
    
    def select_best_path(self, destination):
        # 应用感知路由
        best_tunnel = min(self.tunnels, key=lambda t: t.latency)
        return best_tunnel

router = SDWANRouter("Branch-HQ")
router.add_tunnel({"name": "MPLS", "latency": 10})
router.add_tunnel({"name": "Internet", "latency": 5})
```

## <Icon name="bar-chart-3" color="cyan" /> 表格示例

| 技术方案 | 带宽 | 延迟 | 成本 | 适用场景 |
|---------|------|------|------|---------|
| MPLS    | 高   | 低   | 高   | 核心业务 |
| SD-WAN  | 中高 | 低   | 中   | 混合场景 |
| Internet VPN | 中 | 中高 | 低 | 分支互联 |

## <Icon name="target" color="magenta" /> 引用块

> **<Icon name="lightbulb" color="cyan" /> 提示**
> 
> SD-WAN 的核心价值在于「应用感知 + 智能路由」，不仅仅是多链路聚合。

::: tip 最佳实践
在部署 SD-WAN 前，务必进行应用流量画像分析，识别关键业务的 SLA 需求。
:::

::: warning 注意
物理层链路质量仍然是基础，SD-WAN 无法违背物理定律。
:::

::: danger 风险
不要在生产环境直接切换，建议先在测试环境充分验证。
:::

## <Icon name="link" color="cyan" /> 链接

- [OSI 七层模型](/guide/basics/osi)
- [SD-WAN 概念](/guide/sdwan/concepts)
- [GitHub 仓库](https://github.com/SKT-Shurima/NetworkMastery)

---

<div style="text-align: center; margin-top: 4rem; padding: 2rem; background: var(--bg-dark-card); border-radius: 12px; border: 1px solid rgba(0, 240, 255, 0.2);">
  <p class="neon-text-cyan" style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">
    SYSTEM READY
  </p>
  <p style="color: var(--text-cyber-muted); font-family: 'Fira Code', monospace;">
    [ Cyberpunk Theme v1.0.0 ]
  </p>
</div>
