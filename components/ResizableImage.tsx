import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const ResizableImageComponent = ({ node, updateAttributes, selected }: any) => {
  const { src, alt, width, height } = node.attrs;
  const [isResizing, setIsResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(width || 'auto');
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = imageRef.current?.offsetWidth || 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = direction === 'right' 
        ? moveEvent.clientX - startXRef.current
        : startXRef.current - moveEvent.clientX;
      
      const newWidth = Math.max(100, Math.min(800, startWidthRef.current + delta * 2));
      setCurrentWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      updateAttributes({ width: currentWidth });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <NodeViewWrapper className="relative inline-block my-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`relative inline-block group ${
          selected || isHovered ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 ring-offset-2 dark:ring-offset-gray-900 rounded-xl' : ''
        }`}
        style={{ width: currentWidth !== 'auto' ? currentWidth : undefined }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt || ''}
          className="rounded-xl max-w-full h-auto shadow-lg hover:shadow-2xl transition-all duration-300"
          style={{ width: currentWidth !== 'auto' ? '100%' : undefined }}
          draggable="false"
        />
        
        {/* 调整大小手柄 - 增强视觉反馈 */}
        {(selected || isHovered) && (
          <>
            {/* 左侧手柄 */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onMouseDown={(e) => handleMouseDown(e, 'left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-4 h-16 bg-indigo-600 rounded-full cursor-ew-resize transition-all shadow-lg hover:scale-110 hover:bg-indigo-500"
              style={{ zIndex: 10 }}
            />
            
            {/* 右侧手柄 */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onMouseDown={(e) => handleMouseDown(e, 'right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-4 h-16 bg-indigo-600 rounded-full cursor-ew-resize transition-all shadow-lg hover:scale-110 hover:bg-indigo-500"
              style={{ zIndex: 10 }}
            />
            
            {/* 宽度提示 */}
            {isResizing && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-10 px-3 py-1.5 bg-gray-900 text-white text-xs font-mono rounded-lg shadow-xl"
              >
                {Math.round(typeof currentWidth === 'number' ? currentWidth : imageRef.current?.offsetWidth || 0)}px
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </NodeViewWrapper>
  );
};

export const ResizableImage = Node.create({
  name: 'image',
  group: 'block',  // 图片作为块
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      width: {
        default: 'auto',
      },
      height: {
        default: 'auto',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});
