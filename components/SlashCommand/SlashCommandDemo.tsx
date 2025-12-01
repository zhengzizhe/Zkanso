import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import { SlashCommandMenu } from './SlashCommandMenu';
import { SlashCommand } from './types';
import { Range } from '@tiptap/core';

/**
 * 斜杠命令Demo页面
 * 用于测试斜杠命令菜单系统
 */
export const SlashCommandDemo: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [range, setRange] = useState<Range | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '输入 "/" 打开命令菜单，快速插入各种内容...',
      }),
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight,
    ],
    content: `
      <h1>🎯 斜杠命令系统测试</h1>
      <p>欢迎使用斜杠命令系统！这是一个完整的功能演示页面。</p>
      
      <h2>📝 如何使用</h2>
      <ol>
        <li>在编辑器中输入 <code>/</code> 字符</li>
        <li>命令菜单会自动弹出</li>
        <li>输入关键词进行搜索（支持中英文）</li>
        <li>使用 ↑↓ 键选择命令</li>
        <li>按 Enter 执行命令</li>
        <li>按 Esc 关闭菜单</li>
      </ol>
      
      <h2>✨ 功能特性</h2>
      <ul>
        <li>✅ 30+ 个预定义命令</li>
        <li>✅ 智能搜索（中英文、关键词）</li>
        <li>✅ 键盘导航</li>
        <li>✅ 分类组织</li>
        <li>✅ 优先级排序</li>
        <li>✅ 流畅动画</li>
      </ul>
      
      <h2>🔍 试试搜索</h2>
      <p>输入 "/" 然后尝试以下关键词：</p>
      <ul>
        <li><code>/标题</code> - 插入各级标题</li>
        <li><code>/列表</code> - 创建列表</li>
        <li><code>/表格</code> - 插入表格</li>
        <li><code>/图片</code> - 插入图片</li>
        <li><code>/ai</code> - AI 功能</li>
      </ul>
      
      <h2>💡 开始创作</h2>
      <p>在下方空白处输入 "/" 开始体验...</p>
      <p></p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] px-4 py-2',
      },
      handleKeyDown: (view, event) => {
        // 检测 / 键
        if (event.key === '/') {
          const { state } = view;
          const { from } = state.selection;
          
          // 保存当前位置
          setRange({ from, to: from + 1 });
          setQuery('');
          setShowMenu(true);
          
          return false; // 允许输入 /
        }
        
        // 如果菜单打开，处理搜索输入
        if (showMenu) {
          if (event.key === 'Escape') {
            setShowMenu(false);
            setQuery('');
            return true;
          }
          
          if (event.key === 'Backspace' && query === '') {
            setShowMenu(false);
            return false;
          }
          
          // 更新搜索查询
          if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
            setQuery((prev) => prev + event.key);
          } else if (event.key === 'Backspace') {
            setQuery((prev) => prev.slice(0, -1));
          }
        }
        
        return false;
      },
    },
  });

  const handleCommandSelect = (command: SlashCommand) => {
    setShowMenu(false);
    setQuery('');
    setRange(null);
  };

  const handleMenuClose = () => {
    setShowMenu(false);
    setQuery('');
    setRange(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 顶部标题 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg">
              /
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                斜杠命令系统
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Slash Command System - 完整功能演示
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 编辑器区域 */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* 工具栏提示 */}
          <div className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600">
                  <kbd className="font-mono font-bold text-indigo-600 dark:text-indigo-400">/</kbd>
                  <span>命令菜单</span>
                </span>
                <span className="text-gray-400">•</span>
                <span>已加载 30+ 个命令</span>
              </div>
              {showMenu && (
                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md font-medium">
                  菜单已打开
                </span>
              )}
            </div>
          </div>

          {/* 编辑器 */}
          <div className="relative min-h-[600px] p-6">
            <EditorContent editor={editor} />
            
            {/* 斜杠命令菜单 */}
            {showMenu && editor && (
              <SlashCommandMenu
                editor={editor}
                query={query}
                range={range}
                onSelect={handleCommandSelect}
                onClose={handleMenuClose}
              />
            )}
          </div>

          {/* 底部状态栏 */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <span>字数: {editor?.storage.characterCount?.characters() || 0}</span>
                <span>•</span>
                <span>词数: {editor?.storage.characterCount?.words() || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                  Tiptap Editor
                </span>
                <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded font-medium">
                  斜杠命令系统
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 命令统计卡片 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">15+</div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">P0 核心命令</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">基础块、列表、内容</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">8+</div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">P1 高级命令</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">媒体、表格、高级块</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">7+</div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">AI 功能</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">续写、改写、翻译</div>
          </div>
        </div>
      </div>
    </div>
  );
};
