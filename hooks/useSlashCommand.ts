import { useCallback, useEffect, useState, useRef } from 'react';
import { Editor } from '@tiptap/react';

interface SlashCommandState {
  isOpen: boolean;
  query: string;
  position: { x: number; y: number };
}

export const useSlashCommand = (editor: Editor | null) => {
  const [state, setState] = useState<SlashCommandState>({
    isOpen: false,
    query: '',
    position: { x: 0, y: 0 },
  });

  const updateSlashCommandState = useCallback(() => {
    if (!editor) return;

    const { $from } = editor.state.selection;
    const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);

    // 检查是否在斜杠后的位置
    const slashIndex = textBefore.lastIndexOf('/');
    
    if (slashIndex === -1) {
      setState((prev) => ({ ...prev, isOpen: false }));
      return;
    }

    // 检查斜杠后是否有空格（表示命令已完成）
    const afterSlash = textBefore.slice(slashIndex + 1);
    
    if (afterSlash.includes(' ')) {
      setState((prev) => ({ ...prev, isOpen: false }));
      return;
    }

    // 获取查询文本（斜杠后的内容）
    const query = afterSlash;

    // 计算菜单位置
    const { view } = editor;
    const cursorPos = view.coordsAtPos($from.pos);
    
    setState({
      isOpen: true,
      query,
      position: {
        x: cursorPos.left,
        y: cursorPos.bottom + 8,
      },
    });
  }, [editor]);

  // 监听编辑器内容变化
  useEffect(() => {
    if (!editor) return;

    // 使用 on 方法监听所有可能的更新事件
    const handleUpdate = () => {
      updateSlashCommandState();
    };
    
    const handleSelectionUpdate = () => {
      updateSlashCommandState();
    };

    editor.on('update', handleUpdate);
    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('contentError', () => {});

    // 立即调用一次以初始化状态
    updateSlashCommandState();

    return () => {
      editor.off('update', handleUpdate);
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, updateSlashCommandState]);

  const closeMenu = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const executeCommand = useCallback(
    (command: any) => {
      if (!editor) return;

      const { $from } = editor.state.selection;
      const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);
      const slashIndex = textBefore.lastIndexOf('/');

      if (slashIndex !== -1) {
        const range = {
          from: $from.pos - (textBefore.length - slashIndex),
          to: $from.pos,
        };

        command.command({ editor, range });
      }

      closeMenu();
      
      // 调用命令后立即更新状态
      setTimeout(() => updateSlashCommandState(), 0);
    },
    [editor, closeMenu, updateSlashCommandState]
  );

  return {
    ...state,
    closeMenu,
    executeCommand,
  };
};

export default useSlashCommand;
