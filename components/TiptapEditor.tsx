import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { ArrowLeft } from 'lucide-react';
import { DraggableParagraph, DraggableHeading } from './DraggableBlockExtension';

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

  // 初始化 WebSocket Provider
  useEffect(() => {
    const wsProvider = new WebsocketProvider('ws://localhost:1234', docId, ydoc);
    setProvider(wsProvider);
    return () => {
      wsProvider.destroy();
    };
  }, [docId, ydoc]);

  // 初始化编辑器
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        heading: false,
      }),
      DraggableParagraph,
      DraggableHeading,
      Placeholder.configure({
        placeholder: '输入 / 唤起菜单...',
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      ...(provider ? [
        CollaborationCursor.configure({
          provider,
          user: {
            name: 'User',
            color: '#6366f1',
          },
        }),
      ] : []),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none',
      },
    },
  }, [provider, ydoc]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex-1 ml-0 md:ml-[320px] min-h-screen bg-white dark:bg-gray-950">
      {/* 顶部栏 */}
      <div className="fixed top-0 left-0 right-0 md:left-[320px] h-14 z-30 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <button
          onClick={onBack}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">{spaceName}</div>
        <div className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{pageTitle}</div>
      </div>

      {/* 编辑器内容 */}
      <div className="pt-14">
        <div className="max-w-3xl mx-auto px-8 py-16">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
