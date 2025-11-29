import { List, ListOrdered, CheckSquare, ChevronRight, Columns } from 'lucide-react';
import { SlashCommand, CommandCategoryEnum, CommandPriority } from '../types';

/**
 * 列表命令
 * P0: 无序列表、有序列表、任务列表
 * P1: 折叠列表、分栏列表
 */
export const listCommands: SlashCommand[] = [
  // P0 命令
  {
    id: 'bulletList',
    title: '无序列表',
    description: '创建带圆点的列表',
    icon: List,
    keywords: ['ul', 'bullet', 'list', 'unordered', '无序', '列表', '圆点'],
    category: CommandCategoryEnum.Lists,
    shortcut: 'Ctrl+Shift+8',
    priority: CommandPriority.P0,
    action: (editor, range) => {
      if (range) {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      } else {
        editor.chain().focus().toggleBulletList().run();
      }
    },
    isEnabled: (editor) => editor.can().toggleBulletList(),
  },
  
  {
    id: 'orderedList',
    title: '有序列表',
    description: '创建带数字编号的列表',
    icon: ListOrdered,
    keywords: ['ol', 'numbered', 'ordered', 'list', '有序', '编号', '数字列表'],
    category: CommandCategoryEnum.Lists,
    shortcut: 'Ctrl+Shift+7',
    priority: CommandPriority.P0,
    action: (editor, range) => {
      if (range) {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      } else {
        editor.chain().focus().toggleOrderedList().run();
      }
    },
    isEnabled: (editor) => editor.can().toggleOrderedList(),
  },
  
  {
    id: 'taskList',
    title: '任务列表',
    description: '带复选框的待办事项清单',
    icon: CheckSquare,
    keywords: ['todo', 'task', 'checkbox', 'checklist', '任务', '待办', '清单', 'check'],
    category: CommandCategoryEnum.Lists,
    shortcut: 'Ctrl+Shift+9',
    priority: CommandPriority.P0,
    action: (editor, range) => {
      if (range) {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      } else {
        editor.chain().focus().toggleTaskList().run();
      }
    },
    isEnabled: (editor) => editor.can().toggleTaskList(),
  },
  
  // P1 命令
  {
    id: 'toggleList',
    title: '折叠列表',
    description: '可展开/折叠的列表项',
    icon: ChevronRight,
    keywords: ['toggle', 'collapse', 'expand', '折叠', '展开', '隐藏'],
    category: CommandCategoryEnum.Lists,
    priority: CommandPriority.P1,
    action: (editor, range) => {
      // 需要自定义扩展支持
      console.log('折叠列表功能待实现');
      if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
  
  {
    id: 'columnList',
    title: '分栏列表',
    description: '多列显示的列表',
    icon: Columns,
    keywords: ['column', 'multi', 'columns', '分栏', '多列', '列'],
    category: CommandCategoryEnum.Lists,
    priority: CommandPriority.P1,
    action: (editor, range) => {
      // 需要自定义扩展支持
      console.log('分栏列表功能待实现');
      if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
];
