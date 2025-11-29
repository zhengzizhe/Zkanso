# 区块设计系统 - 完整实现规范

> **基于 Tiptap + Yjs 架构，参考飞书文档和 Craft 的最佳实践**

## 📋 文档概述

本文档详细定义了 Kanso 编辑器中**斜杠命令菜单**内所有区块类型的完整设计规范，包括：
- 🎨 **视觉设计**：颜色、字体、阴影、边框
- 📐 **布局规范**：间距、内边距、外边距、对齐
- 🔧 **Tiptap 实现**：Extension 定义、NodeView 渲染
- 🎭 **交互行为**：悬停、选中、拖拽、编辑
- 🤝 **协作兼容**：Yjs 数据结构

---

## 🎯 设计原则

### 1. 间距系统（基于 8px 基准）
参考 Notion 和 Craft 的设计系统，采用 8px 网格：

```
0.5x = 4px   - 紧凑间距（按钮内边距）
1x   = 8px   - 基础间距（小元素间距）
1.5x = 12px  - 中等间距（段落间距）
2x   = 16px  - 标准间距（块与块之间）
3x   = 24px  - 大间距（章节分隔）
4x   = 32px  - 超大间距（页面边距）
6x   = 48px  - 巨大间距（主要区域分隔）
```

### 2. 颜色系统

```css
/* 主色调 */
--primary: #0066FF;           /* 主蓝色 */
--primary-hover: #0052CC;     /* 悬停蓝 */
--primary-light: #E6F2FF;     /* 浅蓝背景 */

/* 中性色 */
--text-primary: #1F2937;      /* 主文本 */
--text-secondary: #6B7280;    /* 次要文本 */
--text-tertiary: #9CA3AF;     /* 辅助文本 */
--border: #E5E7EB;            /* 边框 */
--bg-gray: #F9FAFB;           /* 浅灰背景 */
--bg-hover: #F3F4F6;          /* 悬停背景 */

/* 功能色 */
--success: #10B981;           /* 成功绿 */
--warning: #F59E0B;           /* 警告橙 */
--error: #EF4444;             /* 错误红 */
--info: #3B82F6;              /* 信息蓝 */

/* 语义色（块类型） */
--callout-info: #EFF6FF;
--callout-success: #ECFDF5;
--callout-warning: #FFFBEB;
--callout-error: #FEF2F2;
```

### 3. 字体系统

```css
/* 字体家族 */
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-serif: "Georgia", "Times New Roman", serif;
--font-mono: "SF Mono", "Monaco", "Consolas", monospace;

/* 字号 */
--text-xs: 12px;    /* 辅助文本 */
--text-sm: 14px;    /* 小号文本 */
--text-base: 16px;  /* 正文 */
--text-lg: 18px;    /* 大号正文 */
--text-xl: 20px;    /* 小标题 */
--text-2xl: 24px;   /* 二级标题 */
--text-3xl: 30px;   /* 一级标题 */
--text-4xl: 36px;   /* 页面标题 */

/* 行高 */
--leading-tight: 1.25;   /* 紧凑（标题） */
--leading-normal: 1.5;   /* 正常（正文） */
--leading-relaxed: 1.75; /* 宽松（引用） */
```

### 4. 阴影系统

```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

## 📦 区块类型详细设计

### 1️⃣ 段落（Paragraph）

#### 视觉设计
```
┌─────────────────────────────────────────┐
│ 🖱️ [把手] 这是一个普通段落文本，支持多 │ 
│          行显示和自动换行。             │
└─────────────────────────────────────────┘

外边距: margin-top: 4px, margin-bottom: 4px
内边距: padding: 2px 4px
最小高度: min-height: 24px
行高: line-height: 1.5
字号: font-size: 16px
颜色: color: #1F2937
```

#### 交互状态
- **默认**: 透明背景，无边框
- **悬停**: 显示左侧拖拽手柄，背景变为 `rgba(0,0,0,0.02)`
- **选中**: 边框 `2px solid #0066FF`，背景 `#E6F2FF`
- **空段落**: 显示占位符 "输入文本，或输入 '/' 打开菜单"

#### Tiptap 实现

```typescript
// 扩展定义
export const ParagraphBlock = Node.create({
  name: 'paragraph',
  group: 'block',
  content: 'inline*',
  
  parseHTML() {
    return [{ tag: 'p' }]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, {
      class: 'kanso-paragraph'
    }), 0]
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(ParagraphNodeView)
  }
})

// NodeView 组件
const ParagraphNodeView = ({ node, updateAttributes, editor }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="kanso-block-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 拖拽手柄 */}
      {isHovered && (
        <div className="kanso-drag-handle">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      )}
      
      {/* 内容区 */}
      <NodeViewContent 
        className="kanso-paragraph"
        style={{
          minHeight: '24px',
          padding: '2px 4px',
          lineHeight: 1.5,
          fontSize: '16px'
        }}
      />
    </div>
  );
};
```

#### CSS 样式

```css
.kanso-block-wrapper {
  position: relative;
  margin: 4px 0;
  transition: background-color 150ms ease;
}

.kanso-block-wrapper:hover {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
}

.kanso-drag-handle {
  position: absolute;
  left: -24px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 150ms ease;
  cursor: grab;
}

.kanso-block-wrapper:hover .kanso-drag-handle {
  opacity: 1;
}

.kanso-paragraph {
  outline: none;
}

.kanso-paragraph:empty::before {
  content: attr(data-placeholder);
  color: #9CA3AF;
  pointer-events: none;
}
```

---

### 2️⃣ 标题（Heading 1-3）

#### H1 - 一级标题

```
┌─────────────────────────────────────────┐
│ 🖱️ 📝 这是一级标题                      │
└─────────────────────────────────────────┘

外边距: margin-top: 24px, margin-bottom: 8px
内边距: padding: 4px 8px
字号: font-size: 30px
字重: font-weight: 700
行高: line-height: 1.25
颜色: color: #1F2937
图标大小: 24px (emoji)
```

#### H2 - 二级标题

```
┌─────────────────────────────────────────┐
│ 🖱️ 📖 这是二级标题                      │
└─────────────────────────────────────────┘

外边距: margin-top: 16px, margin-bottom: 6px
内边距: padding: 3px 6px
字号: font-size: 24px
字重: font-weight: 600
行高: line-height: 1.25
颜色: color: #1F2937
图标大小: 20px
```

#### H3 - 三级标题

```
┌─────────────────────────────────────────┐
│ 🖱️ 📌 这是三级标题                      │
└─────────────────────────────────────────┘

外边距: margin-top: 12px, margin-bottom: 4px
内边距: padding: 2px 4px
字号: font-size: 20px
字重: font-weight: 600
行高: line-height: 1.25
颜色: color: #374151
图标大小: 18px
```

#### Tiptap 实现

```typescript
export const HeadingBlock = Heading.extend({
  addNodeView() {
    return ReactNodeViewRenderer(HeadingNodeView)
  }
})

const HeadingNodeView = ({ node, updateAttributes }) => {
  const level = node.attrs.level;
  const [isHovered, setIsHovered] = useState(false);
  
  const styles = {
    1: { fontSize: '30px', fontWeight: 700, marginTop: '24px', marginBottom: '8px', padding: '4px 8px' },
    2: { fontSize: '24px', fontWeight: 600, marginTop: '16px', marginBottom: '6px', padding: '3px 6px' },
    3: { fontSize: '20px', fontWeight: 600, marginTop: '12px', marginBottom: '4px', padding: '2px 4px' }
  };
  
  const icons = {
    1: <Heading1 className="w-6 h-6 text-blue-500" />,
    2: <Heading2 className="w-5 h-5 text-purple-500" />,
    3: <Heading3 className="w-4 h-4 text-green-500" />
  };
  
  return (
    <div 
      className="kanso-block-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="kanso-drag-handle">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      )}
      
      {/* 标题图标 */}
      <div className="kanso-heading-icon">
        {icons[level]}
      </div>
      
      <NodeViewContent 
        as={`h${level}`}
        className={`kanso-heading-${level}`}
        style={styles[level]}
      />
    </div>
  );
};
```

---

### 3️⃣ 无序列表（Bullet List）

```
┌─────────────────────────────────────────┐
│ 🖱️ • 第一项                             │
│    • 第二项                             │
│      • 嵌套项（缩进 24px）              │
│    • 第三项                             │
└─────────────────────────────────────────┘

列表外边距: margin: 8px 0
列表项内边距: padding: 2px 0
列表项间距: gap: 4px
缩进: padding-left: 24px (每层)
圆点大小: 6px
圆点颜色: #6B7280
圆点与文本间距: 8px
```

#### 嵌套层级样式
- **Level 1**: 实心圆 `•` (#6B7280, 6px)
- **Level 2**: 空心圆 `○` (#9CA3AF, 5px)
- **Level 3**: 实心方块 `▪` (#6B7280, 4px)

#### Tiptap 实现

```typescript
export const BulletListBlock = BulletList.extend({
  addNodeView() {
    return ReactNodeViewRenderer(BulletListNodeView)
  }
})

const BulletListNodeView = ({ node }) => {
  return (
    <ul className="kanso-bullet-list" style={{
      margin: '8px 0',
      paddingLeft: '24px',
      listStyleType: 'disc'
    }}>
      <NodeViewContent />
    </ul>
  );
};

const ListItemNodeView = ({ node }) => {
  return (
    <li className="kanso-list-item" style={{
      padding: '2px 0',
      lineHeight: 1.5
    }}>
      <NodeViewContent />
    </li>
  );
};
```

#### CSS 样式

```css
.kanso-bullet-list {
  margin: 8px 0;
  padding-left: 24px;
}

.kanso-bullet-list li::marker {
  color: #6B7280;
  font-size: 6px;
}

/* 嵌套层级 */
.kanso-bullet-list .kanso-bullet-list {
  margin: 4px 0;
}

.kanso-bullet-list .kanso-bullet-list li::marker {
  content: '○';
  color: #9CA3AF;
  font-size: 5px;
}

.kanso-bullet-list .kanso-bullet-list .kanso-bullet-list li::marker {
  content: '▪';
  color: #6B7280;
  font-size: 4px;
}
```

---

### 4️⃣ 有序列表（Ordered List）

```
┌─────────────────────────────────────────┐
│ 🖱️ 1. 第一步                            │
│    2. 第二步                            │
│       2.1 子步骤（自动编号）            │
│    3. 第三步                            │
└─────────────────────────────────────────┘

外边距: margin: 8px 0
内边距: padding-left: 28px (容纳数字)
序号字体: font-weight: 600
序号颜色: #0066FF
序号与文本间距: 12px
```

#### Tiptap 实现

```typescript
export const OrderedListBlock = OrderedList.extend({
  addNodeView() {
    return ReactNodeViewRenderer(OrderedListNodeView)
  }
})

const OrderedListNodeView = ({ node }) => {
  return (
    <ol className="kanso-ordered-list" style={{
      margin: '8px 0',
      paddingLeft: '28px',
      counterReset: 'list-counter'
    }}>
      <NodeViewContent />
    </ol>
  );
};
```

#### CSS 样式

```css
.kanso-ordered-list {
  list-style: none;
  counter-reset: list-counter;
}

.kanso-ordered-list > li {
  counter-increment: list-counter;
  position: relative;
  padding-left: 12px;
}

.kanso-ordered-list > li::before {
  content: counter(list-counter) ".";
  position: absolute;
  left: -28px;
  font-weight: 600;
  color: #0066FF;
  min-width: 20px;
  text-align: right;
}

/* 嵌套编号 */
.kanso-ordered-list .kanso-ordered-list > li::before {
  content: counter(list-counter, lower-alpha) ".";
  color: #6366F1;
}

.kanso-ordered-list .kanso-ordered-list .kanso-ordered-list > li::before {
  content: counter(list-counter, lower-roman) ".";
  color: #8B5CF6;
}
```

---

### 5️⃣ 任务列表（Task List）

```
┌─────────────────────────────────────────┐
│ 🖱️ ☑️ 已完成的任务（带删除线）          │
│    ☐ 未完成的任务                      │
│    ☐ 另一个待办事项                    │
└─────────────────────────────────────────┘

外边距: margin: 8px 0
复选框大小: 18px × 18px
复选框圆角: border-radius: 4px
复选框边框: 2px solid #D1D5DB
勾选颜色: background: #0066FF
文本删除线: text-decoration: line-through (已完成)
文本颜色: #9CA3AF (已完成), #1F2937 (未完成)
复选框与文本间距: 8px
```

#### Tiptap 实现

```typescript
export const TaskListBlock = TaskList.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TaskListNodeView)
  }
})

export const TaskItemBlock = TaskItem.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TaskItemNodeView)
  }
})

const TaskItemNodeView = ({ node, updateAttributes }) => {
  const checked = node.attrs.checked;
  
  return (
    <li className="kanso-task-item" style={{
      display: 'flex',
      alignItems: 'flex-start',
      padding: '4px 0',
      gap: '8px'
    }}>
      {/* 自定义复选框 */}
      <motion.button
        className="kanso-checkbox"
        onClick={() => updateAttributes({ checked: !checked })}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '4px',
          border: checked ? 'none' : '2px solid #D1D5DB',
          backgroundColor: checked ? '#0066FF' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
          cursor: 'pointer'
        }}
      >
        {checked && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 6L5 9L10 3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </motion.button>
      
      {/* 文本内容 */}
      <NodeViewContent 
        className="kanso-task-content"
        style={{
          flex: 1,
          textDecoration: checked ? 'line-through' : 'none',
          color: checked ? '#9CA3AF' : '#1F2937',
          transition: 'all 200ms ease'
        }}
      />
    </li>
  );
};
```

---

### 6️⃣ 引用块（Quote）

```
┌─────────────────────────────────────────┐
│ 🖱️ ┃ 这是一段引用文本，左侧有彩色边框   │
│    ┃ 可以跨多行显示                     │
│    ┃ 支持嵌套引用                       │
└─────────────────────────────────────────┘

外边距: margin: 12px 0
内边距: padding: 12px 16px
左边框: border-left: 4px solid #0066FF
背景色: background: #F9FAFB
圆角: border-radius: 4px
字体样式: font-style: italic
文本颜色: #374151
行高: line-height: 1.75
```

#### Tiptap 实现

```typescript
export const QuoteBlock = Blockquote.extend({
  addNodeView() {
    return ReactNodeViewRenderer(QuoteNodeView)
  }
})

const QuoteNodeView = ({ node }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="kanso-block-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="kanso-drag-handle">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      )}
      
      <blockquote 
        className="kanso-quote"
        style={{
          margin: '12px 0',
          padding: '12px 16px',
          borderLeft: '4px solid #0066FF',
          backgroundColor: '#F9FAFB',
          borderRadius: '4px',
          fontStyle: 'italic',
          color: '#374151',
          lineHeight: 1.75
        }}
      >
        <Quote className="w-5 h-5 text-blue-400 mb-2" />
        <NodeViewContent />
      </blockquote>
    </div>
  );
};
```

---

### 7️⃣ 代码块（Code Block）

```
┌─────────────────────────────────────────┐
│ 🖱️ [JavaScript ▼]              [📋 复制] │
│ ┌─────────────────────────────────────┐ │
│ │ 1 │ function hello() {              │ │
│ │ 2 │   console.log("Hello!");        │ │
│ │ 3 │ }                               │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

外边距: margin: 16px 0
内边距: padding: 16px
背景色: background: #1E293B (深色主题)
圆角: border-radius: 8px
字体: font-family: 'SF Mono', monospace
字号: font-size: 14px
行高: line-height: 1.6
行号宽度: 40px
行号颜色: #64748B
代码颜色: 语法高亮（lowlight）
工具栏高度: 36px
```

#### Tiptap 实现

```typescript
export const CodeBlockBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockNodeView)
  }
})

const CodeBlockNodeView = ({ node, updateAttributes, extension }) => {
  const [copied, setCopied] = useState(false);
  const language = node.attrs.language || 'javascript';
  
  const copyCode = () => {
    navigator.clipboard.writeText(node.textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="kanso-code-block-wrapper">
      {/* 工具栏 */}
      <div className="kanso-code-toolbar" style={{
        height: '36px',
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#334155',
        borderRadius: '8px 8px 0 0'
      }}>
        {/* 语言选择器 */}
        <select
          value={language}
          onChange={(e) => updateAttributes({ language: e.target.value })}
          className="kanso-language-selector"
          style={{
            background: 'transparent',
            color: '#94A3B8',
            border: 'none',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
          <option value="json">JSON</option>
        </select>
        
        {/* 复制按钮 */}
        <motion.button
          onClick={copyCode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #475569',
            background: copied ? '#0066FF' : 'transparent',
            color: copied ? 'white' : '#94A3B8',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            transition: 'all 200ms'
          }}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? '已复制' : '复制'}
        </motion.button>
      </div>
      
      {/* 代码内容 */}
      <pre style={{
        margin: 0,
        padding: '16px',
        background: '#1E293B',
        borderRadius: '0 0 8px 8px',
        overflow: 'auto',
        fontSize: '14px',
        lineHeight: 1.6,
        fontFamily: "'SF Mono', Monaco, Consolas, monospace"
      }}>
        <NodeViewContent as="code" />
      </pre>
    </div>
  );
};
```

#### CSS 样式（语法高亮）

```css
/* 基于 GitHub Dark 主题 */
.kanso-code-block-wrapper {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

.kanso-code-block pre code {
  display: block;
  color: #E2E8F0;
}

/* 语法高亮颜色 */
.hljs-keyword { color: #C792EA; }      /* 关键字 - 紫色 */
.hljs-string { color: #C3E88D; }       /* 字符串 - 绿色 */
.hljs-number { color: #F78C6C; }       /* 数字 - 橙色 */
.hljs-function { color: #82AAFF; }     /* 函数 - 蓝色 */
.hljs-comment { color: #546E7A; }      /* 注释 - 灰色 */
.hljs-variable { color: #89DDFF; }     /* 变量 - 青色 */
.hljs-class { color: #FFCB6B; }        /* 类名 - 黄色 */

/* 行号 */
.kanso-code-block pre {
  counter-reset: line;
}

.kanso-code-block pre code .line::before {
  counter-increment: line;
  content: counter(line);
  display: inline-block;
  width: 40px;
  text-align: right;
  padding-right: 16px;
  color: #64748B;
  user-select: none;
}
```

---

### 8️⃣ 提示块（Callout）

#### 信息提示（Info）

```
┌─────────────────────────────────────────┐
│ 🖱️ ┌───────────────────────────────────┐│
│    │ ℹ️  信息                          ││
│    │    这是一个信息提示块，用于展示    ││
│    │    重要的提示信息。               ││
│    └───────────────────────────────────┘│
└─────────────────────────────────────────┘

外边距: margin: 12px 0
内边距: padding: 16px
背景色: background: #EFF6FF
边框: border: 1px solid #3B82F6
圆角: border-radius: 8px
图标大小: 20px
图标颜色: #3B82F6
标题字重: font-weight: 600
标题颜色: #1E40AF
内容颜色: #1F2937
```

#### 成功提示（Success）

```
背景色: #ECFDF5
边框: #10B981
图标: ✅
标题颜色: #047857
```

#### 警告提示（Warning）

```
背景色: #FFFBEB
边框: #F59E0B
图标: ⚠️
标题颜色: #D97706
```

#### 错误提示（Error）

```
背景色: #FEF2F2
边框: #EF4444
图标: ❌
标题颜色: #DC2626
```

#### Tiptap 实现

```typescript
export const CalloutBlock = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  
  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => ({
          'data-type': attributes.type
        })
      }
    }
  },
  
  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }]
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(CalloutNodeView)
  }
})

const CalloutNodeView = ({ node, updateAttributes }) => {
  const type = node.attrs.type || 'info';
  
  const configs = {
    info: {
      bg: '#EFF6FF',
      border: '#3B82F6',
      icon: <Info className="w-5 h-5" />,
      iconColor: '#3B82F6',
      titleColor: '#1E40AF',
      title: '信息'
    },
    success: {
      bg: '#ECFDF5',
      border: '#10B981',
      icon: <CheckCircle className="w-5 h-5" />,
      iconColor: '#10B981',
      titleColor: '#047857',
      title: '成功'
    },
    warning: {
      bg: '#FFFBEB',
      border: '#F59E0B',
      icon: <AlertTriangle className="w-5 h-5" />,
      iconColor: '#F59E0B',
      titleColor: '#D97706',
      title: '警告'
    },
    error: {
      bg: '#FEF2F2',
      border: '#EF4444',
      icon: <AlertCircle className="w-5 h-5" />,
      iconColor: '#EF4444',
      titleColor: '#DC2626',
      title: '错误'
    }
  };
  
  const config = configs[type];
  
  return (
    <div 
      className="kanso-callout"
      style={{
        margin: '12px 0',
        padding: '16px',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: '8px',
        display: 'flex',
        gap: '12px'
      }}
    >
      {/* 图标 */}
      <div style={{ color: config.iconColor, flexShrink: 0 }}>
        {config.icon}
      </div>
      
      {/* 内容 */}
      <div style={{ flex: 1 }}>
        {/* 标题 */}
        <div style={{
          fontWeight: 600,
          color: config.titleColor,
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {config.title}
          
          {/* 类型选择器 */}
          <select
            value={type}
            onChange={(e) => updateAttributes({ type: e.target.value })}
            style={{
              marginLeft: 'auto',
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: '4px',
              border: `1px solid ${config.border}`
            }}
          >
            <option value="info">信息</option>
            <option value="success">成功</option>
            <option value="warning">警告</option>
            <option value="error">错误</option>
          </select>
        </div>
        
        {/* 内容 */}
        <NodeViewContent />
      </div>
    </div>
  );
};
```

---

### 9️⃣ 图片块（Image）

```
┌─────────────────────────────────────────┐
│ 🖱️ ┌───────────────────────────────────┐│
│    │                                   ││
│    │       [📷 图片预览]               ││
│    │        可拖拽调整大小              ││
│    │                                   ││
│    └───────────────────────────────────┘│
│         图片标题/描述（可选）            │
└─────────────────────────────────────────┘

外边距: margin: 16px 0
图片圆角: border-radius: 8px
图片阴影: box-shadow: 0 4px 6px rgba(0,0,0,0.1)
最大宽度: max-width: 100%
调整手柄: 8个方向（四角 + 四边）
手柄大小: 8px × 8px
手柄颜色: #0066FF
标题边距: margin-top: 8px
标题对齐: text-align: center
标题字号: font-size: 14px
标题颜色: #6B7280
悬停蒙层: rgba(0,0,0,0.5) + 操作按钮
```

#### Tiptap 实现

```typescript
export const ImageBlock = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: null },
      height: { default: null },
      caption: { default: '' }
    }
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  }
})

const ImageNodeView = ({ node, updateAttributes }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: node.attrs.width || 600,
    height: node.attrs.height || 400
  });
  
  const handleResize = (e) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX - e.target.offsetLeft;
    const aspectRatio = dimensions.height / dimensions.width;
    const newHeight = newWidth * aspectRatio;
    
    setDimensions({ width: newWidth, height: newHeight });
    updateAttributes({ width: newWidth, height: newHeight });
  };
  
  return (
    <div 
      className="kanso-image-block"
      style={{
        margin: '16px 0',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 图片容器 */}
      <div 
        className="kanso-image-container"
        style={{
          position: 'relative',
          display: 'inline-block',
          maxWidth: '100%'
        }}
      >
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          style={{
            width: dimensions.width,
            height: dimensions.height,
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'block'
          }}
        />
        
        {/* 悬停蒙层 */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {/* 操作按钮 */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  background: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Download className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  background: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Trash className="w-5 h-5 text-red-500" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 调整大小手柄 */}
        {isHovered && (
          <>
            {/* 右下角手柄 */}
            <div
              className="kanso-resize-handle"
              onMouseDown={() => setIsResizing(true)}
              onMouseUp={() => setIsResizing(false)}
              onMouseMove={handleResize}
              style={{
                position: 'absolute',
                right: -4,
                bottom: -4,
                width: '8px',
                height: '8px',
                background: '#0066FF',
                borderRadius: '50%',
                cursor: 'nwse-resize',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
          </>
        )}
      </div>
      
      {/* 图片标题 */}
      <input
        type="text"
        value={node.attrs.caption || ''}
        onChange={(e) => updateAttributes({ caption: e.target.value })}
        placeholder="添加图片描述..."
        style={{
          display: 'block',
          width: '100%',
          marginTop: '8px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#6B7280',
          border: 'none',
          outline: 'none',
          background: 'transparent'
        }}
      />
    </div>
  );
};
```

---

### 🔟 表格块（Table）

```
┌─────────────────────────────────────────┐
│ 🖱️ ┌────┬────────┬────────┬──────────┐ │
│    │ ⚙️ │ 列1    │ 列2    │ 列3  [+] │ │
│    ├────┼────────┼────────┼──────────┤ │
│    │ ⚙️ │ 单元格 │ 单元格 │ 单元格   │ │
│    ├────┼────────┼────────┼──────────┤ │
│    │ ⚙️ │ 单元格 │ 单元格 │ 单元格   │ │
│    └────┴────────┴────────┴──────────┘ │
│                                [+ 添加行]│
└─────────────────────────────────────────┘

外边距: margin: 16px 0
表格边框: border: 1px solid #E5E7EB
单元格边框: border: 1px solid #E5E7EB
单元格内边距: padding: 8px 12px
表头背景: background: #F9FAFB
表头字重: font-weight: 600
表头颜色: #374151
行悬停: background: #F9FAFB
选中单元格: border: 2px solid #0066FF
列宽最小值: min-width: 100px
操作列宽度: 32px
```

#### Tiptap 实现

```typescript
export const TableBlock = Table.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TableNodeView)
  }
})

const TableNodeView = ({ node, editor }) => {
  const [hoveredRow, setHoveredRow] = useState(-1);
  const [hoveredCol, setHoveredCol] = useState(-1);
  
  const addRow = () => {
    editor.chain().focus().addRowAfter().run();
  };
  
  const addColumn = () => {
    editor.chain().focus().addColumnAfter().run();
  };
  
  return (
    <div 
      className="kanso-table-wrapper"
      style={{
        margin: '16px 0',
        overflow: 'auto',
        border: '1px solid #E5E7EB',
        borderRadius: '8px'
      }}
    >
      <table style={{
        width: '100%',
        borderCollapse: 'collapse'
      }}>
        <NodeViewContent as="tbody" />
      </table>
      
      {/* 添加行按钮 */}
      <motion.button
        onClick={addRow}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%',
          padding: '8px',
          border: 'none',
          borderTop: '1px solid #E5E7EB',
          background: 'transparent',
          color: '#6B7280',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px'
        }}
      >
        <Plus className="w-4 h-4" />
        添加行
      </motion.button>
    </div>
  );
};

const TableCellNodeView = ({ node, updateAttributes }) => {
  return (
    <td style={{
      padding: '8px 12px',
      border: '1px solid #E5E7EB',
      minWidth: '100px'
    }}>
      <NodeViewContent />
    </td>
  );
};

const TableHeaderNodeView = ({ node }) => {
  return (
    <th style={{
      padding: '8px 12px',
      border: '1px solid #E5E7EB',
      background: '#F9FAFB',
      fontWeight: 600,
      color: '#374151',
      textAlign: 'left'
    }}>
      <NodeViewContent />
    </th>
  );
};
```

---

## 🎨 通用交互模式

### 1. 块级拖拽手柄（Block Handle）

```
位置: 块左侧 -24px
大小: 16px × 16px
图标: GripVertical (6个点)
默认状态: opacity: 0
悬停状态: opacity: 1
颜色: #9CA3AF
悬停颜色: #6B7280
光标: cursor: grab
拖拽时光标: cursor: grabbing
```

### 2. 块级选中状态

```
边框: 2px solid #0066FF
背景: rgba(0, 102, 255, 0.05)
圆角: border-radius: 4px
过渡: transition: all 150ms ease
```

### 3. 块级悬停状态

```
背景: rgba(0, 0, 0, 0.02)
圆角: border-radius: 4px
过渡: transition: background-color 150ms ease
```

### 4. 占位符（Placeholder）

```
颜色: color: #9CA3AF
字号: font-size: 与块相同
字体样式: font-style: normal
指针事件: pointer-events: none
```

---

## 📏 响应式设计

### 断点系统

```css
/* 移动端 */
@media (max-width: 640px) {
  --text-base: 15px;
  --notion-indent: 20px;
  .kanso-block-wrapper {
    padding: 0 12px;
  }
}

/* 平板 */
@media (min-width: 641px) and (max-width: 1024px) {
  --text-base: 16px;
  --notion-indent: 24px;
}

/* 桌面端 */
@media (min-width: 1025px) {
  --text-base: 16px;
  --notion-indent: 24px;
  max-width: 900px;
  margin: 0 auto;
}
```

---

## 🎯 Yjs 协作数据结构

### 块级协作

```typescript
// 每个块在 Yjs 中的表示
interface YjsBlockFragment {
  type: string;              // 'paragraph' | 'heading' | 'image' 等
  attrs: Record<string, any>; // 块属性
  content: Y.XmlFragment;     // 内容（递归）
}

// 示例：段落块
{
  type: 'paragraph',
  attrs: {},
  content: Y.XmlFragment([
    Y.XmlText('这是一段文本')
  ])
}

// 示例：图片块
{
  type: 'image',
  attrs: {
    src: 'https://example.com/image.jpg',
    width: 600,
    height: 400,
    caption: '示例图片'
  },
  content: Y.XmlFragment([])
}
```

---

## ✅ 实施优先级

### P0 - 第一阶段（必须完成）
1. ✅ 段落 (Paragraph)
2. ✅ 标题 (Heading 1-3)
3. ✅ 无序列表 (Bullet List)
4. ✅ 有序列表 (Ordered List)
5. ✅ 任务列表 (Task List)
6. ✅ 引用块 (Quote)
7. ✅ 代码块 (Code Block)

### P1 - 第二阶段
8. ⏳ 提示块 (Callout)
9. ⏳ 图片块 (Image)
10. ⏳ 表格块 (Table)
11. ⏳ 分割线 (Divider)
12. ⏳ 折叠块 (Toggle)

### P2 - 第三阶段
13. ⏳ 视频块 (Video)
14. ⏳ 文件块 (File)
15. ⏳ 数学公式 (Math)
16. ⏳ 流程图 (Mermaid)
17. ⏳ 嵌入块 (Embed)

---

## 📚 参考资料

- **Notion Design System**: https://www.notion.com/
- **Craft App**: https://www.craft.do/
- **飞书文档**: https://www.feishu.cn/
- **Tiptap Documentation**: https://tiptap.dev/
- **Yjs Documentation**: https://docs.yjs.dev/

---

## 🎬 下一步

1. **实现 P0 区块组件**：创建所有核心块的 NodeView
2. **集成到斜杠菜单**：连接命令与区块渲染
3. **测试协作功能**：验证 Yjs 同步
4. **优化性能**：虚拟化、懒加载
5. **添加动画**：Framer Motion 增强

---

**文档版本**: v1.0  
**最后更新**: 2025-11-29  
**作者**: Kanso Team
