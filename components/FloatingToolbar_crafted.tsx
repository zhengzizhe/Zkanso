import React, { useEffect, useState, useRef } from 'react';
import { Bold, Italic, Underline, Code, Link, Strikethrough } from 'lucide-react';

interface FloatingToolbarProps {
  onFormat: (format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'link') => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ onFormat }) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.toString().trim() === '') {
        setPosition(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // 计算工具栏位置（在选中文本上方）
      const top = rect.top + window.scrollY - 50;
      const left = rect.left + window.scrollX + (rect.width / 2) - 150; // 居中

      setPosition({ top, left });
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  if (!position) return null;

  const buttons = [
    { icon: Bold, format: 'bold' as const, label: 'Bold (⌘B)' },
    { icon: Italic, format: 'italic' as const, label: 'Italic (⌘I)' },
    { icon: Underline, format: 'underline' as const, label: 'Underline (⌘U)' },
    { icon: Strikethrough, format: 'strikethrough' as const, label: 'Strikethrough' },
    { icon: Code, format: 'code' as const, label: 'Code' },
    { icon: Link, format: 'link' as const, label: 'Link (⌘K)' },
  ];

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[9999] bg-gray-900 text-white rounded-lg shadow-2xl px-2 py-2 flex items-center gap-1 animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{ top: position.top, left: position.left }}
    >
      {buttons.map(({ icon: Icon, format, label }) => (
        <button
          key={format}
          onClick={() => onFormat(format)}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition-colors duration-150"
          title={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};
