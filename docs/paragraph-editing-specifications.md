# 段落编辑完整规范

> **参考标准**: Craft、飞书文档、Notion  
> **更新日期**: 2025-11-29

---

## 📋 目录

1. [段落状态设计](#段落状态设计)
2. [边框与视觉反馈](#边框与视觉反馈)
3. [占位符系统](#占位符系统)
4. [快捷键系统](#快捷键系统)
5. [交互行为](#交互行为)
6. [完整实现代码](#完整实现代码)

---

## 段落状态设计

### 1.1 空段落状态（Empty State）

#### 视觉规范
```
┌─────────────────────────────────────────┐
│ 🖱️ 输入 '/' 打开命令菜单...             │ ← 占位符文本
└─────────────────────────────────────────┘

内边距: padding: 8px 2px
最小高度: min-height: 32px （确保可点击）
占位符颜色: color: #9CA3AF
占位符字号: font-size: 15px （比正文小1px）
占位符样式: font-style: normal, opacity: 0.6
```

#### Craft 的处理方式
- **占位符**: "Type '/' for commands"
- **颜色**: 非常浅的灰色（#B8B8B8）
- **动画**: 占位符在获得焦点时淡出（150ms）
- **特色**: 支持多种占位符模板（可自定义）

#### 飞书的处理方式
- **占位符**: "输入文字" / "按下 '/' 插入块"
- **颜色**: 中等灰色（#8F959E）
- **位置**: 左对齐，与正文对齐
- **特色**: 可以设置段落提示模板

#### Notion 的处理方式
- **占位符**: "Press 'space' for AI, '/' for commands..."
- **颜色**: 浅灰色（#CFCFCF）
- **特色**: AI 集成提示
- **行为**: 焦点时保持显示，输入时消失

---

### 1.2 有内容状态（Filled State）

```
┌─────────────────────────────────────────┐
│ 🖱️ 这是一段已输入的文本内容，支持多行   │
│    显示和自动换行功能。                 │
└─────────────────────────────────────────┘

内边距: padding: 3px 2px
行高: line-height: 1.6
字号: font-size: 16px
颜色: color: #37352F (Notion) / #1F2329 (飞书)
```

---

## 边框与视觉反馈

### 2.1 默认状态（Default）

**Craft 设计**:
```css
border: none;
background: transparent;
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
```

**飞书设计**:
```css
border: 1px solid transparent;
background: transparent;
border-radius: 2px;
```

**Notion 设计**:
```css
border: none;
background: transparent;
box-shadow: none;
```

**共同特点**: 默认状态几乎不可见，极简主义

---

### 2.2 悬停状态（Hover）

**Craft 设计**:
```css
/* 悬停时显示左侧手柄 */
.paragraph:hover .drag-handle {
  opacity: 1;
  transform: translateX(0);
}

/* 段落背景变化 */
.paragraph:hover {
  background: rgba(55, 53, 47, 0.03); /* 非常浅 */
  border-radius: 3px;
  cursor: text;
}
```

**飞书设计**:
```css
.paragraph:hover {
  background: rgba(31, 35, 41, 0.04);
  border-radius: 4px;
}

/* 左侧出现拖拽手柄和菜单 */
.block-handle:hover {
  visibility: visible;
  opacity: 1;
}
```

**Notion 设计**:
```css
.notion-block:hover {
  background: rgba(55, 53, 47, 0.08);
  border-radius: 3px;
}

/* 左侧6点手柄 */
.block-handle {
  position: absolute;
  left: -24px;
  opacity: 0;
  transition: opacity 200ms;
}

.notion-block:hover .block-handle {
  opacity: 1;
}
```

**关键差异**:
- **Craft**: 最浅的背景色，强调简洁
- **飞书**: 中等背景色，手柄 + 菜单按钮
- **Notion**: 较深背景色，标志性6点手柄

---

### 2.3 焦点状态（Focus）

**Craft 设计**:
```css
.paragraph:focus-within {
  background: transparent;  /* 焦点时移除背景 */
  outline: none;
}

/* 使用虚拟边框（伪元素）*/
.paragraph:focus-within::before {
  content: '';
  position: absolute;
  left: -2px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #007AFF;  /* iOS蓝 */
  border-radius: 1px;
  opacity: 0.8;
}
```

**飞书设计**:
```css
.paragraph:focus-within {
  background: rgba(31, 35, 41, 0.02);
  border: 1px solid rgba(31, 136, 229, 0.3);
  border-radius: 4px;
  box-shadow: 0 0 0 2px rgba(31, 136, 229, 0.1);
}

/* 蓝色外发光效果 */
```

**Notion 设计**:
```css
.notion-block:focus-within {
  background: transparent;
  outline: none;
}

/* 左侧蓝色边框 */
.notion-block:focus-within::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: rgb(35, 131, 226);
  border-radius: 1.5px;
}
```

**设计模式对比**:

| 产品 | 边框位置 | 颜色 | 宽度 | 特殊效果 |
|------|---------|------|------|---------|
| Craft | 左侧 | #007AFF | 2px | 无 |
| 飞书 | 四周 | #1F88E5 | 1px | 外发光 |
| Notion | 左侧 | #2383E2 | 3px | 无 |

---

### 2.4 选中状态（Selected）

**Craft 设计**:
```css
.paragraph.selected {
  background: rgba(0, 122, 255, 0.1);
  border-radius: 3px;
}

/* 选中多个段落时 */
.paragraph.multi-selected {
  background: rgba(0, 122, 255, 0.15);
  border-left: 3px solid #007AFF;
}
```

**飞书设计**:
```css
.paragraph.selected {
  background: rgba(31, 136, 229, 0.08);
  border: 1px solid rgba(31, 136, 229, 0.4);
  border-radius: 4px;
}
```

**Notion 设计**:
```css
.notion-block.selected {
  background: rgba(45, 170, 219, 0.3);
  box-shadow: rgb(45, 170, 219) 0px 0px 0px 1px inset;
}
```

---

## 占位符系统

### 3.1 占位符类型

#### 类型 A: 通用提示（Craft）
```typescript
const placeholders = [
  "Start writing...",
  "Type '/' for commands",
  "What's on your mind?",
  "Begin typing to create"
];

// 随机或按上下文选择
```

#### 类型 B: 功能引导（飞书）
```typescript
const placeholders = {
  default: "输入文字",
  withSlash: "按下 '/' 插入块",
  withAI: "输入 '@AI' 唤起助手",
  afterHeading: "接下来写什么？"
};
```

#### 类型 C: AI集成（Notion）
```typescript
const placeholders = {
  default: "Press 'space' for AI, '/' for commands...",
  afterImage: "Add a caption...",
  inTable: "Type or paste content",
  inCode: "Write some code..."
};
```

---

### 3.2 占位符显示逻辑

```typescript
interface PlaceholderConfig {
  show: boolean;
  text: string;
  context?: 'default' | 'after-media' | 'in-list' | 'in-table';
}

function getPlaceholder(editor: Editor, blockType: string): PlaceholderConfig {
  const isEmpty = editor.isEmpty;
  const isFocused = editor.isFocused;
  const previousBlock = editor.getPreviousBlock();
  
  // 规则1: 非空不显示
  if (!isEmpty) {
    return { show: false, text: '' };
  }
  
  // 规则2: 根据上下文选择
  if (previousBlock?.type === 'image') {
    return { 
      show: true, 
      text: 'Add a caption...',
      context: 'after-media'
    };
  }
  
  // 规则3: 焦点状态（Craft 和 Notion 保留，飞书移除）
  const showOnFocus = ['craft', 'notion'].includes(platform);
  if (isFocused && !showOnFocus) {
    return { show: false, text: '' };
  }
  
  // 规则4: 默认占位符
  return {
    show: true,
    text: "输入 '/' 打开命令菜单...",
    context: 'default'
  };
}
```

---

### 3.3 占位符动画

**Craft 动画**:
```css
.placeholder {
  opacity: 0.5;
  transition: opacity 200ms ease-out;
  pointer-events: none;
}

.paragraph:focus .placeholder {
  opacity: 0.3;  /* 焦点时变淡但不消失 */
}

.paragraph.has-content .placeholder {
  opacity: 0;
  transform: scale(0.98);
}
```

**飞书动画**:
```css
.placeholder {
  opacity: 0.4;
  transition: opacity 150ms linear;
}

.paragraph:focus .placeholder {
  opacity: 0;  /* 焦点时立即消失 */
}
```

**Notion 动画**:
```css
.placeholder {
  opacity: 0.375;
  transition: opacity 100ms ease-in;
}

/* 输入时渐隐 */
.paragraph.typing .placeholder {
  opacity: 0;
  transition: opacity 50ms ease-out;
}
```

---

## 快捷键系统

### 4.1 段落导航快捷键

#### Craft 快捷键
```typescript
const craftShortcuts = {
  // 段落导航
  'Cmd/Ctrl + Up': '移动到上一段',
  'Cmd/Ctrl + Down': '移动到下一段',
  'Cmd/Ctrl + Home': '移动到文档开头',
  'Cmd/Ctrl + End': '移动到文档结尾',
  
  // 段落操作
  'Cmd/Ctrl + Enter': '在下方插入段落',
  'Cmd/Ctrl + Shift + Enter': '在上方插入段落',
  'Cmd/Ctrl + Shift + D': '复制当前段落',
  'Cmd/Ctrl + Shift + K': '删除当前段落',
  
  // 缩进
  'Tab': '增加缩进',
  'Shift + Tab': '减少缩进',
  
  // 选择
  'Cmd/Ctrl + A': '全选段落（连续按两次全选文档）',
  'Shift + Up/Down': '扩展选择',
  'Esc': '取消选择/退出编辑'
};
```

#### 飞书快捷键
```typescript
const feishuShortcuts = {
  // 段落导航
  'Ctrl/Cmd + Up': '光标移至段首',
  'Ctrl/Cmd + Down': '光标移至段尾',
  
  // 段落操作
  'Enter': '新建段落',
  'Shift + Enter': '段内换行',
  'Ctrl/Cmd + Enter': '在当前段落后插入新段落',
  'Ctrl/Cmd + D': '复制当前行',
  'Ctrl/Cmd + Shift + K': '删除当前行',
  
  // 格式化
  'Ctrl/Cmd + B': '加粗',
  'Ctrl/Cmd + I': '斜体',
  'Ctrl/Cmd + U': '下划线',
  'Ctrl/Cmd + Shift + X': '删除线',
  
  // 缩进
  'Tab': '增加缩进',
  'Shift + Tab': '减少缩进',
  
  // 选择
  'Ctrl/Cmd + A': '全选',
  'Esc': '取消选择'
};
```

#### Notion 快捷键
```typescript
const notionShortcuts = {
  // 块操作
  'Esc': '选中当前块',
  'Cmd/Ctrl + A': '选中块内所有内容',
  'Esc' + 'Cmd/Ctrl + A': '选中整个页面',
  
  // 块导航
  'Cmd/Ctrl + }': '下一个块',
  'Cmd/Ctrl + {': '上一个块',
  
  // 块编辑
  'Enter': '编辑选中的块',
  'Cmd/Ctrl + D': '复制块',
  'Cmd/Ctrl + Shift + Up/Down': '移动块',
  'Backspace': '删除空块',
  
  // 转换块类型
  'Cmd/Ctrl + Shift + 0': '转为正文',
  'Cmd/Ctrl + Shift + 1-6': '转为标题1-6',
  'Cmd/Ctrl + Shift + 7': '转为列表',
  'Cmd/Ctrl + Shift + 8': '转为无序列表',
  'Cmd/Ctrl + Shift + 9': '转为待办',
  
  // 缩进
  'Tab': '缩进',
  'Shift + Tab': '反缩进',
  
  // 内容编辑
  'Cmd/Ctrl + B': '粗体',
  'Cmd/Ctrl + I': '斜体',
  'Cmd/Ctrl + U': '下划线',
  'Cmd/Ctrl + Shift + S': '删除线',
  'Cmd/Ctrl + K': '创建链接',
  'Cmd/Ctrl + E': '行内代码'
};
```

---

### 4.2 快捷键冲突处理

#### 优先级规则
```typescript
const shortcutPriority = {
  // 1. 浏览器默认快捷键（最高优先级，不可覆盖）
  browser: [
    'Cmd/Ctrl + R',  // 刷新
    'Cmd/Ctrl + W',  // 关闭标签
    'Cmd/Ctrl + T',  // 新标签
    'Cmd/Ctrl + N'   // 新窗口
  ],
  
  // 2. 系统级快捷键（次高，不建议覆盖）
  system: [
    'Cmd/Ctrl + C',  // 复制
    'Cmd/Ctrl + V',  // 粘贴
    'Cmd/Ctrl + X',  // 剪切
    'Cmd/Ctrl + Z',  // 撤销
    'Cmd/Ctrl + Shift + Z'  // 重做
  ],
  
  // 3. 应用级快捷键（可自定义）
  application: [
    'Cmd/Ctrl + /',  // 打开命令菜单
    'Cmd/Ctrl + K',  // 链接
    'Cmd/Ctrl + Shift + K'  // 删除行
  ]
};
```

---

## 交互行为

### 5.1 点击行为

#### 单击（Click）
```
场景: 用户单击空白段落
行为:
1. 光标定位到段落开头
2. 显示焦点边框（左侧蓝条）
3. 占位符渐隐（Craft保留，飞书移除）
4. 触发 focus 事件
```

#### 双击（Double Click）
```
场景: 用户双击段落中的单词
行为:
1. 选中当前单词
2. 显示浮动工具栏
3. 段落进入选中状态
```

#### 三击（Triple Click）
```
场景: 用户三击段落
行为:
1. 选中整个段落
2. 显示浮动工具栏
3. 可拖拽移动段落
```

---

### 5.2 键盘行为

#### Enter 键

**Craft 处理**:
```typescript
function handleEnter(event: KeyboardEvent) {
  const { editor, selection } = event;
  
  // 1. 在段尾按Enter - 创建新段落
  if (selection.isAtEnd) {
    event.preventDefault();
    editor.commands.createParagraphAfter();
    return;
  }
  
  // 2. 在段中按Enter - 分割段落
  if (selection.isInMiddle) {
    event.preventDefault();
    editor.commands.splitParagraph();
    return;
  }
  
  // 3. Shift + Enter - 软换行
  if (event.shiftKey) {
    event.preventDefault();
    editor.commands.insertLineBreak();
    return;
  }
}
```

**飞书处理**:
```typescript
function handleEnter(event: KeyboardEvent) {
  const { editor, block } = event;
  
  // 1. 空段落按Enter - 转为普通段落或退出列表
  if (block.isEmpty) {
    if (block.isInList) {
      editor.commands.exitList();
    } else {
      editor.commands.createNewParagraph();
    }
    return;
  }
  
  // 2. 有内容按Enter - 正常换行
  editor.commands.insertParagraphAfter();
}
```

**Notion 处理**:
```typescript
function handleEnter(event: KeyboardEvent) {
  const { editor, block } = event;
  
  // 1. 空块按Enter - 转为普通段落
  if (block.isEmpty && block.type !== 'paragraph') {
    editor.commands.turnIntoParagraph();
    return;
  }
  
  // 2. 正常情况 - 创建新块
  editor.commands.createBlockAfter(block.type);
}
```

---

#### Backspace 键

**通用处理逻辑**:
```typescript
function handleBackspace(event: KeyboardEvent) {
  const { editor, selection, block } = event;
  
  // 1. 光标在段首 + 段落为空 - 删除段落
  if (selection.isAtStart && block.isEmpty) {
    event.preventDefault();
    editor.commands.deleteBlock();
    return;
  }
  
  // 2. 光标在段首 + 段落有内容 - 合并到上一段
  if (selection.isAtStart && !block.isEmpty) {
    event.preventDefault();
    const previousBlock = editor.getPreviousBlock();
    if (previousBlock) {
      editor.commands.mergeWithPrevious();
    }
    return;
  }
  
  // 3. 正常删除字符
  // 让浏览器默认处理
}
```

---

### 5.3 拖拽行为

#### 拖拽手柄设计

**Craft**:
```
┌─────────────────────────────────────────┐
│ ⋮⋮ 这是段落内容                         │
└─────────────────────────────────────────┘
  ↑
  6个点的手柄，悬停时显示
```

**飞书**:
```
┌─────────────────────────────────────────┐
│ ≡ ⁝ 这是段落内容                        │
└─────────────────────────────────────────┘
  ↑ ↑
  三横线 + 三点菜单
```

**Notion**:
```
┌─────────────────────────────────────────┐
│ ⁝⁝ 这是段落内容                         │
└─────────────────────────────────────────┘
  ↑
  6个点，点击显示菜单
```

#### 拖拽实现

```typescript
interface DragState {
  isDragging: boolean;
  draggedBlock: Block | null;
  dropTarget: Block | null;
  dropPosition: 'before' | 'after' | 'inside';
}

function handleDragStart(event: DragEvent, block: Block) {
  // 1. 设置拖拽数据
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', block.id);
  
  // 2. 添加拖拽样式
  block.element.classList.add('dragging');
  
  // 3. 创建拖拽预览
  const preview = createDragPreview(block);
  event.dataTransfer.setDragImage(preview, 0, 0);
}

function handleDragOver(event: DragEvent, targetBlock: Block) {
  event.preventDefault();
  
  // 计算插入位置
  const rect = targetBlock.element.getBoundingClientRect();
  const mouseY = event.clientY;
  const blockMiddle = rect.top + rect.height / 2;
  
  const dropPosition = mouseY < blockMiddle ? 'before' : 'after';
  
  // 显示插入线
  showDropIndicator(targetBlock, dropPosition);
}

function handleDrop(event: DragEvent, targetBlock: Block) {
  event.preventDefault();
  
  const draggedId = event.dataTransfer.getData('text/plain');
  const draggedBlock = editor.getBlock(draggedId);
  
  if (dropPosition === 'before') {
    editor.commands.moveBefore(draggedBlock, targetBlock);
  } else {
    editor.commands.moveAfter(draggedBlock, targetBlock);
  }
  
  // 清理
  hideDropIndicator();
  draggedBlock.element.classList.remove('dragging');
}
```

---

## 完整实现代码

### 6.1 优化后的段落组件

```typescript
import React, { useState, useRef, useEffect } from 'react';
import { NodeViewProps, NodeViewContent } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, MoreHorizontal } from 'lucide-react';
import { BlockWrapper } from './BlockWrapper';

interface ParagraphState {
  isFocused: boolean;
  isHovered: boolean;
  isEmpty: boolean;
  isSelected: boolean;
  isDragging: boolean;
}

/**
 * 增强版段落块 NodeView
 * 完全遵循 Craft + 飞书 + Notion 的最佳实践
 */
export const EnhancedParagraphNodeView: React.FC<NodeViewProps> = ({ 
  node, 
  editor,
  selected,
  updateAttributes 
}) => {
  const [state, setState] = useState<ParagraphState>({
    isFocused: false,
    isHovered: false,
    isEmpty: node.textContent.length === 0,
    isSelected: selected,
    isDragging: false
  });

  const contentRef = useRef<HTMLParagraphElement>(null);

  // 更新空状态
  useEffect(() => {
    setState(prev => ({ 
      ...prev, 
      isEmpty: node.textContent.length === 0 
    }));
  }, [node.textContent]);

  // 更新选中状态
  useEffect(() => {
    setState(prev => ({ ...prev, isSelected: selected }));
  }, [selected]);

  // 占位符文本（根据上下文）
  const getPlaceholder = (): string => {
    if (!state.isEmpty) return '';
    
    const prevNode = editor.$pos(editor.state.selection.from - 1).node();
    
    // 图片后提示添加描述
    if (prevNode?.type.name === 'image') {
      return 'Add a caption...';
    }
    
    // 列表中的提示
    if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
      return 'List item';
    }
    
    // 默认提示
    return "输入 '/' 打开命令菜单...";
  };

  // 边框样式（根据状态）
  const getBorderStyle = () => {
    if (state.isSelected) {
      return {
        background: 'rgba(31, 136, 229, 0.08)',
        border: '1px solid rgba(31, 136, 229, 0.4)',
        boxShadow: '0 0 0 2px rgba(31, 136, 229, 0.1)'
      };
    }
    
    if (state.isFocused) {
      return {
        background: 'transparent',
        borderLeft: '3px solid #2383E2',
        paddingLeft: '1px'
      };
    }
    
    if (state.isHovered) {
      return {
        background: 'rgba(55, 53, 47, 0.03)',
        borderRadius: '4px'
      };
    }
    
    return {
      background: 'transparent'
    };
  };

  return (
    <BlockWrapper
      showHandle={state.isHovered || state.isSelected}
      onDragStart={() => setState(prev => ({ ...prev, isDragging: true }))}
      style={{
        ...getBorderStyle(),
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: state.isDragging ? 0.4 : 1
      }}
    >
      {/* 段落内容 */}
      <NodeViewContent
        ref={contentRef}
        as="p"
        className="kanso-paragraph-enhanced"
        data-placeholder={state.isEmpty && !state.isFocused ? getPlaceholder() : undefined}
        onFocus={() => setState(prev => ({ ...prev, isFocused: true }))}
        onBlur={() => setState(prev => ({ ...prev, isFocused: false }))}
        onMouseEnter={() => setState(prev => ({ ...prev, isHovered: true }))}
        onMouseLeave={() => setState(prev => ({ ...prev, isHovered: false }))}
        style={{
          minHeight: '32px',
          padding: '3px 2px',
          lineHeight: 1.6,
          fontSize: '16px',
          color: '#1F2937',
          outline: 'none',
          position: 'relative',
          cursor: 'text'
        }}
      />

      {/* 快捷操作菜单（飞书风格）*/}
      <AnimatePresence>
        {state.isHovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="block-menu-button"
            style={{
              position: 'absolute',
              left: '-48px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              background: 'white',
              border: '1px solid #E5E7EB',
              cursor: 'pointer',
              transition: 'all 150ms'
            }}
            onClick={() => {
              // 打开块菜单
              console.log('Open block menu');
            }}
          >
            <MoreHorizontal className="w-3 h-3 text-gray-500" />
          </motion.button>
        )}
      </AnimatePresence>
    </BlockWrapper>
  );
};
```

---

### 6.2 段落样式（CSS）

```css
/* ===== 增强版段落样式 ===== */

.kanso-paragraph-enhanced {
  position: relative;
  caret-color: #2383E2;  /* Notion 蓝 */
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* 占位符 */
.kanso-paragraph-enhanced:empty::before {
  content: attr(data-placeholder);
  position: absolute;
  left: 2px;
  top: 3px;
  color: #9CA3AF;
  font-size: 15px;
  font-weight: 400;
  opacity: 0.6;
  pointer-events: none;
  transition: opacity 150ms ease-out;
}

/* 焦点时占位符渐隐（Craft 风格）*/
.kanso-paragraph-enhanced:focus::before {
  opacity: 0.3;
}

/* 飞书风格：焦点时完全隐藏 */
.kanso-paragraph-enhanced.feishu-style:focus::before {
  opacity: 0;
}

/* 选中文本时的颜色 */
.kanso-paragraph-enhanced::selection {
  background: rgba(45, 170, 219, 0.3);
  color: inherit;
}

/* 拖拽时的样式 */
.kanso-paragraph-enhanced.dragging {
  opacity: 0.4;
  cursor: grabbing !important;
}

/* 插入指示线 */
.drop-indicator {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: #2383E2;
  border-radius: 1px;
  pointer-events: none;
  z-index: 10;
}

.drop-indicator::before {
  content: '';
  position: absolute;
  left: -4px;
  top: -3px;
  width: 8px;
  height: 8px;
  background: #2383E2;
  border-radius: 50%;
}

/* 暗黑模式 */
@media (prefers-color-scheme: dark) {
  .kanso-paragraph-enhanced {
    color: #E2E8F0;
    caret-color: #60A5FA;
  }
  
  .kanso-paragraph-enhanced:empty::before {
    color: #64748B;
  }
  
  .kanso-paragraph-enhanced::selection {
    background: rgba(96, 165, 250, 0.3);
  }
}

/* 响应式 */
@media (max-width: 640px) {
  .kanso-paragraph-enhanced {
    font-size: 15px;
    line-height: 1.7;
  }
  
  .block-menu-button {
    display: none !important;  /* 移动端隐藏菜单 */
  }
}

/* 打印样式 */
@media print {
  .kanso-paragraph-enhanced:empty::before {
    display: none;
  }
  
  .block-menu-button {
    display: none !important;
  }
}
```

---

## 📊 设计对比总结

| 特性 | Craft | 飞书 | Notion |
|------|-------|------|--------|
| **默认边框** | 无 | 透明 1px | 无 |
| **焦点边框** | 左侧 2px 蓝条 | 四周 1px + 外发光 | 左侧 3px 蓝条 |
| **悬停背景** | 超浅灰 | 浅灰 | 中等灰 |
| **占位符焦点行为** | 变淡保留 | 完全隐藏 | 变淡保留 |
| **拖拽手柄** | 6点（简约）| 三横线+菜单 | 6点（功能）|
| **快捷键风格** | Mac风格 | 跨平台 | 块导向 |
| **动画速度** | 200ms | 150ms | 100-200ms |

---

## ✅ 实施建议

### 优先级 P0（立即实施）
1. ✅ 优化占位符系统（上下文感知）
2. ✅ 实现焦点边框（左侧蓝条）
3. ✅ 添加快捷键支持（Enter/Backspace）
4. ✅ 改进悬停交互

### 优先级 P1（本周）
1. 实现拖拽重排
2. 添加块菜单按钮
3. 完善键盘导航
4. 优化动画性能

### 优先级 P2（后续）
1. AI 集成提示
2. 多端同步优化
3. 无障碍支持
4. 性能监控

---

**文档版本**: v1.0  
**最后更新**: 2025-11-29  
**作者**: Kanso Team  
**参考**: Craft.do, 飞书文档, Notion
