import React, { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Search, X, ChevronUp, ChevronDown, Replace, ReplaceAll } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { animations, shadows, borderRadius, zIndex, componentStyles } from '../../utils/designSystem';

interface SearchReplaceProps {
  editor: Editor | null;
  onClose: () => void;
}

export const SearchReplace: React.FC<SearchReplaceProps> = ({ editor, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [caseSensitive, setCaseSensitive] = useState(false);

  // 搜索功能
  const handleSearch = useCallback(() => {
    if (!editor || !searchTerm) return;

    const { state } = editor;
    const { doc } = state;
    let matches = 0;
    let positions: number[] = [];

    doc.descendants((node, pos) => {
      if (node.isText) {
        const text = caseSensitive ? node.text : node.text?.toLowerCase();
        const search = caseSensitive ? searchTerm : searchTerm.toLowerCase();
        
        if (text && text.includes(search)) {
          let index = text.indexOf(search);
          while (index !== -1) {
            positions.push(pos + index);
            matches++;
            index = text.indexOf(search, index + 1);
          }
        }
      }
    });

    setTotalMatches(matches);
    
    if (positions.length > 0) {
      // 高亮第一个匹配
      const firstPos = positions[0];
      editor.chain()
        .focus()
        .setTextSelection({ from: firstPos, to: firstPos + searchTerm.length })
        .run();
      setCurrentIndex(0);
    }
  }, [editor, searchTerm, caseSensitive]);

  // 下一个匹配
  const handleNext = useCallback(() => {
    if (!editor || !searchTerm) return;
    // 简化实现：重新搜索
    handleSearch();
  }, [editor, searchTerm, handleSearch]);

  // 上一个匹配
  const handlePrevious = useCallback(() => {
    if (!editor || !searchTerm) return;
    // 简化实现：重新搜索
    handleSearch();
  }, [editor, searchTerm, handleSearch]);

  // 替换当前
  const handleReplace = useCallback(() => {
    if (!editor || !searchTerm) return;

    const { state } = editor;
    const { from, to } = state.selection;
    const selectedText = state.doc.textBetween(from, to);

    if (selectedText === searchTerm || (!caseSensitive && selectedText.toLowerCase() === searchTerm.toLowerCase())) {
      editor.chain()
        .focus()
        .insertContentAt({ from, to }, replaceTerm)
        .run();
      
      // 搜索下一个
      handleNext();
    }
  }, [editor, searchTerm, replaceTerm, caseSensitive, handleNext]);

  // 全部替换
  const handleReplaceAll = useCallback(() => {
    if (!editor || !searchTerm) return;

    const { state } = editor;
    const { doc } = state;
    const tr = state.tr;
    let replaced = 0;

    // 从后往前替换，避免位置偏移
    const replacements: { from: number; to: number }[] = [];

    doc.descendants((node, pos) => {
      if (node.isText) {
        const text = caseSensitive ? node.text : node.text?.toLowerCase();
        const search = caseSensitive ? searchTerm : searchTerm.toLowerCase();
        
        if (text && text.includes(search)) {
          let index = text.indexOf(search);
          while (index !== -1) {
            replacements.push({
              from: pos + index,
              to: pos + index + searchTerm.length,
            });
            index = text.indexOf(search, index + 1);
          }
        }
      }
    });

    // 从后往前替换
    replacements.reverse().forEach(({ from, to }) => {
      tr.insertText(replaceTerm, from, to);
      replaced++;
    });

    if (replaced > 0) {
      editor.view.dispatch(tr);
      setTotalMatches(0);
      alert(`已替换 ${replaced} 处`);
    }
  }, [editor, searchTerm, replaceTerm, caseSensitive]);

  return (
    <AnimatePresence>
      {true && (
        <motion.div
          {...animations.variants.popupFromTop}
          transition={animations.transition.fast}
          className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[400px]"
          style={{
            zIndex: zIndex.modal,
            boxShadow: shadows.xl,
            borderRadius: borderRadius.lg,
          }}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Search className="w-4 h-4" />
              搜索与替换
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

      {/* 搜索输入 */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="搜索..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              autoFocus
            />
            <button
              onClick={handlePrevious}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="上一个"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="下一个"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          {totalMatches > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              找到 {totalMatches} 个匹配项
            </p>
          )}
        </div>

        {/* 替换输入 */}
        <div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              placeholder="替换为..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleReplace}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="替换"
            >
              <Replace className="w-4 h-4" />
            </button>
            <button
              onClick={handleReplaceAll}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="全部替换"
            >
              <ReplaceAll className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 选项 */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            区分大小写
          </label>
        </div>

        {/* 快捷键提示 */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400">
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+F</kbd> 打开搜索 •{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Enter</kbd> 搜索 •{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Esc</kbd> 关闭
          </p>
        </div>
      </div>
    </motion.div>
    )}
    </AnimatePresence>
  );
};
