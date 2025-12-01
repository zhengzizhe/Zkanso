import React, { useState } from 'react';
import { NodeViewProps, NodeViewContent, NodeViewWrapper } from '@tiptap/react';

/**
 * 引用块 NodeView - 带飞书风格手柄的容器包装
 */
export const QuoteNodeView: React.FC<NodeViewProps> = ({ 
  node, 
  editor,
  getPos 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NodeViewWrapper
      className="block-wrapper"
      style={{ 
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        margin: '12px 0',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 飞书风格手柄容器 */}
      <div 
        className="block-handle"
        draggable="true"
        data-drag-handle
        onDragStart={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          left: '-24px',
          top: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          opacity: isHovered ? 0.6 : 0,
          transition: 'opacity 150ms ease',
          cursor: 'grab',
        }}
      >
        {/* 6个点 */}
        <div
          style={{
            width: '12px',
            height: '12px',
            backgroundImage: 'radial-gradient(circle, #9CA3AF 1.5px, transparent 1.5px)',
            backgroundSize: '6px 6px',
            backgroundPosition: '0 0, 6px 0, 0 6px, 6px 6px',
          }}
        />
        {/* 块类型图标 */}
        <div
          style={{
            fontSize: '10px',
            fontWeight: 600,
            color: '#9CA3AF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            opacity: 0.5,
          }}
        >
          “
        </div>
      </div>

      {/* 引用块内容 */}
      <NodeViewContent
        as="blockquote"
        style={{
          flex: 1,
          margin: 0,
          padding: '12px 16px',
          borderLeft: '4px solid #6366F1',
          backgroundColor: '#F9FAFB',
          borderRadius: '6px',
          color: '#374151',
          lineHeight: 1.75,
          fontStyle: 'italic',
          outline: 'none',
        }}
      />
    </NodeViewWrapper>
  );
};
