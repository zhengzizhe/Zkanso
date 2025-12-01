# 🎨 Craft 风格现代化设计系统更新

## 📦 更新内容

### 1. 引入代码高亮库
✅ 已安装 `prismjs` 和 `@types/prismjs`
- 支持多语言语法高亮（JavaScript、Python、JSON、Bash 等）
- 使用 `react-syntax-highlighter` 进行渲染

### 2. 新增核心样式文件

#### `/styles/craft-theme.css` - 设计系统基础
- **设计 Token**：颜色、间距、圆角、阴影、动画等设计变量
- **主题色**：`#409EFF` (Craft 风格蓝色)
- **组件系统**：按钮、输入框、卡片、标签、工具提示等
- **响应式**：完整的移动端适配
- **无障碍**：支持键盘导航和屏幕阅读器

#### `/styles/craft-blocks.css` - 块级元素样式
包含所有内容块的现代化卡片样式：
- 标题 (H1-H6) - 渐变色标题、下划线装饰
- 段落 - 优化行高和间距
- 列表 - 彩色圆点/数字、悬停效果
- 任务列表 - 卡片化、渐变复选框
- 表格 - 悬停高亮、选中状态
- 行内代码 - 粉色渐变背景
- 链接 - 下划线动画效果
- 高亮文本 - 黄色渐变背景
- 分割线 - 渐变色彩
- Callout - 多色提示框
- 图片 - 卡片化、缩放效果
- 折叠块 - 卡片化、动画效果

### 3. 优化现有样式

#### `/styles/enhanced-code-block.css`
- ✅ 使用 Craft 设计 Token
- ✅ 卡片化设计 (`border-radius: 12px`)
- ✅ 阴影效果 (`box-shadow`)
- ✅ 悬停态动画 (上浮效果)
- ✅ 主题色按钮 (#409EFF)
- ✅ 语言选择器优化

#### `/styles/blockquote.css`
- ✅ 主题色左侧边框 (#409EFF)
- ✅ 更大的引号水印 (56px)
- ✅ 卡片化圆角 (8px)
- ✅ 悬停态阴影和位移效果

### 4. 更新测试页面

#### `/pages/toolbar-test.tsx`
- ✅ 引入 `craft-theme.css` 
- ✅ 引入 `craft-blocks.css`

## 🎨 设计规范

### 颜色体系
```css
主题色：#409EFF
成功色：#10b981
警告色：#f59e0b
错误色：#ef4444
```

### 圆角规范
```css
小圆角：6px
基础圆角：8px
中等圆角：10px
大圆角：12px
特大圆角：16px
```

### 阴影规范
```css
小阴影：0 1px 2px rgba(0, 0, 0, 0.04)
基础阴影：0 2px 6px rgba(0, 0, 0, 0.08)
中等阴影：0 4px 12px rgba(0, 0, 0, 0.12)
大阴影：0 8px 24px rgba(0, 0, 0, 0.15)
```

### 间距规范
```css
极小：0.5rem
小：0.75rem
基础：1rem
中等：1.5rem
大：2rem
特大：3rem
```

## 🚀 使用方式

### 1. 在组件中使用设计Token
```tsx
// 使用 CSS 变量
<div className="craft-card">
  <button className="craft-btn craft-btn-primary">
    点击我
  </button>
</div>
```

### 2. 在自定义组件中应用
```css
.my-component {
  background: var(--craft-bg-base);
  border-radius: var(--craft-radius-base);
  box-shadow: var(--craft-shadow-base);
  transition: all var(--craft-transition-base);
}

.my-component:hover {
  box-shadow: var(--craft-shadow-md);
  transform: translateY(-1px);
}
```

### 3. 响应式适配
所有组件自动支持暗色模式：
```html
<html class="dark">
  <!-- 暗色模式自动生效 -->
</html>
```

## 📊 对比 Craft

### 已实现的特性 ✅
- ✅ 卡片化设计
- ✅ 统一圆角规范
- ✅ 阴影系统
- ✅ 主题色系统
- ✅ 悬停态动画
- ✅ 代码块工具栏
- ✅ 语法高亮
- ✅ 任务列表复选框
- ✅ 引用块引号水印
- ✅ 链接下划线动画
- ✅ 表格选中状态
- ✅ 图片卡片化
- ✅ 折叠块动画

### 待优化的特性 ⏳
- ⏳ 表格悬浮工具栏
- ⏳ 图片标题输入
- ⏳ 多级列表样式变化
- ⏳ 更多动画细节

## 🎯 核心亮点

### 1. 全局设计Token
使用 CSS 变量实现的设计系统，便于全局统一和快速调整

### 2. 卡片化一切
所有内容块都采用卡片化设计，具备：
- 圆角 (8-12px)
- 阴影 (多层次)
- 边框 (细边框)
- 悬停效果 (上浮、阴影加深)

### 3. 主题色贯穿
`#409EFF` 作为主题色应用于：
- 按钮背景
- 链接文字
- 列表标记
- 表格选中
- 复选框背景
- 引用块边框
- 高亮效果

### 4. 细腻的交互反馈
- 悬停态：背景变化、阴影加深、轻微上浮
- 聚焦态：外发光效果
- 激活态：缩放效果
- 动画：使用 cubic-bezier 缓动函数

### 5. 完整的暗色模式
所有组件都内置暗色模式适配，自动跟随系统主题

## 📱 响应式设计
- 移动端自动调整间距和字号
- 触摸友好的按钮大小
- 自适应布局

## ♿ 无障碍支持
- 键盘导航支持
- Focus-visible 样式
- ARIA 标签完善
- 减少动画选项 (prefers-reduced-motion)

## 🔧 技术栈
- CSS 变量 (设计Token)
- Flexbox / Grid (布局)
- CSS Transitions (动画)
- Media Queries (响应式)
- Prism.js (语法高亮)

## 📄 文件清单
- ✅ `/styles/craft-theme.css` (346 行)
- ✅ `/styles/craft-blocks.css` (446 行)
- ✅ `/styles/enhanced-code-block.css` (已优化)
- ✅ `/styles/blockquote.css` (已优化)
- ✅ `/pages/toolbar-test.tsx` (已更新)

## 🎉 效果预览
启动项目后访问 `/toolbar-test` 页面即可查看完整效果！

```bash
npm run dev
```

---

**🎨 Craft 风格，现代化设计，精致交互体验！**
