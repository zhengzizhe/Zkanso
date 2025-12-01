import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import CharacterCount from '@tiptap/extension-character-count';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import CustomTableCell from '../extensions/CustomTableCell';
import Gapcursor from '@tiptap/extension-gapcursor';
import Dropcursor from '@tiptap/extension-dropcursor';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Mention from '@tiptap/extension-mention';
import Youtube from '@tiptap/extension-youtube';
import Mathematics from '@tiptap/extension-mathematics';
import { runDragTests } from '../utils/dragTestRunner';
import { MarkdownChecker } from '../utils/markdownChecker';
import { StyleChecker } from '../utils/styleChecker';
import Typography from '@tiptap/extension-typography';
import FontFamily from '@tiptap/extension-font-family';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import FloatingMenu from '@tiptap/extension-floating-menu';
import { CustomImage } from '../extensions/CustomImage';
import { CustomDetails } from '../extensions/CustomDetails';
import { CustomFile } from '../extensions/CustomFile';
import { CustomVideo } from '../extensions/CustomVideo';
import { Callout } from '../extensions/Callout';
import { Mermaid } from '../extensions/Mermaid';
import { EnhancedCodeBlock } from '../extensions/EnhancedCodeBlock';
import { DragHandle } from '../extensions/DragHandle'; // 使用自定义拖拽手柄
import { FloatingToolbar } from '../components/Editor/FloatingToolbar';
import { ToolbarButtons } from '../components/Editor/ToolbarButtons';
import { StatusBar } from '../components/Editor/StatusBar';
import { ImageUploadPanel } from '../components/Editor/ImageUploadPanel';
import { SearchReplace } from '../components/Editor/SearchReplace';
import { SlashCommandMenu } from '../components/SlashCommandMenu';
import { TableMenu } from '../components/TableMenu';
import { useSlashCommand } from '../hooks/useSlashCommand';
import { downloadMarkdown, uploadMarkdown, copyAsMarkdown } from '../utils/markdown';
import DialogManager from '../components/CustomDialog';
import { Download, Upload, Copy, Undo, Redo } from 'lucide-react';
// 第三方库样式
import 'katex/dist/katex.min.css';
import '@excalidraw/excalidraw/index.css';

// 自定义样式（按优先级顺序）
import '../styles/craft-theme.css';          // 1. 设计系统基础（变量、颜色）
import '../styles/blocks-unified.css';       // 2. 所有渲染块样式（统一）
import '../styles/enhanced-code-block.css';  // 3. 代码块样式
import '../styles/mermaid.css';              // 4. Mermaid 图表
import '../styles/mathematics.css';          // 5. 数学公式
import '../styles/mention.css';              // 6. @提及
import '../styles/drag-handle.css';          // 7. 拖拽手柄
import '../styles/custom-dialog.css';        // 8. 对话框

/**
 * 悬浮工具栏 + 斜杠命令菜单测试页面
 * 
 * 布局：灰色背景 + 中央白色编辑区域
 * 功能：测试选中文本后的悬浮工具栏 + 输入 '/' 呼出斜杠命令菜单
 */
const ToolbarTestPage: React.FC = () => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showSearchReplace, setShowSearchReplace] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [checkResults, setCheckResults] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [styleResults, setStyleResults] = useState<any>(null);
  const [checkingStyle, setCheckingStyle] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: false, // 禁用默认代码块，使用增强版
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer hover:text-blue-700',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      CustomImage,
      CustomFile,
      CustomVideo,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: ({ query }: any) => {
            const users = [
              { id: '1', label: '张三' },
              { id: '2', label: '李四' },
              { id: '3', label: '王五' },
              { id: '4', label: '赵六' },
              { id: '5', label: 'Alice' },
              { id: '6', label: 'Bob' },
            ];
            return users
              .filter(user => user.label.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 5);
          },
          render: () => {
            let component: any;
            let popup: any;
            
            return {
              onStart: (props: any) => {
                component = document.createElement('div');
                component.className = 'mention-suggestions bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[200px] max-h-[300px] overflow-y-auto';
                
                const renderItems = () => {
                  component.innerHTML = '';
                  props.items.forEach((item: any, index: number) => {
                    const div = document.createElement('button');
                    div.className = `w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${index === props.selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''}`;
                    div.textContent = `@${item.label}`;
                    div.onclick = () => props.command(item);
                    component.appendChild(div);
                  });
                };
                
                renderItems();
                document.body.appendChild(component);
                
                const updatePosition = () => {
                  const { range, editor } = props;
                  const { view } = editor;
                  const coords = view.coordsAtPos(range.from);
                  component.style.position = 'absolute';
                  component.style.top = `${coords.bottom + 5}px`;
                  component.style.left = `${coords.left}px`;
                  component.style.zIndex = '9999';
                };
                
                updatePosition();
              },
              onUpdate(props: any) {
                const renderItems = () => {
                  component.innerHTML = '';
                  props.items.forEach((item: any, index: number) => {
                    const div = document.createElement('button');
                    div.className = `w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${index === props.selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''}`;
                    div.textContent = `@${item.label}`;
                    div.onclick = () => props.command(item);
                    component.appendChild(div);
                  });
                };
                renderItems();
              },
              onExit() {
                if (component) {
                  component.remove();
                }
              },
            };
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CharacterCount,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table',
        },
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      Gapcursor, // 重新启用
      Dropcursor.configure({
        color: '#6366f1',
        width: 2,
      }),
      TextStyle,
      Color,
      Subscript,
      Superscript,
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'youtube-video',
        },
      }),
      CustomDetails,
      Mathematics,
      Mermaid,
      EnhancedCodeBlock.configure({
        defaultLanguage: 'javascript',
      }),
      Typography,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      BubbleMenu.configure({
        element: document.querySelector('.bubble-menu') as HTMLElement,
      }),
      FloatingMenu.configure({
        element: document.querySelector('.floating-menu') as HTMLElement,
      }),
      Callout,
      DragHandle, // 拖拽手柄
      Placeholder.configure({
        placeholder: '输入 "/" 呼出菜单，或选中文本试试悬浮工具栏...',
      }),
    ],
    content: `<h1>Markdown 测试文档（Test Markdown File）</h1>
<p>用于测试 Markdown 渲染器的各种语法效果<br>Version: 1.0<br>Author: ChatGPT</p>

<h2>1. 标题（Headings）</h2>
<h1>H1 标题</h1>
<h2>H2 标题</h2>
<h3>H3 标题</h3>
<h4>H4 标题</h4>
<h5>H5 标题</h5>
<h6>H6 标题</h6>

<h2>2. 段落 & 换行</h2>
<p>这是一个段落。<br>这是同一段落中的第二行（使用换行）。</p>
<p>空行后是新段落。</p>

<h2>3. 粗体 / 斜体 / 删除线 / 高亮</h2>
<p><strong>粗体</strong></p>
<p><em>斜体</em></p>
<p><strong><em>粗斜体</em></strong></p>
<p><s>删除线</s></p>
<p><mark>高亮文本</mark></p>

<h2>4. 引用（Blockquote）</h2>
<blockquote>
  <p>这是一级引用</p>
  <blockquote>
    <p>这是二级引用</p>
    <blockquote>
      <p>这是三级引用</p>
    </blockquote>
  </blockquote>
</blockquote>

<h2>5. 列表</h2>
<h3>无序列表</h3>
<ul>
  <li><p>项目 A</p></li>
  <li><p>项目 B</p>
    <ul>
      <li><p>子项目 B.1</p></li>
      <li><p>子项目 B.2</p></li>
    </ul>
  </li>
</ul>

<h3>有序列表</h3>
<ol>
  <li><p>第一项</p></li>
  <li><p>第二项</p>
    <ol>
      <li><p>子项</p></li>
      <li><p>子项</p></li>
    </ol>
  </li>
</ol>

<h3>任务列表（Task List）</h3>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked /><span></span></label><div><p>已完成任务</p></div></li>
  <li data-type="taskItem" data-checked="false"><label><input type="checkbox" /><span></span></label><div><p>未完成任务</p></div></li>
  <li data-type="taskItem" data-checked="false"><label><input type="checkbox" /><span></span></label><div><p>多级任务</p>
    <ul data-type="taskList">
      <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked /><span></span></label><div><p>子任务已完成</p></div></li>
      <li data-type="taskItem" data-checked="false"><label><input type="checkbox" /><span></span></label><div><p>子任务未完成</p></div></li>
    </ul>
  </div></li>
</ul>

<h2>6. 代码（Code）</h2>
<h3>行内代码</h3>
<p>这是一段 <code>inline code</code>。</p>

<h3>代码块（多语言）</h3>
<pre><code class="language-bash">echo "Hello Markdown!"</code></pre>
<pre><code class="language-javascript">const hello = () => console.log("Hello JS!");
hello();</code></pre>
<pre><code class="language-python">def add(a, b):
    return a + b

print(add(2, 3))</code></pre>
<pre><code class="language-json">{
  "name": "markdown-test",
  "version": "1.0.0"
}</code></pre>

<h2>7. 表格（Table）</h2>
<table>
  <tr>
    <th>姓名</th>
    <th>年龄</th>
    <th>城市</th>
  </tr>
  <tr>
    <td>张三</td>
    <td>28</td>
    <td>北京</td>
  </tr>
  <tr>
    <td>李四</td>
    <td>22</td>
    <td>上海</td>
  </tr>
  <tr>
    <td>王五</td>
    <td>30</td>
    <td>深圳</td>
  </tr>
</table>

<h2>8. 链接（Links）</h2>
<p><a href="https://www.github.com">普通链接</a></p>
<p><a href="https://www.github.com">https://www.github.com</a></p>

<h2>9. 分割线</h2>
<hr>

<h2>10. Emoji 渲染</h2>
<p>😀 😃 😄 😁 😆 😅 😂 🤣</p>
<p>🔥 🚀 ⭐️ ⚠️ ⛔️</p>
<p>🍎 🍔 🍣 🍺 🍵</p>
<p>🐶 🐱 🦁 🐼 🐧</p>
<p>🎉 🎁 🎶 🧩</p>

<h2>11. 复选框 + 代码组合</h2>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked /><span></span></label><div><p>任务</p></div></li>
</ul>
<pre><code class="language-javascript">console.log("Task demo");</code></pre>

<h2>12. 长文本段落（用于滚动测试）</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

<h2>13. 超长表格测试</h2>
<table>
  <tr>
    <th>C1</th><th>C2</th><th>C3</th><th>C4</th><th>C5</th>
  </tr>
  <tr>
    <td>A1</td><td>B1</td><td>C1</td><td>D1</td><td>E1</td>
  </tr>
  <tr>
    <td>A2</td><td>B2</td><td>C2</td><td>D2</td><td>E2</td>
  </tr>
  <tr>
    <td>A3</td><td>B3</td><td>C3</td><td>D3</td><td>E3</td>
  </tr>
</table>

<h2>14. Mermaid 图表测试</h2>
<h3>流程图（Flowchart）</h3>
<pre data-type="mermaid"><code>flowchart TD
    A[开始] --> B{条件判断?}
    B -->|是| C[执行任务 1]
    B -->|否| D[执行任务 2]
    C --> E[结束]
    D --> E[结束]</code></pre>

<h3>时序图（Sequence Diagram）</h3>
<pre data-type="mermaid"><code>sequenceDiagram
    participant User
    participant Server
    User->>Server: 发送请求
    Server-->>User: 返回数据</code></pre>

<h3>甘特图（Gantt Chart）</h3>
<pre data-type="mermaid"><code>gantt
    title 项目开发甘特图
    dateFormat  YYYY-MM-DD
    section 设计
    原型设计       :done, des1, 2025-01-01, 5d
    UI 设计        :active, des2, 2025-01-06, 5d
    section 开发
    前端开发       :dev1, 2025-01-10, 7d
    后端开发       :dev2, 2025-01-10, 10d</code></pre>

<h2>15. 数学公式测试</h2>
<p>行内公式：这是爱因斯坦质能方程 E = mc²</p>
<p>块级公式（如果支持 KaTeX）：</p>
<div data-type="math-display">\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}</div>

<h2>16. 测试结束</h2>
<p><strong>END OF MARKDOWN TEST</strong></p>
    `,
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none px-8 py-6',
        style: 'padding-left: 48px; position: relative; overflow: visible;', // overflow: visible 确保图标可见
      },
      // 禁止直接拖拽文本，只允许通过拖拽手柄
      handleDOMEvents: {
        dragstart: (view, event) => {
          const target = event.target as HTMLElement;
          // 只允许拖拽手柄触发拖拽
          if (!target.closest('.drag-handle')) {
            event.preventDefault();
            return true;
          }
          return false;
        },
      },
    },
    onCreate: ({ editor }) => {
      console.log('Editor created');
      console.log('Available nodes:', Object.keys(editor.schema.nodes));
      console.log('Has customImage:', !!editor.schema.nodes.customImage);
      console.log('Has customDetails:', !!editor.schema.nodes.customDetails);
    },
  });

  // 监听图片上传事件
  React.useEffect(() => {
    const handleOpenImageUpload = () => {
      setShowImageUpload(true);
    };
    
    window.addEventListener('openImageUpload', handleOpenImageUpload);
    return () => window.removeEventListener('openImageUpload', handleOpenImageUpload);
  }, []);

  // 监听 Ctrl+F 打开搜索
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearchReplace(true);
      }
      if (e.key === 'Escape') {
        setShowSearchReplace(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 斜杠命令菜单状态
  const slashCommand = useSlashCommand(editor);

  if (!editor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* 中央白色编辑区域 */}
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Markdown 工具栏 */}
        <div className="flex items-center justify-between gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          {/* 左侧: 撤销/重做 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="撤销 (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="重做 (Ctrl+Shift+Z)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
          
          {/* 右侧: Markdown 按钮 */}
          <div className="flex items-center gap-2">
          {/* 插入 Mermaid 图表按钮 */}
          <button
            onClick={() => {
              editor.chain().focus().insertContent({
                type: 'mermaid',
                attrs: {
                  content: 'graph TD\n    A[开始] --> B[结束]'
                }
              }).run();
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            title="插入 Mermaid 图表"
          >
            📊 Mermaid
          </button>
          {/* 拖动测试按钮 */}
          <button
            onClick={async () => {
              if (editor && !testing) {
                setTesting(true);
                setTestResults(null);
                console.log('🧪 开始运行拖动引擎测试...');
                try {
                  const results = await runDragTests(editor);
                  setTestResults(results);
                  console.log('✅ 测试完成:', results);
                } catch (error) {
                  console.error('❌ 测试出错:', error);
                } finally {
                  setTesting(false);
                }
              }
            }}
            disabled={testing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="运行拖动测试"
          >
            {testing ? '🔄 测试中...' : '🧪 测试拖动'}
          </button>
          {/* Markdown 功能检查按钮 */}
          <button
            onClick={async () => {
              if (editor && !checking) {
                setChecking(true);
                setCheckResults(null);
                console.log('🔍 开始检查 Markdown 功能...');
                try {
                  const checker = new MarkdownChecker(editor);
                  const results = checker.runAllChecks();
                  const report = checker.generateReport();
                  setCheckResults({ results, report });
                  console.log('✅ 检查完成:', results);
                  console.log(report);
                } catch (error) {
                  console.error('❌ 检查出错:', error);
                } finally {
                  setChecking(false);
                }
              }
            }}
            disabled={checking}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="检查 Markdown 功能"
          >
            {checking ? '🔄 检查中...' : '🔍 检查功能'}
          </button>
          {/* 样式问题检查按钮 */}
          <button
            onClick={async () => {
              if (editor && !checkingStyle) {
                setCheckingStyle(true);
                setStyleResults(null);
                console.log('🎨 开始检查样式问题...');
                try {
                  const checker = new StyleChecker(editor);
                  const issues = checker.runAllChecks();
                  const report = checker.generateReport();
                  setStyleResults({ issues, report });
                  console.log('✅ 样式检查完成:', issues);
                  console.log(report);
                } catch (error) {
                  console.error('❌ 样式检查出错:', error);
                } finally {
                  setCheckingStyle(false);
                }
              }
            }}
            disabled={checkingStyle}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="检查样式问题"
          >
            {checkingStyle ? '🔄 检查中...' : '🎨 检查样式'}
          </button>
          <button
            onClick={() => uploadMarkdown(editor!)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-500 transition-colors"
            title="导入 Markdown"
          >
            <Upload className="w-4 h-4" />
            导入 MD
          </button>
          <button
            onClick={() => downloadMarkdown(editor!, 'document.md')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-500 transition-colors"
            title="导出为 Markdown"
          >
            <Download className="w-4 h-4" />
            导出 MD
          </button>
          <button
            onClick={async () => {
              await copyAsMarkdown(editor!);
              setCopySuccess(true);
              setTimeout(() => setCopySuccess(false), 2000);
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            title="复制为 Markdown"
          >
            <Copy className="w-4 h-4" />
            {copySuccess ? '已复制!' : '复制 MD'}
          </button>
          </div>
        </div>

        {/* 编辑器区域 */}
        <div className="relative min-h-[600px] max-h-[calc(100vh-200px)] overflow-y-auto">
          <div style={{ position: 'relative', paddingLeft: '40px' }}>
            <EditorContent editor={editor} />
          </div>
          
          {/* 斜杠命令菜单 */}
          <SlashCommandMenu
            editor={editor}
            isOpen={slashCommand.isOpen}
            position={slashCommand.position}
            onClose={slashCommand.closeMenu}
            query={slashCommand.query}
            onSelect={slashCommand.executeCommand}
          />
          
          {/* 白色悬浮工具栏 */}
          <FloatingToolbar editor={editor} theme="feishu">
            {editor && <ToolbarButtons editor={editor} />}
          </FloatingToolbar>
          
          {/* 表格操作菜单 */}
          <TableMenu editor={editor} />
        </div>

        {/* 状态栏 */}
        <StatusBar editor={editor} />
      </div>
      
      {/* 样式检查结果显示 */}
      {styleResults && (
        <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-2xl max-h-[80vh] overflow-y-auto z-50">
          <div className="flex items-center justify-between mb-3 sticky top-0 bg-white dark:bg-gray-800 pb-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">🎨 样式问题检查报告</h3>
            <button
              onClick={() => setStyleResults(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          {/* 统计 */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-red-50 dark:bg-red-900/20 rounded p-2 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {styleResults.issues.filter((i: any) => i.severity === 'critical').length}
              </div>
              <div className="text-xs text-red-600 dark:text-red-400">严重问题</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-2 text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {styleResults.issues.filter((i: any) => i.severity === 'warning').length}
              </div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">警告</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {styleResults.issues.filter((i: any) => i.severity === 'minor').length}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">次要问题</div>
            </div>
          </div>
          {/* 问题列表 */}
          <div className="space-y-4">
            {Object.entries(
              styleResults.issues.reduce((acc: any, issue: any) => {
                if (!acc[issue.category]) acc[issue.category] = [];
                acc[issue.category].push(issue);
                return acc;
              }, {})
            ).map(([category, issues]: [string, any]) => (
              <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{category}</h4>
                <div className="space-y-2">
                  {issues.map((issue: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">
                          {issue.severity === 'critical' ? '🔴' : 
                           issue.severity === 'warning' ? '🟡' : '🔵'}
                        </span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {issue.element}: {issue.issue}
                          </div>
                          {issue.solution && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-1">
                              💡 {issue.solution}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 检查结果显示 */}
      {checkResults && (
        <div className="fixed top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-2xl max-h-[80vh] overflow-y-auto z-50">
          <div className="flex items-center justify-between mb-3 sticky top-0 bg-white dark:bg-gray-800 pb-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">📊 Markdown 功能检查报告</h3>
            <button
              onClick={() => setCheckResults(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            {Object.entries(
              checkResults.results.reduce((acc: any, result: any) => {
                if (!acc[result.category]) acc[result.category] = [];
                acc[result.category].push(result);
                return acc;
              }, {})
            ).map(([category, results]: [string, any]) => (
              <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{category}</h4>
                <div className="space-y-1">
                  {results.map((result: any, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-lg">
                        {result.status === 'supported' ? '✅' : 
                         result.status === 'partial' ? '⚠️' :
                         result.status === 'missing' ? '❌' : '🎨'}
                      </span>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 dark:text-white">{result.feature}</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-2">{result.details}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 测试结果显示 */}
      {testResults && (
        <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-md z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">📊 测试报告</h3>
            <button
              onClick={() => setTestResults(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">总计：</span>
              <span className="font-bold text-gray-900 dark:text-white">{testResults.total} 个测试</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600 dark:text-green-400">✅ 通过：</span>
              <span className="font-bold text-green-600 dark:text-green-400">{testResults.passed} 个</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-600 dark:text-red-400">❌ 失败：</span>
              <span className="font-bold text-red-600 dark:text-red-400">{testResults.failed} 个</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">通过率：</span>
              <span className={`font-bold ${
                testResults.passed / testResults.total >= 0.8 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
              }`}>
                {((testResults.passed / testResults.total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 max-h-60 overflow-y-auto">
            {testResults.details.map((detail: any) => (
              <div
                key={detail.id}
                className={`text-xs mb-2 p-2 rounded ${
                  detail.passed
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}
              >
                <div className="font-bold">{detail.passed ? '✅' : '❌'} {detail.id}: {detail.name}</div>
                <div className="text-xs mt-1 opacity-75">{detail.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 图片上传面板 */}
      {showImageUpload && editor && (
        <ImageUploadPanel 
          editor={editor} 
          onClose={() => setShowImageUpload(false)} 
        />
      )}
      
      {/* 搜索/替换面板 */}
      {showSearchReplace && editor && (
        <SearchReplace 
          editor={editor} 
          onClose={() => setShowSearchReplace(false)} 
        />
      )}
      
      {/* 自定义弹窗管理器 */}
      <DialogManager />
    </div>
  );
};

export default ToolbarTestPage;
