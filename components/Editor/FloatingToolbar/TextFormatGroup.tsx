import React from 'react';
import { Editor } from '@tiptap/react';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarDivider } from './ToolbarDivider';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code 
} from 'lucide-react';

interface TextFormatGroupProps {
  editor: Editor;
  theme?: 'feishu' | 'craft';
}

export const TextFormatGroup: React.FC<TextFormatGroupProps> = ({ editor, theme = 'feishu' }) => {
  return (
    <>
      <ToolbarButton
        icon={<Bold size={16} strokeWidth={2.5} />}
        label="粗体"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        theme={theme}
        shortcut="⌘B"
      />
      
      <ToolbarButton
        icon={<Italic size={16} strokeWidth={2.5} />}
        label="斜体"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        theme={theme}
        shortcut="⌘I"
      />
      
      <ToolbarButton
        icon={<Underline size={16} strokeWidth={2.5} />}
        label="下划线"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        theme={theme}
        shortcut="⌘U"
      />
      
      <ToolbarButton
        icon={<Strikethrough size={16} strokeWidth={2.5} />}
        label="删除线"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        theme={theme}
        shortcut="⌘⇧X"
      />
      
      <ToolbarButton
        icon={<Code size={16} strokeWidth={2.5} />}
        label="行内代码"
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        theme={theme}
        shortcut="⌘E"
      />
      
      <ToolbarDivider theme={theme} />
    </>
  );
};
