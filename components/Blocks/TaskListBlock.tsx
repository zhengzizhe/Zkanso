import React from 'react';
import { NodeViewProps, NodeViewContent } from '@tiptap/react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * 任务列表项 NodeView
 * 
 * 设计规范：
 * - 复选框大小: 18px × 18px
 * - 复选框圆角: border-radius: 4px
 * - 复选框边框: 2px solid #D1D5DB
 * - 勾选颜色: background: #0066FF
 * - 文本删除线: text-decoration: line-through (已完成)
 * - 复选框与文本间距: 8px
 */
export const TaskItemNodeView: React.FC<NodeViewProps> = ({ node, updateAttributes }) => {
  const checked = node.attrs.checked || false;

  return (
    <li 
      className="kanso-task-item" 
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        padding: '4px 0',
        gap: '8px',
        listStyle: 'none'
      }}
    >
      {/* 自定义复选框 */}
      <motion.button
        className="kanso-checkbox"
        onClick={() => updateAttributes({ checked: !checked })}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '4px',
          border: checked ? 'none' : '2px solid #D1D5DB',
          backgroundColor: checked ? '#0066FF' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
          cursor: 'pointer',
          transition: 'all 200ms ease'
        }}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </motion.button>

      {/* 文本内容 */}
      <NodeViewContent 
        className="kanso-task-content"
        style={{
          flex: 1,
          textDecoration: checked ? 'line-through' : 'none',
          color: checked ? '#9CA3AF' : '#1F2937',
          transition: 'all 200ms ease',
          outline: 'none'
        }}
      />
    </li>
  );
};
