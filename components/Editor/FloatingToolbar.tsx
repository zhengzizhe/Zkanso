import React, { useEffect, useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bold, Italic, Underline, Strikethrough, Code,
  Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Link as LinkIcon, MoreHorizontal
} from 'lucide-react';

interface FloatingToolbarProps {
  editor: Editor | null;
}

/**
 * Craft 风格悬浮工具栏
 * 
 * 设计规范：
 * - 高度: 42px
 * - 内边距: 6px
 * - 圆角: 8px
 * - 阴影: shadow-4 (层级 4)
 * - 动画: 150ms cubic-bezier
 */
export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ editor }) => {
  const [shouldShow, setShouldShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // 更新工具栏位置
  const updatePosition = useCallback(() => {
    if (!editor) return;

    const { selection } = editor.state;
    const { from, to, empty } = selection;

    // 没有选中文本时隐藏
    if (empty) {
      setShouldShow(false);
      return;
    }

    // 获取选中文本的DOM范围
    const { view } = editor;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);

    // 计算工具栏位置（选中文本上方居中）
    const centerX = (start.left + end.right) / 2;
    const toolbarWidth = 400; // 预估工具栏宽度
    
    setPosition({
      top: start.top - 50, // 工具栏高度 42px + 间距 8px
      left: Math.max(10, Math.min(centerX - toolbarWidth / 2, window.innerWidth - toolbarWidth - 10))
    });

    setShouldShow(true);
  }, [editor]);

  // 监听选择变化
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      updatePosition();
    };

    editor.on('selectionUpdate', handleUpdate);
    editor.on('update', handleUpdate);

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('update', handleUpdate);
    };
  }, [editor, updatePosition]);

  if (!editor) return null;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className="craft-floating-toolbar"
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ 
            duration: 0.15, 
            ease: [0.4, 0, 0.2, 1] 
          }}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            zIndex: 'var(--craft-z-popover)'
          }}
        >
          {/* 工具栏容器 */}
          <div className="craft-toolbar-container">
            {/* 文本格式组 */}
            <ToolbarButton
              isActive={editor.isActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
              icon={<Bold className="w-4 h-4" />}
              tooltip="粗体 (Cmd+B)"
            />
            <ToolbarButton
              isActive={editor.isActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              icon={<Italic className="w-4 h-4" />}
              tooltip="斜体 (Cmd+I)"
            />
            <ToolbarButton
              isActive={editor.isActive('underline')}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              icon={<Underline className="w-4 h-4" />}
              tooltip="下划线 (Cmd+U)"
            />
            <ToolbarButton
              isActive={editor.isActive('strike')}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              icon={<Strikethrough className="w-4 h-4" />}
              tooltip="删除线"
            />
            <ToolbarButton
              isActive={editor.isActive('code')}
              onClick={() => editor.chain().focus().toggleCode().run()}
              icon={<Code className="w-4 h-4" />}
              tooltip="行内代码"
            />

            {/* 分隔符 */}
            <div className="craft-toolbar-divider" />

            {/* 标题组 */}
            <ToolbarButton
              isActive={editor.isActive('heading', { level: 1 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              icon={<Heading1 className="w-4 h-4" />}
              tooltip="标题 1"
            />
            <ToolbarButton
              isActive={editor.isActive('heading', { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              icon={<Heading2 className="w-4 h-4" />}
              tooltip="标题 2"
            />
            <ToolbarButton
              isActive={editor.isActive('heading', { level: 3 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              icon={<Heading3 className="w-4 h-4" />}
              tooltip="标题 3"
            />

            {/* 分隔符 */}
            <div className="craft-toolbar-divider" />

            {/* 列表和引用组 */}
            <ToolbarButton
              isActive={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              icon={<List className="w-4 h-4" />}
              tooltip="无序列表"
            />
            <ToolbarButton
              isActive={editor.isActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              icon={<ListOrdered className="w-4 h-4" />}
              tooltip="有序列表"
            />
            <ToolbarButton
              isActive={editor.isActive('blockquote')}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              icon={<Quote className="w-4 h-4" />}
              tooltip="引用"
            />

            {/* 分隔符 */}
            <div className="craft-toolbar-divider" />

            {/* 链接按钮 */}
            <ToolbarButton
              isActive={editor.isActive('link')}
              onClick={() => {
                const url = window.prompt('输入链接地址:');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              icon={<LinkIcon className="w-4 h-4" />}
              tooltip="插入链接"
            />

            {/* 更多选项 */}
            <ToolbarButton
              onClick={() => {}}
              icon={<MoreHorizontal className="w-4 h-4" />}
              tooltip="更多选项"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * 工具栏按钮组件
 */
interface ToolbarButtonProps {
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  tooltip?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  isActive,
  onClick,
  tooltip
}) => {
  return (
    <motion.button
      className={`craft-toolbar-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={tooltip}
    >
      {icon}
    </motion.button>
  );
};
