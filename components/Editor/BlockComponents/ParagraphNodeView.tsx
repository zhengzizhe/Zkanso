import React, { useState } from 'react';
import { NodeViewProps, NodeViewContent, NodeViewWrapper } from '@tiptap/react';

/**
 * 段落 NodeView - 带飞书风格手柄的容器包装
 */
export const ParagraphNodeView: React.FC<NodeViewProps> = ({ 
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
        margin: '2px 0',
        minHeight: '28px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 飞书风格手柄容器 */}
      <div 
        className="block-handle"
        draggable="true"
        data-drag-handle
        onDragStart={(e) => {
          e.stopPropagation();
        }}
        style={{
          position: 'absolute',
          left: '-24px',
          top: '4px',
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
          T
        </div>
      </div>

      {/* 段落内容 */}
      <NodeViewContent
        as="p"
        style={{
          flex: 1,
          minHeight: '24px',
          lineHeight: 1.6,
          fontSize: '16px',
          color: '#1F2937',
          outline: 'none',
          cursor: 'text',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          margin: 0,
          padding: '2px 4px',
        }}
      />
    </NodeViewWrapper>
  );
};
