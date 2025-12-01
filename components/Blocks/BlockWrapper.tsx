import React, { useState } from 'react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';

interface BlockWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showHandle?: boolean;
  onDragStart?: () => void;
}

/**
 * 通用块级包装器组件
 * 提供拖拽手柄、悬停效果等通用功能
 */
export const BlockWrapper: React.FC<BlockWrapperProps> = ({
  children,
  className = '',
  style = {},
  showHandle = true,
  onDragStart
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NodeViewWrapper
      className={`kanso-block-wrapper ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        margin: '4px 0',
        transition: 'background-color 150ms ease',
        ...style
      }}
    >
      {/* 拖拽手柄 */}
      {showHandle && isHovered && (
        <motion.div
          className="kanso-drag-handle"
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.15 }}
          draggable
          onDragStart={onDragStart}
          style={{
            position: 'absolute',
            left: '-24px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'grab',
            padding: '4px',
            borderRadius: '4px',
            transition: 'background-color 150ms ease'
          }}
          whileHover={{
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
          }}
          whileTap={{
            cursor: 'grabbing',
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
          }}
        >
          <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        </motion.div>
      )}

      {/* 内容 */}
      {children}
    </NodeViewWrapper>
  );
};
