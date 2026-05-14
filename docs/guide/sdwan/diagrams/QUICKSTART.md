# <Icon name="rocket" color="magenta" /> 快速开始指南

不想看那么多文档？这个 5 分钟快速指南帮你快速上手。

---

## 你是谁？<Icon name="user" color="cyan" />

### <Icon name="book-open" color="cyan" /> 我是文档阅读者
**你想**: 看看 SD-WAN 在三个企业中的实际应用

**做这个**:
1. 打开原文档: `docs/guide/sdwan/cases.md`
2. 找到你感兴趣的案例（制造业/金融/互联网）
3. 查看相应的 Mermaid 图表
4. 点击链接查看详细资源

---

### <Icon name="image" color="cyan" /> 我是演讲者/博主
**你想**: 获得高质量的图表用于演讲或文章

**做这个**:
1. 进入 `diagrams/svg/` 目录
2. 选择你需要的 SVG 文件
   - `case1-topology.svg` - 制造业架构
   - `case2-zerotrust.svg` - 零信任框架
   - `case3-global.svg` - 全球网络
3. 直接拖入 PowerPoint/Keynote，或导出为 PNG/PDF

---

### <Icon name="pencil" color="cyan" /> 我需要编辑这些图
**你想**: 修改图表内容以适应自己的场景

**做这个**:
1. 进入 `diagrams/excalidraw/` 目录
2. 选择你需要的 JSON 文件
3. 访问 https://excalidraw.com
4. 点击 "Open" → "Import"
5. 导入对应的 JSON 文件
6. 进行编辑（可以邀请他人协作）
7. 导出为新的 JSON（如需保存）或 PNG/SVG

---

### <Icon name="refresh-cw" color="cyan" /> 我需要集成到文档中
**你想**: 在原 `cases.md` 中使用这些资源

**做这个**:
1. 打开 `diagrams/INTEGRATION.md` - 完整的集成步骤
2. 选择你喜欢的集成方案
3. 照着步骤操作（3-5 步）
4. 完成！

---

### <Icon name="bar-chart-3" color="cyan" /> 我想快速了解三个案例的异同
**你想**: 一张表格对比三个案例

**做这个**:
1. 打开 `diagrams/COMPARISON.md`
2. 滚动找到"三个 SD-WAN 案例对比"表格
3. 看完！大约 2 分钟

---

## <Icon name="target" color="magenta" /> 核心资源地图

```
我想...                          打开这个文件

查看 Mermaid 图表              enhanced-mermaid/case*.md
                              (在 GitHub 自动渲染)

下载高质量图片                svg/case*.svg
                              (用于演讲/打印)

编辑图表内容                  excalidraw/case*.json
                              (上传到 excalidraw.com)

快速了解用途                  README.md
                              (5 分钟概览)

对比三个案例                  COMPARISON.md
                              (表格对比)

集成到原文档                  INTEGRATION.md
                              (逐步指南)

查看完整信息                  MANIFEST.md
                              (项目清单)

快速上手（这个文件）          QUICKSTART.md
                              (你正在读)
```

---

## <Icon name="zap" color="cyan" /> 最常见的 3 个使用场景

### 场景 1: "我要在 GitHub 上看文档"
```
1. 打开 docs/guide/sdwan/cases.md
2. 滚动找到你想看的案例
3. Mermaid 图会自动显示
4. 想要更详细？点击链接进入 diagrams/ 目录
```

### 场景 2: "我要用这个图做演讲"
```
1. 去 diagrams/svg/ 目录
2. 下载你需要的 .svg 文件
3. 在 PowerPoint 中插入或拖入
4. 或右键另存为 PNG 然后插入
```

### 场景 3: "我要修改图表的内容"
```
1. 去 diagrams/excalidraw/ 目录
2. 记下你想编辑的文件名（如 case1-architecture.json）
3. 打开 https://excalidraw.com
4. 导入 → 选择文件 → 打开
5. 编辑完后导出为新的 JSON 或 PNG
```

---

## <Icon name="folder" color="cyan" /> 文件夹结构一览

```
diagrams/
├── [file] README.md          ← 完整的功能说明（30 行）
├── [file] COMPARISON.md      ← 三案例对比表（10 分钟阅读）
├── [file] INTEGRATION.md     ← 集成步骤指南（15 分钟）
├── [file] MANIFEST.md        ← 项目统计信息（参考）
├── [file] QUICKSTART.md      ← 这个文件！（5 分钟）
│
├── [dir] enhanced-mermaid/  ← Mermaid 图表
│   ├── case1-architecture.md
│   ├── case2-security.md
│   └── case3-global.md
│
├── [dir] svg/               ← 高质量 SVG 图
│   ├── case1-topology.svg
│   ├── case2-zerotrust.svg
│   └── case3-global.svg
│
└── [dir] excalidraw/        ← 可编辑 JSON
    ├── case1-architecture.json
    ├── case2-zerotrust.json
    └── case3-global.json
```

---

## <Icon name="graduation-cap" color="magenta" /> 如果你不知道...

### "我应该用哪个格式？"

| 我想... | 用这个 |
|--------|------|
| 在 GitHub 上看 | <Icon name="message-circle" color="cyan" /> **Mermaid** (enhanced-mermaid/) |
| 做演讲或打印 | <Icon name="image" color="cyan" /> **SVG** (svg/) |
| 团队一起编辑 | <Icon name="pencil" color="cyan" /> **Excalidraw** (excalidraw/) |

### "SVG 是什么？"
一种矢量图格式。优点：无论放多大都不会模糊，文件小，可以放在网页上。

### "Excalidraw 是什么？"
一个免费的在线绘图工具。优点：简单易用，支持团队协作，可以导入导出 JSON。

### "JSON 是什么？"
一种文本格式。在这里用来储存 Excalidraw 的图表数据，以便版本控制和协作。

---

## ⏱ 时间估算

| 任务 | 时间 |
|------|------|
| 快速看一个 Mermaid 图 | 1 分钟 |
| 阅读一个案例的完整说明 | 5 分钟 |
| 对比三个案例 | 3 分钟 |
| 下载并在 PowerPoint 中使用 SVG | 2 分钟 |
| 在 Excalidraw 中编辑一个图 | 10 分钟 |
| 完整集成到原文档 | 15 分钟 |

---

## <Icon name="lightbulb" color="cyan" /> 快速提示

<Icon name="sparkles" color="magenta" /> **Pro Tip 1**: GitHub 直接打开 Mermaid
- 不需要任何工具，自动渲染
- 适合快速查看

<Icon name="sparkles" color="magenta" /> **Pro Tip 2**: SVG 右键"在浏览器中打开"
- 在浏览器中可以缩放、拖拽
- 完全不失质量

<Icon name="sparkles" color="magenta" /> **Pro Tip 3**: Excalidraw 支持实时协作
- 邀请他人访问共享链接
- 可以一起编辑和注释

<Icon name="sparkles" color="magenta" /> **Pro Tip 4**: 所有文件都在 Git 中
- 可以看到历史记录
- 可以 diff 看到变化

---

## <Icon name="life-buoy" color="danger" /> 遇到问题？

| 问题 | 解决方案 |
|------|--------|
| SVG 在我的编辑器中打不开 | 用浏览器打开，或用 Illustrator/Inkscape |
| JSON 文件无法导入到 Excalidraw | 检查文件是否完整，重新下载试试 |
| Mermaid 在我的编辑器中没显示 | 这是正常的，需要支持 Mermaid 的工具（GitHub/网站/文档工具） |
| 我想修改但不知道怎么改 | 参考 INTEGRATION.md 或直接在 Excalidraw 中拖拖改改 |

---

## <Icon name="rocket" color="magenta" /> 接下来...

选一个你感兴趣的：

1. **新手**: 打开 `README.md` 了解全貌（10 分钟）
2. **急性子**: 直接进 `svg/` 下载图表用（2 分钟）
3. **细致型**: 读 `COMPARISON.md` 对比三个案例（10 分钟）
4. **技术型**: 打开 `INTEGRATION.md` 学习怎么集成（20 分钟）
5. **完美主义**: 从 `README.md` 开始，逐个看完所有文件（1 小时）

---

**问题？** 看 `INTEGRATION.md` 的"常见问题"部分

**想要更多细节？** 打开 `MANIFEST.md` 查看完整的项目统计

**准备集成？** 按照 `INTEGRATION.md` 的步骤来

---

**祝你使用愉快！** <Icon name="party-popper" color="magenta" />

*最后更新: 2025-01-15*
