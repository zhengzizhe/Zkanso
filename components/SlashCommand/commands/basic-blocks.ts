import { Editor } from '@tiptap/react';
import { Type, Heading1, Heading2, Heading3 } from 'lucide-react';
import { SlashCommand, CommandCategoryEnum, CommandPriority } from '../types';

/**
 * 基础块命令
 * P0 优先级 - 必须在第一阶段完成
 */
export const basicBlockCommands: SlashCommand[] = [
  {
    id: 'paragraph',
    title: '正文',
    description: '普通段落文本',
    icon: Type,
    keywords: ['text', 'p', 'paragraph', '正文', '段落', '文本', 'para'],
    category: CommandCategoryEnum.BasicBlocks,
    priority: CommandPriority.P0,
    action: (editor, range) => {
      if (range) {
        editor.chain().focus().deleteRange(range).setParagraph().run();
      } else {
        editor.chain().focus().setParagraph().run();
      }
    },
    isEnabled: (editor) => editor.can().setParagraph(),
  },
  
  {
    id: 'heading1',
    title: '标题 1',
    description: '大号标题，用于章节标题',
    icon: Heading1,
    keywords: ['h1', 'title', 'heading', '标题', '大标题', '一级标题', '1'],
    category: CommandCategoryEnum.BasicBlocks,
    shortcut: 'Ctrl+Alt+1',
    priority: CommandPriority.P0,
    action: (editor, range) => {
      if (range) {
        editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run();
      } else {
        editor.chain().focus().toggleHeading({ level: 1 }).run();
      }
    },
    isEnabled: (editor) => editor.can().toggleHeading({ level: 1 }),
  },
  
  {
    id: 'heading2',
    title: '标题 2',
    description: '中号标题，用于副标题',
    icon: Heading2,
    keywords: ['h2', 'subtitle', 'heading', '标题', '副标题', '二级标题', '2'],
    category: CommandCategoryEnum.BasicBlocks,
    shortcut: 'Ctrl+Alt+2',
    priority: CommandPriority.P0,
    action: (editor, range) => {
      if (range) {
        editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run();
      } else {
        editor.chain().focus().toggleHeading({ level: 2 }).run();
      }
    },
    isEnabled: (editor) => editor.can().toggleHeading({ level: 2 }),
  },
  
  {
    id: 'heading3',
    title: '标题 3',
    description: '小号标题，用于小节标题',
    icon: Heading3,
    keywords: ['h3', 'small', 'heading', '标题', '小标题', '三级标题', '3'],
    category: CommandCategoryEnum.BasicBlocks,
    shortcut: 'Ctrl+Alt+3',
    priority: CommandPriority.P0,
    action: (editor, range) => {
      if (range) {
        editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run();
      } else {
        editor.chain().focus().toggleHeading({ level: 3 }).run();
      }
    },
    isEnabled: (editor) => editor.can().toggleHeading({ level: 3 }),
  },
];
