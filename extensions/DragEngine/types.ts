/**
 * 拖动引擎类型定义
 */

import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { EditorView } from '@tiptap/pm/view';

/**
 * 节点类型枚举
 */
export enum NodeType {
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
  TABLE_ROW = 'tableRow',
  TABLE_CELL = 'tableCell',
  TABLE_HEADER = 'tableHeader',
  IMAGE = 'customImage',
  VIDEO = 'customVideo',
  FILE = 'customFile',
  DETAILS = 'customDetails',
  CALLOUT = 'callout',
  MATH_BLOCK = 'mathBlock',
  HORIZONTAL_RULE = 'horizontalRule',
  UNKNOWN = 'unknown',
}

/**
 * 拖动区域类型
 */
export enum DropZoneType {
  BEFORE = 'before',      // 在目标之前
  AFTER = 'after',        // 在目标之后
  INSIDE = 'inside',      // 在目标内部
  NESTED = 'nested',      // 嵌套到目标
  REPLACE = 'replace',    // 替换目标
  FORBIDDEN = 'forbidden', // 禁止拖动
}

/**
 * 拖动操作类型
 */
export enum DragAction {
  MOVE = 'move',           // 移动
  CONVERT = 'convert',     // 转换类型
  NEST = 'nest',           // 嵌套
  UNNEST = 'unnest',       // 解除嵌套
  MERGE = 'merge',         // 合并
  REJECT = 'reject',       // 拒绝
}

/**
 * 节点信息
 */
export interface NodeInfo {
  type: NodeType;           // 节点类型
  node: ProseMirrorNode;    // ProseMirror 节点
  pos: number;              // 节点位置
  depth: number;            // 节点深度
  parent: ProseMirrorNode | null; // 父节点
  parentPos: number;        // 父节点位置
  isListItem: boolean;      // 是否是列表项
  isNested: boolean;        // 是否嵌套
  level: number;            // 层级（用于标题和列表）
}

/**
 * 拖动上下文
 */
export interface DragContext {
  source: NodeInfo;         // 源节点信息
  target: NodeInfo | null;  // 目标节点信息
  dropZone: DropZoneType;   // 拖放区域
  action: DragAction;       // 拖动操作
  valid: boolean;           // 是否合法
  reason?: string;          // 拒绝原因
}

/**
 * 拖动规则
 */
export interface DragRule {
  sourceType: NodeType;     // 源节点类型
  targetType: NodeType;     // 目标节点类型
  dropZone: DropZoneType;   // 拖放区域
  action: DragAction;       // 执行的操作
  condition?: (ctx: DragContext) => boolean; // 额外条件
  transform?: (ctx: DragContext, view: EditorView) => void; // 转换函数
}

/**
 * 拖动配置
 */
export interface DragEngineConfig {
  enableVisualFeedback: boolean;  // 启用视觉反馈
  dropCursorColor: string;        // 拖放光标颜色
  highlightColor: string;         // 高亮颜色
  animationDuration: number;      // 动画时长
  debug: boolean;                 // 调试模式
}

/**
 * 位置信息
 */
export interface PositionInfo {
  pos: number;              // ProseMirror 位置
  coords: { x: number; y: number }; // 屏幕坐标
  zone: DropZoneType;       // 区域类型
}
