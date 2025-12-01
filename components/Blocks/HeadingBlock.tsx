import React, { useState, useCallback } from 'react';
import { NodeViewProps, NodeViewContent } from '@tiptap/react';
import { BlockWrapper } from './BlockWrapper';
import { Heading1, Heading2, Heading3 } from 'lucide-react';
import { FeishuBlockHandle } from './FeishuBlockHandle';
import { useDragController } from './DragController';

/**
 * 标题块 NodeView
 * 
 * H1 设计规范：
 * - 外边距: margin: 24px 0 8px
 * - 字号: font-size: 30px
 * - 字重: font-weight: 700
 * - 行高: line-height: 1.25
 * 
 * H2 设计规范：
 * - 外边距: margin: 16px 0 6px
 * - 字号: font-size: 24px
 * - 字重: font-weight: 600
 * 
 * H3 设计规范：
 * - 外边距: margin: 12px 0 4px
 * - 字号: font-size: 20px
 * - 字重: font-weight: 600
 */
export const HeadingNodeView: React.FC<NodeViewProps> = ({ node, editor, getPos }) => {
  const level = node.attrs.level as 1 | 2 | 3;
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

  const styles = {
    1: { 
      fontSize: '30px', 
      fontWeight: 700, 
      marginTop: '24px', 
      marginBottom: '8px', 
      padding: '4px 8px',
      color: '#1F2937'
    },
    2: { 
      fontSize: '24px', 
      fontWeight: 600, 
      marginTop: '16px', 
      marginBottom: '6px', 
      padding: '3px 6px',
      color: '#1F2937'
    },
    3: { 
      fontSize: '20px', 
      fontWeight: 600, 
      marginTop: '12px', 
      marginBottom: '4px', 
      padding: '2px 4px',
      color: '#374151'
    }
  };

  const icons = {
    1: <Heading1 className="w-6 h-6 text-blue-500" />,
    2: <Heading2 className="w-5 h-5 text-purple-500" />,
    3: <Heading3 className="w-4 h-4 text-green-500" />
  };

  return (
    <div
      style={{ position: 'relative', margin: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 飞书风格手柄 */}
      <FeishuBlockHandle
        isHovered={isHovered}
        isDragging={isDragging}
        blockType={`heading${level}` as 'heading1' | 'heading2' | 'heading3'}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />

      {/* 标题内容 */}
      <NodeViewContent
        as={`h${level}` as any}
        className={`kanso-heading-${level}`}
        style={{
          ...styles[level],
          lineHeight: 1.25,
          outline: 'none',
          position: 'relative'
        }}
      />
    </div>
  );
};
