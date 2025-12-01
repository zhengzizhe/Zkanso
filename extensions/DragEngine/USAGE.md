# 拖动引擎使用指南

## 一、快速开始

### 1. 安装和初始化

```typescript
import { DragEngine } from './extensions/DragEngine';
import { EditorView } from '@tiptap/pm/view';

// 在编辑器插件中初始化
const dragEngine = new DragEngine(view, {
  enableVisualFeedback: true,
  dropCursorColor: '#6366F1',
  debug: true, // 开启调试模式
});
```

### 2. 集成到 ProseMirror 插件

```typescript
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { DragEngine } from './extensions/DragEngine';

const dragPlugin = new Plugin({
  key: new PluginKey('dragEngine'),
  
  view(editorView) {
    const engine = new DragEngine(editorView, {
      enableVisualFeedback: true,
      debug: false,
    });
    
    let draggedNode: NodeInfo | null = null;

    // 拖动开始
    editorView.dom.addEventListener('dragstart', (e) => {
      const pos = editorView.posAtCoords({
        left: e.clientX,
        top: e.clientY,
      });
      
      if (pos) {
        draggedNode = engine.startDrag(pos.pos);
      }
    });

    // 拖动结束
    editorView.dom.addEventListener('dragend', () => {
      engine.endDrag();
      draggedNode = null;
    });

    // 拖放
    editorView.dom.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const dropPos = editorView.posAtCoords({
        left: e.clientX,
        top: e.clientY,
      });

      if (dropPos) {
        engine.performDrop(dropPos.pos);
      }
    });

    return {
      update(view) {
        engine.updateView(view);
      },
      destroy() {
        // 清理
      },
    };
  },
});
```

---

## 二、核心概念

### 1. 节点类型 (NodeType)

引擎支持识别以下节点类型：

```typescript
enum NodeType {
  PARAGRAPH = 'paragraph',
  HEADING = 'heading',
  BLOCKQUOTE = 'blockquote',
  CODE_BLOCK = 'codeBlock',
  BULLET_LIST = 'bulletList',
  ORDERED_LIST = 'orderedList',
  TASK_LIST = 'taskList',
  LIST_ITEM = 'listItem',
  TASK_ITEM = 'taskItem',
  TABLE = 'table',
  IMAGE = 'customImage',
  VIDEO = 'customVideo',
  FILE = 'customFile',
  DETAILS = 'customDetails',
  CALLOUT = 'callout',
  // ... 更多类型
}
```

### 2. 拖放区域 (DropZoneType)

```typescript
enum DropZoneType {
  BEFORE = 'before',      // 在目标之前
  AFTER = 'after',        // 在目标之后
  INSIDE = 'inside',      // 在目标内部
  NESTED = 'nested',      // 嵌套到目标
  REPLACE = 'replace',    // 替换目标
  FORBIDDEN = 'forbidden', // 禁止拖动
}
```

### 3. 拖动操作 (DragAction)

```typescript
enum DragAction {
  MOVE = 'move',           // 移动
  CONVERT = 'convert',     // 转换类型
  NEST = 'nest',           // 嵌套
  UNNEST = 'unnest',       // 解除嵌套
  MERGE = 'merge',         // 合并
  REJECT = 'reject',       // 拒绝
}
```

---

## 三、支持的场景

### ✅ P0 场景（已实现）

#### 1. 段落拖动
- ✅ 段落 → 段落（之前/之后）
- ✅ 段落 → 标题（之前/之后）
- ✅ 段落 → 列表（转换为列表项）
- ✅ 段落 → 引用块（嵌入引用）
- ✅ 段落 → Callout（嵌入）

#### 2. 标题拖动
- ✅ 标题 → 段落（之前/之后）
- ✅ 标题 → 标题（之前/之后，保持层级）

#### 3. 列表拖动
- ✅ 列表项 → 列表项（排序）
- ✅ 列表项 → 段落（转换为段落）
- ✅ 列表项 → 列表项（嵌套，增加缩进）
- ✅ 任务项 → 任务项（排序，保持状态）
- ✅ 任务项 ↔ 普通列表项（互相转换）

#### 4. 引用块拖动
- ✅ 引用块 → 段落（之前/之后）
- ❌ 引用块 → 引用块（禁止嵌套）

#### 5. 代码块拖动
- ✅ 代码块 → 段落（之前/之后）
- ❌ 段落 → 代码块（禁止拖入）

#### 6. 表格拖动
- ✅ 表格 → 段落（之前/之后）
- ✅ 表格 → 列表（之前/之后）
- ❌ 段落 → 表格（禁止拖入）

#### 7. 媒体拖动
- ✅ 图片 → 段落（之前/之后）
- ✅ 视频 → 段落（之前/之后）
- ✅ 文件 → 段落（之前/之后）

#### 8. 特殊块拖动
- ✅ 折叠块 → 段落（之前/之后）
- ✅ Callout → 段落（之前/之后）
- ✅ 段落 → 折叠块（嵌入）

---

## 四、自定义规则

### 1. 添加新规则

```typescript
import { DragRules, NodeType, DropZoneType, DragAction } from './extensions/DragEngine';

// 获取现有规则
const rules = DragRules.getRules();

// 添加自定义规则
rules.push({
  sourceType: NodeType.PARAGRAPH,
  targetType: NodeType.MY_CUSTOM_BLOCK,
  dropZone: DropZoneType.INSIDE,
  action: DragAction.NEST,
  condition: (ctx) => {
    // 自定义条件
    return ctx.source.node.textContent.length > 0;
  },
  transform: (ctx, view) => {
    // 自定义转换逻辑
    const tr = view.state.tr;
    // ... 执行自定义操作
    view.dispatch(tr);
  },
});
```

### 2. 修改现有规则

```typescript
// 查找并修改规则
const ruleIndex = rules.findIndex(
  r => r.sourceType === NodeType.PARAGRAPH && 
       r.targetType === NodeType.BLOCKQUOTE
);

if (ruleIndex !== -1) {
  rules[ruleIndex].action = DragAction.REJECT;
  rules[ruleIndex].condition = () => false;
}
```

---

## 五、调试技巧

### 1. 开启调试模式

```typescript
const engine = new DragEngine(view, {
  debug: true, // 在控制台输出详细日志
});
```

### 2. 查看拖动上下文

```typescript
// 在自定义 transform 函数中
transform: (ctx, view) => {
  console.log('Source:', ctx.source);
  console.log('Target:', ctx.target);
  console.log('DropZone:', ctx.dropZone);
  console.log('Action:', ctx.action);
  console.log('Valid:', ctx.valid);
}
```

### 3. 规则匹配测试

```typescript
// 描述规则
DragRules.getRules().forEach(rule => {
  console.log(DragRules.describeRule(rule));
});

// 输出示例：
// paragraph → paragraph (before): move
// paragraph → heading (after): move
// listItem → listItem (inside): nest
```

---

## 六、最佳实践

### 1. 性能优化

```typescript
// ✅ 推荐：使用节流防止频繁触发
import { throttle } from 'lodash';

const handleDrag = throttle((e) => {
  const pos = view.posAtCoords({
    left: e.clientX,
    top: e.clientY,
  });
  if (pos) {
    engine.performDrop(pos.pos);
  }
}, 100);

view.dom.addEventListener('drag', handleDrag);
```

### 2. 错误处理

```typescript
// ✅ 推荐：使用 try-catch 捕获异常
try {
  const success = engine.performDrop(dropPos.pos);
  if (!success) {
    console.warn('拖动操作被拒绝');
  }
} catch (error) {
  console.error('拖动失败:', error);
  // 显示用户友好的错误提示
}
```

### 3. 视觉反馈

```typescript
// ✅ 推荐：结合 Dropcursor 扩展
import Dropcursor from '@tiptap/extension-dropcursor';

editor.use(Dropcursor.configure({
  color: '#6366f1',
  width: 2,
}));
```

---

## 七、常见问题

### Q1: 拖动后节点消失了？
**A**: 检查规则是否正确，确保没有执行 `REJECT` 操作。开启 `debug: true` 查看日志。

### Q2: 列表项拖动后层级错乱？
**A**: 确保使用 `NEST` 和 `UNNEST` 操作，而不是简单的 `MOVE`。

### Q3: 如何禁止某些节点拖动？
**A**: 添加规则并设置 `action: DragAction.REJECT`：

```typescript
{
  sourceType: NodeType.TABLE,
  targetType: NodeType.CODE_BLOCK,
  dropZone: DropZoneType.INSIDE,
  action: DragAction.REJECT,
}
```

### Q4: 如何支持批量拖动？
**A**: 目前不支持批量拖动。可以通过扩展 `DragEngine` 类实现：

```typescript
class BatchDragEngine extends DragEngine {
  private selectedNodes: NodeInfo[] = [];
  
  startBatchDrag(positions: number[]) {
    this.selectedNodes = positions
      .map(pos => this.getNodeInfo(pos))
      .filter(n => n !== null) as NodeInfo[];
  }
  
  performBatchDrop(dropPos: number) {
    this.selectedNodes.forEach(node => {
      // 执行批量拖动逻辑
    });
  }
}
```

---

## 八、下一步计划

### 🚧 即将支持
- [ ] 批量拖动（多选块）
- [ ] 跨文档拖动
- [ ] 拖动预览（Ghost Image）
- [ ] 拖动动画效果
- [ ] 撤销/重做支持

### 🔮 未来计划
- [ ] 表格行列拖动
- [ ] 分栏拖动
- [ ] 自定义拖动区域高亮
- [ ] 拖动权限控制
- [ ] 拖动历史记录

---

**文档版本**: 1.0  
**最后更新**: 2025-11-30
