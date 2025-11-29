import React from 'react';
import { Editor } from '@tiptap/react';
import { FloatingToolbar as ToolbarContainer } from './FloatingToolbar';
import { TextFormatGroup } from './TextFormatGroup';
import { ColorPicker } from './ColorPicker';
import { LinkEditor } from './LinkEditor';
import { ToolbarDivider } from './ToolbarDivider';
import { ToolbarButton } from './ToolbarButton';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react';

interface FloatingToolbarProps {
  editor: Editor | null;
  theme?: 'feishu' | 'craft';
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ editor, theme = 'feishu' }) => {
  if (!editor) return null;

  return (
    <ToolbarContainer editor={editor} theme={theme}>
      {/* 文字格式组 */}
      <TextFormatGroup editor={editor} theme={theme} />

      {/* 颜色选择器 */}
      <ColorPicker editor={editor} theme={theme} />
      
      <ToolbarDivider theme={theme} />

      {/* 链接编辑器 */}
      <LinkEditor editor={editor} theme={theme} />
      
      <ToolbarDivider theme={theme} />

      {/* 标题快捷按钮 */}
      <ToolbarButton
        icon={<Heading1 size={16} strokeWidth={2.5} />}
        label="一级标题"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        theme={theme}
        shortcut="⌃1"
      />
      
      <ToolbarButton
        icon={<Heading2 size={16} strokeWidth={2.5} />}
        label="二级标题"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        theme={theme}
        shortcut="⌃2"
      />
      
      <ToolbarButton
        icon={<Heading3 size={16} strokeWidth={2.5} />}
        label="三级标题"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        theme={theme}
        shortcut="⌃3"
      />
      
      <ToolbarDivider theme={theme} />

      {/* 列表按钮 */}
      <ToolbarButton
        icon={<List size={16} strokeWidth={2.5} />}
        label="无序列表"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        theme={theme}
      />
      
      <ToolbarButton
        icon={<ListOrdered size={16} strokeWidth={2.5} />}
        label="有序列表"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        theme={theme}
      />
      
      <ToolbarButton
        icon={<Quote size={16} strokeWidth={2.5} />}
        label="引用"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        theme={theme}
      />
    </ToolbarContainer>
  );
};

// 导出子组件供外部使用
export { ToolbarButton } from './ToolbarButton';
export { ToolbarDivider } from './ToolbarDivider';
export { TextFormatGroup } from './TextFormatGroup';
export { ColorPicker } from './ColorPicker';
export { LinkEditor } from './LinkEditor';
