import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Edit2, Check, X } from 'lucide-react';

// 初始化 Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
});

const MermaidComponent = ({ node, updateAttributes, deleteNode }: any) => {
  const { code } = node.attrs;
  const [isEditing, setIsEditing] = useState(!code);
  const [editCode, setEditCode] = useState(code || 'graph TD\n  A[开始] --> B[结束]');
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgCode, setSvgCode] = useState('');

  useEffect(() => {
    if (!isEditing && code && containerRef.current) {
      renderMermaid();
    }
  }, [code, isEditing]);

  const renderMermaid = async () => {
    if (!containerRef.current || !code) return;
    
    try {
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      const { svg } = await mermaid.render(id, code);
      setSvgCode(svg);
      setError('');
    } catch (err: any) {
      setError(err.message || '渲染失败');
    }
  };

  const handleSave = () => {
    if (!editCode.trim()) {
      deleteNode();
      return;
    }
    updateAttributes({ code: editCode });
    setIsEditing(false);
    setError('');
  };

  const handleCancel = () => {
    if (!code) {
      deleteNode();
    } else {
      setEditCode(code);
      setIsEditing(false);
      setError('');
    }
  };

  return (
    <NodeViewWrapper>
      <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mermaid 图表</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  title="保存"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                  title="取消"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <textarea
              value={editCode}
              onChange={(e) => setEditCode(e.target.value)}
              className="w-full h-48 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="输入 Mermaid 图表代码..."
              autoFocus
            />
            
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              示例：graph TD; A[开始] --&gt; B[结束]
            </div>
          </div>
        ) : (
          <div className="relative group">
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-2 right-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-gray-700"
              title="编辑"
            >
              <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            
            {error ? (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                渲染错误: {error}
              </div>
            ) : (
              <div 
                ref={containerRef}
                className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg"
                dangerouslySetInnerHTML={{ __html: svgCode }}
              />
            )}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const MermaidExtension = Node.create({
  name: 'mermaid',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      code: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="mermaid"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'mermaid' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MermaidComponent);
  },
});
