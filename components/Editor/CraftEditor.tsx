import React from 'react';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import { LayoutGroup } from 'framer-motion';
import StarterKit from '@tiptap/starter-kit';
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import Dropcursor from '@tiptap/extension-dropcursor';
import { DragDropExtension } from './DragDropExtension';
import { ParagraphNodeView } from './BlockComponents/ParagraphNodeView';
import { HeadingNodeView } from './BlockComponents/HeadingNodeView';
import { QuoteNodeView } from './BlockComponents/QuoteNodeView';
import { FloatingToolbar } from './FloatingToolbar';
import { SlashMenu } from './SlashMenu';
import '../../styles/craft-variables.css';
import '../../styles/craft-editor.css';

interface CraftEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

/**
 * Craft 风格编辑器主组件
 * 
 * 功能特性：
 * - 悬浮工具栏：选中文本时显示
 * - 斜杠菜单：输入 / 触发命令
 * - 块级操作：悬停段落时显示控制柄
 * - 拖拽排序：支持块级拖拽重排
 * - 键盘快捷键：完整的快捷键支持
 * 
 * 设计规范：
 * - 字体：SF Pro Display
 * - 行高：1.6
 * - 段落间距：20px
 * - 最大宽度：768px
 */
export const CraftEditor: React.FC<CraftEditorProps> = ({
  content = '',
  onChange,
  placeholder = '输入 / 召唤命令菜单...',
  editable = true
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        heading: false,
        blockquote: false,
      }),
      DragDropExtension,
      Dropcursor.configure({
        color: '#6366F1',
        width: 3,
      }),
      // 包装的段落
      Paragraph.extend({
        addNodeView() {
          return ReactNodeViewRenderer(ParagraphNodeView);
        },
      }),
      // 包装的标题
      Heading.configure({
        levels: [1, 2, 3]
      }).extend({
        addNodeView() {
          return ReactNodeViewRenderer(HeadingNodeView);
        },
      }),
      // 包装的引用块
      Blockquote.extend({
        addNodeView() {
          return ReactNodeViewRenderer(QuoteNodeView);
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'craft-link'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'craft-image'
        }
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'craft-task-list'
        }
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'craft-task-item'
        }
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'craft-editor-empty'
      })
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class: 'craft-editor-content',
        // 启用 HTML5 原生拖拽
        draggable: 'true',
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    }
  });

  return (
    <div className="craft-editor-container">
      {/* 编辑器主体 */}
      <div className="craft-editor-wrapper">
        <LayoutGroup>
          <EditorContent editor={editor} />
        </LayoutGroup>
      </div>

      {/* 悬浮工具栏 */}
      <FloatingToolbar editor={editor} />

      {/* 斜杠命令菜单 */}
      <SlashMenu editor={editor} />
    </div>
  );
};

/**
 * 导出编辑器组件和相关工具
 */
export { FloatingToolbar } from './FloatingToolbar';
export { SlashMenu } from './SlashMenu';
export * from './BlockComponents';
