import * as React from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { ChevronDown, ChevronRight, Play, Copy, Check, Download, Trash2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 支持的语言列表
const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'xml', label: 'XML' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'plaintext', label: '纯文本' },
];

// React 组件
function EnhancedCodeBlockComponent({ node, updateAttributes, deleteNode, editor }: any) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [code, setCode] = React.useState(node.textContent || '');
  const [isLanguageOpen, setIsLanguageOpen] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const languageSelectRef = React.useRef<HTMLDivElement>(null);

  const language = node.attrs.language || 'plaintext';

  // 同步代码到节点
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = code;
    }
  }, [code]);

  // 复制代码
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 下载代码
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `code.${language === 'plaintext' ? 'txt' : language}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // 清空代码
  const handleClear = () => {
    if (window.confirm('确定要清空代码吗？此操作无法撤销。')) {
      setCode('');
      if (textareaRef.current) {
        textareaRef.current.value = '';
      }
    }
  };

  // 自动运行（这里只是示例，实际需要沙箱环境）
  const handleRun = () => {
    if (language === 'javascript') {
      try {
        console.log('🚀 运行代码:');
        // eslint-disable-next-line no-eval
        eval(code);
      } catch (err) {
        console.error('❌ 运行错误:', err);
      }
    } else {
      alert(`暂不支持运行 ${language} 代码`);
    }
  };

  // 获取行号
  const lines = code.split('\n');
  const lineCount = lines.length;

  // 处理语言选择器外部点击
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageSelectRef.current && !languageSelectRef.current.contains(event.target as unknown as Element)) {
        setIsLanguageOpen(false);
      }
    };

    if (isLanguageOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isLanguageOpen]);

  return (
    <NodeViewWrapper className="enhanced-code-block-wrapper">
      <div className="enhanced-code-block">
        {/* 标题栏 */}
        <div className="code-block-header">
          <div className="code-block-header-left">
            <button
              className="collapse-btn"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? '展开' : '折叠'}
            >
              {collapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            <span className="code-block-label">代码块</span>
            {/* 自定义语言选择器 */}
            <div className="language-selector-wrapper" ref={languageSelectRef}>
              <button
                className="language-selector"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                title="选择编程语言"
              >
                <span className="language-display">
                  {LANGUAGES.find(l => l.value === language)?.label || '选择语言'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${
                  isLanguageOpen ? 'rotate-180' : ''
                }`} />
              </button>
              {isLanguageOpen && (
                <div className="language-dropdown">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      className={`language-option ${
                        language === lang.value ? 'active' : ''
                      }`}
                      onClick={() => {
                        updateAttributes({ language: lang.value });
                        setIsLanguageOpen(false);
                      }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="code-block-header-right">
            {/* 自动运行 */}
            {(language === 'javascript' || language === 'typescript') && (
              <button
                className="header-btn header-btn-run"
                onClick={handleRun}
                title="自动运行"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
            )}

            {/* 下载按钮 */}
            <button
              className="header-btn"
              onClick={handleDownload}
              title="下载代码"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* 复制按钮 */}
            <button
              className={`header-btn ${
                copied ? 'header-btn-copied' : 'header-btn-copy'
              }`}
              onClick={handleCopy}
              title="复制"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* 清空按钮 */}
            <button
              className="header-btn header-btn-danger"
              onClick={handleClear}
              title="清空代码"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 代码编辑区 */}
        {!collapsed && (
          <div className="code-block-content">
            {/* 高亮显示层 */}
            <SyntaxHighlighter
              language={language}
              style={tomorrow}
              customStyle={{
                margin: 0,
                padding: '12px',
                background: 'transparent',
                fontSize: '13px',
                lineHeight: '1.5',
              }}
              codeTagProps={{
                style: {
                  fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Courier New', monospace",
                },
              }}
              showLineNumbers
              lineNumberStyle={{
                minWidth: '40px',
                paddingRight: '12px',
                color: '#858585',
                userSelect: 'none',
                textAlign: 'right',
              }}
            >
              {code || '// 输入代码...'}
            </SyntaxHighlighter>

            {/* 透明的编辑层 */}
            <textarea
              ref={textareaRef}
              className="code-textarea-overlay"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
              spellCheck={false}
              placeholder="输入代码..."
            />
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export interface EnhancedCodeBlockOptions {
  HTMLAttributes: Record<string, any>;
  defaultLanguage: string;
}

export const EnhancedCodeBlock = Node.create<EnhancedCodeBlockOptions>({
  name: 'enhancedCodeBlock',

  group: 'block',

  code: true,

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      defaultLanguage: 'plaintext',
    };
  },

  addAttributes() {
    return {
      language: {
        default: this.options.defaultLanguage,
        parseHTML: (element) => element.getAttribute('data-language'),
        renderHTML: (attributes) => ({
          'data-language': attributes.language,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'pre[data-type="enhanced-code-block"]',
      },
      // 兼容普通代码块格式
      {
        tag: 'pre',
        preserveWhitespace: 'full',
        getAttrs: (node) => {
          const codeElement = (node as HTMLElement).querySelector('code');
          if (!codeElement) return false;
          
          // 从 class 中提取语言（例如 language-javascript）
          const className = codeElement.className || '';
          const languageMatch = className.match(/language-(\w+)/);
          const language = languageMatch ? languageMatch[1] : 'plaintext';
          
          return { language };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'pre',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'enhanced-code-block',
      }),
      ['code', {}, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EnhancedCodeBlockComponent);
  },

  addCommands() {
    return {
      setEnhancedCodeBlock:
        (attributes: any) =>
        ({ commands }: any) => {
          return commands.setNode(this.name, attributes);
        },
      toggleEnhancedCodeBlock:
        (attributes: any) =>
        ({ commands }: any) => {
          return commands.toggleNode(this.name, 'paragraph', attributes);
        },
    } as any;
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => (this.editor.commands as any).toggleEnhancedCodeBlock(),
    };
  },
});
