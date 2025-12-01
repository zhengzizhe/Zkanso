import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { allCommands } from '../SlashCommand/commands';
import { SlashCommand } from '../SlashCommand/types';

interface SlashMenuProps {
  editor: Editor | null;
}

/**
 * Craft 风格斜杠命令菜单
 * 
 * 设计规范：
 * - 宽度: 320px
 * - 最大高度: 400px (滚动)
 * - 圆角: 10px
 * - 阴影: shadow-5 (层级 5)
 * - 项目高度: 44px
 * - 动画: 150ms cubic-bezier
 */
export const SlashMenu: React.FC<SlashMenuProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  /**
   * 使用测试 Demo 的完整 30+ 命令集
   * 复用自 components/SlashCommand/commands/
   */
  const menuItems: SlashCommand[] = allCommands;

  /**
   * 过滤菜单项 - 支持标题、描述、关键词搜索
   */
  const filteredItems = menuItems.filter(item => {
    if (query === '') return true;
    
    const lowerQuery = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.keywords.some(k => k.toLowerCase().includes(lowerQuery))
    );
  });

  /**
   * 监听斜杠命令触发
   */
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const { selection } = editor.state;
      const { $from } = selection;
      const text = $from.nodeBefore?.text || '';

      // 检测斜杠命令
      if (text.endsWith('/')) {
        const { view } = editor;
        const coords = view.coordsAtPos($from.pos);
        
        setPosition({
          top: coords.bottom + 4,
          left: coords.left
        });
        
        setIsOpen(true);
        setQuery('');
        setSelectedIndex(0);
      } else if (isOpen && text.includes('/')) {
        // 更新搜索查询
        const slashIndex = text.lastIndexOf('/');
        const searchQuery = text.substring(slashIndex + 1);
        setQuery(searchQuery);
        setSelectedIndex(0);
      } else {
        setIsOpen(false);
      }
    };

    editor.on('update', handleUpdate);
    editor.on('selectionUpdate', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      editor.off('selectionUpdate', handleUpdate);
    };
  }, [editor, isOpen]);

  /**
   * 选择菜单项
   */
  const selectItem = useCallback((item: SlashCommand) => {
    if (!editor) return;

    // 删除斜杠命令文本
    const { selection } = editor.state;
    const { $from } = selection;
    const text = $from.nodeBefore?.text || '';
    const slashIndex = text.lastIndexOf('/');
    
    if (slashIndex !== -1) {
      editor
        .chain()
        .deleteRange({
          from: $from.pos - (text.length - slashIndex),
          to: $from.pos
        })
        .run();
    }

    // 执行命令 - 调用 action 方法
    if (item.action) {
      item.action(editor);
    }
    
    setIsOpen(false);
  }, [editor]);

  /**
   * 键盘导航
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex(prev => 
          Math.min(prev + 1, filteredItems.length - 1)
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (filteredItems[selectedIndex]) {
          selectItem(filteredItems[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(false);
      }
    };

    // 使用 capture 阶段拦截，优先级高于 TipTap
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, selectedIndex, filteredItems, selectItem]);

  /**
   * 自动滚动到选中项
   */
  useEffect(() => {
    if (!isOpen) return;
    
    const selectedElement = itemRefs.current.get(selectedIndex);
    if (selectedElement) {
      selectedElement.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex, isOpen]);

  if (!editor) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="craft-slash-menu"
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ 
            duration: 0.15, 
            ease: [0.4, 0, 0.2, 1] 
          }}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            zIndex: 'var(--craft-z-dropdown)'
          }}
        >
          <div className="craft-slash-menu-container">
            {/* 搜索提示 */}
            {query && (
              <div className="craft-slash-menu-header">
                搜索: {query}
              </div>
            )}

            {/* 菜单项列表 */}
            <div className="craft-slash-menu-list" ref={listRef}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    isSelected={index === selectedIndex}
                    onClick={() => selectItem(item)}
                    onMount={(el) => {
                      if (el) {
                        itemRefs.current.set(index, el);
                      } else {
                        itemRefs.current.delete(index);
                      }
                    }}
                  />
                ))
              ) : (
                <div className="craft-slash-menu-empty">
                  未找到匹配项
                </div>
              )}
            </div>

            {/* 底部提示 */}
            <div className="craft-slash-menu-footer">
              <span className="text-xs text-gray-500">
                ↑↓ 选择 · Enter 确认 · Esc 取消
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * 单个菜单项组件
 */
interface MenuItemComponentProps {
  item: SlashCommand;
  isSelected: boolean;
  onClick: () => void;
  onMount: (el: HTMLDivElement | null) => void;
}

const MenuItem: React.FC<MenuItemComponentProps> = ({ 
  item, 
  isSelected, 
  onClick,
  onMount
}) => {
  const Icon = item.icon;
  const ref = useCallback((node: HTMLDivElement | null) => {
    onMount(node);
  }, [onMount]);
  
  return (
    <motion.div
      ref={ref}
      className={`craft-slash-menu-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      whileHover={{ backgroundColor: 'var(--craft-hover)' }}
    >
      <div className="craft-slash-menu-item-icon">
        <Icon className="w-5 h-5" />
      </div>
      <div className="craft-slash-menu-item-content">
        <div className="craft-slash-menu-item-title">
          {item.title}
        </div>
        {item.description && (
          <div className="craft-slash-menu-item-description">
            {item.description}
          </div>
        )}
      </div>
    </motion.div>
  );
};
