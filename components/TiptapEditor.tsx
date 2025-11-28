import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { ArrowLeft, Share2, Settings } from 'lucide-react';

interface TiptapEditorProps {
  docId: string;
  onBack: () => void;
  pageTitle?: string;
  spaceName?: string;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  docId,
  onBack,
  pageTitle = 'Untitled',
  spaceName = 'Personal',
}) => {
  const [ydoc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  useEffect(() => {
    const wsProvider = new WebsocketProvider('ws://localhost:1234', docId, ydoc);
    setProvider(wsProvider);
    return () => {
      wsProvider.destroy();
    };
  }, [docId, ydoc]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: '开始输入内容...',
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
      editorProps: {
        attributes: {
          class:
            'focus:outline-none text-[15px] leading-7 text-gray-800',
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

  return (
    <div className="flex-1 min-h-screen flex flex-col">
      {/* 顶部返回栏，尽量简洁 */}
      <div className="h-14 flex items-center justify-between px-4 md:px-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-sm hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="ml-1 text-xs text-gray-500 truncate max-w-[180px]">
            {spaceName}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 bg-white/70 hover:bg-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            已同步
          </button>
          <button className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-gray-500 hover:text-gray-800 shadow-sm">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-gray-500 hover:text-gray-800 shadow-sm">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 中间空白页 */}
      <div className="flex-1 flex items-start justify-center pt-2 pb-16 px-4 md:px-0">
        <div className="w-full max-w-3xl">
          <div className="mx-auto bg-white rounded-[32px] shadow-[0_18px_45px_rgba(15,23,42,0.08)] overflow-hidden border border-white">
            {/* 头图区域 */}
            <div className="h-48 md:h-56 w-full bg-gradient-to-r from-[#a3bffa] via-[#c4f1f9] to-[#fefcbf]" />

            {/* 内容区域 */}
            <div className="px-6 md:px-10 py-8 md:py-10">
              {/* 标题 + 作者时间 */}
              <div className="mb-8 border-b border-gray-100 pb-6">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3 truncate">
                  {pageTitle || '未命名文档'}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span>作者：You</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>创建时间：{createdAt}</span>
                </div>
              </div>

              {/* 段落编辑区域（TipTap） */}
              <div className="min-h-[320px]">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
