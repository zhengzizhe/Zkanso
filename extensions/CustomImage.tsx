import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React, { useState, useCallback } from 'react';
import { Trash2, Download, AlignLeft, AlignCenter, AlignRight, Maximize2 } from 'lucide-react';

// 图片卡片组件 - 飞书/Craft 风格
const ImageCard = ({ node, updateAttributes, deleteNode, selected }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState<number>(node.attrs.width || 100);
  const imageRef = React.useRef<HTMLDivElement>(null);
  const { src, alt = '', title = '', align = 'center', width = 100 } = node.attrs;

  // 处理拖拽调整大小
  const handleMouseDown = useCallback((e: React.MouseEvent, direction: 'left' | 'right') => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startWidth = imageRef.current?.offsetWidth || 0;
    const containerWidth = imageRef.current?.parentElement?.offsetWidth || 800;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = direction === 'right' 
        ? moveEvent.clientX - startX 
        : startX - moveEvent.clientX;
      
      const newWidth = Math.max(200, Math.min(containerWidth, startWidth + delta));
      const widthPercent = Math.round((newWidth / containerWidth) * 100);
      setCurrentWidth(widthPercent);
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      if (updateAttributes) {
        updateAttributes({ width: currentWidth });
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [updateAttributes, currentWidth]);

  const handleDelete = useCallback(() => {
    if (deleteNode) deleteNode();
  }, [deleteNode]);

  const handleAlignChange = useCallback((newAlign: string) => {
    if (updateAttributes) updateAttributes({ align: newAlign });
  }, [updateAttributes]);

  const displayWidth = isResizing ? currentWidth : width;

  return (
    <NodeViewWrapper 
      className={`image-block-card ${align === 'center' ? 'mx-auto' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: `${displayWidth}%`,
        maxWidth: '100%',
        margin: align === 'center' ? '1.5em auto' : '1.5em 0',
      }}
    >
      <div 
        ref={imageRef}
        className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* 左侧调整手柄 */}
        {(isHovered || isResizing) && (
          <div
            onMouseDown={(e) => handleMouseDown(e, 'left')}
            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-indigo-500 transition-colors z-20"
            style={{ background: isResizing ? '#6366f1' : 'transparent' }}
          />
        )}
        
        {/* 右侧调整手柄 */}
        {(isHovered || isResizing) && (
          <div
            onMouseDown={(e) => handleMouseDown(e, 'right')}
            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-indigo-500 transition-colors z-20"
            style={{ background: isResizing ? '#6366f1' : 'transparent' }}
          />
        )}
        {/* 工具栏 */}
        {isHovered && !isResizing && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-1">
            {/* 宽度显示 */}
            <span className="px-2 text-xs text-gray-500 dark:text-gray-400">
              {displayWidth}%
            </span>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button
              onClick={() => handleAlignChange('left')}
              className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${align === 'left' ? 'bg-gray-100' : ''}`}
              title="左对齐"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleAlignChange('center')}
              className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${align === 'center' ? 'bg-gray-100' : ''}`}
              title="居中"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleAlignChange('right')}
              className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${align === 'right' ? 'bg-gray-100' : ''}`}
              title="右对齐"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button
              onClick={handleDelete}
              className="p-1.5 rounded hover:bg-red-100 transition-colors"
              title="删除"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
            </button>
          </div>
        )}

        {/* 图片 */}
        <img
          src={src}
          alt={alt}
          title={title}
          className="w-full h-auto block"
        />

        {/* 标题 */}
        {title && (
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {title}
            </p>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

// 自定义图片节点
export const CustomImage = Node.create({
  name: 'customImage',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute('src'),
        renderHTML: (attributes) => {
          if (!attributes.src) return {};
          return { src: attributes.src };
        },
      },
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute('alt'),
        renderHTML: (attributes) => {
          if (!attributes.alt) return {};
          return { alt: attributes.alt };
        },
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute('title'),
        renderHTML: (attributes) => {
          if (!attributes.title) return {};
          return { title: attributes.title };
        },
      },
      align: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-align') || 'center',
        renderHTML: (attributes) => {
          return { 'data-align': attributes.align };
        },
      },
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-width'),
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { 'data-width': attributes.width };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
      {
        tag: 'div[data-type="custom-image"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'custom-image' }), ['img', HTMLAttributes]];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageCard);
  },
});

export default CustomImage;
