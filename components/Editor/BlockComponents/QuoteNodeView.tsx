import React, { useState } from 'react';
import { NodeViewProps, NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { motion } from 'framer-motion';
import { FeishuBlockHandle } from '../../Blocks/FeishuBlockHandle';

/**
 * 引用块 NodeView - 使用 Tiptap 原生组件 + 官方拖拽 + 飞书风格手柄
 */
export const QuoteNodeView: React.FC<NodeViewProps> = ({ 
  node, 
  editor,
  getPos 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <NodeViewWrapper
      as={motion.div}
      layout
      data-drag-handle
      data-type="blockquote"
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 30,
        mass: 0.8
      }}
      style={{ position: 'relative', margin: '12px 0' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FeishuBlockHandle
        isHovered={isHovered}
        isDragging={isDragging}
        blockType="quote"
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      />

      {/* 引用块内容 */}
      <NodeViewContent
        as="blockquote"
        style={{
          margin: 0,
          padding: '12px 16px',
          borderLeft: '4px solid #0066FF',
          backgroundColor: '#F9FAFB',
          borderRadius: '4px',
          color: '#374151',
          lineHeight: 1.75,
          fontStyle: 'italic',
          outline: 'none'
        }}
      />
    </NodeViewWrapper>
  );
};
