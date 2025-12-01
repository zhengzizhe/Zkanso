# Zkanso 富文本编辑器 - 完整设计文档

## 📋 文档概述

本文档指导如何集成 Tiptap 的官方扩展，构建一个功能完整、体验优秀的在线文档编辑器，参考飞书/Craft等产品的设计理念。

**目标**: 建立一个模块化、可扩展、高性能的富文本编辑系统

---

## 第一部分：产品分析与设计目标

### 1.1 竞品参考分析

#### 飞书文档特性
- **块级编辑**: 每个段落/列表项可独立操作
- **实时协作**: 多人同时编辑，光标实时同步
- **丰富交互**: 斜杠菜单、快捷键、拖放排序
- **高效排版**: 表格、分栏、多媒体嵌入
- **性能优化**: 虚拟滚动、增量更新

#### Craft设计理念
- **简洁优雅**: 最小化界面干扰
- **势能感**: 块元素显示拖拽手柄
- **视觉层级**: 清晰的缩进和间距
- **键盘优先**: 全快捷键操作流程
- **渐进功能**: 按需显示高级功能

### 1.2 目标架构

```
┌─────────────────────────────────────────┐
│         编辑器容器 (EditorContainer)     │
├─────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │   编辑区域 (TiptapEditor)        │  │
│  │  ┌────────────────────────────┐  │  │
│  │  │  块菜单 (SlashCommand)     │  │  │
│  │  │  浮动工具栏 (Toolbar)      │  │  │
│  │  │  拖放指示线 (Dropcursor)   │  │  │
│  │  │  协同光标 (Collaboration)  │  │  │
│  │  └────────────────────────────┘  │  │
│  └──────────────────────────────────┘  │
├─────────────────────────────────────────┤
│  状态栏 (StatusBar): 字数统计、位置    │
└─────────────────────────────────────────┘
```

---

## 第二部分：扩展集成规划

### 2.1 已集成的扩展 (4个)

#### ✅ StarterKit (预组合包)
- **现状**: 已集成
- **包含**: Document, Paragraph, Text, Heading, Bold, Italic, CodeBlock, Blockquote等
- **无需重复集成**

#### ✅ Underline
- **现状**: 已集成
- **用途**: 文本下划线

#### ✅ Link
- **现状**: 已集成
- **配置**: openOnClick: false

#### ✅ TaskList / TaskItem
- **现状**: 已集成
- **用途**: 任务列表（复选框）

---

### 2.2 待集成的核心扩展 (第一阶段)

#### 📌 **Highlight** (文本高亮)
**参考**: 飞书的标记功能  
**功能**: 为文本添加背景色

```typescript
// 配置
Highlight.configure({
  multicolor: true  // 支持多种颜色
})

// 使用场景
- 标记重点内容（黄色、红色、绿色等）
- 支持颜色选择器
- 编辑菜单中显示颜色面板

// 预期样式
.ProseMirror mark {
  background: linear-gradient(120deg, #ffd700, #ffa500);
  padding: 2px 4px;
  border-radius: 3px;
  transition: background 0.2s;
}

// 快捷键
Ctrl/Cmd + Shift + H (打开颜色选择)
```

**实现步骤**:
1. 安装: `npm install @tiptap/extension-highlight@^2.27.1`
2. 在 `toolbar-test.tsx` 导入配置
3. 创建 `styles/highlight.css` 配置样式
4. 在浮动工具栏中添加颜色选择按钮
5. 添加键盘快捷键支持

---

#### 📌 **Image** (图片插入)
**参考**: 飞书的图片上传和管理  
**功能**: 支持图片上传、调整大小、对齐

```typescript
// 配置
Image.configure({
  inline: false,           // 图片单独占用一行
  HTMLAttributes: {
    class: 'editor-image',
    draggable: true
  }
})

// 使用场景
- 从本地上传图片
- 从URL粘贴图片
- 拖放图片到编辑器
- 调整图片大小
- 设置图片对齐方式（左、中、右）
- 为图片添加标题

// 预期样式
.editor-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s;
  margin: 1em 0;
}

.editor-image:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  cursor: move;
}

// 功能特性
- 上传进度条
- 图片懒加载
- 智能缩放
- 右键菜单（删除、替换）
```

**实现步骤**:
1. 安装: `npm install @tiptap/extension-image@^2.27.1`
2. 创建 `components/ImageUpload.tsx` 处理上传
3. 创建 `styles/image.css` 配置样式
4. 集成到斜杠菜单 (`/图片`)
5. 支持拖放上传
6. 添加图片大小调整功能

---

#### 📌 **TextAlign** (文本对齐)
**参考**: 飞书的对齐功能  
**功能**: 左对齐、居中、右对齐、两端对齐

```typescript
// 配置
TextAlign.configure({
  types: ['heading', 'paragraph']
})

// 使用场景
- 标题居中
- 段落左对齐（默认）
- 右对齐（用于特殊排版）
- 两端对齐

// 预期样式
.text-align-left { text-align: left; }
.text-align-center { text-align: center; }
.text-align-right { text-align: right; }
.text-align-justify { text-align: justify; }

// 快捷键
Ctrl/Cmd + Shift + L (左对齐)
Ctrl/Cmd + Shift + E (居中)
Ctrl/Cmd + Shift + R (右对齐)
Ctrl/Cmd + Shift + J (两端对齐)
```

**实现步骤**:
1. 安装: `npm install @tiptap/extension-text-align@^2.27.1`
2. 在工具栏添加对齐按钮组
3. 配置键盘快捷键
4. 创建 `styles/textalign.css`

---

#### 📌 **CharacterCount** (字数统计)
**参考**: 飞书的字数统计器  
**功能**: 实时显示字符和词数

```typescript
// 配置
CharacterCount.configure({
  limit: null  // 不限制字数，或设置上限如 10000
})

// 使用场景
- 状态栏显示 "字数: 1234"
- 实时更新
- 超限时提示警告
- 用于SEO优化参考

// 实现示例
const stats = editor.storage.characterCount;
console.log(`字符数: ${stats.characters}, 词数: ${stats.words}`);

// 预期展示
┌────────────────────────────────────┐
│ ... | 字数: 1234 | 词数: 245        │
└────────────────────────────────────┘
```

**实现步骤**:
1. 安装: `npm install @tiptap/extension-character-count@^2.27.1`
2. 创建 `components/StatusBar.tsx` 显示统计信息
3. 监听 `editor.storage.characterCount` 变化
4. 添加样式和动画

---

### 2.3 待集成的表格扩展 (第二阶段)

#### 📌 **Table / TableRow / TableHeader / TableCell** (表格)
**参考**: 飞书的表格编辑  
**功能**: 创建、编辑、美化表格

```typescript
// 配置
Table.configure({
  resizable: false,
  handleWidth: 2,
  cellMinWidth: 50,
  lastColumnResizable: true,
  HTMLAttributes: { class: 'editor-table' }
})

TableRow.configure({
  HTMLAttributes: { class: 'editor-table-row' }
})

TableHeader.configure({
  HTMLAttributes: { class: 'editor-table-header' }
})

TableCell.configure({
  HTMLAttributes: { class: 'editor-table-cell' }
})

// 使用场景
- 创建数据表格
- 对标题行特殊样式
- 右键菜单操作（插入行/列、删除等）
- 单元格内支持富文本编辑
- 表格排序、筛选（高级）

// 预期样式
.editor-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}

.editor-table-header {
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  font-weight: 600;
}

.editor-table-cell {
  padding: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.editor-table-cell:hover {
  background: rgba(99, 102, 241, 0.05);
}

// 快捷键
Ctrl/Cmd + Shift + T (插入表格)
Tab (移动到下一个单元格)
Shift + Tab (移动到上一个单元格)
```

**实现步骤**:
1. 安装4个表格扩展
2. 创建 `components/TableMenu.tsx` 处理表格操作
3. 创建 `styles/table.css` 完整样式
4. 集成到斜杠菜单 (`/表格`)
5. 实现右键菜单
6. 添加键盘快捷键

---

### 2.4 待集成的协同编辑扩展 (第三阶段)

#### 📌 **Collaboration / CollaborationCursor** (实时协作)
**参考**: 飞书的多人编辑、Figma的实时协作  
**功能**: 多用户实时编辑，光标同步

```typescript
// 依赖
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// 配置
Collaboration.configure({
  document: ydoc
})

CollaborationCursor.configure({
  provider: provider,
  user: {
    name: 'John Doe',
    color: '#ff0000',
    avatar: 'https://...'
  }
})

// 使用场景
- 多人实时编辑同一文档
- 看到其他用户的光标位置和名字
- 不同颜色的光标区分用户
- 用户头像悬停显示
- 冲突自动解决（Yjs CRDT算法）

// 预期表现
┌──────────────────────────────────┐
│ [👤 张三] [👤 李四] [👤 王五]    │
│                                   │
│ 这是一个[李四在这里编辑]的段落... │
│         └─ 李四的光标             │
└──────────────────────────────────┘

// 样式
.collaboration-cursor {
  position: absolute;
  pointer-events: none;
  border-left: 2px solid;
  margin-left: -1px;
  animation: blink 1s infinite;
}

.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  background: currentColor;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}
```

**实现步骤** (复杂，需分阶段):
1. 安装: `npm install yjs y-websocket @tiptap/extension-collaboration@^2.27.1`
2. 设置 WebSocket 服务器或使用云服务
3. 初始化 Yjs 文档
4. 配置协作光标
5. 处理用户状态管理
6. 实现离线缓存机制
7. 添加用户列表组件

---

### 2.5 待集成的增强扩展 (第四阶段)

#### 📌 **Gapcursor** (间隙光标)
**参考**: Medium、Notion的块之间插入  
**功能**: 在块元素之间显示光标，支持插入元素

```typescript
Gapcursor.configure({
  HTMLAttributes: { class: 'ProseMirror-gapcursor' }
})

// 使用场景
- 在图片下方插入文字
- 在块级元素之间插入新块
- 改进的块选择体验

// 样式
.ProseMirror-gapcursor {
  position: absolute;
  pointer-events: none;
  display: none;
}

.ProseMirror-gapcursor::after {
  content: '';
  display: block;
  height: 0;
  position: absolute;
  left: -2px;
  right: -2px;
  border-top: 1px solid #6366f1;
  animation: gapPulse 0.6s infinite;
}
```

**实现步骤**:
1. 安装: `npm install @tiptap/extension-gapcursor@^2.27.1`
2. 配置并启用
3. 调整样式和动画

---

## 第三部分：交互功能设计

### 3.1 斜杠菜单 (已有，待扩展)

**现状**: 已实现基础命令  
**扩展方案**:

```
/基础
  ├─ 段落
  ├─ 标题 1/2/3

/格式
  ├─ 引用块
  ├─ 代码块
  ├─ 分割线

/列表
  ├─ 无序列表
  ├─ 有序列表
  ├─ 任务列表

/高级
  ├─ 表格
  ├─ 图片
  ├─ [待定: 视频、音频]

/提示
  ├─ Info
  ├─ Warning
  ├─ Success
  ├─ Error
```

**新增命令的斜杠菜单触发**:
- `/高亮` → 打开颜色选择
- `/图片` → 打开上传对话
- `/表格` → 创建N×M表格
- `/对齐` → 选择对齐方式

---

### 3.2 浮动工具栏 (待扩展)

**参考**: 飞书的浮动工具栏  
**现状**: 基础版本已有  
**扩展功能**:

```
┌─────────────────────────────────────┐
│ B  I  U  S  C  |  H1  H2  H3        │
│ 列表  引用  |  🎨(高亮)  🖼️(图片)   │
│ ... (更多)                          │
└─────────────────────────────────────┘

新增按钮:
- 🎨 高亮颜色 (多色选择)
- 🖼️ 插入图片
- ◼️ 文本对齐 (左/中/右/两端)
- ⋯  更多菜单 (溢出)
```

---

### 3.3 键盘快捷键体系

**参考**: Craft的键盘优先设计  
**规划**:

```
文本格式:
  Ctrl/Cmd + B     Bold
  Ctrl/Cmd + I     Italic
  Ctrl/Cmd + U     Underline
  Ctrl/Cmd + Shift + X  Strike
  
列表:
  Ctrl/Cmd + Shift + U  Bullet List
  Ctrl/Cmd + Shift + O  Ordered List
  
对齐:
  Ctrl/Cmd + Shift + L  Left
  Ctrl/Cmd + Shift + E  Center
  Ctrl/Cmd + Shift + R  Right
  Ctrl/Cmd + Shift + J  Justify
  
块操作:
  Ctrl/Cmd + Shift + B  Blockquote
  Ctrl/Cmd + Alt + C    Code Block
  Ctrl/Cmd + Shift + H  Highlight
  Ctrl/Cmd + Alt + T    Table
  
导航:
  /         Slash Menu
  Tab       Indent
  Shift+Tab Outdent
```

---

## 第四部分：样式系统规划

### 4.1 样式文件组织

```
styles/
├─ global.css              (已有，基础样式)
├─ codeblock.css           (已有)
├─ list.css               (已有)
├─ blockquote.css         (已有)
├─ highlight.css          (新增，高亮)
├─ image.css              (新增，图片)
├─ table.css              (新增，表格)
├─ textalign.css          (新增，对齐)
├─ collaboration.css      (新增，协作光标)
├─ toolbar.css            (新增，工具栏)
└─ statusbar.css          (新增，状态栏)
```

### 4.2 设计系统规范

#### 颜色系统
```
主色: #6366f1 (Indigo-500)
辅助色: #3b82f6 (Blue-500)
成功: #10b981 (Green-500)
警告: #f59e0b (Amber-500)
错误: #ef4444 (Red-500)

背景: #ffffff / #1f2937 (Dark)
边框: #e5e7eb / #4b5563 (Dark)
文字: #1f2937 / #e5e7eb (Dark)
```

#### 间距系统
```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 24px

block间距: 8px (margin)
块内padding: 0 (紧凑)
```

#### 圆角系统
```
sm: 4px (按钮、输入框)
md: 6px (卡片)
lg: 8px (大容器)
xl: 12px (图片、表格)
```

---

## 第五部分：实现路线图

### Phase 1: 基础完善 (当前)
✅ **已完成**:
- StarterKit
- Underline, Link
- TaskList/TaskItem
- 斜杠菜单基础
- 浮动工具栏基础

📌 **本阶段重点** (1-2周):
1. [ ] 集成 Highlight (文本高亮)
2. [ ] 集成 Image (图片上传)
3. [ ] 集成 TextAlign (文本对齐)
4. [ ] 集成 CharacterCount (字数统计)
5. [ ] 优化浮动工具栏UI
6. [ ] 创建相应的样式文件

---

### Phase 2: 高级功能 (2-3周)
📌 **重点**:
1. [ ] 集成 Table/TableRow/TableHeader/TableCell
2. [ ] 表格右键菜单
3. [ ] 表格行列操作
4. [ ] 优化表格样式和交互
5. [ ] 键盘快捷键完善

---

### Phase 3: 协同编辑 (3-4周)
📌 **重点**:
1. [ ] 搭建 WebSocket 服务器或选择云方案
2. [ ] 集成 Collaboration
3. [ ] 集成 CollaborationCursor
4. [ ] 用户状态管理
5. [ ] 测试冲突解决和性能

---

### Phase 4: 优化与扩展 (持续)
📌 **内容**:
1. [ ] 集成 Gapcursor
2. [ ] 性能优化 (虚拟滚动、渲染优化)
3. [ ] 无障碍访问 (A11y)
4. [ ] 导入/导出功能 (Markdown, HTML, PDF)
5. [ ] 插件系统支持

---

## 第六部分：技术细节指南

### 6.1 图片扩展实现示例

```typescript
// components/ImageUpload.tsx
import Image from '@tiptap/extension-image';

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: { default: '' },
      title: { default: '' },
      width: { default: null },
      height: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (dom: HTMLElement) => ({
          src: (dom as HTMLImageElement).getAttribute('src'),
          alt: (dom as HTMLImageElement).getAttribute('alt'),
          title: (dom as HTMLImageElement).getAttribute('title'),
          width: (dom as HTMLImageElement).getAttribute('width'),
          height: (dom as HTMLImageElement).getAttribute('height'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', HTMLAttributes];
  },

  addCommands() {
    return {
      setImage: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },

      uploadImage: (file: File) => ({ editor, commands }) => {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/api/upload', { method: 'POST', body: formData })
          .then(res => res.json())
          .then(data => {
            commands.setImage({ src: data.url, alt: file.name });
          });
      },
    };
  },
});
```

### 6.2 表格扩展集成示例

```typescript
// extensions/index.ts
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';

export const tableExtensions = [
  Table.configure({
    resizable: false,
    handleWidth: 2,
    cellMinWidth: 50,
    lastColumnResizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
];

// 在 useEditor 中使用
extensions: [
  StarterKit,
  ...tableExtensions,
]
```

### 6.3 协同编辑设置示例

```typescript
// lib/collaboration.ts
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export function setupCollaboration(docName: string) {
  const ydoc = new Y.Doc();
  
  const provider = new WebsocketProvider(
    'ws://localhost:1234',
    docName,
    ydoc
  );

  const yMap = ydoc.getMap('shared');

  return { ydoc, provider, yMap };
}

// 在 useEditor 中使用
const { ydoc, provider } = setupCollaboration('my-doc');

extensions: [
  Collaboration.configure({ document: ydoc }),
  CollaborationCursor.configure({
    provider,
    user: {
      name: 'User',
      color: generateColor(),
    },
  }),
]
```

---

## 第七部分：验收标准

### 功能验收
- [ ] 所有扩展正常加载，无控制台错误
- [ ] 斜杠菜单覆盖所有扩展功能
- [ ] 键盘快捷键全部可用
- [ ] 工具栏按钮逻辑正确
- [ ] 文本样式、块元素渲染正确

### 性能验收
- [ ] 编辑器初始加载时间 < 1s
- [ ] 输入响应延迟 < 50ms
- [ ] 撤销重做流畅无卡顿
- [ ] 大文档 (10MB) 不崩溃
- [ ] 内存占用稳定

### 样式验收
- [ ] 浅色/深色模式适配
- [ ] 响应式设计 (手机/平板/桌面)
- [ ] 视觉层级清晰
- [ ] 交互反馈明确（hover/focus/active）
- [ ] 动画流畅，不影响性能

### 用户体验
- [ ] 新用户可直观理解操作
- [ ] 高频操作可通过快捷键完成
- [ ] 错误提示清晰
- [ ] 撤销机制可靠
- [ ] 内容自动保存

---

## 第八部分：相关资源

### Tiptap官方文档
- 主站: https://tiptap.dev
- 扩展文档: https://tiptap.dev/api/extensions
- 示例: https://tiptap.dev/examples

### 参考产品
- 飞书文档: https://www.feishu.cn
- Craft: https://craft.do
- Notion: https://notion.so
- Obsidian: https://obsidian.md

### 开源项目参考
- Tiptap官方示例仓库
- ProseMirror示例
- Yjs官方示例

---

## 总结

本文档规划了一条清晰的技术路线，通过分阶段集成Tiptap的官方扩展，最终构建一个功能完整、体验优秀的在线文档编辑器。重点强调了：

1. **模块化**: 每个扩展独立配置和样式
2. **渐进增强**: 分阶段实现，避免过度复杂
3. **用户体验**: 参考行业领先产品设计
4. **性能考量**: 从架构开始重视性能
5. **可维护性**: 清晰的代码组织和文档

通过遵循本方案，可以高效地将Zkanso发展成为一个强大的富文本编辑平台。
