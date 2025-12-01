import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToolbarButton } from './ToolbarButton';
import { Palette, Type, Highlighter } from 'lucide-react';

interface ColorPickerProps {
  editor: Editor;
  theme?: 'feishu' | 'craft';
}

const TEXT_COLORS = [
  { label: '默认', value: '#1F2329' },
  { label: '红色', value: '#F54A45' },
  { label: '橙色', value: '#FF8F1F' },
  { label: '黄色', value: '#FFB02E' },
  { label: '绿色', value: '#00B578' },
  { label: '青色', value: '#14B8A6' },
  { label: '蓝色', value: '#3370FF' },
  { label: '紫色', value: '#8B5CF6' },
  { label: '灰色', value: '#646A73' },
];

const HIGHLIGHT_COLORS = [
  { label: '无', value: 'transparent' },
  { label: '黄色', value: '#FEF08A' },
  { label: '蓝色', value: '#BFDBFE' },
  { label: '粉色', value: '#FECACA' },
  { label: '绿色', value: '#BBF7D0' },
  { label: '紫色', value: '#E9D5FF' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ editor, theme = 'feishu' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'highlight'>('text');
  const [customColor, setCustomColor] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const applyTextColor = (color: string) => {
    if (color === '#1F2329') {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
  };

  const applyHighlight = (color: string) => {
    if (color === 'transparent') {
      editor.chain().focus().unsetHighlight().run();
    } else {
      editor.chain().focus().setHighlight({ color }).run();
    }
  };

  const applyCustomColor = () => {
    if (!customColor) return;
    
    const color = customColor.startsWith('#') ? customColor : `#${customColor}`;
    
    if (activeTab === 'text') {
      applyTextColor(color);
    } else {
      applyHighlight(color);
    }
    
    setCustomColor('');
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <ToolbarButton
        icon={<Palette size={16} strokeWidth={2.5} />}
        label="颜色"
        onClick={() => setIsOpen(!isOpen)}
        isActive={isOpen}
        theme={theme}
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
              width: '240px',
              background: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              padding: '12px',
              zIndex: 1500,
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {/* 标签切换 */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', borderBottom: '1px solid #F2F3F5', paddingBottom: '8px' }}>
              <button
                onClick={() => setActiveTab('text')}
                style={{
                  flex: 1,
                  padding: '6px',
                  border: 'none',
                  borderRadius: '4px',
                  background: activeTab === 'text' ? '#E6EDFF' : 'transparent',
                  color: activeTab === 'text' ? '#3370FF' : '#646A73',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <Type size={14} />
                文字颜色
              </button>
              <button
                onClick={() => setActiveTab('highlight')}
                style={{
                  flex: 1,
                  padding: '6px',
                  border: 'none',
                  borderRadius: '4px',
                  background: activeTab === 'highlight' ? '#E6EDFF' : 'transparent',
                  color: activeTab === 'highlight' ? '#3370FF' : '#646A73',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <Highlighter size={14} />
                背景颜色
              </button>
            </div>

            {/* 颜色网格 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              {(activeTab === 'text' ? TEXT_COLORS : HIGHLIGHT_COLORS).map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    if (activeTab === 'text') {
                      applyTextColor(color.value);
                    } else {
                      applyHighlight(color.value);
                    }
                  }}
                  title={color.label}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    border: color.value === 'transparent' ? '1px dashed #DEE0E3' : '1px solid #DEE0E3',
                    background: color.value,
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  {color.value === 'transparent' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(45deg)',
                        width: '20px',
                        height: '1px',
                        background: '#F54A45',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* 自定义颜色输入 */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#8F959E',
                    fontSize: '13px',
                    pointerEvents: 'none',
                  }}
                >
                  #
                </span>
                <input
                  type="text"
                  placeholder="自定义颜色"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value.replace('#', ''))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') applyCustomColor();
                  }}
                  maxLength={6}
                  style={{
                    width: '100%',
                    height: '32px',
                    paddingLeft: '20px',
                    paddingRight: '8px',
                    border: '1px solid #DEE0E3',
                    borderRadius: '4px',
                    fontSize: '13px',
                  }}
                />
              </div>
              <button
                onClick={applyCustomColor}
                disabled={!customColor}
                style={{
                  height: '32px',
                  padding: '0 12px',
                  border: 'none',
                  borderRadius: '4px',
                  background: customColor ? '#3370FF' : '#F2F3F5',
                  color: customColor ? '#FFFFFF' : '#C9CDD4',
                  fontSize: '13px',
                  cursor: customColor ? 'pointer' : 'not-allowed',
                }}
              >
                应用
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
