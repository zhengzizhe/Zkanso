import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Range } from '@tiptap/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SlashCommand, SlashCommandCategory, MenuPosition } from './types';
import { commandsByCategory } from './commands';
import { searchCommandsByCategory } from './utils/search';

interface SlashCommandMenuProps {
  editor: Editor | null;
  query: string;
  range: Range | null;
  onSelect: (command: SlashCommand) => void;
  onClose: () => void;
}

/**
 * 斜杠命令菜单组件
 * 当用户输入 '/' 时显示，提供快速插入各种块类型的功能
 */
export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  editor,
  query,
  range,
  onSelect,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCategories, setFilteredCategories] = useState<SlashCommandCategory[]>([]);
  const [position, setPosition] = useState<MenuPosition>({ x: 100, y: 100 });
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // 过滤命令
  useEffect(() => {
    const filtered = searchCommandsByCategory(query, commandsByCategory);
    setFilteredCategories(filtered);
    setSelectedIndex(0);
  }, [query]);

  // 计算菜单位置
  useEffect(() => {
    if (!editor || !range) return;

    try {
      const { view } = editor;
      const coords = view.coordsAtPos(range.from);
      
      // 计算位置（避免超出屏幕）
      const menuWidth = 320;
      const menuHeight = 400;
      const padding = 16;
      
      let x = coords.left;
      let y = coords.bottom + 8;
      
      // 防止右侧溢出
      if (x + menuWidth > window.innerWidth - padding) {
        x = window.innerWidth - menuWidth - padding;
      }
      
      // 防止左侧溢出
      if (x < padding) {
        x = padding;
      }
      
      // 防止底部溢出（显示在上方）
      if (y + menuHeight > window.innerHeight - padding) {
        y = coords.top - menuHeight - 8;
      }
      
      // 防止顶部溢出
      if (y < padding) {
        y = padding;
      }
      
      setPosition({ x, y });
    } catch (error) {
      console.error('Error calculating menu position:', error);
    }
  }, [editor, range]);

  // 获取所有可见命令的扁平列表
  const flatCommands = filteredCategories.flatMap((cat) => cat.commands);

  // 自动滚动到选中项
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flatCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatCommands.length) % flatCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatCommands[selectedIndex]) {
          handleSelect(flatCommands[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, flatCommands, onClose]);

  // 处理命令选择
  const handleSelect = useCallback(
    (command: SlashCommand) => {
      if (editor && range) {
        command.action(editor, range);
        onSelect(command);
      }
    },
    [editor, range, onSelect]
  );

  if (filteredCategories.length === 0) {
    return null;
  }

  let globalIndex = 0;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
          mass: 0.8,
        }}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 9999,
        }}
        className="w-80 max-h-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-xl"
      >
        {/* 搜索提示头部 */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {query ? `搜索: "${query}"` : '输入关键词筛选命令...'}
            </span>
            {flatCommands.length > 0 && (
              <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                {flatCommands.length} 个结果
              </span>
            )}
          </div>
        </div>

        {/* 命令列表 */}
        <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
          {filteredCategories.map((category, catIndex) => (
            <div key={category.category}>
              {/* 分类标题 */}
              <div className="px-3 py-2 flex items-center gap-2">
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-transparent dark:from-gray-700 dark:via-gray-600" />
                <span className="text-xs font-bold tracking-wider uppercase text-gray-400 dark:text-gray-500">
                  {category.category}
                </span>
                <div className="flex-1 h-px bg-gradient-to-l from-gray-200 via-gray-300 to-transparent dark:from-gray-700 dark:via-gray-600" />
              </div>

              {/* 命令项 */}
              {category.commands.map((command) => {
                const currentIndex = globalIndex++;
                const isSelected = currentIndex === selectedIndex;

                return (
                  <motion.button
                    key={command.id}
                    ref={isSelected ? selectedRef : null}
                    onClick={() => handleSelect(command)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 shadow-sm'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {/* 图标 */}
                    <div
                      className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-600 dark:text-indigo-400 scale-110 shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <command.icon className="w-4 h-4" />
                    </div>

                    {/* 文字内容 */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                          {command.title}
                        </div>
                        {command.shortcut && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            {command.shortcut}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {command.description}
                      </div>
                    </div>

                    {/* 选中指示器 */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"
                      />
                    )}
                  </motion.button>
                );
              })}

              {catIndex < filteredCategories.length - 1 && <div className="my-1" />}
            </div>
          ))}
        </div>

        {/* 底部快捷键提示 */}
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-[10px] font-mono shadow-sm">
                ↑↓
              </kbd>
              <span>导航</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-[10px] font-mono shadow-sm">
                Enter
              </kbd>
              <span>选择</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-[10px] font-mono shadow-sm">
                Esc
              </kbd>
              <span>关闭</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
