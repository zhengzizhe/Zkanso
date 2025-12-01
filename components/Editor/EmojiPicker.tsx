import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  editor: Editor;
}

const EMOJI_LIST = [
  // 表情
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
  '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
  '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
  '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
  
  // 手势
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
  '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤝', '🙏',
  
  // 符号
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '⭐', '🌟',
  '✨', '⚡', '🔥', '💥', '💫', '💦', '💨', '💯', '✅', '❌',
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);

  const insertEmoji = (emoji: string) => {
    editor.chain().focus().insertContent(emoji).run();
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="插入表情"
        className={`
          p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700
          transition-colors duration-150
          ${isOpen ? 'bg-gray-100 dark:bg-gray-700' : ''}
        `}
        style={{
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          color: isOpen ? '#6366f1' : 'inherit',
        }}
      >
        <Smile className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '36px',
            left: 0,
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '8px',
            zIndex: 1500,
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gap: '4px',
            maxWidth: '320px',
            maxHeight: '240px',
            overflowY: 'auto',
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {EMOJI_LIST.map((emoji, index) => (
            <button
              key={index}
              onClick={() => insertEmoji(emoji)}
              style={{
                width: '28px',
                height: '28px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '20px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              className="hover:bg-gray-100"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
