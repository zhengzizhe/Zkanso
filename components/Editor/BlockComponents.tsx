import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GripVertical, Plus, MoreHorizontal,
  Type, Heading1, Image, Code, List, Quote
} from 'lucide-react';

/**
 * 标题块组件
 */
export const HeadingBlock: React.FC<any> = ({ node, updateAttributes }) => {
  const [isHovered, setIsHovered] = useState(false);
  const level = node.attrs.level || 1;

  return (
    <NodeViewWrapper 
      className={`craft-heading-block craft-heading-${level}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 左侧控制区域 */}
      <div className="craft-block-controls">
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="craft-block-controls-container"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15 }}
            >
              <button 
                className="craft-block-handle"
                contentEditable={false}
                draggable
                data-drag-handle
              >
                <GripVertical className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 内容区域 */}
      <NodeViewContent className="craft-block-content" />
    </NodeViewWrapper>
  );
};

/**
 * 代码块组件
 */
export const CodeBlockComponent: React.FC<any> = ({ 
  node, 
  updateAttributes,
  extension 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [language, setLanguage] = useState(node.attrs.language || 'plaintext');

  return (
    <NodeViewWrapper 
      className="craft-code-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 左侧控制区域 */}
      <div className="craft-block-controls">
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="craft-block-controls-container"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15 }}
            >
              <button 
                className="craft-block-handle"
                contentEditable={false}
                draggable
                data-drag-handle
              >
                <GripVertical className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 代码块容器 */}
      <div className="craft-code-block-container">
        {/* 语言选择器 */}
        <div className="craft-code-block-header">
          <select
            className="craft-code-language-select"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              updateAttributes({ language: e.target.value });
            }}
            contentEditable={false}
          >
            <option value="plaintext">纯文本</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
          </select>

          {/* 复制按钮 */}
          {isHovered && (
            <motion.button
              className="craft-code-copy-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                navigator.clipboard.writeText(node.textContent);
              }}
            >
              复制
            </motion.button>
          )}
        </div>

        {/* 代码内容 */}
        <pre className="craft-code-content">
          <NodeViewContent as="code" />
        </pre>
      </div>
    </NodeViewWrapper>
  );
};

/**
 * 引用块组件
 */
export const BlockquoteComponent: React.FC<any> = ({ node }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NodeViewWrapper 
      className="craft-blockquote"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 左侧控制区域 */}
      <div className="craft-block-controls">
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="craft-block-controls-container"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15 }}
            >
              <button 
                className="craft-block-handle"
                contentEditable={false}
                draggable
                data-drag-handle
              >
                <GripVertical className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 引用内容 */}
      <div className="craft-blockquote-container">
        <div className="craft-blockquote-border" />
        <NodeViewContent className="craft-blockquote-content" />
      </div>
    </NodeViewWrapper>
  );
};

/**
 * Callout 提示框组件
 */
interface CalloutProps {
  node: any;
  updateAttributes: any;
}

export const CalloutComponent: React.FC<CalloutProps> = ({ 
  node, 
  updateAttributes 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const type = node.attrs.type || 'info';

  const calloutTypes = {
    info: { icon: '💡', color: 'blue', label: '信息' },
    tip: { icon: '✨', color: 'green', label: '技巧' },
    warning: { icon: '⚠️', color: 'yellow', label: '警告' },
    error: { icon: '🚫', color: 'red', label: '错误' }
  };

  const config = calloutTypes[type as keyof typeof calloutTypes];

  return (
    <NodeViewWrapper 
      className={`craft-callout craft-callout-${type}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 左侧控制区域 */}
      <div className="craft-block-controls">
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="craft-block-controls-container"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15 }}
            >
              <button 
                className="craft-block-handle"
                contentEditable={false}
                draggable
                data-drag-handle
              >
                <GripVertical className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Callout 容器 */}
      <div className="craft-callout-container">
        <div className="craft-callout-icon">{config.icon}</div>
        <div className="craft-callout-body">
          <NodeViewContent className="craft-callout-content" />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

/**
 * 块级操作菜单
 */
interface BlockMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlockMenu: React.FC<BlockMenuProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: <Type className="w-4 h-4" />, label: '文本', action: 'text' },
    { icon: <Heading1 className="w-4 h-4" />, label: '标题', action: 'heading' },
    { icon: <List className="w-4 h-4" />, label: '列表', action: 'list' },
    { icon: <Code className="w-4 h-4" />, label: '代码', action: 'code' },
    { icon: <Quote className="w-4 h-4" />, label: '引用', action: 'quote' },
    { icon: <Image className="w-4 h-4" />, label: '图片', action: 'image' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="craft-block-menu"
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {menuItems.map((item) => (
            <button
              key={item.action}
              className="craft-block-menu-item"
              onClick={() => {
                // 执行对应操作
                onClose();
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
