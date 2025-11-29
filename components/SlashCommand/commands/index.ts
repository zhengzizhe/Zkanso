import { SlashCommand, SlashCommandCategory } from '../types';
import { basicBlockCommands } from './basic-blocks';
import { listCommands } from './lists';
import { contentBlockCommands } from './content-blocks';
import { mediaCommands } from './media';
import { aiCommands } from './ai';

/**
 * 所有命令的汇总
 */
export const allCommands: SlashCommand[] = [
  ...basicBlockCommands,
  ...listCommands,
  ...contentBlockCommands,
  ...mediaCommands,
  ...aiCommands,
];

/**
 * 按分类组织的命令
 */
export const commandsByCategory: SlashCommandCategory[] = [
  {
    category: '基础块',
    commands: basicBlockCommands,
  },
  {
    category: '列表',
    commands: listCommands,
  },
  {
    category: '内容块',
    commands: contentBlockCommands,
  },
  {
    category: '媒体',
    commands: mediaCommands,
  },
  {
    category: 'AI 功能',
    commands: aiCommands,
  },
];

/**
 * P0 命令（第一优先级）
 */
export const p0Commands = allCommands.filter(cmd => cmd.priority === 100);

/**
 * P1 命令（第二优先级）
 */
export const p1Commands = allCommands.filter(cmd => cmd.priority === 50);

/**
 * P2 命令（第三优先级）
 */
export const p2Commands = allCommands.filter(cmd => cmd.priority === 10);

// 导出单个命令集
export { basicBlockCommands } from './basic-blocks';
export { listCommands } from './lists';
export { contentBlockCommands } from './content-blocks';
export { mediaCommands } from './media';
export { aiCommands } from './ai';
