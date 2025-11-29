import { Sparkles, RefreshCw, Maximize2, Minimize2, Languages, FileText, CheckCircle } from 'lucide-react';
import { SlashCommand, CommandCategoryEnum, CommandPriority } from '../types';

/**
 * AI 功能命令
 * P2 优先级 - 第三阶段实现
 */
export const aiCommands: SlashCommand[] = [
  {
    id: 'ai-continue',
    title: 'AI 续写',
    description: '根据上文继续写作',
    icon: Sparkles,
    keywords: ['ai', 'continue', 'write', 'auto', '续写', '继续', '写作', '自动'],
    category: CommandCategoryEnum.AI,
    priority: CommandPriority.P2,
    action: (editor, range) => {
      console.log('AI 续写功能待实现');
      if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
  
  {
    id: 'ai-rewrite',
    title: 'AI 改写',
    description: '重写选中内容',
    icon: RefreshCw,
    keywords: ['ai', 'rewrite', 'rephrase', '改写', '重写', '换个说法'],
    category: CommandCategoryEnum.AI,
    priority: CommandPriority.P2,
    action: (editor, range) => {
      console.log('AI 改写功能待实现');
      if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
  
  {
    id: 'ai-expand',
    title: 'AI 扩展',
    description: '扩展内容，增加细节',
    icon: Maximize2,
    keywords: ['ai', 'expand', 'elaborate', '扩展', '展开', '详细'],
    category: CommandCategoryEnum.AI,
    priority: CommandPriority.P2,
    action: (editor, range) => {
      console.log('AI 扩展功能待实现');
      if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
  
  {
    id: 'ai-simplify',
    title: 'AI 简化',
    description: '简化表达，缩短内容',
    icon: Minimize2,
    keywords: ['ai', 'simplify', 'shorten', 'brief', '简化', '精简', '缩短'],
    category: CommandCategoryEnum.AI,
    priority: CommandPriority.P2,
    action: (editor, range) => {
      console.log('AI 简化功能待实现');
      if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
  
  {
    id: 'ai-translate',
    title: 'AI 翻译',
    description: '翻译文本（中英互译）',
    icon: Languages,
    keywords: ['ai', 'translate', 'trans', '翻译', '中英', '英中'],
    category: CommandCategoryEnum.AI,
    priority: CommandPriority.P2,
    action: (editor, range) => {
      console.log('AI 翻译功能待实现');
      if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
  
  {
    id: 'ai-summarize',
    title: 'AI 总结',
    description: '生成内容摘要',
    icon: FileText,
    keywords: ['ai', 'summary', 'tldr', 'brief', '总结', '摘要', '概括'],
    category: CommandCategoryEnum.AI,
    priority: CommandPriority.P2,
    action: (editor, range) => {
      console.log('AI 总结功能待实现');
      if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
  
  {
    id: 'ai-grammar',
    title: 'AI 语法检查',
    description: '检查并修正语法错误',
    icon: CheckCircle,
    keywords: ['ai', 'grammar', 'correct', 'check', '语法', '纠错', '修正'],
    category: CommandCategoryEnum.AI,
    priority: CommandPriority.P2,
    action: (editor, range) => {
      console.log('AI 语法检查功能待实现');
      if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
];
