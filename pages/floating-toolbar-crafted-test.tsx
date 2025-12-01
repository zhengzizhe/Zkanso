import React, { useState } from 'react';
import { FloatingToolbar } from '../components/FloatingToolbar_crafted';
import { ModeToolbar } from '../components/ModeToolbar_crafted';

/**
 * Crafted 版本悬浮工具栏测试页面
 * 
 * 测试从 crafted-docs 引入的悬浮工具栏组件
 */
const FloatingToolbarCraftedTest: React.FC = () => {
  const [content, setContent] = useState(`
    <h1>Crafted 悬浮工具栏测试</h1>
    <p>选中下面的文字，查看悬浮工具栏效果：</p>
    <p>这是一段<strong>可以选中</strong>的文本。试试选中这些文字，工具栏会自动出现在选中文本的上方。</p>
    <p>支持的格式包括：<strong>粗体</strong>、<em>斜体</em>、<u>下划线</u>、<s>删除线</s>、<code>代码</code>和<a href="#">链接</a>。</p>
    <blockquote>这是一个引用块，你也可以选中这里的文字来测试工具栏。</blockquote>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  `);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isTypewriterMode, setIsTypewriterMode] = useState(false);

  const handleFormat = (format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'link') => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    console.log(`应用格式: ${format}`);
    
    // 这里只是演示，实际应该操作 DOM 或使用富文本编辑器
    const selectedText = selection.toString();
    alert(`将对 "${selectedText}" 应用 ${format} 格式`);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* 页面标题 */}
      <div className={`border-b ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            🎨 Crafted 悬浮工具栏测试
          </h1>
          <p className={`mt-1 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            测试从 crafted-docs 引入的原生 Selection API 版本
          </p>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 提示卡片 */}
        <div className={`rounded-lg p-4 mb-6 ${
          isDarkMode 
            ? 'bg-blue-900/20 border border-blue-700/50 text-blue-300' 
            : 'bg-blue-50 border border-blue-200 text-blue-800'
        }`}>
          <h3 className="font-semibold mb-2">💡 使用说明</h3>
          <ul className="text-sm space-y-1">
            <li>• 选中下方文本，悬浮工具栏会自动出现</li>
            <li>• 点击工具栏按钮查看格式选项</li>
            <li>• 使用右下角的模式切换按钮测试不同模式</li>
            <li>• 此版本基于原生 Selection API，与 Tiptap 独立</li>
          </ul>
        </div>

        {/* 编辑器区域 */}
        <div className={`rounded-xl shadow-lg overflow-hidden ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div
            className={`prose prose-lg max-w-none p-8 ${
              isDarkMode ? 'prose-invert' : ''
            } ${
              isFocusMode ? 'opacity-70 hover:opacity-100 transition-opacity' : ''
            } ${
              isTypewriterMode ? 'flex flex-col items-center justify-center min-h-[500px]' : ''
            }`}
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
              userSelect: 'text',
              cursor: 'text',
            }}
          />
        </div>

        {/* 功能对比说明 */}
        <div className={`mt-6 rounded-lg p-6 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            📊 技术特点
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className={`font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Crafted 版本
              </h4>
              <ul className={`space-y-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <li>✓ 原生 Selection API</li>
                <li>✓ 轻量级实现（~80行）</li>
                <li>✓ TailwindCSS 动画</li>
                <li>✓ 深色主题风格</li>
                <li>✓ 固定偏移定位</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                当前项目版本
              </h4>
              <ul className={`space-y-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <li>✓ Tiptap Editor API</li>
                <li>✓ 完整实现（~195行）</li>
                <li>✓ Framer Motion 动画</li>
                <li>✓ 飞书/Craft 双主题</li>
                <li>✓ 智能边界检测</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 悬浮工具栏 */}
      <FloatingToolbar onFormat={handleFormat} />

      {/* 模式工具栏 */}
      <ModeToolbar
        isDarkMode={isDarkMode}
        isFocusMode={isFocusMode}
        isTypewriterMode={isTypewriterMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
        onToggleTypewriterMode={() => setIsTypewriterMode(!isTypewriterMode)}
      />
    </div>
  );
};

export default FloatingToolbarCraftedTest;
