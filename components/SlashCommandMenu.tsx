import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from '@tiptap/react';
import { getSlashCommands, SlashCommand } from '../extensions/SlashCommandExtension';
import { Search } from 'lucide-react';
import { animations, shadows, borderRadius, zIndex } from '../utils/designSystem';

interface SlashCommandMenuProps {
  editor: Editor | null;
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  query: string;
  onSelect: (command: SlashCommand) => void;
}

export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  editor,
  isOpen,
  position,
  onClose,
  query,
  onSelect,
}) => {
  const [filteredCommands, setFilteredCommands] = useState<SlashCommand[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const commands = getSlashCommands();

  // 按分类组织命令
  const groupedCommands: Record<string, SlashCommand[]> = React.useMemo(() => {
    const groups: Record<string, SlashCommand[]> = {};
    filteredCommands.forEach((cmd) => {
      const category = cmd.category || '其他';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // 过滤命令
  useEffect(() => {
    const filtered = commands.filter((cmd) => {
      const searchText = query.toLowerCase();
      return (
        cmd.title.toLowerCase().includes(searchText) ||
        cmd.description.toLowerCase().includes(searchText) ||
        cmd.searchTerms.some((term) => term.toLowerCase().includes(searchText))
      );
    });
    setFilteredCommands(filtered);
    setSelectedIndex(0);
  }, [query]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            onSelect(filteredCommands[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onSelect, onClose]);

  // 自动滚动到选中项
  useEffect(() => {
    const selectedElement = menuRef.current?.querySelector(
      `[data-index="${selectedIndex}"]`
    ) as HTMLElement;
    if (selectedElement) {
      selectedElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          {...animations.variants.popupFromTop}
          transition={animations.transition.fast}
          className="fixed w-72 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[420px] flex flex-col"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: zIndex.popover,
            boxShadow: shadows.lg,
            borderRadius: borderRadius.md,
          }}
        >
          {/* 搜索头部 */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={() => {}} // 由父组件控制
              placeholder="搜索命令..."
              className="flex-1 bg-transparent outline-none text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400"
              autoFocus
            />
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {filteredCommands.length}
            </span>
          </div>

          {/* 命令列表 - 分类显示 */}
          <div className="overflow-y-auto flex-1">
            {filteredCommands.length > 0 ? (
              Object.entries(groupedCommands).map(([category, cmds]) => (
                <div key={category}>
                  {/* 分类标题 */}
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-900/30 sticky top-0">
                    {category}
                  </div>
                  {/* 分类下的命令 */}
                  {cmds.map((command) => {
                    const cmdIndex = filteredCommands.indexOf(command);
                    return (
                      <motion.div
                        key={command.title}
                        data-index={cmdIndex}
                        onClick={() => onSelect(command)}
                        onMouseEnter={() => setSelectedIndex(cmdIndex)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`px-3 py-2 cursor-pointer transition-colors ${
                          cmdIndex === selectedIndex
                            ? 'bg-indigo-50 dark:bg-indigo-900/30'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-gray-400 dark:text-gray-500 mt-0.5">
                            {command.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                {command.title}
                              </span>
                              {cmdIndex === selectedIndex && (
                                <span className="text-[10px] px-1 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                                  ↵
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                              {command.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className="px-3 py-6 text-center text-gray-400 dark:text-gray-500 text-xs">
                {query ? '没有找到匹配的命令' : '输入搜索...'}
              </div>
            )}
          </div>

          {/* 底部提示 */}
          {filteredCommands.length > 0 && (
            <div className="text-[10px] text-gray-400 dark:text-gray-500 px-3 py-1.5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-center">
              ↑↓ 选择 · ↵ 确认 · Esc 关闭
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlashCommandMenu;
