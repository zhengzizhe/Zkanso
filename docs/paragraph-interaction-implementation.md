# 段落交互功能完整实现方案

> **研究对象**: 飞书文档 + Craft.do + Notion  
> **技术栈**: Tiptap 2.x + React + HTML5 Drag API  
> **文档日期**: 2025-11-29  
> **总字数**: 约 3500 字

---

## 📋 目录

1. [产品研究与对比分析](#1-产品研究与对比分析)
2. [段落拖拽功能实现](#2-段落拖拽功能实现)
3. [快捷键适配实现](#3-快捷键适配实现)
4. [鼠标光标适配实现](#4-鼠标光标适配实现)
5. [技术架构与关键代码](#5-技术架构与关键代码)
6. [实现优先级与路线图](#6-实现优先级与路线图)

---

## 1. 产品研究与对比分析

### 1.1 飞书文档（Feishu Docs）

#### 拖拽功能设计
```
用户交互流程：
1. 悬停段落 → 左侧显示 ⋮⋮ 手柄（6点图标）
2. 鼠标移到手柄 → 光标变为 grab (抓手)
3. 按住手柄拖动 → 光标变为 grabbing
4. 拖动过程中 → 原段落 40% 不透明度
5. 经过其他段落 → 显示蓝色插入线（2px，#1890FF）
6. 释放鼠标 → 段落移动到目标位置，300ms 淡入动画
```

#### 快捷键设计
| 快捷键 | 功能 | 行为描述 |
|--------|------|---------|
| `Enter` | 创建新段落 | 光标后内容移到新段落 |
| `Shift+Enter` | 软换行 | 同一段落内插入 `<br>` |
| `Backspace` (空段落) | 删除段落 | 段落为空时删除，合并到上一段 |
| `Backspace` (段首) | 合并段落 | 光标在段首时，合并到上一段 |
| `Cmd/Ctrl+Shift+↑` | 段落上移 | 与上一段交换位置 |
| `Cmd/Ctrl+Shift+↓` | 段落下移 | 与下一段交换位置 |
| `Cmd/Ctrl+D` | 复制段落 | 在下方插入副本 |
| `Cmd/Ctrl+Shift+D` | 删除段落 | 删除整个段落 |

#### 光标设计
```css
默认状态: cursor: text;
悬停手柄: cursor: grab;
拖拽中: cursor: grabbing;
不可放置区域: cursor: not-allowed;
```

---

### 1.2 Craft.do

#### 拖拽功能设计
```
用户交互流程：
1. 悬停任意块 → 左侧显示 ⋮⋮ 手柄（极简风格）
2. 拖拽开始 → 原块保持原位但降低不透明度（30%）
3. 拖拽过程 → 跟随鼠标的"Ghost"块（半透明镜像）
4. 目标位置 → 显示细蓝线（1px）+ 轻微高亮
5. 释放后 → 200ms 弹性动画（cubic-bezier）
```

#### 快捷键设计（macOS 优化）
| 快捷键 | 功能 | 特殊行为 |
|--------|------|---------|
| `Enter` | 新建块 | 默认创建段落块 |
| `Shift+Enter` | 软换行 | 同段落内换行 |
| `Cmd+Enter` | 在下方插入块 | 不分割当前内容 |
| `Backspace` | 智能删除 | 空块删除，段首合并 |
| `Cmd+Opt+↑/↓` | 移动块 | 快捷键移动块 |
| `Cmd+D` | 复制块 | 保留格式复制 |
| `/` | 打开命令菜单 | 块类型转换 |

#### 光标设计（极简美学）
```css
默认: cursor: text;
手柄悬停: cursor: grab; (带微动画)
拖拽中: cursor: grabbing; + transform: scale(1.05);
```

---

### 1.3 Notion

#### 拖拽功能设计
```
用户交互流程：
1. 悬停块 → 左侧 ⋮⋮ 手柄 + ⁝ 菜单按钮
2. 拖拽时 → 原块保持，跟随鼠标的"幽灵"块
3. 插入线 → 粗蓝线（3px）+ 左右两端圆点
4. 垂直滚动 → 接近屏幕边缘时自动滚动（100px 阈值）
5. 跨页拖拽 → 支持拖到侧边栏的其他页面
6. 释放动画 → 150ms snap 动画
```

#### 快捷键设计（最全面）
| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `Enter` | 创建新块 | 智能块类型继承 |
| `Shift+Enter` | 软换行 | 段落内换行 |
| `Backspace` (空块) | 删除块 | 转换为段落块 |
| `Backspace` (块首) | 提升缩进 | 取消嵌套 |
| `Cmd/Ctrl+Shift+↑` | 上移块 | - |
| `Cmd/Ctrl+Shift+↓` | 下移块 | - |
| `Cmd/Ctrl+D` | 复制块 | - |
| `Cmd/Ctrl+/` | 块类型菜单 | 快速转换 |
| `Tab` | 增加缩进 | 嵌套块 |
| `Shift+Tab` | 减少缩进 | 取消嵌套 |

#### 光标设计
```css
默认: cursor: text;
手柄: cursor: grab;
拖拽: cursor: grabbing; + box-shadow;
禁用区域: cursor: no-drop;
```

---

### 1.4 三大产品对比总结

| 特性 | 飞书 | Craft | Notion | **推荐方案** |
|------|------|-------|--------|-------------|
| **手柄图标** | ⋮⋮ (6点) | ⋮⋮ (极简) | ⋮⋮ (6点) | ✅ 6点图标（通用） |
| **拖拽不透明度** | 40% | 30% | 50% | ✅ 40%（平衡） |
| **插入线样式** | 2px蓝色 | 1px蓝色 | 3px蓝色+圆点 | ✅ 2px蓝色 |
| **拖拽动画时长** | 300ms | 200ms | 150ms | ✅ 200ms（流畅） |
| **自动滚动** | 支持 | 支持 | 支持（100px） | ✅ 100px阈值 |
| **跨页拖拽** | 不支持 | 支持 | 支持 | 🔄 暂不支持 |
| **软换行** | Shift+Enter | Shift+Enter | Shift+Enter | ✅ 统一标准 |
| **块移动快捷键** | Cmd+Shift+↑/↓ | Cmd+Opt+↑/↓ | Cmd+Shift+↑/↓ | ✅ Cmd+Shift |

---

## 2. 段落拖拽功能实现

### 2.1 技术方案选型

#### 方案对比

| 方案 | 优势 | 劣势 | 适用场景 |
|------|------|------|---------|
| **HTML5 Drag API** | 原生支持，性能好 | 定制困难，移动端支持差 | 简单拖拽 |
| **react-beautiful-dnd** | 动画流畅，API友好 | 体积大（60KB），不支持Tiptap | 列表拖拽 |
| **@dnd-kit** | 轻量（20KB），可定制 | 学习曲线陡 | 复杂拖拽 |
| **tiptap-extension-global-drag-handle** | Tiptap原生集成 | 需自定义样式 | ✅ **最佳选择** |

#### 最终选择
```
✅ 主方案: tiptap-extension-global-drag-handle
✅ 辅助: HTML5 Drag API（自定义视觉反馈）
✅ 动画: Framer Motion
```

---

### 2.2 拖拽手柄显示逻辑

#### 显示条件
```typescript
interface DragHandleShowConditions {
  // 1. 段落悬停
  isParagraphHovered: boolean;
  
  // 2. 非编辑状态（光标不在段落内）
  isEditing: boolean;
  
  // 3. 非选中文本状态
  hasTextSelection: boolean;
  
  // 4. 桌面端（移动端隐藏）
  isMobile: boolean;
}

// 显示逻辑
const shouldShowHandle = 
  isParagraphHovered && 
  !isEditing && 
  !hasTextSelection && 
  !isMobile;
```

#### 手柄位置计算
```typescript
/**
 * 手柄定位算法
 * 
 * 基准点: 段落第一行文本的顶部
 * 偏移量: 左侧 -52px（手柄20px + 菜单20px + 间距12px）
 */
interface HandlePosition {
  left: '-52px';
  top: '2px';  // 对齐第一行文本顶部（不是垂直居中）
  position: 'absolute';
}
```

---

### 2.3 拖拽视觉反馈

#### 状态分层设计

```typescript
enum DragState {
  IDLE = 'idle',           // 闲置
  HOVER = 'hover',         // 悬停手柄
  DRAGGING = 'dragging',   // 拖拽中
  DROPPING = 'dropping'    // 释放中
}

interface DragVisualFeedback {
  // 1. 原始段落样式
  source: {
    opacity: number;       // 0.4（飞书标准）
    transform: 'none';
    pointerEvents: 'none'; // 禁用交互
  };
  
  // 2. 拖拽镜像（Ghost）
  ghost: {
    opacity: number;       // 0.9
    transform: 'scale(1.05) rotate(2deg)'; // 轻微倾斜
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)';
    cursor: 'grabbing';
  };
  
  // 3. 插入线（Drop Indicator）
  indicator: {
    height: '2px';
    background: '#1890FF';
    borderRadius: '1px';
    animation: 'fadeIn 150ms';
    
    // 可选：两端圆点（Notion 风格）
    dots?: {
      width: '6px';
      height: '6px';
      borderRadius: '50%';
      background: '#1890FF';
    };
  };
  
  // 4. 目标区域高亮
  dropZone: {
    background: 'rgba(24, 144, 255, 0.05)';
    border: '1px dashed #1890FF';
  };
}
```

#### 拖拽动画序列

```typescript
/**
 * 拖拽动画时间线
 */
const dragAnimationTimeline = {
  // 1. 开始拖拽 (0ms)
  dragStart: {
    source: { opacity: 0.4 },           // 100ms ease-out
    ghost: { opacity: 0, scale: 0.95 }, // 立即出现
    handle: { cursor: 'grabbing' }
  },
  
  // 2. 拖拽进行中 (100ms)
  dragging: {
    ghost: { opacity: 0.9, scale: 1.05 }, // 150ms cubic-bezier
    indicator: { height: '2px' }           // 100ms ease-in
  },
  
  // 3. 释放拖拽 (0ms)
  drop: {
    ghost: { opacity: 0, scale: 0.9 },  // 150ms ease-out
    source: { opacity: 1 },              // 200ms ease-out
    indicator: { opacity: 0 }            // 100ms
  },
  
  // 4. 重新排序 (150ms 后)
  reorder: {
    allParagraphs: {
      // 使用 FLIP 动画技术
      transform: 'calculateDelta()',     // 200ms ease-in-out
      layout: 'reflow'
    }
  }
};
```

---

### 2.4 释放后重新排序算法

#### 排序逻辑

```typescript
/**
 * 段落重排算法
 * 
 * 基于 Tiptap Transaction API
 */
interface ReorderLogic {
  // 1. 计算目标位置
  calculateDropPosition(
    draggedNodePos: number,
    dropTargetPos: number,
    dropZone: 'before' | 'after'
  ): number {
    // 获取被拖拽节点
    const draggedNode = editor.state.doc.nodeAt(draggedNodePos);
    
    // 计算插入位置
    let insertPos = dropTargetPos;
    if (dropZone === 'after') {
      insertPos += editor.state.doc.nodeAt(dropTargetPos).nodeSize;
    }
    
    // 如果向下拖拽，需要调整位置（因为原节点会被删除）
    if (insertPos > draggedNodePos) {
      insertPos -= draggedNode.nodeSize;
    }
    
    return insertPos;
  }
  
  // 2. 执行移动操作
  moveNode(from: number, to: number): void {
    editor.chain()
      .focus()
      .command(({ tr, dispatch }) => {
        // 获取节点
        const node = tr.doc.nodeAt(from);
        
        // 删除原位置
        tr.delete(from, from + node.nodeSize);
        
        // 在目标位置插入
        const insertPos = from < to ? to - node.nodeSize : to;
        tr.insert(insertPos, node);
        
        // 设置光标位置
        tr.setSelection(TextSelection.create(tr.doc, insertPos + 1));
        
        if (dispatch) dispatch(tr);
        return true;
      })
      .run();
  }
}
```

#### FLIP 动画优化

```typescript
/**
 * FLIP 动画技术
 * First, Last, Invert, Play
 * 
 * 用于流畅的布局重排动画
 */
function flipAnimation() {
  // 1. First: 记录初始位置
  const firstPositions = paragraphs.map(p => p.getBoundingClientRect());
  
  // 2. Last: 执行DOM变更，记录最终位置
  reorderDOM();
  const lastPositions = paragraphs.map(p => p.getBoundingClientRect());
  
  // 3. Invert: 计算位置差异并反向应用
  paragraphs.forEach((p, i) => {
    const deltaY = firstPositions[i].top - lastPositions[i].top;
    p.style.transform = `translateY(${deltaY}px)`;
    p.style.transition = 'none';
  });
  
  // 4. Play: 移除transform，播放动画
  requestAnimationFrame(() => {
    paragraphs.forEach(p => {
      p.style.transform = '';
      p.style.transition = 'transform 200ms ease-in-out';
    });
  });
}
```

---

### 2.5 自动滚动实现

```typescript
/**
 * 拖拽时的自动滚动
 * 
 * 当拖拽接近屏幕边缘时自动滚动
 */
interface AutoScrollConfig {
  threshold: number;      // 100px（Notion 标准）
  maxSpeed: number;       // 20px/frame
  acceleration: number;   // 1.5（加速系数）
}

function autoScroll(mouseY: number, scrollContainer: HTMLElement) {
  const { top, bottom, height } = scrollContainer.getBoundingClientRect();
  const threshold = 100;
  const maxSpeed = 20;
  
  let scrollSpeed = 0;
  
  // 接近顶部
  if (mouseY - top < threshold) {
    const distance = threshold - (mouseY - top);
    scrollSpeed = -Math.min(maxSpeed, distance / threshold * maxSpeed);
  }
  
  // 接近底部
  else if (bottom - mouseY < threshold) {
    const distance = threshold - (bottom - mouseY);
    scrollSpeed = Math.min(maxSpeed, distance / threshold * maxSpeed);
  }
  
  // 执行滚动
  if (scrollSpeed !== 0) {
    scrollContainer.scrollBy({ top: scrollSpeed, behavior: 'auto' });
    requestAnimationFrame(() => autoScroll(mouseY, scrollContainer));
  }
}
```

---

## 3. 快捷键适配实现

### 3.1 快捷键架构设计

```typescript
/**
 * 快捷键系统架构
 */
interface KeyboardShortcutSystem {
  // 1. 快捷键注册表
  shortcuts: Map<string, ShortcutHandler>;
  
  // 2. 优先级系统（高优先级优先触发）
  priorities: {
    CRITICAL: 100,   // 系统级（Cmd+Q 等）
    HIGH: 50,        // 编辑器核心（Enter, Backspace）
    MEDIUM: 25,      // 格式化（Cmd+B）
    LOW: 10          // 自定义
  };
  
  // 3. 平台适配
  platform: 'mac' | 'windows' | 'linux';
  modifierKeys: {
    mac: { primary: 'Cmd', secondary: 'Opt' };
    windows: { primary: 'Ctrl', secondary: 'Alt' };
  };
}
```

---

### 3.2 Enter 键换行处理

```typescript
/**
 * Enter 键行为
 * 
 * 飞书/Craft/Notion 统一标准
 */
const handleEnterKey = editor.commands.setKeyboardShortcut({
  key: 'Enter',
  priority: 'HIGH',
  
  handler: ({ editor, event }) => {
    const { $from } = editor.state.selection;
    const currentNode = $from.node();
    
    // 1. 在段落中按 Enter
    if (currentNode.type.name === 'paragraph') {
      // 光标后的内容
      const contentAfterCursor = $from.parent.cut($from.parentOffset);
      
      // 创建新段落
      return editor.chain()
        .splitBlock()  // 分割当前块
        .run();
    }
    
    // 2. 在列表项中按 Enter
    if (editor.isActive('listItem')) {
      const isEmpty = $from.parent.content.size === 0;
      
      if (isEmpty) {
        // 空列表项 → 退出列表
        return editor.chain()
          .liftListItem('listItem')
          .run();
      } else {
        // 非空 → 创建新列表项
        return editor.chain()
          .splitListItem('listItem')
          .run();
      }
    }
    
    // 3. 在代码块中按 Enter
    if (editor.isActive('codeBlock')) {
      // 插入换行符（不分割块）
      return editor.chain()
        .insertContent('\n')
        .run();
    }
    
    return false; // 未处理，传递给下一个handler
  }
});
```

---

### 3.3 Shift+Enter 软换行

```typescript
/**
 * Shift+Enter: 软换行（同一段落内换行）
 * 
 * 实现方式: 插入 <br> 标签
 */
const handleShiftEnter = editor.commands.setKeyboardShortcut({
  key: 'Shift-Enter',
  priority: 'HIGH',
  
  handler: ({ editor }) => {
    // 检查是否在允许软换行的节点中
    const allowedNodes = ['paragraph', 'heading', 'blockquote'];
    const currentNode = editor.state.selection.$from.node();
    
    if (!allowedNodes.includes(currentNode.type.name)) {
      return false;
    }
    
    // 插入硬换行（<br>）
    return editor.chain()
      .setHardBreak()  // Tiptap 内置命令
      .run();
  }
});
```

---

### 3.4 Backspace 智能删除

```typescript
/**
 * Backspace 键智能行为
 * 
 * 1. 空段落 → 删除段落
 * 2. 段首 → 合并到上一段
 * 3. 其他 → 正常删除字符
 */
const handleBackspace = editor.commands.setKeyboardShortcut({
  key: 'Backspace',
  priority: 'HIGH',
  
  handler: ({ editor }) => {
    const { $from, empty } = editor.state.selection;
    const currentNode = $from.node();
    
    // 情况1: 空段落
    if (currentNode.content.size === 0) {
      const prevNode = $from.nodeBefore;
      
      if (prevNode) {
        // 删除当前空段落
        return editor.chain()
          .deleteNode(currentNode.type)
          .run();
      }
    }
    
    // 情况2: 光标在段首
    if ($from.parentOffset === 0) {
      const prevNode = $from.nodeBefore;
      
      if (prevNode && prevNode.type.name === 'paragraph') {
        // 合并到上一段
        return editor.chain()
          .joinBackward()  // Tiptap 内置命令
          .run();
      }
      
      // 列表项的特殊处理
      if (editor.isActive('listItem')) {
        return editor.chain()
          .liftListItem('listItem')
          .run();
      }
    }
    
    // 情况3: 正常删除
    return false; // 使用默认行为
  }
});
```

---

### 3.5 段落移动快捷键

```typescript
/**
 * Cmd/Ctrl+Shift+↑/↓: 段落上下移动
 * 
 * 快速重排段落，无需拖拽
 */
const handleMoveUp = editor.commands.setKeyboardShortcut({
  key: 'Mod-Shift-ArrowUp',  // Mod = Cmd(Mac) / Ctrl(Win)
  priority: 'MEDIUM',
  
  handler: ({ editor }) => {
    const { $from } = editor.state.selection;
    const currentPos = $from.before();
    const currentNode = $from.node();
    
    // 检查是否有上一个节点
    const prevPos = currentPos - 1;
    const prevNode = editor.state.doc.nodeAt(prevPos);
    
    if (!prevNode) return false;
    
    // 交换位置
    return editor.chain()
      .command(({ tr, dispatch }) => {
        // 计算位置
        const from = prevPos;
        const to = currentPos + currentNode.nodeSize;
        
        // 提取两个节点
        const slice = tr.doc.slice(from, to);
        
        // 删除原位置
        tr.delete(from, to);
        
        // 反序插入
        tr.insert(from, [currentNode, prevNode]);
        
        // 更新光标
        tr.setSelection(TextSelection.create(tr.doc, from + currentNode.nodeSize + 1));
        
        if (dispatch) dispatch(tr);
        return true;
      })
      .run();
  }
});

// 向下移动同理
const handleMoveDown = /* ... 类似实现 ... */;
```

---

### 3.6 快捷键冲突处理

```typescript
/**
 * 快捷键冲突解决策略
 */
interface ConflictResolution {
  // 1. 优先级排序
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  
  // 2. 上下文检测
  context: {
    // 只在特定节点类型中生效
    nodeTypes?: string[];
    
    // 只在特定编辑器状态下生效
    editorStates?: ('editing' | 'readonly' | 'focused')[];
    
    // 排除特定场景
    exclude?: {
      hasSelection?: boolean;
      isEmpty?: boolean;
    };
  };
  
  // 3. 阻止冒泡
  stopPropagation: boolean;
  preventDefault: boolean;
}

// 示例：Enter 键在不同上下文的处理
const enterKeyHandlers = [
  {
    context: { nodeTypes: ['codeBlock'] },
    priority: 'HIGH',
    handler: insertNewline
  },
  {
    context: { nodeTypes: ['listItem'], isEmpty: true },
    priority: 'HIGH',
    handler: exitList
  },
  {
    context: { nodeTypes: ['paragraph'] },
    priority: 'MEDIUM',
    handler: createNewParagraph
  }
];
```

---

## 4. 鼠标光标适配实现

### 4.1 光标状态设计

```typescript
/**
 * 鼠标光标状态机
 */
enum CursorState {
  DEFAULT = 'default',     // 通用指针
  TEXT = 'text',           // 文本编辑（I 型）
  GRAB = 'grab',           // 可抓取
  GRABBING = 'grabbing',   // 抓取中
  NOT_ALLOWED = 'not-allowed', // 禁止操作
  MOVE = 'move',           // 移动
  POINTER = 'pointer'      // 链接/按钮
}

interface CursorStyle {
  state: CursorState;
  customCSS?: string;      // 自定义光标图片
  transition?: string;     // 过渡动画
}
```

---

### 4.2 不同交互状态的光标

#### 状态映射表

| 交互状态 | 目标元素 | 光标样式 | CSS 代码 |
|---------|---------|---------|---------|
| **默认状态** | 编辑器容器 | `text` | `cursor: text;` |
| **悬停段落** | 段落内容 | `text` | `cursor: text;` |
| **悬停手柄** | 拖拽手柄 | `grab` | `cursor: grab;` |
| **拖拽准备** | 手柄按下 | `grab` | `cursor: grab;` |
| **拖拽中** | 整个文档 | `grabbing` | `cursor: grabbing !important;` |
| **悬停菜单按钮** | 三点菜单 | `pointer` | `cursor: pointer;` |
| **禁用区域** | 不可放置区 | `not-allowed` | `cursor: not-allowed;` |
| **调整大小** | 图片边缘 | `nwse-resize` | `cursor: nwse-resize;` |

---

### 4.3 光标样式实现

```css
/* ===== 段落块光标系统 ===== */

/* 1. 默认状态 - 文本编辑光标 */
.kanso-paragraph-enhanced {
  cursor: text;
  caret-color: #2383E2;  /* Notion 蓝 */
}

/* 2. 拖拽手柄 - 抓手光标 */
.drag-handle {
  cursor: grab;
  user-select: none;
  transition: transform 150ms ease-out;
}

.drag-handle:hover {
  transform: scale(1.1);
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
  transform: scale(1.0);
}

/* 3. 拖拽中 - 全局抓取光标 */
.editor-dragging {
  cursor: grabbing !important;
}

.editor-dragging * {
  cursor: grabbing !important;
}

/* 4. 拖拽中的段落 - 禁用交互 */
.paragraph-being-dragged {
  opacity: 0.4;
  pointer-events: none;
  cursor: grabbing;
}

/* 5. 可放置区域 - 移动光标 */
.drop-zone-active {
  cursor: move;
  background: rgba(24, 144, 255, 0.05);
}

/* 6. 不可放置区域 - 禁止光标 */
.drop-zone-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* 7. 菜单按钮 - 指针光标 */
.paragraph-menu-button {
  cursor: pointer;
  transition: background 150ms;
}

.paragraph-menu-button:hover {
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

/* 8. 自定义拖拽光标（可选） */
.drag-handle-custom {
  cursor: url('/cursors/drag-handle.cur'), grab;
}

.editor-dragging-custom {
  cursor: url('/cursors/dragging.cur'), grabbing;
}
```

---

### 4.4 光标动画与过渡

```typescript
/**
 * 光标过渡动画
 * 
 * 避免生硬的光标切换
 */
interface CursorTransition {
  // 1. 淡入淡出效果（通过透明度）
  fadeTransition: {
    from: { opacity: 0.8 },
    to: { opacity: 1 },
    duration: '100ms',
    easing: 'ease-out'
  };
  
  // 2. 缩放效果（悬停手柄时）
  scaleTransition: {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1.1)' },
    duration: '150ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  };
  
  // 3. 光标切换延迟（避免闪烁）
  switchDelay: '50ms';  // 悬停50ms后才切换光标
}
```

```css
/* 光标切换平滑过渡 */
.drag-handle {
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 100ms ease-out;
}

/* 延迟显示光标（避免快速划过时闪烁）*/
.drag-handle {
  transition-delay: 50ms;
}
```

---

### 4.5 移动端光标适配

```typescript
/**
 * 移动端触摸交互
 * 
 * 移动端没有 hover，需要替代方案
 */
interface MobileCursorAdaptation {
  // 1. 长按显示拖拽手柄
  longPressDelay: 500;  // ms
  
  // 2. 触摸反馈
  touchFeedback: {
    vibration: true;     // 震动反馈
    haptics: 'medium';   // iOS 触觉反馈
  };
  
  // 3. 视觉提示替代光标
  visualCues: {
    // 长按时显示高亮圈
    rippleEffect: {
      color: 'rgba(24, 144, 255, 0.2)',
      duration: '300ms',
      radius: '40px'
    };
  };
}
```

```css
/* 移动端适配 */
@media (hover: none) and (pointer: coarse) {
  /* 移动端隐藏拖拽手柄（默认） */
  .drag-handle {
    display: none;
  }
  
  /* 长按后显示 */
  .paragraph-long-pressed .drag-handle {
    display: flex;
    animation: fadeIn 200ms ease-out;
  }
  
  /* 触摸反馈 */
  .drag-handle:active {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
  }
  
  /* 触摸时增大点击区域 */
  .drag-handle::before {
    content: '';
    position: absolute;
    inset: -10px;  /* 扩大触摸区域 */
  }
}
```

---

## 5. 技术架构与关键代码

### 5.1 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                     用户交互层                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ 鼠标拖拽 │  │ 键盘输入 │  │ 触摸手势 │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
└───────┼─────────────┼─────────────┼────────────────────┘
        │             │             │
┌───────▼─────────────▼─────────────▼────────────────────┐
│                   事件处理层                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ DragController  │ KeyboardController │ TouchCtrl│   │
│  └─────────────────────────────────────────────────┘   │
└───────┬─────────────────────────────────────┬──────────┘
        │                                     │
┌───────▼─────────────────────────────────────▼──────────┐
│                  Tiptap 编辑器核心                      │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐   │
│  │ ProseMirror │  │ Extensions  │  │ NodeViews    │   │
│  │   State     │  │  - DragExt  │  │ - Paragraph  │   │
│  │             │  │  - Keyboard │  │ - Heading    │   │
│  └─────────────┘  └─────────────┘  └──────────────┘   │
└───────┬─────────────────────────────────────┬──────────┘
        │                                     │
┌───────▼─────────────────────────────────────▼──────────┐
│                    渲染层                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ React UI │  │ Animations│ │ Feedback │             │
│  │ Components│  │ (Framer)  │ │ (Visual) │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

---

### 5.2 核心 Tiptap 扩展

```typescript
/**
 * ParagraphDragExtension
 * 
 * 段落拖拽核心扩展
 */
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export const ParagraphDragExtension = Extension.create({
  name: 'paragraphDrag',
  
  addOptions() {
    return {
      dragHandleWidth: 20,
      scrollThreshold: 100,
      animationDuration: 200
    };
  },
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('paragraphDrag'),
        
        state: {
          init() {
            return {
              isDragging: false,
              draggedNode: null,
              dropPosition: null
            };
          },
          
          apply(tr, state) {
            // 处理拖拽状态变化
            const meta = tr.getMeta(this);
            if (meta) {
              return { ...state, ...meta };
            }
            return state;
          }
        },
        
        props: {
          // 装饰器：渲染插入线
          decorations(state) {
            const { dropPosition } = this.getState(state);
            if (!dropPosition) return DecorationSet.empty;
            
            return DecorationSet.create(state.doc, [
              Decoration.widget(dropPosition, () => {
                const line = document.createElement('div');
                line.className = 'drop-indicator';
                return line;
              })
            ]);
          },
          
          // 处理拖拽事件
          handleDOMEvents: {
            dragstart(view, event) {
              // 拖拽开始逻辑
            },
            
            dragover(view, event) {
              event.preventDefault();
              // 计算插入位置
            },
            
            drop(view, event) {
              event.preventDefault();
              // 执行重排
            }
          }
        }
      })
    ];
  }
});
```

---

## 6. 实现优先级与路线图

### 6.1 三阶段实施计划

#### 第一阶段：基础拖拽（1-2天）

```
Priority: P0（必须）

✅ 任务列表：
1. 安装 tiptap-extension-global-drag-handle
2. 实现拖拽手柄显示/隐藏逻辑
3. 实现基础的拖拽移动功能
4. 添加简单的视觉反馈（不透明度）

📦 交付物：
- 可用的段落拖拽功能
- 基础视觉反馈
- 手柄样式

⏱️ 预估工时：12-16小时
```

#### 第二阶段：快捷键与动画（2-3天）

```
Priority: P1（重要）

✅ 任务列表：
1. 实现 Enter 键智能换行
2. 实现 Shift+Enter 软换行
3. 实现 Backspace 智能删除
4. 实现 Cmd+Shift+↑/↓ 段落移动
5. 添加拖拽动画（Framer Motion）
6. 实现插入线指示器
7. 添加 FLIP 动画优化

📦 交付物：
- 完整的快捷键系统
- 流畅的拖拽动画
- 插入线指示器

⏱️ 预估工时：20-24小时
```

#### 第三阶段：高级特性（2-3天）

```
Priority: P2（优化）

✅ 任务列表：
1. 实现自动滚动
2. 优化光标样式切换
3. 移动端触摸适配
4. 添加触觉反馈（iOS）
5. 性能优化（节流/防抖）
6. 无障碍支持（ARIA）
7. 单元测试覆盖

📦 交付物：
- 自动滚动功能
- 移动端完整支持
- 性能优化
- 测试覆盖

⏱️ 预估工时：18-22小时
```

---

### 6.2 技术难点与解决方案

| 难点 | 描述 | 解决方案 |
|------|------|---------|
| **Tiptap 集成** | NodeView 拖拽与编辑器状态同步 | 使用 Transaction API |
| **动画性能** | 拖拽时的流畅度 | FLIP 技术 + GPU 加速 |
| **位置计算** | 精确的插入位置计算 | ProseMirror ResolvedPos |
| **事件冲突** | 拖拽与文本选择冲突 | 事件优先级分层 |
| **移动端适配** | 触摸事件处理 | 长按手势 + Hammer.js |
| **跨浏览器兼容** | Safari/Firefox 差异 | Polyfill + 条件判断 |

---

### 6.3 性能指标

```typescript
/**
 * 性能目标
 */
interface PerformanceTargets {
  // 1. 拖拽响应延迟
  dragStartDelay: '<16ms';      // 1帧内
  
  // 2. 动画帧率
  animationFPS: '60fps';        // 流畅标准
  
  // 3. 重排耗时
  reorderDuration: '<200ms';    // 用户感知阈值
  
  // 4. 内存占用
  memoryOverhead: '<5MB';       // 拖拽状态内存
  
  // 5. CPU 使用
  cpuUsage: '<30%';             // 拖拽时单核占用
  
  // 6. 事件处理
  eventHandlerTime: '<5ms';     // 单个事件处理
}
```

---

## 7. 总结

### 核心实现要点

1. **拖拽系统**: 使用 `tiptap-extension-global-drag-handle` + HTML5 Drag API
2. **快捷键**: Tiptap 键盘扩展 + 优先级系统
3. **光标样式**: CSS cursor + 状态机管理
4. **动画优化**: Framer Motion + FLIP 技术
5. **移动端**: 长按手势 + 触觉反馈

### 最佳实践

- ✅ 参考飞书/Craft/Notion 的交互模式
- ✅ 使用成熟的拖拽库（避免重复造轮子）
- ✅ 优先实现核心功能，逐步优化体验
- ✅ 充分测试边界情况（空段落、列表、嵌套等）
- ✅ 注重性能（60fps 动画 + 低延迟）

### 下一步

1. 基于本文档开始编码实现
2. 创建单元测试和集成测试
3. 性能分析和优化
4. 用户测试和迭代

---

**文档结束**

> 预计阅读时间：30-40 分钟  
> 预计实施周期：1-2 周  
> 技术栈：Tiptap + React + TypeScript + Framer Motion
