import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToolbarButton } from './ToolbarButton';
import { Link as LinkIcon, ExternalLink, Trash2 } from 'lucide-react';

interface LinkEditorProps {
  editor: Editor;
  theme?: 'feishu' | 'craft';
}

export const LinkEditor: React.FC<LinkEditorProps> = ({ editor, theme = 'feishu' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // 获取当前链接信息
  const currentLink = editor.getAttributes('link');
  const hasLink = editor.isActive('link');

  useEffect(() => {
    if (isOpen) {
      if (hasLink) {
        setUrl(currentLink.href || '');
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to);
        setText(selectedText);
      } else {
        setUrl('');
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to);
        setText(selectedText);
      }
      setTimeout(() => urlInputRef.current?.focus(), 100);
    }
  }, [isOpen, hasLink, currentLink, editor]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const insertOrUpdateLink = () => {
    if (!url.trim()) return;

    let finalUrl = url.trim();
    
    // 自动添加协议
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    if (text.trim() && !hasLink) {
      // 插入新链接（带文字）
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: text.trim(),
          marks: [
            {
              type: 'link',
              attrs: {
                href: finalUrl,
                target: '_blank',
              },
            },
          ],
        })
        .run();
    } else {
      // 更新现有链接
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: finalUrl, target: '_blank' })
        .run();
    }

    setIsOpen(false);
    setUrl('');
    setText('');
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setIsOpen(false);
    setUrl('');
    setText('');
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <ToolbarButton
        icon={<LinkIcon size={16} strokeWidth={2.5} />}
        label="链接"
        onClick={() => setIsOpen(!isOpen)}
        isActive={isOpen || hasLink}
        theme={theme}
        shortcut="⌘K"
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '40px',
              left: 0,
              width: '360px',
              background: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              padding: '16px',
              zIndex: 1500,
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <div style={{ marginBottom: '12px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#1F2329',
                  marginBottom: '6px',
                }}
              >
                链接地址 *
              </label>
              <input
                ref={urlInputRef}
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') insertOrUpdateLink();
                  if (e.key === 'Escape') setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '0 8px',
                  border: '1px solid #DEE0E3',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>

            {!hasLink && (
              <div style={{ marginBottom: '12px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#1F2329',
                    marginBottom: '6px',
                  }}
                >
                  显示文字
                </label>
                <input
                  type="text"
                  placeholder="输入链接文字（可选）"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') insertOrUpdateLink();
                    if (e.key === 'Escape') setIsOpen(false);
                  }}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 8px',
                    border: '1px solid #DEE0E3',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={insertOrUpdateLink}
                  disabled={!url.trim()}
                  style={{
                    height: '32px',
                    padding: '0 16px',
                    border: 'none',
                    borderRadius: '4px',
                    background: url.trim() ? '#3370FF' : '#F2F3F5',
                    color: url.trim() ? '#FFFFFF' : '#C9CDD4',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: url.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ExternalLink size={14} />
                  {hasLink ? '更新' : '插入'}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setUrl('');
                    setText('');
                  }}
                  style={{
                    height: '32px',
                    padding: '0 16px',
                    border: '1px solid #DEE0E3',
                    borderRadius: '4px',
                    background: '#FFFFFF',
                    color: '#1F2329',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  取消
                </button>
              </div>

              {hasLink && (
                <button
                  onClick={removeLink}
                  style={{
                    height: '32px',
                    padding: '0 12px',
                    border: 'none',
                    borderRadius: '4px',
                    background: '#FFEBEA',
                    color: '#F54A45',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Trash2 size={14} />
                  删除
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
