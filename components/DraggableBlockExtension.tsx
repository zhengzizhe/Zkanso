import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Plus } from 'lucide-react';

// 块组件 - Craft 风格
const BlockComponent = ({ node, editor, getPos, updateAttributes, deleteNode, selected }: any) => {
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 监听编辑器选区变化
  useEffect(() => {
    const updateFocus = () => {
      const pos = getPos();
      if (typeof pos === 'number') {
        const { from, to } = editor.state.selection;
        // 检查选区是否在当前节点内
        const nodeStart = pos;
        const nodeEnd = pos + node.nodeSize;
        const isInNode = from >= nodeStart && to <= nodeEnd;
        setIsFocused(isInNode && editor.isFocused);
      }
    };

    updateFocus();
    editor.on('selectionUpdate', updateFocus);
    editor.on('focus', updateFocus);
    editor.on('blur', updateFocus);

    return () => {
      editor.off('selectionUpdate', updateFocus);
      editor.off('focus', updateFocus);
      editor.off('blur', updateFocus);
    };
  }, [editor, getPos, node.nodeSize]);

  const handleDragStart = (e: React.DragEvent) => {
    if (!dragHandleRef.current?.contains(e.target as Node)) {
      e.preventDefault();
      return;
    }
    
    setIsDragging(true);
    
    const pos = getPos();
    const { view } = editor;
    const { from, to } = { from: pos, to: pos + node.nodeSize };
    
    // 设置拖拽数据
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', editor.view.dom.innerHTML);
    
    // 在编辑器中选中该节点
    view.dispatch(view.state.tr.setSelection(
      view.state.selection.constructor.create(view.state.doc, from, to)
    ));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('block-content') || target.classList.contains('ProseMirror')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        // 选中整个段落
        editor.chain()
          .focus()
          .setTextSelection({
            from: pos,
            to: pos + node.nodeSize
          })
          .run();
      }
    }
  };

  return (
    <NodeViewWrapper 
      className={`block-wrapper ${isDragging ? 'is-dragging' : ''} ${isFocused ? 'is-focused' : ''}`}
      ref={wrapperRef}
      draggable="true"
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseLeave={() => setShowPlusMenu(false)}
      style={{
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isDragging ? 'scale(1.01)' : 'scale(1)',
        opacity: isDragging ? 0.5 : 1,
        whiteSpace: 'normal',
      }}
    >
      <div className="group relative">
        {/* 左侧工具栏 - 只在 hover 时显示 */}
        <div className="drag-handle-area absolute left-0 top-1/2 -translate-y-1/2 -ml-10 flex items-center gap-0.5">
          {/* + 按钮 */}
          <button
            onClick={() => setShowPlusMenu(!showPlusMenu)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          
          {/* 拖拽手柄 */}
          <div
            ref={dragHandleRef}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            contentEditable={false}
            data-drag-handle
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 块内容 */}
        <div className="block-content">
          <NodeViewContent />
        </div>

        {/* Plus 菜单 */}
        {showPlusMenu && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[200px]"
          >
            {[
              { label: '文本', cmd: () => editor.chain().focus().setParagraph().run() },
              { label: '标题 1', cmd: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
              { label: '标题 2', cmd: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
              { label: '标题 3', cmd: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
              { label: '列表', cmd: () => editor.chain().focus().toggleBulletList().run() },
              { label: '有序列表', cmd: () => editor.chain().focus().toggleOrderedList().run() },
              { label: '引用', cmd: () => editor.chain().focus().toggleBlockquote().run() },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.cmd();
                  setShowPlusMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

// 段落节点
export const DraggableParagraph = Node.create({
  name: 'paragraph',
  priority: 1000,
  group: 'block',
  content: 'inline*',
  draggable: true,

  parseHTML() {
    return [{ tag: 'p' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BlockComponent);
  },
});

// 标题节点
export const DraggableHeading = Node.create({
  name: 'heading',
  priority: 1000,
  group: 'block',
  content: 'inline*',
  draggable: true,

  addAttributes() {
    return {
      level: {
        default: 1,
      },
    };
  },

  parseHTML() {
    return [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [`h${node.attrs.level}`, mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BlockComponent);
  },
});

// 导出块扩展
export const DraggableBlock = [
  DraggableParagraph,
  DraggableHeading,
];
