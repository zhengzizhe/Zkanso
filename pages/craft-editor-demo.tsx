import React, { useState } from 'react';
import { CraftEditor } from '../components/Editor';

/**
 * Craft 编辑器演示页面
 * 
 * 展示所有功能：
 * 1. 悬浮工具栏 - 选中文本显示
 * 2. 斜杠菜单 - 输入 / 触发
 * 3. 块级操作 - 悬停段落显示控制柄
 * 4. 完整的富文本编辑功能
 */
export default function CraftEditorDemo() {
  const [content, setContent] = useState(`
    <h1>欢迎使用 Craft 编辑器</h1>
    <p>这是一个基于 Craft.do 设计规范的现代化编辑器。</p>
    
    <h2>主要功能</h2>
    
    <h3>1. 悬浮工具栏</h3>
    <p>选中任意文本，会自动显示悬浮工具栏，支持：</p>
    <ul>
      <li><strong>粗体</strong>、<em>斜体</em>、<u>下划线</u></li>
      <li><s>删除线</s>、<code>行内代码</code></li>
      <li>标题 1、标题 2、标题 3</li>
      <li>列表、引用、链接</li>
    </ul>
    
    <h3>2. 斜杠命令菜单</h3>
    <p>输入 <code>/</code> 可以快速插入：</p>
    <ul>
      <li>各种标题</li>
      <li>列表（有序、无序、任务）</li>
      <li>代码块</li>
      <li>引用</li>
      <li>图片</li>
      <li>分割线</li>
    </ul>
    
    <h3>3. 代码高亮</h3>
    <pre><code>function hello() {
  console.log("Hello Craft!");
}</code></pre>
    
    <h3>4. 引用块</h3>
    <blockquote>
      <p>这是一个引用块示例。可以用来引用重要的文字或名言。</p>
    </blockquote>
    
    <h3>5. 任务列表</h3>
    <ul data-type="taskList">
      <li data-type="taskItem" data-checked="true">创建编辑器组件</li>
      <li data-type="taskItem" data-checked="true">实现悬浮工具栏</li>
      <li data-type="taskItem" data-checked="true">实现斜杠菜单</li>
      <li data-type="taskItem" data-checked="false">添加更多功能...</li>
    </ul>
    
    <hr />
    
    <h2>快捷键</h2>
    <ul>
      <li><code>Cmd + B</code> - 粗体</li>
      <li><code>Cmd + I</code> - 斜体</li>
      <li><code>Cmd + U</code> - 下划线</li>
      <li><code>/</code> - 打开命令菜单</li>
      <li><code>Cmd + Enter</code> - 退出代码块</li>
    </ul>
  `);

  return (
    <div className="demo-container">
      {/* 顶部导航 */}
      <header className="demo-header">
        <h1>Craft 编辑器演示</h1>
        <p>基于 Craft.do 设计系统的富文本编辑器</p>
      </header>

      {/* 编辑器区域 */}
      <main className="demo-main">
        <CraftEditor
          content={content}
          onChange={setContent}
          placeholder="输入 / 召唤命令菜单，或者开始输入..."
        />
      </main>

      {/* 底部信息 */}
      <footer className="demo-footer">
        <div className="demo-stats">
          <span>字符数: {content.replace(/<[^>]*>/g, '').length}</span>
        </div>
      </footer>

      <style jsx>{`
        .demo-container {
          min-height: 100vh;
          background: var(--craft-gray-50);
        }

        .demo-header {
          background: #FFFFFF;
          border-bottom: 1px solid var(--craft-gray-200);
          padding: var(--craft-space-6) var(--craft-space-8);
          text-align: center;
        }

        .demo-header h1 {
          font-size: var(--craft-text-4xl);
          font-weight: var(--craft-font-weight-bold);
          color: var(--craft-gray-900);
          margin: 0 0 var(--craft-space-2) 0;
        }

        .demo-header p {
          font-size: var(--craft-text-lg);
          color: var(--craft-gray-600);
          margin: 0;
        }

        .demo-main {
          max-width: 1200px;
          margin: var(--craft-space-8) auto;
          padding: 0 var(--craft-space-6);
        }

        .demo-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-top: 1px solid var(--craft-gray-200);
          padding: var(--craft-space-3) var(--craft-space-8);
        }

        .demo-stats {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: var(--craft-space-6);
          font-size: var(--craft-text-sm);
          color: var(--craft-gray-600);
        }

        @media (prefers-color-scheme: dark) {
          .demo-container {
            background: var(--craft-dark-bg);
          }

          .demo-header {
            background: var(--craft-dark-surface);
            border-bottom-color: var(--craft-dark-border);
          }

          .demo-header h1 {
            color: var(--craft-dark-text);
          }

          .demo-footer {
            background: rgba(45, 45, 45, 0.95);
            border-top-color: var(--craft-dark-border);
          }
        }
      `}</style>
    </div>
  );
}
