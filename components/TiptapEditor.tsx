import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Dropcursor from '@tiptap/extension-dropcursor';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { ArrowLeft, Share2, MoreHorizontal, Maximize2, SplitSquareHorizontal, Plus, GripVertical, Type, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DraggableBlock } from './DraggableBlockExtension';
import { BubbleMenu } from './BubbleMenu';

interface TiptapEditorProps {
  docId: string;
  onBack: () => void;
  pageTitle?: string;
  spaceName?: string;
  collaborationUrl?: string;
  onShare?: () => void;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  docId,
  onBack,
  pageTitle = 'Untitled',
  spaceName = 'Personal',
  collaborationUrl = 'ws://localhost:1234',
  onShare,
}) => {
  const [ydoc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [blockMenuPosition, setBlockMenuPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const wsProvider = new WebsocketProvider(collaborationUrl, docId, ydoc);
    setProvider(wsProvider);
    return () => {
      wsProvider.destroy();
    };
  }, [docId, ydoc, collaborationUrl]);

  const editor = useEditor(
    {
      extensions: [
        ...DraggableBlock,
        Dropcursor.configure({
          color: '#3b82f6',
          width: 2,
        }),
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
          paragraph: false,
          dropcursor: false,
        }),
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === 'heading') {
              return '标题';
            }
            return '输入 "/" 呼出菜单，或开始输入内容...';
          },
        }),
        Collaboration.configure({
          document: ydoc,
        }),
        ...(provider
          ? [
              CollaborationCursor.configure({
                provider,
                user: {
                  name: 'You',
                  color: '#6366f1',
                },
              }),
            ]
          : []),
      ],
      content: '<p>这是第一个块</p><p>这是第二个块</p><p>按 Enter 键可以创建新块</p>',
      editorProps: {
        attributes: {
          class:
            'focus:outline-none text-[15px] leading-7 text-gray-800 dark:text-gray-200',
        },
        handleKeyDown: (view, event) => {
          // 检测 '/' 键来显示块菜单
          if (event.key === '/') {
            const { from } = view.state.selection;
            const coords = view.coordsAtPos(from);
            setBlockMenuPosition({ x: coords.left, y: coords.top + 24 });
            setShowBlockMenu(true);
          }
          return false;
        },
      },
    },
    [provider, ydoc],
  );

  if (!editor) return null;

  const createdAt = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // 块类型菜单项
  const blockTypes = [
    { icon: <Type className="w-4 h-4" />, label: '段落', command: () => editor.chain().focus().setParagraph().run() },
    { icon: <Heading1 className="w-4 h-4" />, label: '标题1', command: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { icon: <Heading2 className="w-4 h-4" />, label: '标题2', command: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { icon: <Heading3 className="w-4 h-4" />, label: '标题3', command: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { icon: <List className="w-4 h-4" />, label: '无序列表', command: () => editor.chain().focus().toggleBulletList().run() },
    { icon: <ListOrdered className="w-4 h-4" />, label: '有序列表', command: () => editor.chain().focus().toggleOrderedList().run() },
    { icon: <Quote className="w-4 h-4" />, label: '引用', command: () => editor.chain().focus().toggleBlockquote().run() },
    { icon: <Code className="w-4 h-4" />, label: '代码块', command: () => editor.chain().focus().toggleCodeBlock().run() },
  ];

  const handleBlockTypeSelect = (command: () => void) => {
    command();
    setShowBlockMenu(false);
  };

  return (
    <motion.div 
      className="flex-1 min-h-screen flex flex-col bg-transparent"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
    >
      {/* 顶部导航栏 - 参考第二张图片 */}
      <div className="h-14 flex items-center justify-between px-4 md:px-8">
        {/* 左侧：返回 + 面包屑 */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors">{spaceName}</span>
            <span className="text-gray-400 dark:text-gray-600">/</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{pageTitle || '未命名文档'}</span>
          </div>
        </div>
        
        {/* 右侧：状态 + 操作按钮 */}
        <div className="flex items-center gap-3">
          {/* 同步状态 */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs font-medium text-gray-600 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            已同步
          </div>
          
          {/* 分享按钮 */}
          <button 
            onClick={onShare}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
            title="分享"
          >
            <Share2 className="w-4 h-4" />
          </button>
          
          {/* 全屏按钮 */}
          <button 
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            title="全屏"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          
          {/* 分屏按钮 */}
          <button 
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            title="分屏"
          >
            <SplitSquareHorizontal className="w-4 h-4" />
          </button>
          
          {/* 更多选项 */}
          <button 
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            title="更多"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 中间空白页 */}
      <div className="flex-1 flex items-start justify-center pt-2 pb-16 px-4 md:px-0">
        <motion.div 
          className="w-full max-w-3xl h-[90vh]"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            delay: 0.05
          }}
        >
          <div className="mx-auto h-full bg-white dark:bg-gray-800 rounded-[32px] shadow-xl md:shadow-2xl overflow-hidden flex flex-col relative">
            {/* 头图区域 - 带遮罩渐变 */}
            <div className="relative h-48 md:h-56 w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-[#a3bffa] via-[#c4f1f9] to-[#fefcbf]" />
              {/* 底部渐变遮罩，让头图与内容融合 */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white dark:from-gray-800 to-transparent" />
            </div>

            {/* 内容区域 - 负边距让标题覆盖到头图 */}
            <div className="flex-1 px-6 md:px-10 -mt-12 relative z-10 overflow-y-auto">
              {/* 标题 + 作者时间 - 带背景卡片 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4">
                  {pageTitle || '未命名文档'}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>作者：You</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span>创建时间：{createdAt}</span>
                </div>
              </div>

              {/* 段落编辑区域（TipTap） */}
              <div className="min-h-[320px] pb-8 relative">
                <EditorContent editor={editor} />
                
                {/* 块类型选择菜单 */}
                <AnimatePresence>
                  {showBlockMenu && (
                    <>
                      {/* 背景遮罩 */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowBlockMenu(false)}
                      />
                      
                      {/* 菜单 */}
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="fixed z-20 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        style={{
                          left: `${blockMenuPosition.x}px`,
                          top: `${blockMenuPosition.y}px`,
                        }}
                      >
                        <div className="p-2 space-y-0.5 max-h-80 overflow-y-auto">
                          {blockTypes.map((block, index) => (
                            <button
                              key={index}
                              onClick={() => handleBlockTypeSelect(block.command)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                                {block.icon}
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                                {block.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TiptapEditor;
