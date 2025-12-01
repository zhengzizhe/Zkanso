import React from 'react';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  Quote,
  Code,
  Divide,
  Image,
  Link,
  Trash2,
  Zap,
  Check,
  AlertCircle,
  Table,
  Youtube,
  ChevronDown,
  Sigma,
  Smile,
  FileUp,
  Video,
  Workflow,
} from 'lucide-react';

export interface SlashCommand {
  title: string;
  description: string;
  searchTerms: string[];
  icon: React.ReactNode;
  command: ({ editor, range }: { editor: any; range: any }) => void;
  category?: string; // 新增分类字段
}

const commands: SlashCommand[] = [
  // ========== 基础文本 ==========
  {
    title: '段落',
    description: '普通文本',
    searchTerms: ['p', 'paragraph'],
    icon: <Type className="w-4 h-4" />,
    category: '基础',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setParagraph()
        .run();
    },
  },
  {
    title: '标题 1',
    description: '大标题',
    searchTerms: ['title', 'large', 'h1'],
    icon: <Heading1 className="w-4 h-4" />,
    category: '基础',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 1 })
        .run();
    },
  },
  {
    title: '标题 2',
    description: '中等标题',
    searchTerms: ['subtitle', 'medium', 'h2'],
    icon: <Heading2 className="w-4 h-4" />,
    category: '基础',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 2 })
        .run();
    },
  },
  {
    title: '标题 3',
    description: '小标题',
    searchTerms: ['heading', 'small', 'h3'],
    icon: <Heading3 className="w-4 h-4" />,
    category: '基础',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 3 })
        .run();
    },
  },
  {
    title: '标题 4',
    description: '小标题',
    searchTerms: ['heading', 'h4'],
    icon: <Heading4 className="w-4 h-4" />,
    category: '基础',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 4 })
        .run();
    },
  },
  {
    title: '标题 5',
    description: '微小标题',
    searchTerms: ['heading', 'h5'],
    icon: <Heading5 className="w-4 h-4" />,
    category: '基础',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 5 })
        .run();
    },
  },
  {
    title: '标题 6',
    description: '最小标题',
    searchTerms: ['heading', 'h6'],
    icon: <Heading6 className="w-4 h-4" />,
    category: '基础',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 6 })
        .run();
    },
  },
  
  // ========== 列表 ==========
  {
    title: '无序列表',
    description: '项目符号列表',
    searchTerms: ['ul', 'bullet', '列表'],
    icon: <List className="w-4 h-4" />,
    category: '列表',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBulletList()
        .run();
    },
  },
  {
    title: '有序列表',
    description: '编号列表',
    searchTerms: ['ol', 'numbered', '编号'],
    icon: <ListOrdered className="w-4 h-4" />,
    category: '列表',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleOrderedList()
        .run();
    },
  },
  
  // ========== 内容块 ==========
  {
    title: '引用块',
    description: '引用或参考',
    searchTerms: ['quote', 'blockquote', '引用'],
    icon: <Quote className="w-4 h-4" />,
    category: '内容块',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBlockquote()
        .run();
    },
  },
  {
    title: '信息',
    description: '信息提示',
    searchTerms: ['info', 'information', 'note'],
    icon: <AlertCircle className="w-4 h-4" />,
    category: '提示框',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'callout',
          attrs: { type: 'info' },
          content: [
            {
              type: 'text',
              text: '这是一个信息提示',
            },
          ],
        })
        .run();
    },
  },
  {
    title: '警告',
    description: '警告提示',
    searchTerms: ['warning', 'alert', 'caution'],
    icon: <AlertCircle className="w-4 h-4" />,
    category: '提示框',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'callout',
          attrs: { type: 'warning' },
          content: [
            {
              type: 'text',
              text: '这是一个警告提示',
            },
          ],
        })
        .run();
    },
  },
  {
    title: '成功',
    description: '成功提示',
    searchTerms: ['success', 'done', 'complete'],
    icon: <Check className="w-4 h-4" />,
    category: '提示框',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'callout',
          attrs: { type: 'success' },
          content: [
            {
              type: 'text',
              text: '这是一个成功提示',
            },
          ],
        })
        .run();
    },
  },
  {
    title: '错误',
    description: '错误提示',
    searchTerms: ['error', 'danger', 'fail'],
    icon: <Trash2 className="w-4 h-4" />,
    category: '提示框',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'callout',
          attrs: { type: 'error' },
          content: [
            {
              type: 'text',
              text: '这是一个错误提示',
            },
          ],
        })
        .run();
    },
  },
  {
    title: '代码块',
    description: '增强代码编辑器',
    searchTerms: ['code', 'block', '代码', '代码块', 'enhanced'],
    icon: <Code className="w-4 h-4" />,
    category: '内容块',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setEnhancedCodeBlock({ language: 'javascript' })
        .run();
    },
  },
  {
    title: '分割线',
    description: '视觉分隔',
    searchTerms: ['divider', 'hr', 'horizontal', '分割'],
    icon: <Divide className="w-4 h-4" />,
    category: '内容块',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setHorizontalRule()
        .run();
    },
  },
  {
    title: '任务列表',
    description: '待办事项',
    searchTerms: ['todo', 'task', 'check', '任务'],
    icon: <Check className="w-4 h-4" />,
    category: '列表',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleTaskList()
        .run();
    },
  },
  
  // ========== 媒体 ==========
  {
    title: '图片',
    description: '插入图片',
    searchTerms: ['image', 'photo', 'picture', 'img', '图片'],
    icon: <Image className="w-4 h-4" />,
    category: '媒体',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      
      // 触发自定义事件打开图片上传面板
      const event = new CustomEvent('openImageUpload');
      window.dispatchEvent(event);
    },
  },
  {
    title: '文件',
    description: '上传文件',
    searchTerms: ['file', 'upload', 'attachment', '文件', '附件'],
    icon: <FileUp className="w-4 h-4" />,
    category: '媒体',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      
      // 创建文件输入
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const url = event.target?.result as string;
            
            const content = editor.schema.nodes.customFile
              ? {
                  type: 'customFile',
                  attrs: {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: url,
                  },
                }
              : {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: `📄 ${file.name} (${Math.round(file.size / 1024)}KB)`,
                    },
                  ],
                };
            
            editor.chain().focus().insertContent(content).run();
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    },
  },
  {
    title: '视频',
    description: '上传视频',
    searchTerms: ['video', 'mp4', '视频'],
    icon: <Video className="w-4 h-4" />,
    category: '媒体',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      
      // 创建视频文件输入
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const url = event.target?.result as string;
            
            const content = editor.schema.nodes.customVideo
              ? {
                  type: 'customVideo',
                  attrs: {
                    src: url,
                    controls: true,
                  },
                }
              : {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: `🎥 ${file.name}`,
                    },
                  ],
                };
            
            editor.chain().focus().insertContent(content).run();
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    },
  },
  {
    title: '表格',
    description: '插入表格',
    searchTerms: ['table', 'grid', '表格'],
    icon: <Table className="w-4 h-4" />,
    category: '媒体',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    },
  },
  {
    title: 'YouTube',
    description: '嵌入视频',
    searchTerms: ['youtube', 'video', '视频'],
    icon: <Youtube className="w-4 h-4" />,
    category: '媒体',
    command: ({ editor, range }) => {
      const url = window.prompt('请输入YouTube视频URL:');
      if (url) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setYoutubeVideo({ src: url })
          .run();
      }
    },
  },
  {
    title: '折叠块',
    description: '可收起内容',
    searchTerms: ['details', 'collapse', 'toggle', '折叠', '收起'],
    icon: <ChevronDown className="w-4 h-4" />,
    category: '内容块',
    command: ({ editor, range }) => {
      const summary = window.prompt('请输入标题:') || '点击展开';
      
      // 尝试使用自定义折叠块
      const content = editor.schema.nodes.customDetails
        ? {
            type: 'customDetails',
            attrs: { summary, open: false },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: '请输入内容...' }],
              },
            ],
          }
        : {
            type: 'paragraph',
            content: [{ type: 'text', text: `▶ ${summary}: 请输入内容...` }],
          };
      
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent(content)
        .run();
    },
  },
  {
    title: '数学公式',
    description: 'LaTeX公式',
    searchTerms: ['math', 'latex', 'formula', '公式', '数学'],
    icon: <Sigma className="w-4 h-4" />,
    category: '媒体',
    command: ({ editor, range }) => {
      const latex = window.prompt('请输入LaTeX公式（如: E = mc^2）:');
      if (latex) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: 'displayMath',
            attrs: { value: latex },
          })
          .run();
      }
    },
  },
  {
    title: '表情符号',
    description: '插入表情',
    searchTerms: ['emoji', 'emoticon', '表情', '符号'],
    icon: <Smile className="w-4 h-4" />,
    category: '媒体',
    command: ({ editor, range }) => {
      const emojis = ['😀', '😃', '😄', '❤️', '👍', '🎉', '🔥', '✅'];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent(emoji)
        .run();
    },
  },
  {
    title: 'Mermaid 图表',
    description: '流程图/时序图/甘特图',
    searchTerms: ['mermaid', 'diagram', 'flowchart', 'sequence', 'gantt', '图表', '流程图', '时序图', '甘特图'],
    icon: <Workflow className="w-4 h-4" />,
    category: '媒体',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'mermaid',
          attrs: {
            content: 'graph TD\n    A[开始] --> B[结束]'
          }
        })
        .run();
    },
  },
  {
    title: '提示',
    description: '捕获重要的提示信息',
    searchTerms: ['alert', 'tip', 'callout'],
    icon: <AlertCircle className="w-4 h-4" />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '💡 ',
            },
          ],
        })
        .run();
    },
  },
];

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('slashCommand'),
        props: {
          decorations(state) {
            const { doc, selection } = state;
            const { $from } = selection;
            const textStart = $from.parent.textContent.lastIndexOf('/');

            if (textStart === -1) {
              return DecorationSet.empty;
            }

            return DecorationSet.empty;
          },
        },
      }),
    ];
  },

  addKeyboardShortcuts() {
    return {};
  },
});

export const getSlashCommands = () => commands;

export default SlashCommand;
