import React, { useState } from 'react';
import { NodeViewProps, NodeViewContent, NodeViewWrapper } from '@tiptap/react';

/**
 * 标题 NodeView - 带飞书风格手柄的容器包装
 */
export const HeadingNodeView: React.FC<NodeViewProps> = ({ 
  node, 
  editor,
  getPos 
}) => {
  const level = node.attrs.level as 1 | 2 | 3;
  const [isHovered, setIsHovered] = useState(false);

  const levelConfig = {
    1: { label: 'H1', fontSize: '30px', fontWeight: 700 },
    2: { label: 'H2', fontSize: '24px', fontWeight: 600 },
    3: { label: 'H3', fontSize: '20px', fontWeight: 600 },
  };

  const config = levelConfig[level];

  return (
    <NodeViewWrapper
      className="block-wrapper"
      style={{ 
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        margin: 0,
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
          top: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          opacity: isHovered ? 0.6 : 0,
          transition: 'opacity 150ms ease',
          cursor: 'grab',
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            backgroundImage: 'radial-gradient(circle, #9CA3AF 1.5px, transparent 1.5px)',
            backgroundSize: '6px 6px',
            backgroundPosition: '0 0, 6px 0, 0 6px, 6px 6px',
          }}
        />
        <div
          style={{
            fontSize: '9px',
            fontWeight: 600,
            color: '#9CA3AF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            opacity: 0.5,
          }}
        >
          {config.label}
        </div>
      </div>

      {/* 标题内容 */}
      <NodeViewContent
        as={`h${level}` as any}
        style={{
          flex: 1,
          fontSize: config.fontSize,
          fontWeight: config.fontWeight,
          lineHeight: 1.25,
          color: '#1F2937',
          outline: 'none',
          margin: 0,
          padding: '4px 8px',
        }}
      />
    </NodeViewWrapper>
  );
};
