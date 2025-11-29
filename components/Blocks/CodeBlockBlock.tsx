import React, { useState } from 'react';
import { NodeViewProps, NodeViewContent } from '@tiptap/react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

/**
 * 代码块 NodeView
 * 
 * 设计规范：
 * - 外边距: margin: 16px 0
 * - 内边距: padding: 16px
 * - 背景色: background: #1E293B
 * - 圆角: border-radius: 8px
 * - 字体: 'SF Mono', Monaco, Consolas, monospace
 * - 字号: font-size: 14px
 * - 行高: line-height: 1.6
 * - 工具栏高度: 36px
 */
export const CodeBlockNodeView: React.FC<NodeViewProps> = ({ node, updateAttributes }) => {
  const [copied, setCopied] = useState(false);
  const language = node.attrs.language || 'javascript';

  const copyCode = () => {
    navigator.clipboard.writeText(node.textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="kanso-code-block-wrapper"
      style={{
        margin: '16px 0',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* 工具栏 */}
      <div 
        className="kanso-code-toolbar"
        style={{
          height: '36px',
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#334155',
          borderRadius: '8px 8px 0 0'
        }}
      >
        {/* 语言选择器 */}
        <select
          value={language}
          onChange={(e) => updateAttributes({ language: e.target.value })}
          className="kanso-language-selector"
          style={{
            background: 'transparent',
            color: '#94A3B8',
            border: 'none',
            fontSize: '13px',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
          <option value="json">JSON</option>
          <option value="bash">Bash</option>
          <option value="sql">SQL</option>
        </select>

        {/* 复制按钮 */}
        <motion.button
          onClick={copyCode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #475569',
            background: copied ? '#0066FF' : 'transparent',
            color: copied ? 'white' : '#94A3B8',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            transition: 'all 200ms'
          }}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? '已复制' : '复制'}
        </motion.button>
      </div>

      {/* 代码内容 */}
      <pre 
        style={{
          margin: 0,
          padding: '16px',
          background: '#1E293B',
          borderRadius: '0 0 8px 8px',
          overflow: 'auto',
          fontSize: '14px',
          lineHeight: 1.6,
          fontFamily: "'SF Mono', Monaco, Consolas, monospace"
        }}
      >
        <NodeViewContent 
          as="code"
          style={{
            display: 'block',
            color: '#E2E8F0',
            outline: 'none'
          }}
        />
      </pre>
    </div>
  );
};
