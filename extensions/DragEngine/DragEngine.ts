/**
 * 拖动引擎核心类
 * 处理所有拖动场景的逻辑
 */

import { EditorView } from '@tiptap/pm/view';
import { Node as ProseMirrorNode, ResolvedPos } from '@tiptap/pm/model';
import { Transaction } from '@tiptap/pm/state';
import {
  NodeType,
  DropZoneType,
  DragAction,
  NodeInfo,
  DragContext,
  DragRule,
  DragEngineConfig,
  PositionInfo,
} from './types';
import { DragRules } from './rules';

export class DragEngine {
  private view: EditorView;
  private config: DragEngineConfig;
  private rules: DragRule[];
  private draggedNode: NodeInfo | null = null;

  constructor(view: EditorView, config?: Partial<DragEngineConfig>) {
    this.view = view;
    this.config = {
      enableVisualFeedback: true,
      dropCursorColor: '#6366F1',
      highlightColor: 'rgba(99, 102, 241, 0.1)',
      animationDuration: 200,
      debug: false,
      ...config,
    };
    this.rules = DragRules.getRules();
  }

  /**
   * 开始拖动
   */
  startDrag(pos: number): NodeInfo | null {
    const nodeInfo = this.getNodeInfo(pos);
    if (!nodeInfo) {
      this.log('无法识别节点', pos);
      return null;
    }

    this.draggedNode = nodeInfo;
    this.log('开始拖动', nodeInfo);
    return nodeInfo;
  }

  /**
   * 结束拖动
   */
  endDrag(): void {
    this.draggedNode = null;
    this.log('结束拖动');
  }

  /**
   * 执行拖放操作
   */
  performDrop(dropPos: number): boolean {
    if (!this.draggedNode) {
      this.log('没有拖动的节点');
      return false;
    }

    const targetInfo = this.getNodeInfo(dropPos);
    const dropZone = this.calculateDropZone(dropPos, targetInfo);
    
    const context: DragContext = {
      source: this.draggedNode,
      target: targetInfo,
      dropZone,
      action: DragAction.MOVE,
      valid: true,
    };

    // 查找匹配的规则
    const rule = this.findMatchingRule(context);
    if (!rule) {
      context.valid = false;
      context.reason = '没有匹配的拖动规则';
      this.log('拒绝拖动', context.reason);
      return false;
    }

    // 应用规则
    context.action = rule.action;

    // 检查条件
    if (rule.condition && !rule.condition(context)) {
      context.valid = false;
      context.reason = '不满足拖动条件';
      this.log('拒绝拖动', context.reason);
      return false;
    }

    // 执行操作
    if (context.action === DragAction.REJECT) {
      context.valid = false;
      context.reason = '该操作不被允许';
      this.log('拒绝拖动', context.reason);
      return false;
    }

    // 执行转换
    if (rule.transform) {
      rule.transform(context, this.view);
    } else {
      this.executeDefaultAction(context);
    }

    return true;
  }

  /**
   * 获取节点信息
   */
  private getNodeInfo(pos: number): NodeInfo | null {
    try {
      const { state } = this.view;
      const $pos = state.doc.resolve(pos);
      
      let depth = $pos.depth;
      while (depth > 0) {
        const node = $pos.node(depth);
        if (node.isBlock && node.type.name !== 'doc') {
          const nodeType = this.getNodeType(node.type.name);
          const parent = depth > 1 ? $pos.node(depth - 1) : null;
          const parentPos = depth > 1 ? $pos.before(depth - 1) : 0;

          // 特殊处理：如果当前是列表项（listItem/taskItem），总是拖动整个列表
          // 这样可以保留列表的完整结构，避免内容丢失
          if ((nodeType === NodeType.LIST_ITEM || nodeType === NodeType.TASK_ITEM) && parent) {
            const parentType = parent.type.name;
            if (parentType === 'bulletList' || parentType === 'orderedList' || parentType === 'taskList') {
              // 拖动整个列表，而不是单个列表项
              this.log(`检测到列表项，拖动整个 ${parentType}`);
              return {
                type: this.getNodeType(parentType),
                node: parent,
                pos: parentPos,
                depth: depth - 1,
                parent: depth > 2 ? $pos.node(depth - 2) : null,
                parentPos: depth > 2 ? $pos.before(depth - 2) : 0,
                isListItem: false,
                isNested: depth > 2,
                level: depth - 2,
              };
            }
          }

          return {
            type: nodeType,
            node,
            pos: $pos.before(depth),
            depth,
            parent,
            parentPos,
            isListItem: nodeType === NodeType.LIST_ITEM || nodeType === NodeType.TASK_ITEM,
            isNested: depth > 1 && parent?.type.name.includes('List'),
            level: node.attrs.level || (depth - 1),
          };
        }
        depth--;
      }
    } catch (error) {
      this.log('获取节点信息失败', error);
    }
    return null;
  }

  /**
   * 计算拖放区域
   */
  private calculateDropZone(dropPos: number, targetInfo: NodeInfo | null): DropZoneType {
    if (!targetInfo) {
      return DropZoneType.AFTER;
    }

    const { state } = this.view;
    const $pos = state.doc.resolve(dropPos);
    const targetPos = targetInfo.pos;
    const targetEnd = targetPos + targetInfo.node.nodeSize;

    // 判断是在节点之前、之后还是内部
    if (dropPos < targetPos + 5) {
      return DropZoneType.BEFORE;
    } else if (dropPos > targetEnd - 5) {
      return DropZoneType.AFTER;
    } else if (targetInfo.node.isTextblock) {
      return DropZoneType.BEFORE; // 文本块视为之前
    } else {
      return DropZoneType.INSIDE;
    }
  }

  /**
   * 查找匹配的规则
   */
  private findMatchingRule(context: DragContext): DragRule | null {
    const { source, target, dropZone } = context;
    
    for (const rule of this.rules) {
      // 匹配源类型
      if (rule.sourceType !== source.type) continue;
      
      // 匹配目标类型
      if (target && rule.targetType !== target.type) continue;
      
      // 匹配拖放区域
      if (rule.dropZone !== dropZone) continue;
      
      return rule;
    }

    return null;
  }

  /**
   * 执行默认操作
   */
  private executeDefaultAction(context: DragContext): void {
    const { source, target, dropZone, action } = context;

    if (!this.draggedNode) return;

    const { state } = this.view;
    const tr = state.tr;

    try {
      switch (action) {
        case DragAction.MOVE:
          this.executeMoveAction(tr, source, target, dropZone);
          break;
        case DragAction.CONVERT:
          this.executeConvertAction(tr, source, target, dropZone);
          break;
        case DragAction.NEST:
          this.executeNestAction(tr, source, target);
          break;
        case DragAction.UNNEST:
          this.executeUnnestAction(tr, source);
          break;
        default:
          this.log('未知操作', action);
          return;
      }

      this.view.dispatch(tr);
      this.log('执行操作成功', action);
    } catch (error) {
      this.log('执行操作失败', error);
    }
  }

  /**
   * 执行移动操作
   */
  private executeMoveAction(
    tr: Transaction,
    source: NodeInfo,
    target: NodeInfo | null,
    dropZone: DropZoneType
  ): void {
    const sourcePos = source.pos;
    const sourceEnd = sourcePos + source.node.nodeSize;

    // 计算目标位置
    let insertPos: number;
    if (!target) {
      insertPos = tr.doc.content.size - 1;
    } else {
      const targetPos = target.pos;
      const targetEnd = targetPos + target.node.nodeSize;

      if (dropZone === DropZoneType.BEFORE) {
        insertPos = targetPos;
      } else if (dropZone === DropZoneType.AFTER) {
        insertPos = targetEnd;
      } else if (dropZone === DropZoneType.INSIDE) {
        insertPos = targetPos + 1; // 节点内部的第一个位置
      } else {
        insertPos = targetEnd;
      }
    }

    // 判断移动方向
    const movingDown = insertPos > sourcePos;

    if (movingDown) {
      // 向下移动：先插入再删除
      tr.insert(insertPos, source.node);
      tr.delete(sourcePos, sourceEnd);
    } else {
      // 向上移动：先删除再插入
      tr.delete(sourcePos, sourceEnd);
      tr.insert(insertPos, source.node);
    }
  }

  /**
   * 执行转换操作
   */
  private executeConvertAction(
    tr: Transaction,
    source: NodeInfo,
    target: NodeInfo | null,
    dropZone: DropZoneType
  ): void {
    // 先删除源节点
    const sourcePos = source.pos;
    const sourceEnd = sourcePos + source.node.nodeSize;
    tr.delete(sourcePos, sourceEnd);

    // 然后根据目标类型创建新节点
    if (target) {
      const newNode = this.convertNode(source.node, target.type);
      const insertPos = dropZone === DropZoneType.BEFORE ? target.pos : target.pos + target.node.nodeSize;
      tr.insert(insertPos, newNode);
    }
  }

  /**
   * 执行嵌套操作
   */
  private executeNestAction(tr: Transaction, source: NodeInfo, target: NodeInfo | null): void {
    if (!target) return;

    const sourcePos = source.pos;
    const sourceEnd = sourcePos + source.node.nodeSize;

    // 删除源节点
    tr.delete(sourcePos, sourceEnd);

    // 插入到目标节点内部
    const insertPos = target.pos + target.node.nodeSize - 1;
    tr.insert(insertPos, source.node);
  }

  /**
   * 执行解除嵌套操作
   */
  private executeUnnestAction(tr: Transaction, source: NodeInfo): void {
    if (!source.parent) return;

    const sourcePos = source.pos;
    const sourceEnd = sourcePos + source.node.nodeSize;

    // 删除源节点
    tr.delete(sourcePos, sourceEnd);

    // 插入到父节点之后
    const insertPos = source.parentPos + source.parent.nodeSize;
    tr.insert(insertPos, source.node);
  }

  /**
   * 节点类型转换
   */
  private convertNode(node: ProseMirrorNode, targetType: NodeType): ProseMirrorNode {
    const { state } = this.view;
    const schema = state.schema;

    // 根据目标类型创建新节点
    switch (targetType) {
      case NodeType.PARAGRAPH:
        return schema.nodes.paragraph.create(null, node.content);
      case NodeType.LIST_ITEM:
        return schema.nodes.listItem.create(null, node.content);
      case NodeType.TASK_ITEM:
        return schema.nodes.taskItem.create({ checked: false }, node.content);
      default:
        return node;
    }
  }

  /**
   * 获取节点类型
   */
  private getNodeType(typeName: string): NodeType {
    const typeMap: Record<string, NodeType> = {
      paragraph: NodeType.PARAGRAPH,
      heading: NodeType.HEADING,
      blockquote: NodeType.BLOCKQUOTE,
      codeBlock: NodeType.CODE_BLOCK,
      bulletList: NodeType.BULLET_LIST,
      orderedList: NodeType.ORDERED_LIST,
      taskList: NodeType.TASK_LIST,
      listItem: NodeType.LIST_ITEM,
      taskItem: NodeType.TASK_ITEM,
      table: NodeType.TABLE,
      tableRow: NodeType.TABLE_ROW,
      tableCell: NodeType.TABLE_CELL,
      tableHeader: NodeType.TABLE_HEADER,
      customImage: NodeType.IMAGE,
      customVideo: NodeType.VIDEO,
      customFile: NodeType.FILE,
      customDetails: NodeType.DETAILS,
      callout: NodeType.CALLOUT,
      mathBlock: NodeType.MATH_BLOCK,
      horizontalRule: NodeType.HORIZONTAL_RULE,
    };

    return typeMap[typeName] || NodeType.UNKNOWN;
  }

  /**
   * 更新视图引用
   */
  updateView(view: EditorView): void {
    this.view = view;
  }

  /**
   * 调试日志
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[DragEngine]', ...args);
    }
  }

  /**
   * 获取当前拖动的节点
   */
  getDraggedNode(): NodeInfo | null {
    return this.draggedNode;
  }
}
