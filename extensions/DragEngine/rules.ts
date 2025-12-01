/**
 * 拖动规则定义
 * 定义所有拖动场景的规则
 */

import { NodeType, DropZoneType, DragAction, DragRule } from './types';

export class DragRules {
  /**
   * 获取所有拖动规则
   */
  static getRules(): DragRule[] {
    return [
      // ========== A. 基础文本块拖动规则 ==========
      
      // A1. 段落 → 段落
      {
        sourceType: NodeType.PARAGRAPH,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.PARAGRAPH,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },

      // A2. 标题 → 段落/标题
      {
        sourceType: NodeType.HEADING,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.HEADING,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.HEADING,
        targetType: NodeType.HEADING,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.HEADING,
        targetType: NodeType.HEADING,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },

      // A3. 引用块拖动
      {
        sourceType: NodeType.BLOCKQUOTE,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.BLOCKQUOTE,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.BLOCKQUOTE,
        targetType: NodeType.BLOCKQUOTE,
        dropZone: DropZoneType.INSIDE,
        action: DragAction.REJECT, // 不支持嵌套引用
      },
      {
        sourceType: NodeType.PARAGRAPH,
        targetType: NodeType.BLOCKQUOTE,
        dropZone: DropZoneType.INSIDE,
        action: DragAction.NEST, // 段落可以嵌入引用
      },

      // A4. 代码块拖动
      {
        sourceType: NodeType.CODE_BLOCK,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.CODE_BLOCK,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.PARAGRAPH,
        targetType: NodeType.CODE_BLOCK,
        dropZone: DropZoneType.INSIDE,
        action: DragAction.REJECT, // 不允许拖入代码块
      },

      // ========== B. 列表类拖动规则 ==========

      // B1. 列表项 → 列表项
      {
        sourceType: NodeType.LIST_ITEM,
        targetType: NodeType.LIST_ITEM,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.LIST_ITEM,
        targetType: NodeType.LIST_ITEM,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.LIST_ITEM,
        targetType: NodeType.LIST_ITEM,
        dropZone: DropZoneType.INSIDE,
        action: DragAction.NEST, // 嵌套为子列表
      },

      // B2. 列表项 → 段落
      {
        sourceType: NodeType.LIST_ITEM,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.CONVERT, // 转换为段落
      },
      {
        sourceType: NodeType.LIST_ITEM,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.AFTER,
        action: DragAction.CONVERT, // 转换为段落
      },

      // B3. 段落 → 列表项
      {
        sourceType: NodeType.PARAGRAPH,
        targetType: NodeType.LIST_ITEM,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.CONVERT, // 转换为列表项
      },
      {
        sourceType: NodeType.PARAGRAPH,
        targetType: NodeType.LIST_ITEM,
        dropZone: DropZoneType.AFTER,
        action: DragAction.CONVERT, // 转换为列表项
      },

      // B4. 任务列表项
      {
        sourceType: NodeType.TASK_ITEM,
        targetType: NodeType.TASK_ITEM,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.TASK_ITEM,
        targetType: NodeType.TASK_ITEM,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.TASK_ITEM,
        targetType: NodeType.LIST_ITEM,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.CONVERT, // 转换为普通列表项
      },
      {
        sourceType: NodeType.LIST_ITEM,
        targetType: NodeType.TASK_ITEM,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.CONVERT, // 转换为任务项
      },

      // B5. 任务列表整体拖动
      {
        sourceType: NodeType.TASK_LIST,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.TASK_LIST,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.PARAGRAPH,
        targetType: NodeType.TASK_LIST,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.PARAGRAPH,
        targetType: NodeType.TASK_LIST,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.TASK_LIST,
        targetType: NodeType.HEADING,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.TASK_LIST,
        targetType: NodeType.HEADING,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.TASK_LIST,
        targetType: NodeType.BLOCKQUOTE,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.TASK_LIST,
        targetType: NodeType.BLOCKQUOTE,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.TASK_LIST,
        targetType: NodeType.BULLET_LIST,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.TASK_LIST,
        targetType: NodeType.BULLET_LIST,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.TASK_LIST,
        targetType: NodeType.ORDERED_LIST,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.TASK_LIST,
        targetType: NodeType.ORDERED_LIST,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },

      // ========== C. 表格拖动规则 ==========

      // C1. 表格整体拖动
      {
        sourceType: NodeType.TABLE,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.TABLE,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.PARAGRAPH,
        targetType: NodeType.TABLE,
        dropZone: DropZoneType.INSIDE,
        action: DragAction.REJECT, // 不允许拖入表格
      },

      // C2. 表格与列表
      {
        sourceType: NodeType.TABLE,
        targetType: NodeType.LIST_ITEM,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.TABLE,
        targetType: NodeType.LIST_ITEM,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },

      // ========== D. 媒体类拖动规则 ==========

      // D1. 图片拖动
      {
        sourceType: NodeType.IMAGE,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.IMAGE,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.PARAGRAPH,
        targetType: NodeType.IMAGE,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.PARAGRAPH,
        targetType: NodeType.IMAGE,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },

      // D2. 视频拖动
      {
        sourceType: NodeType.VIDEO,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.VIDEO,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },

      // D3. 文件拖动
      {
        sourceType: NodeType.FILE,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.FILE,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },

      // ========== E. 特殊块拖动规则 ==========

      // E1. 折叠块拖动
      {
        sourceType: NodeType.DETAILS,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.DETAILS,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.PARAGRAPH,
        targetType: NodeType.DETAILS,
        dropZone: DropZoneType.INSIDE,
        action: DragAction.NEST, // 段落可以嵌入折叠块
      },

      // E2. Callout拖动
      {
        sourceType: NodeType.CALLOUT,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.CALLOUT,
        targetType: NodeType.PARAGRAPH,
        dropZone: DropZoneType.AFTER,
        action: DragAction.MOVE,
      },
      {
        sourceType: NodeType.PARAGRAPH,
        targetType: NodeType.CALLOUT,
        dropZone: DropZoneType.INSIDE,
        action: DragAction.NEST, // 段落可以嵌入Callout
      },

      // ========== 通用规则（兜底） ==========
      {
        sourceType: NodeType.UNKNOWN,
        targetType: NodeType.UNKNOWN,
        dropZone: DropZoneType.BEFORE,
        action: DragAction.REJECT,
      },
    ];
  }

  /**
   * 获取规则描述（用于调试）
   */
  static describeRule(rule: DragRule): string {
    return `${rule.sourceType} → ${rule.targetType} (${rule.dropZone}): ${rule.action}`;
  }
}
