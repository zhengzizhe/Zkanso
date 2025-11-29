import React, { useState, useCallback } from 'react';
import { NodeViewProps, NodeViewContent } from '@tiptap/react';
import { BlockWrapper } from './BlockWrapper';
import { Quote } from 'lucide-react';
import { FeishuBlockHandle } from './FeishuBlockHandle';
import { useDragController } from './DragController';

/**
 * 引用块 NodeView
 * 
 * 设计规范：
 * - 外边距: margin: 12px 0
 * - 内边距: padding: 12px 16px
 * - 左边框: border-left: 4px solid #0066FF
 * - 背景色: background: #F9FAFB
 * - 圆角: border-radius: 4px
 * - 字体样式: font-style: italic
 * - 行高: line-height: 1.75
 */
export const QuoteNodeView: React.FC<NodeViewProps> = ({ node, editor, getPos }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragController = useDragController(editor);

  const handleDragStart = useCallback((event: React.DragEvent<HTMLElement>) => {
    const pos = getPos();
    if (typeof pos !== 'number') return;
    setIsDragging(true);
    dragController.handleDragStart(event, pos);
  }, [getPos, dragController]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    dragController.handleDragEnd();
  }, [dragController]);
  return (
    <div
      style={{ position: 'relative', margin: '12px 0' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 飞书风格手柄 */}
      <FeishuBlockHandle
        isHovered={isHovered}
        isDragging={isDragging}
        blockType="quote"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />

      <blockquote 
        className="kanso-quote"
        style={{
          margin: 0,
          padding: '12px 16px',
          borderLeft: '4px solid #0066FF',
          backgroundColor: '#F9FAFB',
          borderRadius: '4px',
          color: '#374151',
          lineHeight: 1.75,
          position: 'relative'
        }}
      >
        {/* 内容 */}
        <NodeViewContent 
          style={{
            fontStyle: 'italic',
            outline: 'none'
          }}
        />
      </blockquote>
    </div>
  );
};
