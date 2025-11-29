import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface FloatingToolbarProps {
  editor: Editor | null;
  delay?: number;
  theme?: 'feishu' | 'craft';
  children?: React.ReactNode;
}

interface Position {
  top: number;
  left: number;
  opacity: number;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  editor,
  delay = 150,
  theme = 'feishu',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0, opacity: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 计算工具栏位置
   * 需求：在选中文本上方居中显示，避免遮挡选中内容
   */
  const calculatePosition = useCallback((): Position | null => {
    if (!editor) return null;

    const { from, to, empty } = editor.state.selection;
    
    // 如果没有选中内容，隐藏工具栏
    if (empty) return null;

    // 获取选中区域的 DOM 范围
    const { view } = editor;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);

    // 工具栏宽度（需要在渲染后获取真实宽度）
    const toolbarWidth = toolbarRef.current?.offsetWidth || 400;
    const toolbarHeight = theme === 'feishu' ? 44 : 40;
    const spacing = 8; // 与选中文本的间距

    // 计算居中位置
    const centerX = (start.left + end.left) / 2;
    let left = centerX - toolbarWidth / 2;

    // 计算顶部位置（在选中文本上方）
    let top = start.top - toolbarHeight - spacing;

    // 边界检测：防止超出视口
    const viewportWidth = window.innerWidth;
    const scrollY = window.scrollY;

    // 左右边界
    const padding = 16;
    if (left < padding) left = padding;
    if (left + toolbarWidth > viewportWidth - padding) {
      left = viewportWidth - toolbarWidth - padding;
    }

    // 上下边界：如果上方空间不足，则显示在下方
    if (top < scrollY + padding) {
      top = end.bottom + spacing;
    }

    return {
      top: top + scrollY,
      left,
      opacity: 1,
    };
  }, [editor, theme]);

  /**
   * 监听选中变化
   */
  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      // 清除之前的延迟
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const { empty } = editor.state.selection;

      if (empty) {
        // 无选中内容，立即隐藏
        setIsVisible(false);
        setPosition({ top: 0, left: 0, opacity: 0 });
      } else {
        // 有选中内容，延迟显示
        timeoutRef.current = setTimeout(() => {
          const pos = calculatePosition();
          if (pos) {
            setPosition(pos);
            setIsVisible(true);
          }
        }, delay);
      }
    };

    // 监听编辑器状态更新
    editor.on('selectionUpdate', updateToolbar);
    editor.on('update', updateToolbar);

    // 监听滚动和窗口调整
    const handleScroll = () => {
      if (isVisible) {
        const pos = calculatePosition();
        if (pos) setPosition(pos);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      editor.off('selectionUpdate', updateToolbar);
      editor.off('update', updateToolbar);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [editor, delay, calculatePosition, isVisible]);

  /**
   * 阻止工具栏上的鼠标事件导致编辑器失焦
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // 主题样式
  const themeStyles = {
    feishu: {
      height: '44px',
      borderRadius: '8px',
      background: '#FFFFFF',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
      padding: '6px 8px',
    },
    craft: {
      height: '40px',
      borderRadius: '8px',
      background: '#FFFFFF',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
      padding: '4px 6px',
    },
  };

  const currentTheme = themeStyles[theme];

  // 使用 Portal 渲染到 body
  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={toolbarRef}
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{
            duration: 0.15,
            ease: [0.4, 0, 0.2, 1], // easeInOut
          }}
          style={{
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 1400,
            ...currentTheme,
          }}
          onMouseDown={handleMouseDown}
          className="floating-toolbar"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
