# Vue 组件开发检查清单

## 必须检查项（避免编译错误）

### 1. 标签闭合检查
- [ ] `<script setup>` 有对应的 `</script>`
- [ ] `<template>` 有对应的 `</template>`
- [ ] `<style scoped>` 有对应的 `</style>`
- [ ] 所有自定义 HTML 标签正确闭合
- [ ] v-if/v-for 等指令的标签正确闭合

### 2. 语法检查
- [ ] props 定义完整（类型 + required/default）
- [ ] import 语句正确
- [ ] ref/computed/onMounted 等 API 正确导入
- [ ] 变量命名无拼写错误

### 3. 路径检查
- [ ] 相对路径正确（../ 层级）
- [ ] 图片/资源路径可访问
- [ ] import 的模块路径正确

---

## 推荐检查项（提升代码质量）

### 4. 性能优化
- [ ] 大数据列表使用 v-for key
- [ ] 避免不必要的 computed 计算
- [ ] 事件监听正确卸载

### 5. 响应式设计
- [ ] 移动端适配 (@media)
- [ ] 字体大小使用 clamp()
- [ ] 触摸事件支持

### 6. 可访问性
- [ ] 图片有 alt 属性
- [ ] 按钮有 aria-label
- [ ] 键盘导航支持

---

## 常见错误及修复

### 错误 1: Element is missing end tag

**原因**: 标签未闭合

```vue
<!-- ❌ 错误 -->
<script setup>
...
<template>

<!-- ✅ 正确 -->
<script setup>
...
</script>

<template>
```

### 错误 2: Cannot find module

**原因**: import 路径错误

```vue
<!-- ❌ 错误 -->
import { foo } from './bar'  // 文件不存在

<!-- ✅ 正确 -->
import { foo } from '../bar.js'  // 正确相对路径
```

### 错误 3: Unexpected token

**原因**: 语法错误（多余逗号、括号不匹配）

```vue
<!-- ❌ 错误 -->
const props = defineProps({
  title: String,
})  // 多余逗号

<!-- ✅ 正确 -->
const props = defineProps({
  title: String
})
```

---

## 开发流程

1. **复制模板** - 从 `COMPONENT_TEMPLATE.vue` 开始
2. **编写代码** - 按需修改
3. **本地检查** - 运行检查清单
4. **保存文件** - 触发热更新
5. **浏览器验证** - 检查是否正常显示
6. **提交代码** - git commit

---

## 提交前自查

```bash
# 1. 检查语法错误
npm run dev  # 启动开发服务器，观察控制台

# 2. 检查文件结构
grep -n "</script>" component.vue   # 确保有闭合标签
grep -n "</template>" component.vue
grep -n "</style>" component.vue

# 3. 提交
git add component.vue
git commit -m "feat: add new component"
```

---

## 紧急修复步骤

如果出现编译错误：

1. **看错误信息** - 定位到具体行号
2. **检查标签闭合** - 最常见问题
3. **检查 import** - 第二常见问题
4. **重启服务器** - `Ctrl+C` 然后 `npm run dev`
5. **清除缓存** - 删除 `node_modules/.vite` 后重启

---

## 参考资源

- [Vue 3 文档](https://vuejs.org/)
- [VitePress 文档](https://vitepress.dev/)
- [组件模板](./COMPONENT_TEMPLATE.vue)
