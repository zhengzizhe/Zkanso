import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeishuBlockHandleProps {
  isHovered: boolean;
  isDragging?: boolean;
  blockType: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'quote' | 'bulletList' | 'orderedList' | 'taskList' | 'codeBlock' | 'image';
  onDragStart?: (event: React.DragEvent<HTMLElement>) => void;
  onDragEnd?: () => void;
  onClick?: () => void;
  showMenu?: boolean;
}

/**
 * 飞书风格的块级操作手柄
 * 包含：6个点的拖拽手柄 + 块类型图标
 * 
 * 设计规范：
 * - 6个点：2列3行，每个点4px
 * - 块图标：20x20px，显示块类型
 * - 悬停时显示，平时只显示淡化的块图标
 */
export const FeishuBlockHandle: React.FC<FeishuBlockHandleProps> = ({
  isHovered,
  isDragging = false,
  blockType,
  onDragStart,
  onDragEnd,
  onClick,
  showMenu = false
}) => {
  // 块类型配置
  const blockConfig = {
    paragraph: { icon: 'T', color: '#6B7280', label: '正文' },
    heading1: { icon: 'H1', color: '#2563EB', label: '标题 1' },
    heading2: { icon: 'H2', color: '#7C3AED', label: '标题 2' },
    heading3: { icon: 'H3', color: '#10B981', label: '标题 3' },
    quote: { icon: '"', color: '#9333EA', label: '引用' },
    bulletList: { icon: '•', color: '#7C3AED', label: '列表' },
    orderedList: { icon: '1.', color: '#DC2626', label: '有序列表' },
    taskList: { icon: '✓', color: '#059669', label: '任务' },
    codeBlock: { icon: '</>', color: '#0891B2', label: '代码' },
    image: { icon: '📷', color: '#EA580C', label: '图片' }
  };

  const config = blockConfig[blockType];

  return (
    <div
      className="feishu-block-handle"
      style={{
        position: 'absolute',
        left: '-56px',
        top: '2px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        height: '24px',
        zIndex: 10
      }}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {/* 6个点拖拽手柄 - 飞书风格 */}
            <motion.div
              className="six-dots-handle"
              draggable
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '20px',
                height: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 4px)',
                gridTemplateRows: 'repeat(3, 4px)',
                gap: '2px',
                padding: '4px',
                borderRadius: '4px',
                cursor: isDragging ? 'grabbing' : 'grab',
                transition: 'background 150ms'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {/* 渲染6个点（2列3行） */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: '#9CA3AF',
                    transition: 'background-color 150ms'
                  }}
                />
              ))}
            </motion.div>

            {/* 块类型图标 */}
            <motion.div
              className="block-type-icon"
              whileHover={{ scale: 1.05 }}
              onClick={onClick}
              title={config.label}
              style={{
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                background: showMenu ? `${config.color}15` : 'rgba(0, 0, 0, 0.04)',
                color: config.color,
                fontSize: blockType.startsWith('heading') ? '10px' : '12px',
                fontWeight: 600,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 150ms',
                fontFamily: blockType === 'quote' ? 'serif' : 'ui-sans-serif, system-ui, sans-serif'
              }}
            >
              {config.icon}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 非悬停状态：仅显示淡化的块类型图标 */}
      {!isHovered && (
        <div
          className="block-type-icon-static"
          title={config.label}
          style={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            background: 'transparent',
            color: '#D1D5DB',
            fontSize: blockType.startsWith('heading') ? '10px' : '12px',
            fontWeight: 600,
            transition: 'all 150ms',
            fontFamily: blockType === 'quote' ? 'serif' : 'ui-sans-serif, system-ui, sans-serif'
          }}
        >
          {config.icon}
        </div>
      )}
    </div>
  );
};
