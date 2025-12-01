# Tiptap 官方扩展和依赖完整文档

> 本文档列举 **Tiptap v2.27.1** 官方提供的所有扩展

## 📦 核心依赖

```json
{
  "@tiptap/core": "^2.27.1",
  "@tiptap/react": "^2.27.1",
  "@tiptap/pm": "^2.27.1"
}
```

## 🔌 Tiptap 官方扩展（共 40+ 个）

### 文档结构扩展

#### 1. **Document**
- **包**: `@tiptap/extension-document@^2.27.1`
- **功能**: 定义文档的根节点
- **类型**: 必需的根节点

#### 2. **Paragraph**
- **包**: `@tiptap/extension-paragraph@^2.27.1`
- **功能**: 段落块元素
- **HTML**: `<p>`

#### 3. **Text**
- **包**: `@tiptap/extension-text@^2.27.1`
- **功能**: 基础文本节点
- **说明**: Tiptap 的最小文本单位

### 标题和格式扩展

#### 4. **Heading**
- **包**: `@tiptap/extension-heading@^2.27.1`
- **功能**: 标题元素 (h1-h6)
- **HTML**: `<h1>`, `<h2>`, ..., `<h6>`
- **配置**:
  ```typescript
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6]
  })
  ```

#### 5. **Bold**
- **包**: `@tiptap/extension-bold@^2.27.1`
- **功能**: 加粗文本
- **HTML**: `<strong>`, `<b>`
- **快捷键**: `Ctrl/Cmd + B`

#### 6. **Italic**
- **包**: `@tiptap/extension-italic@^2.27.1`
- **功能**: 斜体文本
- **HTML**: `<em>`, `<i>`
- **快捷键**: `Ctrl/Cmd + I`

#### 7. **Underline**
- **包**: `@tiptap/extension-underline@^2.27.1`
- **功能**: 下划线文本
- **HTML**: `<u>`
- **快捷键**: `Ctrl/Cmd + U`

#### 8. **Strike**
- **包**: `@tiptap/extension-strike@^2.27.1`
- **功能**: 删除线文本
- **HTML**: `<s>`, `<del>`
- **快捷键**: `Ctrl/Cmd + Shift + X`

#### 9. **Code**
- **包**: `@tiptap/extension-code@^2.27.1`
- **功能**: 内联代码
- **HTML**: `<code>`
- **快捷键**: `Ctrl/Cmd + E`

#### 10. **Superscript**
- **包**: `@tiptap/extension-superscript@^2.27.1`
- **功能**: 上标文本
- **HTML**: `<sup>`
- **快捷键**: `Ctrl/Cmd + .`

#### 11. **Subscript**
- **包**: `@tiptap/extension-subscript@^2.27.1`
- **功能**: 下标文本
- **HTML**: `<sub>`
- **快捷键**: `Ctrl/Cmd + ,`

#### 12. **Highlight**
- **包**: `@tiptap/extension-highlight@^2.27.1`
- **功能**: 高亮文本（背景色）
- **HTML**: `<mark>`
- **配置**:
  ```typescript
  Highlight.configure({
    multicolor: true
  })
  ```

### 代码和块扩展

#### 13. **CodeBlock**
- **包**: `@tiptap/extension-code-block@^2.27.1`
- **功能**: 代码块
- **HTML**: `<pre><code>`
- **特性**: 支持语言高亮
- **配置**:
  ```typescript
  CodeBlock.configure({
    languageClassPrefix: 'language-'
  })
  ```

#### 14. **Blockquote**
- **包**: `@tiptap/extension-blockquote@^2.27.1`
- **功能**: 引用块
- **HTML**: `<blockquote>`
- **快捷键**: `Ctrl/Cmd + Shift + B`

#### 15. **HardBreak**
- **包**: `@tiptap/extension-hard-break@^2.27.1`
- **功能**: 硬换行（换行不换段）
- **HTML**: `<br>`
- **快捷键**: `Shift + Enter`

#### 16. **HorizontalRule**
- **包**: `@tiptap/extension-horizontal-rule@^2.27.1`
- **功能**: 水平分割线
- **HTML**: `<hr>`

### 列表扩展

#### 17. **BulletList**
- **包**: `@tiptap/extension-bullet-list@^2.27.1`
- **功能**: 无序列表
- **HTML**: `<ul><li>`
- **快捷键**: `Ctrl/Cmd + Shift + U`

#### 18. **OrderedList**
- **包**: `@tiptap/extension-ordered-list@^2.27.1`
- **功能**: 有序列表
- **HTML**: `<ol><li>`
- **快捷键**: `Ctrl/Cmd + Shift + O`

#### 19. **ListItem**
- **包**: `@tiptap/extension-list-item@^2.27.1`
- **功能**: 列表项
- **HTML**: `<li>`

#### 20. **TaskList**
- **包**: `@tiptap/extension-task-list@^2.27.1`
- **功能**: 任务列表（带复选框）
- **HTML**: `<ul data-type="taskList">`

#### 21. **TaskItem**
- **包**: `@tiptap/extension-task-item@^2.27.1`
- **功能**: 任务列表项
- **HTML**: `<li data-type="taskItem"><input type="checkbox">`
- **配置**:
  ```typescript
  TaskItem.configure({
    nested: true
  })
  ```

### 交互和编辑扩展

#### 22. **Link**
- **包**: `@tiptap/extension-link@^2.27.1`
- **功能**: 超链接
- **HTML**: `<a>`
- **配置**:
  ```typescript
  Link.configure({
    openOnClick: false,
    linkOnPaste: true,
    autolink: true
  })
  ```

#### 23. **Image**
- **包**: `@tiptap/extension-image@^2.27.1`
- **功能**: 图片元素
- **HTML**: `<img>`
- **配置**:
  ```typescript
  Image.configure({
    inline: false,
    HTMLAttributes: { class: 'img-class' }
  })
  ```

#### 24. **TextAlign**
- **包**: `@tiptap/extension-text-align@^2.27.1`
- **功能**: 文本对齐（左、中、右、两端）
- **配置**:
  ```typescript
  TextAlign.configure({
    types: ['heading', 'paragraph']
  })
  ```

#### 25. **Gapcursor**
- **包**: `@tiptap/extension-gapcursor@^2.27.1`
- **功能**: 在 void 节点之间显示光标
- **说明**: 改进选择体验

#### 26. **Dropcursor**
- **包**: `@tiptap/extension-dropcursor@^2.27.1`
- **功能**: 拖放游标指示线
- **配置**:
  ```typescript
  Dropcursor.configure({
    width: 2,
    class: 'ProseMirror-dropcursor',
    color: '#3b82f6'
  })
  ```

#### 27. **Placeholder**
- **包**: `@tiptap/extension-placeholder@^2.27.1`
- **功能**: 占位符文本
- **配置**:
  ```typescript
  Placeholder.configure({
    placeholder: '开始输入...'
  })
  ```

### 历史和撤销扩展

#### 28. **History**
- **包**: `@tiptap/extension-history@^2.27.1`
- **功能**: 撤销/重做
- **快捷键**: `Ctrl/Cmd + Z` / `Ctrl/Cmd + Shift + Z`
- **配置**:
  ```typescript
  History.configure({
    depth: 100,
    newGroupDelay: 500
  })
  ```

### 表格扩展

#### 29. **Table**
- **包**: `@tiptap/extension-table@^2.27.1`
- **功能**: 表格元素
- **HTML**: `<table>`
- **配置**:
  ```typescript
  Table.configure({
    resizable: false
  })
  ```

#### 30. **TableRow**
- **包**: `@tiptap/extension-table-row@^2.27.1`
- **功能**: 表格行
- **HTML**: `<tr>`

#### 31. **TableHeader**
- **包**: `@tiptap/extension-table-header@^2.27.1`
- **功能**: 表格头部单元格
- **HTML**: `<th>`

#### 32. **TableCell**
- **包**: `@tiptap/extension-table-cell@^2.27.1`
- **功能**: 表格普通单元格
- **HTML**: `<td>`

### 协同编辑扩展

#### 33. **Collaboration**
- **包**: `@tiptap/extension-collaboration@^2.27.1`
- **功能**: 多用户实时协作编辑
- **依赖**: `yjs@^13.0.0`
- **说明**: 需要 WebSocket 服务器支持

#### 34. **CollaborationCursor**
- **包**: `@tiptap/extension-collaboration-cursor@^2.27.1`
- **功能**: 显示协作用户的光标
- **依赖**: `yjs@^13.0.0`
- **配置**:
  ```typescript
  CollaborationCursor.configure({
    provider: yjsProvider,
    user: { name: 'John', color: '#ff0000' }
  })
  ```

### 分析和计数扩展

#### 35. **CharacterCount**
- **包**: `@tiptap/extension-character-count@^2.27.1`
- **功能**: 字符计数
- **使用**:
  ```typescript
  const { characters, words } = editor.storage.characterCount;
  ```

### Starter Kit 包含的扩展

**@tiptap/starter-kit@^2.27.1** 是一个预组合包，包含以下扩展：

```
Document
Paragraph
Heading
Bold
Italic
Code
CodeBlock
Blockquote
HardBreak
HorizontalRule
BulletList
OrderedList
ListItem
Strike
Text
History
Drop (内部使用)
Paste (内部使用)
```

## 📦 完整 package.json 依赖

```json
{
  "@tiptap/core": "^2.27.1",
  "@tiptap/extension-blockquote": "^2.27.1",
  "@tiptap/extension-bold": "^2.27.1",
  "@tiptap/extension-bullet-list": "^2.27.1",
  "@tiptap/extension-character-count": "^2.27.1",
  "@tiptap/extension-code": "^2.27.1",
  "@tiptap/extension-code-block": "^2.27.1",
  "@tiptap/extension-collaboration": "^2.27.1",
  "@tiptap/extension-collaboration-cursor": "^2.27.1",
  "@tiptap/extension-document": "^2.27.1",
  "@tiptap/extension-dropcursor": "^2.27.1",
  "@tiptap/extension-gapcursor": "^2.27.1",
  "@tiptap/extension-hard-break": "^2.27.1",
  "@tiptap/extension-heading": "^2.27.1",
  "@tiptap/extension-highlight": "^2.27.1",
  "@tiptap/extension-history": "^2.27.1",
  "@tiptap/extension-horizontal-rule": "^2.27.1",
  "@tiptap/extension-image": "^2.27.1",
  "@tiptap/extension-italic": "^2.27.1",
  "@tiptap/extension-link": "^2.27.1",
  "@tiptap/extension-list-item": "^2.27.1",
  "@tiptap/extension-ordered-list": "^2.27.1",
  "@tiptap/extension-paragraph": "^2.27.1",
  "@tiptap/extension-placeholder": "^2.27.1",
  "@tiptap/extension-strike": "^2.27.1",
  "@tiptap/extension-subscript": "^2.27.1",
  "@tiptap/extension-superscript": "^2.27.1",
  "@tiptap/extension-table": "^2.27.1",
  "@tiptap/extension-table-cell": "^2.27.1",
  "@tiptap/extension-table-header": "^2.27.1",
  "@tiptap/extension-table-row": "^2.27.1",
  "@tiptap/extension-task-item": "^2.27.1",
  "@tiptap/extension-task-list": "^2.27.1",
  "@tiptap/extension-text": "^2.27.1",
  "@tiptap/extension-text-align": "^2.27.1",
  "@tiptap/extension-underline": "^2.27.1",
  "@tiptap/pm": "^2.27.1",
  "@tiptap/react": "^2.27.1",
  "@tiptap/starter-kit": "^2.27.1"
}
```

## 🎯 扩展分类总览

| 分类 | 数量 | 扩展 |
|------|------|-------|
| **文档结构** | 3 | Document, Paragraph, Text |
| **文本格式** | 7 | Bold, Italic, Underline, Strike, Code, Superscript, Subscript |
| **块元素** | 4 | Heading, CodeBlock, Blockquote, HardBreak |
| **列表** | 5 | BulletList, OrderedList, ListItem, TaskList, TaskItem |
| **交互** | 5 | Link, Image, TextAlign, Gapcursor, Dropcursor |
| **功能** | 3 | Placeholder, History, CharacterCount |
| **表格** | 4 | Table, TableRow, TableHeader, TableCell |
| **协同编辑** | 2 | Collaboration, CollaborationCursor |
| **其他** | 1 | Highlight |
| **分割线** | 1 | HorizontalRule |
| **总计** | **35+** | - |

## 💡 使用建议

### 最小配置
```typescript
import StarterKit from '@tiptap/starter-kit';

const editor = useEditor({
  extensions: [StarterKit],
  content: '<p>Hello</p>',
});
```

### 推荐配置
```typescript
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';

const editor = useEditor({
  extensions: [
    StarterKit,
    Underline,
    Link,
    Image,
    TaskList,
    TaskItem,
    Placeholder,
  ],
});
```

### 完整配置（包含表格和协同编辑）
```typescript
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';

const editor = useEditor({
  extensions: [
    StarterKit,
    Table,
    TableRow,
    TableHeader,
    TableCell,
    Collaboration.configure({
      document: ydoc,
    }),
    CollaborationCursor.configure({
      provider: provider,
      user: { name: 'User', color: '#ff0000' },
    }),
  ],
});
```

---

**最后更新**: 2025-11-30  
**Tiptap 版本**: 2.27.1  
**官方文档**: https://tiptap.dev


### 1. **StarterKit** (核心扩展集合)
- **包**: `@tiptap/starter-kit@^2.27.1`
- **功能**: 包含以下扩展的预组合包
  - Document (文档结构)
  - Paragraph (段落)
  - Heading (标题 - 支持 h1, h2, h3)
  - Bold (加粗)
  - Italic (斜体)
  - Code (内联代码)
  - CodeBlock (代码块)
  - Blockquote (引用块)
  - HardBreak (硬换行)
  - HorizontalRule (分割线)
  - BulletList (无序列表)
  - OrderedList (有序列表)
  - ListItem (列表项)
  - Strike (删除线)
  - Text (文本)
  - History (撤销重做)
  - Drop/Paste (拖放粘贴)

### 2. **Underline**
- **包**: `@tiptap/extension-underline@^2.27.1`
- **功能**: 文本下划线格式
- **使用**:
  ```typescript
  import Underline from '@tiptap/extension-underline';
  
  extensions: [Underline]
  ```

### 3. **Link**
- **包**: `@tiptap/extension-link@^2.27.1`
- **功能**: 超链接支持
- **配置**:
  ```typescript
  import Link from '@tiptap/extension-link';
  
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-blue-600 underline cursor-pointer hover:text-blue-700',
    },
  })
  ```

### 4. **Placeholder**
- **包**: `@tiptap/extension-placeholder@^2.27.1`
- **功能**: 编辑器占位符文字
- **配置**:
  ```typescript
  import Placeholder from '@tiptap/extension-placeholder';
  
  Placeholder.configure({
    placeholder: '输入内容...',
  })
  ```

### 5. **TaskList** (任务列表)
- **包**: `@tiptap/extension-task-list@^2.27.1`
- **功能**: 支持可勾选的任务列表
- **使用**:
  ```typescript
  import TaskList from '@tiptap/extension-task-list';
  
  extensions: [TaskList]
  ```

### 6. **TaskItem** (任务项)
- **包**: `@tiptap/extension-task-item@^2.27.1`
- **功能**: 任务列表中的单个任务项
- **配置**:
  ```typescript
  import TaskItem from '@tiptap/extension-task-item';
  
  TaskItem.configure({
    nested: true,  // 支持嵌套任务
  })
  ```

### 7. **Collaboration** (协同编辑)
- **包**: `@tiptap/extension-collaboration@^2.27.1`
- **功能**: 多用户实时协作编辑
- **依赖**: `yjs@^13.0.0`

### 8. **CollaborationCursor** (协同光标)
- **包**: `@tiptap/extension-collaboration-cursor@^2.27.1`
- **功能**: 显示其他用户的光标位置
- **依赖**: `yjs@^13.0.0`

### 9. **Dropcursor** (拖放游标)
- **包**: `@tiptap/extension-dropcursor@^2.27.1`
- **功能**: 拖放块元素时显示插入位置指示线

