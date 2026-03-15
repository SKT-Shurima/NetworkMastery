# 🎓 互动式学习组件演示

这个页面展示了 NetworkMastery 的互动式学习组件。

## 思考题组件

<ThinkingQuestion
  question="为什么 SD-WAN 能够降低 40% 的 WAN 成本？"
  hint="从三个维度思考：1) 链路类型的差异；2) 运维复杂度的变化；3) 流量优化带来的收益"
  answer="**成本降低的三大来源**：

1. **链路成本**（占 60%）
   - MPLS 专线: 5000-20000 元/月/Mbps
   - Internet 宽带: 500-2000 元/月/Mbps
   - SD-WAN 可混用便宜链路，整体成本下降 50-70%

2. **运维成本**（占 25%）
   - 传统: 每个分支需要单独配置路由器
   - SD-WAN: 云端集中管理，Zero-touch 部署
   - 运维人力成本降低 40-60%

3. **流量优化**（占 15%）
   - 应用感知路由避免回流（节省带宽 30%）
   - WAN 加速技术提升链路利用率
   - 动态流量调度减少拥塞

**真实案例**: 某零售企业 500 个分支，从 MPLS 迁移到 SD-WAN 后，年度 WAN 总成本从 1200 万降至 680 万（降幅 43%）。"
/>

---

## 如何在文档中使用

在任意 Markdown 文件中插入：

\`\`\`vue
<ThinkingQuestion
  question="你的问题？"
  hint="提示内容（可选）"
  answer="参考答案（可选）"
/>
\`\`\`

---

## 设计理念

### 1. 启发式教学
不直接给答案，鼓励先思考，再查看提示，最后核对答案。

### 2. 渐进式揭示
- 默认只显示问题
- 点击"查看提示"获得思考方向
- 点击"查看答案"核对理解

### 3. 赛博朋克美学
- 紫色霓虹边框
- 顶部彩虹渐变条
- 按钮悬停发光效果
- 内容滑入动画

---

## 下一步

计划中的互动组件：

- **LabTask** - 实验任务清单
- **Quiz** - 单选/多选测验
- **Checkpoint** - 阶段检查点
- **NetworkDiagram** - 交互式网络拓扑图
- **Timeline** - 学习时间轴

---

<div style="text-align: center; margin-top: 4rem; padding: 2rem; background: var(--bg-dark-card); border-radius: 12px; border: 1px solid rgba(0, 240, 255, 0.2);">
  <p class="neon-text-cyan" style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; font-family: var(--font-display);">
    互动式学习体验
  </p>
  <p style="color: var(--text-cyber-muted); font-family: 'Fira Code', monospace;">
    [ Phase 2 - Component System ]
  </p>
</div>
