import * as React from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import mermaid from 'mermaid';
import { Code, Eye, Layout, Trash2, Maximize2, X, Pencil } from 'lucide-react';
import { MermaidDrawer } from '../components/MermaidDrawer';

// 初始化 Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

export interface MermaidOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mermaid: {
      setMermaid: () => ReturnType;
    };
  }
}

export const Mermaid = Node.create<MermaidOptions>({
  name: 'mermaid',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      content: {
        default: 'graph TD\n  A[开始] --> B[结束]',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'pre[data-type="mermaid"]',
        getAttrs: (node) => {
          const element = node as HTMLElement;
          const codeElement = element.querySelector('code');
          const content = codeElement?.textContent || 'graph TD\n    A[开始] --> B[结束]';
          return { content };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'pre',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'mermaid',
      }),
      ['code', {}, HTMLAttributes.content || ''],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MermaidComponent);
  },

  addCommands() {
    return {
      setMermaid:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              content: 'graph TD\n  A[开始] --> B[结束]',
            },
          });
        },
    };
  },
});

// React 组件用于渲染 Mermaid
function MermaidComponent({ node, updateAttributes, deleteNode, editor }: any) {
  const [svg, setSvg] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [viewMode, setViewMode] = React.useState<'code' | 'preview' | 'both'>('both');
  const [code, setCode] = React.useState(node.attrs.content || '');
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showDrawer, setShowDrawer] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // 快捷键支持
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + M 切换全屏
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        setIsFullscreen(prev => !prev);
      }
      // ESC 关闭全屏
      if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen]);

  React.useEffect(() => {
    const renderMermaid = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, code);
        setSvg(svg);
        setError('');
      } catch (err: any) {
        setError(err.message || '渲染失败');
        setSvg('');
      }
    };

    if (code.trim()) {
      renderMermaid();
    }
  }, [code]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    updateAttributes({ content: newCode });
  };

  const handleDelete = () => {
    const showConfirm = async () => {
      let result;
      if ((window as any).customDialog) {
        result = await (window as any).customDialog.confirm('确定要删除此 Mermaid 图表吗？', '确认删除');
      } else {
        result = confirm('确定要删除此 Mermaid 图表吗？');
      }
      
      if (result) {
        deleteNode();
      }
    };
    
    showConfirm();
  };

  const handleFullscreen = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleSaveFromDrawer = (newCode: string) => {
    setCode(newCode);
    updateAttributes({ content: newCode });
  };

  return (
    <NodeViewWrapper className="mermaid-node-wrapper">
      <div className="mermaid-editor">
        {/* 工具栏 */}
        <div className="mermaid-toolbar">
          <div className="mermaid-toolbar-left">
            <span className="mermaid-label">📊 Mermaid 图表</span>
          </div>
          <div className="mermaid-toolbar-right">
            <button
              onClick={() => setViewMode('code')}
              className={`mermaid-btn ${viewMode === 'code' ? 'active' : ''}`}
              title="仅显示代码"
            >
              <Code size={16} />
            </button>
            <button
              onClick={() => setViewMode('both')}
              className={`mermaid-btn ${viewMode === 'both' ? 'active' : ''}`}
              title="代码+预览"
            >
              <Layout size={16} />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`mermaid-btn ${viewMode === 'preview' ? 'active' : ''}`}
              title="仅显示预览"
            >
              <Eye size={16} />
            </button>
            <div className="mermaid-divider" />
            {/* 可视化绘制按钮 */}
            <button
              onClick={() => setShowDrawer(true)}
              className="mermaid-btn"
              title="可视化绘制"
            >
              <Pencil size={16} />
            </button>
            {/* 放大按钮 */}
            <button
              onClick={handleFullscreen}
              className="mermaid-btn"
              title="放大图表"
            >
              <Maximize2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="mermaid-btn mermaid-btn-danger"
              title="删除图表"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className={`mermaid-content mermaid-layout-${viewMode}`}>
          {/* 代码编辑器 */}
          {(viewMode === 'code' || viewMode === 'both') && (
            <div className="mermaid-code-panel">
              <div className="mermaid-panel-header">代码编辑</div>
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="mermaid-textarea"
                placeholder="输入 Mermaid 代码...\n\n示例：\nflowchart TD\n    A[开始] --> B[结束]"
                spellCheck={false}
              />
            </div>
          )}

          {/* 预览面板 */}
          {(viewMode === 'preview' || viewMode === 'both') && (
            <div className="mermaid-preview-panel">
              <div className="mermaid-panel-header">实时预览</div>
              <div className="mermaid-preview-content">
                {error ? (
                  <div className="mermaid-error">
                    <strong>⚠️ 渲染错误</strong>
                    <pre>{error}</pre>
                  </div>
                ) : svg ? (
                  <div className="mermaid-svg-wrapper" dangerouslySetInnerHTML={{ __html: svg }} />
                ) : (
                  <div className="mermaid-empty">
                    <Code size={48} style={{ opacity: 0.3 }} />
                    <p>在左侧输入 Mermaid 代码</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 全屏模态框 */}
      {isFullscreen && (
        <div className="mermaid-fullscreen-modal" onClick={handleCloseFullscreen}>
          <div className="mermaid-fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <div className="mermaid-fullscreen-header">
              <span className="mermaid-fullscreen-title">📊 Mermaid 图表 - 放大预览</span>
              <button
                onClick={handleCloseFullscreen}
                className="mermaid-fullscreen-close"
                title="关闭"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mermaid-fullscreen-body">
              {error ? (
                <div className="mermaid-error">
                  <strong>⚠️ 渲染错误</strong>
                  <pre>{error}</pre>
                </div>
              ) : svg ? (
                <div className="mermaid-fullscreen-svg" dangerouslySetInnerHTML={{ __html: svg }} />
              ) : (
                <div className="mermaid-empty">
                  <Code size={64} style={{ opacity: 0.3 }} />
                  <p>没有图表内容</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 可视化绘制面板 */}
      {showDrawer && (
        <MermaidDrawer
          onClose={() => setShowDrawer(false)}
          onSave={handleSaveFromDrawer}
          initialCode={code}
        />
      )}
    </NodeViewWrapper>
  );
}