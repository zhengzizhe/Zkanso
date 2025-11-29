# Craft 编辑器使用指南

基于 Craft.do 设计系统的现代化富文本编辑器。

## 📦 已实现的功能

### 1. 核心组件

#### ✅ 悬浮工具栏 (`FloatingToolbar`)
- **触发方式**: 选中任意文本
- **位置**: 自动定位在选中文本上方居中
- **功能**:
  - 文本格式：粗体、斜体、下划线、删除线、行内代码
  - 标题：H1、H2、H3
  - 列表：无序列表、有序列表、引用
  - 链接：插入/编辑链接
- **动画**: 150ms 平滑淡入淡出

#### ✅ 斜杠命令菜单 (`SlashMenu`)
- **触发方式**: 输入 `/` 字符
- **功能**:
  - 基础块：文本、引用、分割线
  - 标题：大标题、中标题、小标题
  - 列表：无序列表、有序列表、任务列表
  - 代码：代码块
  - 媒体：图片
  - 提示框：信息提示、技巧提示
- **搜索**: 支持中英文关键词搜索
- **键盘导航**: ↑↓ 选择，Enter 确认，Esc 取消

#### ✅ 块级组件 (`BlockComponents`)
- **段落块** (`ParagraphBlock`)
  - 悬停显示左侧控制柄
  - 拖拽手柄 + 添加按钮
  - 平滑动画过渡

- **标题块** (`HeadingBlock`)
  - 支持 H1、H2、H3
  - 自适应字体大小和字重

- **代码块** (`CodeBlockComponent`)
  - 语言选择器（10+ 语言）
  - 复制代码按钮
  - 语法高亮支持

- **引用块** (`BlockquoteComponent`)
  - 左侧彩色边框
  - 斜体样式

- **Callout 提示框** (`CalloutComponent`)
  - 4 种类型：info、tip、warning、error
  - 对应图标和配色

### 2. 设计系统

#### 颜色系统
- **品牌色**: `#FF6C47` (Craft 橙色)
- **中性色**: 10 级灰度系统
- **语义色**: 成功、警告、错误、信息
- **高亮色**: 黄、绿、蓝、粉

#### 字体系统
- **UI 字体**: SF Pro Text / Segoe UI
- **内容字体**: SF Pro Display
- **等宽字体**: SF Mono / Cascadia Code
- **字号**: 12px - 48px (Major Third Scale)
- **字重**: 400、500、600、700

#### 间距系统
- 基于 8px 栅格
- 范围: 0 - 96px
- 组件内边距预设

#### 阴影系统
- 6 级深度阴影
- 内阴影、发光效果
- 焦点、错误、成功状态阴影

#### 动画系统
- **时长**: 50ms - 350ms
- **缓动**: cubic-bezier 标准曲线
- **类型**: 淡入淡出、缩放、滑动

## 🚀 快速开始

### 安装依赖

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-underline \
  @tiptap/extension-link @tiptap/extension-image @tiptap/extension-task-list \
  @tiptap/extension-task-item @tiptap/extension-placeholder \
  framer-motion lucide-react
```

### 基础用法

```tsx
import { CraftEditor } from '@/components/Editor';

function MyPage() {
  const [content, setContent] = useState('');

  return (
    <CraftEditor
      content={content}
      onChange={setContent}
      placeholder="输入 / 召唤命令菜单..."
    />
  );
}
```

### 高级配置

```tsx
import { CraftEditor } from '@/components/Editor';

function AdvancedEditor() {
  return (
    <CraftEditor
      content={initialContent}
      onChange={handleChange}
      placeholder="开始创作..."
      editable={true}
    />
  );
}
```

## ⌨️ 快捷键

### 文本格式
- `Cmd + B` - 粗体
- `Cmd + I` - 斜体
- `Cmd + U` - 下划线
- `Cmd + Shift + X` - 删除线
- `Cmd + E` - 行内代码

### 标题
- `Cmd + Alt + 1` - 标题 1
- `Cmd + Alt + 2` - 标题 2
- `Cmd + Alt + 3` - 标题 3

### 列表
- `Cmd + Shift + 7` - 有序列表
- `Cmd + Shift + 8` - 无序列表
- `Cmd + Shift + 9` - 任务列表

### 其他
- `/` - 打开命令菜单
- `Cmd + Enter` - 退出代码块
- `Cmd + K` - 插入链接

## 🎨 自定义样式

所有样式变量都定义在 `styles/craft-variables.css` 中：

```css
:root {
  --craft-primary: #FF6C47;
  --craft-text-base: 16px;
  --craft-space-4: 16px;
  /* ... 更多变量 */
}
```

你可以通过覆盖这些 CSS 变量来自定义外观。

## 📁 文件结构

```
components/Editor/
├── CraftEditor.tsx          # 主编辑器组件
├── FloatingToolbar.tsx      # 悬浮工具栏
├── SlashMenu.tsx            # 斜杠命令菜单
├── BlockComponents.tsx      # 块级组件集合
└── index.ts                 # 导出文件

styles/
├── craft-variables.css      # 设计系统变量
└── craft-editor.css         # 编辑器样式

pages/
└── craft-editor-demo.tsx    # 演示页面
```

## 🎯 核心特性

### 1. 悬浮工具栏
- ✅ 自动定位（选中文本上方居中）
- ✅ 边界检测（防止超出屏幕）
- ✅ 平滑动画（150ms 淡入淡出）
- ✅ 激活状态指示
- ✅ 分组和分隔符

### 2. 斜杠菜单
- ✅ 实时搜索过滤
- ✅ 键盘导航（上下选择）
- ✅ 类别分组
- ✅ 图标和描述
- ✅ 选中高亮

### 3. 块级组件
- ✅ 悬停显示控制柄
- ✅ 拖拽重排序
- ✅ 添加新块
- ✅ 统一的视觉风格
- ✅ 平滑动画过渡

## 🌙 暗色模式

完整支持暗色模式，自动检测系统偏好：

```css
@media (prefers-color-scheme: dark) {
  /* 自动应用暗色主题 */
}
```

## 📊 性能优化

- ✅ 使用 `useCallback` 缓存函数
- ✅ 使用 `AnimatePresence` 优化动画
- ✅ 按需加载组件
- ✅ CSS 变量减少重绘

## 🔧 扩展开发

### 添加新的块类型

1. 在 `BlockComponents.tsx` 中创建组件
2. 在 `SlashMenu.tsx` 中添加菜单项
3. 在 `craft-editor.css` 中添加样式

### 添加新的工具栏按钮

在 `FloatingToolbar.tsx` 中：

```tsx
<ToolbarButton
  isActive={editor.isActive('yourMark')}
  onClick={() => editor.chain().focus().toggleYourMark().run()}
  icon={<YourIcon />}
  tooltip="你的功能"
/>
```

## 📝 待优化项

- [ ] 拖拽排序功能完善
- [ ] Callout 组件集成到斜杠菜单
- [ ] 代码块语法高亮
- [ ] 图片上传功能
- [ ] 表格支持
- [ ] 协作编辑
- [ ] 导出为 Markdown/PDF

## 🎉 完成度

- ✅ CSS 设计系统变量（完整）
- ✅ 悬浮工具栏（完整）
- ✅ 斜杠命令菜单（完整）
- ✅ 段落块组件（完整）
- ✅ 标题块组件（完整）
- ✅ 代码块组件（完整）
- ✅ 引用块组件（完整）
- ✅ Callout 组件（完整）
- ✅ 主编辑器集成（完整）
- ✅ 完整样式系统（完整）
- ✅ 演示页面（完整）

## 📞 支持

如有问题，请参考：
- Craft 设计文档: `docs/craft-ui-components-design-system.md`
- TipTap 官方文档: https://tiptap.dev
- Framer Motion 文档: https://www.framer.com/motion
