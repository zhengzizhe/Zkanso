import { Quote, Code, Minus, Scissors, MoveVertical } from 'lucide-react';
import { SlashCommand, CommandCategoryEnum, CommandPriority } from '../types';

/**
 * 内容块命令
 * P0: 引用、代码块、分割线
 * P1: 内联代码、分页符、空白间距
 */
export const contentBlockCommands: SlashCommand[] = [
  // P0 命令
  {
    id: 'quote',
    title: '引用',
    description: '引用文本块',
    icon: Quote,
    keywords: ['quote', 'blockquote', 'citation', '引用', '引述', '摘录'],
    category: CommandCategoryEnum.ContentBlocks,
    shortcut: 'Ctrl+Shift+B',
    priority: CommandPriority.P0,
    action: (editor, range) => {
      if (range) {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      } else {
        editor.chain().focus().toggleBlockquote().run();
      }
    },
    isEnabled: (editor) => editor.can().toggleBlockquote(),
  },
  
  {
    id: 'codeBlock',
    title: '代码块',
    description: '插入代码块，支持语法高亮',
    icon: Code,
    keywords: ['code', 'codeblock', 'pre', 'snippet', '代码', '代码块'],
    category: CommandCategoryEnum.ContentBlocks,
    shortcut: 'Ctrl+Alt+C',
    priority: CommandPriority.P0,
    action: (editor, range) => {
      if (range) {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      } else {
        editor.chain().focus().toggleCodeBlock().run();
      }
    },
    isEnabled: (editor) => editor.can().toggleCodeBlock(),
  },
  
  {
    id: 'divider',
    title: '分割线',
    description: '插入水平分割线',
    icon: Minus,
    keywords: ['hr', 'divider', 'line', 'horizontal', '分割', '横线', '分隔线'],
    category: CommandCategoryEnum.ContentBlocks,
    priority: CommandPriority.P0,
    action: (editor, range) => {
      if (range) {
        editor.chain().focus().deleteRange(range).setHorizontalRule().run();
      } else {
        editor.chain().focus().setHorizontalRule().run();
      }
    },
    isEnabled: (editor) => editor.can().setHorizontalRule(),
  },
  
  // P1 命令
  {
    id: 'inlineCode',
    title: '内联代码',
    description: '行内代码标记',
    icon: Code,
    keywords: ['code', 'inline', 'mono', '内联', '行内', '代码'],
    category: CommandCategoryEnum.ContentBlocks,
    shortcut: 'Ctrl+E',
    priority: CommandPriority.P1,
    action: (editor, range) => {
      if (range) {
        editor.chain().focus().deleteRange(range).toggleCode().run();
      } else {
        editor.chain().focus().toggleCode().run();
      }
    },
    isEnabled: (editor) => editor.can().toggleCode(),
  },
  
  {
    id: 'pageBreak',
    title: '分页符',
    description: '强制分页',
    icon: Scissors,
    keywords: ['pagebreak', 'break', 'page', '分页', '换页'],
    category: CommandCategoryEnum.ContentBlocks,
    priority: CommandPriority.P1,
    action: (editor, range) => {
      // 需要自定义扩展
      console.log('分页符功能待实现');
      if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
  
  {
    id: 'spacer',
    title: '空白间距',
    description: '增加垂直空白',
    icon: MoveVertical,
    keywords: ['spacer', 'space', 'gap', '空白', '间距', '间隔'],
    category: CommandCategoryEnum.ContentBlocks,
    priority: CommandPriority.P1,
    action: (editor, range) => {
      // 插入空段落作为间距
      if (range) {
        editor.chain().focus().deleteRange(range).insertContent('<p></p>').run();
      } else {
        editor.chain().focus().insertContent('<p></p>').run();
      }
    },
  },
];
