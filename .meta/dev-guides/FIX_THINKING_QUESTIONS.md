# 修复 ThinkingQuestion 组件的构建问题

## 问题
ThinkingQuestion 组件的 `answer` 属性中包含：
- 代码块（```）
- 表格（|）
- 复杂的 Markdown 格式

这些在 Vue 组件的属性中会导致解析错误。

## 解决方案
将 ThinkingQuestion 改为使用 VitePress 的自定义容器（:::tip）

### 修复前：
```vue
<ThinkingQuestion
  question="问题？"
  hint="提示"
  answer="复杂的内容包含代码块..."
/>
```

### 修复后：
```markdown
::: tip 💡 思考题
**问题？**

<details>
<summary>💡 查看提示</summary>

提示内容

</details>

<details>
<summary>✓ 查看答案</summary>

答案内容（可以包含代码块、表格等）

</details>
:::
```

## 需要修复的文件
1. docs/guide/sdwan/concepts.md (3 个)
2. docs/guide/sdwan/architecture.md (2 个)
3. docs/guide/sdwan/routing.md (2 个)

## 执行
批量替换为自定义容器格式。
