import React, { useState } from 'react';
import { Editor } from '@tiptap/core';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GripVertical, 
  Type, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

interface BlockTypeIndicatorProps {
  editor: Editor;
  getPos: () => number | undefined;
  node: any;
}

/**
 * 飞书风格的块类型指示器
 * 显示当前块的类型图标 + 6个点的拖拽手柄
 */
export const BlockTypeIndicator: React.FC<BlockTypeIndicatorProps> = ({
  editor,
  getPos,
  node
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // 获取当前块类型
  const getBlockType = () => {
    const type = node.type.name;
    const attrs = node.attrs;

    switch (type) {
      case 'heading':
        return {
          icon: attrs.level === 1 ? Heading1 : attrs.level === 2 ? Heading2 : Heading3,
          label: `标题 ${attrs.level}`,
          color: '#2563EB' // 蓝色
        };
      case 'bulletList':
        return {
          icon: List,
          label: '无序列表',
          color: '#7C3AED' // 紫色
        };
      case 'orderedList':
        return {
          icon: ListOrdered,
          label: '有序列表',
          color: '#DC2626' // 红色
        };
      case 'taskList':
      case 'taskItem':
        return {
          icon: CheckSquare,
          label: '任务列表',
          color: '#059669' // 绿色
        };
      case 'blockquote':
        return {
          icon: Quote,
          label: '引用',
          color: '#9333EA' // 紫色
        };
      case 'codeBlock':
        return {
          icon: Code,
          label: '代码块',
          color: '#0891B2' // 青色
        };
      case 'image':
        return {
          icon: ImageIcon,
          label: '图片',
          color: '#EA580C' // 橙色
        };
      case 'callout':
        return {
          icon: AlertCircle,
          label: '提示块',
          color: '#D97706' // 黄色
        };
      default:
        return {
          icon: Type,
          label: '正文',
          color: '#6B7280' // 灰色
        };
    }
  };

  const blockInfo = getBlockType();
  const Icon = blockInfo.icon;

  return (
    <div
      className="block-type-indicator"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: '-56px',
        top: '2px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        height: '24px',
        userSelect: 'none'
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
              gap: '2px'
            }}
          >
            {/* 6个点拖拽手柄 */}
            <button
              className="drag-handle"
              contentEditable={false}
              draggable
              data-drag-handle
              title="拖拽移动"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                padding: 0,
                border: 'none',
                background: 'transparent',
                borderRadius: '4px',
                cursor: 'grab',
                color: '#9CA3AF',
                transition: 'all 150ms'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.color = '#4B5563';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#9CA3AF';
              }}
            >
              <GripVertical className="w-3.5 h-3.5" />
            </button>

            {/* 块类型图标 */}
            <div
              className="block-type-icon"
              title={blockInfo.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                background: 'rgba(0, 0, 0, 0.04)',
                color: blockInfo.color,
                transition: 'all 150ms'
              }}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 非悬停状态：仅显示块类型图标 */}
      {!isHovered && (
        <div
          className="block-type-icon-static"
          title={blockInfo.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            background: 'transparent',
            color: '#D1D5DB',
            transition: 'all 150ms'
          }}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
};
