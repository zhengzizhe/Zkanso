import React from 'react';
import { Editor } from '@tiptap/react';
import { Range } from '@tiptap/core';

/**
 * 斜杠命令接口
 */
export interface SlashCommand {
  /** 唯一标识 */
  id: string;
  
  /** 显示名称 */
  title: string;
  
  /** 描述文字 */
  description: string;
  
  /** 图标组件 */
  icon: React.FC<{ className?: string }>;
  
  /** 搜索关键词（支持中英文） */
  keywords: string[];
  
  /** 所属分类 */
  category: string;
  
  /** 快捷键（可选） */
  shortcut?: string;
  
  /** 执行动作 */
  action: (editor: Editor, range?: Range) => void;
  
  /** 是否可用（可选） */
  isEnabled?: (editor: Editor) => boolean;
  
  /** 优先级（排序用，可选） */
  priority?: number;
  
  /** 搜索匹配分数（内部使用） */
  score?: number;
}

/**
 * 命令分类
 */
export interface SlashCommandCategory {
  category: string;
  commands: SlashCommand[];
}

/**
 * 菜单位置
 */
export interface MenuPosition {
  x: number;
  y: number;
}

/**
 * 命令优先级
 */
export enum CommandPriority {
  P0 = 100,  // 最高优先级
  P1 = 50,   // 中等优先级
  P2 = 10,   // 低优先级
}

/**
 * 命令分类枚举
 */
export enum CommandCategoryEnum {
  BasicBlocks = '基础块',
  Lists = '列表',
  ContentBlocks = '内容块',
  Media = '媒体',
  Tables = '表格与数据',
  Advanced = '高级块',
  AI = 'AI 功能',
  Layout = '布局',
  Special = '特殊功能',
}
