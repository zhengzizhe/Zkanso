import React from 'react';
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react';
import { Editor } from '@tiptap/core';
import { Bold, Italic, Underline, Strikethrough, Code, Link } from 'lucide-react';

interface BubbleMenuProps {
  editor: Editor;
}

export const BubbleMenu: React.FC<BubbleMenuProps> = ({ editor }) => {
  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex items-center gap-1 px-2 py-1.5 bg-gray-900 dark:bg-gray-800 rounded-lg shadow-xl border border-gray-700"
    >
      {/* 加粗 */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('bold')
            ? 'bg-indigo-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
        title="加粗 (Cmd+B)"
      >
        <Bold className="w-4 h-4" />
      </button>

      {/* 斜体 */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('italic')
            ? 'bg-indigo-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
        title="斜体 (Cmd+I)"
      >
        <Italic className="w-4 h-4" />
      </button>

      {/* 下划线 */}
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('underline')
            ? 'bg-indigo-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
        title="下划线 (Cmd+U)"
      >
        <Underline className="w-4 h-4" />
      </button>

      {/* 删除线 */}
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('strike')
            ? 'bg-indigo-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
        title="删除线 (Cmd+Shift+X)"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      {/* 分隔线 */}
      <div className="w-px h-5 bg-gray-600 mx-1" />

      {/* 内联代码 */}
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('code')
            ? 'bg-indigo-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
        title="内联代码 (Cmd+E)"
      >
        <Code className="w-4 h-4" />
      </button>

      {/* 链接 */}
      <button
        onClick={() => {
          const url = window.prompt('输入链接地址：');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('link')
            ? 'bg-indigo-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
        title="添加链接 (Cmd+K)"
      >
        <Link className="w-4 h-4" />
      </button>
    </TiptapBubbleMenu>
  );
};
