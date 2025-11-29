import React, { useState, useRef, useEffect } from 'react';
import { NodeViewProps } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash, Maximize2 } from 'lucide-react';

/**
 * 图片块 NodeView
 * 
 * 设计规范：
 * - 外边距: margin: 16px 0
 * - 图片圆角: border-radius: 8px
 * - 图片阴影: box-shadow: 0 4px 6px rgba(0,0,0,0.1)
 * - 最大宽度: max-width: 100%
 * - 手柄大小: 8px × 8px
 * - 手柄颜色: #0066FF
 * - 标题边距: margin-top: 8px
 * - 标题对齐: text-align: center
 */
export const ImageNodeView: React.FC<NodeViewProps> = ({ node, updateAttributes, deleteNode }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: node.attrs.width || 600,
    height: node.attrs.height || 400
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 加载图片时获取真实尺寸
  useEffect(() => {
    if (imageRef.current && !node.attrs.width) {
      const img = imageRef.current;
      img.onload = () => {
        const newWidth = Math.min(img.naturalWidth, 800);
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        const newHeight = newWidth * aspectRatio;
        setDimensions({ width: newWidth, height: newHeight });
        updateAttributes({ width: newWidth, height: newHeight });
      };
    }
  }, [node.attrs.src]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = dimensions.width;
    const aspectRatio = dimensions.height / dimensions.width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(200, Math.min(startWidth + delta, 1200));
      const newHeight = newWidth * aspectRatio;
      
      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      updateAttributes({ 
        width: dimensions.width, 
        height: dimensions.height 
      });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = node.attrs.src;
    link.download = 'image.jpg';
    link.click();
  };

  return (
    <div 
      ref={containerRef}
      className="kanso-image-block"
      style={{
        margin: '16px 0',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 图片容器 */}
      <div 
        className="kanso-image-container"
        style={{
          position: 'relative',
          display: 'inline-block',
          maxWidth: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          cursor: isResizing ? 'ew-resize' : 'default'
        }}
      >
        <img
          ref={imageRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          style={{
            width: dimensions.width,
            height: dimensions.height,
            display: 'block',
            maxWidth: '100%',
            objectFit: 'cover'
          }}
        />

        {/* 悬停蒙层 */}
        <AnimatePresence>
          {isHovered && !isResizing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {/* 下载按钮 */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={downloadImage}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  background: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Download className="w-5 h-5 text-gray-700" />
              </motion.button>

              {/* 全屏按钮 */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => window.open(node.attrs.src, '_blank')}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  background: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Maximize2 className="w-5 h-5 text-gray-700" />
              </motion.button>

              {/* 删除按钮 */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={deleteNode}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  background: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Trash className="w-5 h-5 text-red-500" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 调整大小手柄 */}
        {isHovered && (
          <>
            {/* 右下角手柄 */}
            <div
              className="kanso-resize-handle"
              onMouseDown={handleMouseDown}
              style={{
                position: 'absolute',
                right: -4,
                bottom: -4,
                width: '8px',
                height: '8px',
                background: '#0066FF',
                borderRadius: '50%',
                cursor: 'nwse-resize',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                zIndex: 10
              }}
            />
          </>
        )}
      </div>

      {/* 图片标题 */}
      <input
        type="text"
        value={node.attrs.caption || ''}
        onChange={(e) => updateAttributes({ caption: e.target.value })}
        placeholder="添加图片描述..."
        style={{
          display: 'block',
          width: '100%',
          maxWidth: dimensions.width,
          marginTop: '8px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#6B7280',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          padding: '4px 8px'
        }}
      />
    </div>
  );
};
