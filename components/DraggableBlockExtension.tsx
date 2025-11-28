import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React, { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { GripVertical, Plus } from 'lucide-react';

// 块组件
const BlockComponent = ({ node, editor, getPos }: any) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dragControls = useDragControls();
  const isEmpty = !node.textContent?.trim();

  return (
    <NodeViewWrapper className="block-wrapper">
      <motion.div
        className="group relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setShowMenu(false);
        }}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
      >
        {/* 左侧工具栏 */}
        <div
          className={`absolute left-0 top-0 flex items-center gap-1 -ml-8 transition-opacity ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <div
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-grab active:cursor-grabbing text-gray-400"
            onPointerDown={(e) => {
              e.preventDefault();
              dragControls.start(e);
            }}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 块内容 */}
        <div className="block-content">
          <NodeViewContent />
        </div>

        {/* 插入菜单 */}
        {showMenu && (
          <div className="absolute left-0 top-full mt-1 z-50 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-1 min-w-[180px]">
            <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">插入块</div>
            <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
            {[
              { label: '段落', cmd: () => editor.chain().focus().setParagraph().run() },
              { label: '标题 1', cmd: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
              { label: '标题 2', cmd: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
              { label: '标题 3', cmd: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.cmd();
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </motion.div>
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

// 统一的块扩展（包含段落和标题）
export const DraggableBlock = [
  DraggableParagraph,
  DraggableHeading,
] as any;
