import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

// 折叠块组件 - 飞书风格
const DetailsBlock = ({ node, updateAttributes }: any) => {
  const { open = false, summary = '点击展开' } = node.attrs;
  const [isOpen, setIsOpen] = useState(open);

  const toggleOpen = () => {
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    if (updateAttributes) {
      updateAttributes({ open: newOpen });
    }
  };

  return (
    <NodeViewWrapper className="details-wrapper">
      <div className="details-block bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden my-4">
        {/* 折叠标题 - 可点击 */}
        <div
          onClick={toggleOpen}
          className="details-summary flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors select-none bg-white dark:bg-gray-800"
        >
          <ChevronRight 
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          />
          <span className="flex-1 font-medium text-gray-700 dark:text-gray-300">
            {summary}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {isOpen ? '收起' : '展开'}
          </span>
        </div>

        {/* 折叠内容 - 带动画 */}
        <div 
          className={`details-content transition-all duration-200 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <NodeViewContent className="details-content-inner" />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

// 自定义 Details 节点
export const CustomDetails = Node.create({
  name: 'customDetails',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      open: {
        default: false,
        parseHTML: (element) => element.hasAttribute('open'),
        renderHTML: (attributes) => {
          if (!attributes.open) return {};
          return { open: '' };
        },
      },
      summary: {
        default: '点击展开',
        parseHTML: (element) => {
          const summary = element.querySelector('summary');
          return summary?.textContent || '点击展开';
        },
        renderHTML: (attributes) => {
          return { 'data-summary': attributes.summary };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'details',
      },
      {
        tag: 'div[data-type="custom-details"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'custom-details', class: 'custom-details' }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DetailsBlock);
  },
});

export default CustomDetails;
