import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Workflow,
} from 'lucide-react';

interface ToolbarButtonsProps {
  editor: Editor;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
  title: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, isActive, icon, title }) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700
        transition-colors duration-150
        ${isActive ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}
      `}
      style={{
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
      }}
    >
      {icon}
    </button>
  );
};

const HighlightColorPicker: React.FC<{ editor: Editor }> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const colors = [
    { name: 'yellow', value: '#fef3c7', label: '黄色' },
    { name: 'green', value: '#d1fae5', label: '绿色' },
    { name: 'blue', value: '#dbeafe', label: '蓝色' },
    { name: 'red', value: '#fee2e2', label: '红色' },
    { name: 'purple', value: '#ede9fe', label: '紫色' },
    { name: 'orange', value: '#ffedd5', label: '橙色' },
    { name: 'pink', value: '#fce7f3', label: '粉色' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="文本高亮"
        className={`
          p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700
          transition-colors duration-150
          ${editor.isActive('highlight') ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'}
        `}
        style={{
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
        }}
      >
        <Highlighter className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '36px',
            left: 0,
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '8px',
            zIndex: 1500,
            display: 'flex',
            gap: '4px',
            minWidth: '200px',
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => {
                editor.chain().focus().toggleHighlight({ color: color.name }).run();
                setIsOpen(false);
              }}
              title={color.label}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                background: color.value,
                border: editor.isActive('highlight', { color: color.name }) ? '2px solid #6366f1' : '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            />
          ))}
          <button
            onClick={() => {
              editor.chain().focus().unsetHighlight().run();
              setIsOpen(false);
            }}
            title="移除高亮"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              background: '#fff',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#ef4444',
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export const ToolbarButtons: React.FC<ToolbarButtonsProps> = ({ editor }) => {
  return (
    <>
      {/* 文本格式 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={<Bold className="w-4 h-4" />}
        title="加粗 (Ctrl+B)"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={<Italic className="w-4 h-4" />}
        title="斜体 (Ctrl+I)"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        icon={<Underline className="w-4 h-4" />}
        title="下划线 (Ctrl+U)"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={<Strikethrough className="w-4 h-4" />}
        title="删除线 (Ctrl+Shift+X)"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        icon={<Code className="w-4 h-4" />}
        title="内联代码"
      />

      {/* 分隔线 */}
      <div style={{ width: '1px', height: '20px', background: '#e5e7eb', margin: '0 4px' }} />

      {/* 高亮 */}
      <HighlightColorPicker editor={editor} />

      {/* 分隔线 */}
      <div style={{ width: '1px', height: '20px', background: '#e5e7eb', margin: '0 4px' }} />

      {/* 标题 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        icon={<Heading1 className="w-4 h-4" />}
        title="标题 1"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        icon={<Heading2 className="w-4 h-4" />}
        title="标题 2"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        icon={<Heading3 className="w-4 h-4" />}
        title="标题 3"
      />

      {/* 分隔线 */}
      <div style={{ width: '1px', height: '20px', background: '#e5e7eb', margin: '0 4px' }} />

      {/* 列表 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={<List className="w-4 h-4" />}
        title="无序列表"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={<ListOrdered className="w-4 h-4" />}
        title="有序列表"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon={<Quote className="w-4 h-4" />}
        title="引用块"
      />

      {/* 分隔线 */}
      <div style={{ width: '1px', height: '20px', background: '#e5e7eb', margin: '0 4px' }} />

      {/* Mermaid 图表 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setMermaid().run()}
        isActive={editor.isActive('mermaid')}
        icon={<Workflow className="w-4 h-4" />}
        title="插入 Mermaid 图表"
      />

      {/* 分隔线 */}
      <div style={{ width: '1px', height: '20px', background: '#e5e7eb', margin: '0 4px' }} />

      {/* 文本对齐 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        icon={<AlignLeft className="w-4 h-4" />}
        title="左对齐"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        icon={<AlignCenter className="w-4 h-4" />}
        title="居中对齐"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        icon={<AlignRight className="w-4 h-4" />}
        title="右对齐"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        isActive={editor.isActive({ textAlign: 'justify' })}
        icon={<AlignJustify className="w-4 h-4" />}
        title="两端对齐"
      />
    </>
  );
};
