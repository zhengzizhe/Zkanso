import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Combine,
  Split,
  Palette,
  ToggleLeft,
  ToggleRight,
  Columns,
  Rows,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Copy,
  Eraser,
  Lock
} from 'lucide-react';
import { animations, shadows, borderRadius, zIndex } from '../utils/designSystem';

interface TableMenuProps {
  editor: Editor;
}

interface Position {
  top: number;
  left: number;
  opacity: number;
}

const PRESET_COLORS = [
  { color: '#FFFFFF', label: '白色' },
  { color: '#F3F4F6', label: '浅灰' },
  { color: '#DBEAFE', label: '浅蓝' },
  { color: '#DCFCE7', label: '浅绿' },
  { color: '#FEF3C7', label: '浅黄' },
  { color: '#FEE2E2', label: '浅红' },
  { color: '#E0E7FF', label: '浅紫' },
  { color: '#FCE7F3', label: '浅粉' },
];

export const TableMenu: React.FC<TableMenuProps> = ({ editor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0, opacity: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  /**
   * 计算工具栏位置
   */
  const calculatePosition = useCallback((): Position | null => {
    if (!editor) return null;

    const { selection } = editor.state;
    const { from, to } = selection;
    const inTable = editor.isActive('table');
    
    if (!inTable) return null;
    
    // 只有在选中单元格时才显示（_CellSelection）
    const isCellSelection = selection.constructor.name.includes('CellSelection');
    if (!isCellSelection) return null;

    // 获取选区位置
    const { view } = editor;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);

    // 工具栏尺寸
    const toolbarWidth = toolbarRef.current?.offsetWidth || 650;
    const toolbarHeight = 44;
    const spacing = 8;

    // 计算居中位置
    const centerX = (start.left + end.left) / 2;
    let left = centerX - toolbarWidth / 2;
    let top = start.top - toolbarHeight - spacing;

    // 边界检测
    const viewportWidth = window.innerWidth;
    const scrollY = window.scrollY;
    const padding = 16;

    if (left < padding) left = padding;
    if (left + toolbarWidth > viewportWidth - padding) {
      left = viewportWidth - toolbarWidth - padding;
    }

    if (top < scrollY + padding) {
      top = end.bottom + spacing;
    }

    return {
      top: top + scrollY,
      left,
      opacity: 1,
    };
  }, [editor]);

  /**
   * 监听选中变化
   */
  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const { selection } = editor.state;
      const inTable = editor.isActive('table');

      // 检查是否是 CellSelection（双击或拖选单元格）
      const isCellSelection = selection.constructor.name.includes('CellSelection');
      const shouldShow = inTable && isCellSelection;

      if (shouldShow) {
        timeoutRef.current = setTimeout(() => {
          const pos = calculatePosition();
          if (pos) {
            setPosition(pos);
            setIsVisible(true);
          }
        }, 150);
      } else {
        setIsVisible(false);
        setPosition({ top: 0, left: 0, opacity: 0 });
      }
    };

    editor.on('selectionUpdate', updateToolbar);
    editor.on('update', updateToolbar);

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
  }, [editor, calculatePosition, isVisible]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleCellBackgroundColor = (color: string) => {
    editor.chain().focus().setCellAttribute('backgroundColor', color).run();
    setShowColorPicker(false);
  };

  const handleClearCells = () => {
    editor.chain().focus().clearCells().run();
  };

  const handleFixColumnWidth = () => {
    const width = window.prompt('请输入列宽（像素）：', '100');
    if (width && !isNaN(Number(width))) {
      editor.chain().focus().setCellAttribute('colwidth', [Number(width)]).run();
    }
  };

  // 点击外部关闭颜色选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPicker]);

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={toolbarRef}
          {...animations.variants.floatingToolbar}
          transition={animations.transition.fast}
          style={{
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: zIndex.floating,
            minHeight: '44px',
            borderRadius: borderRadius.md,
            background: '#FFFFFF',
            boxShadow: shadows.lg,
            padding: '6px 8px',
          }}
          onMouseDown={handleMouseDown}
          className="floating-toolbar dark:bg-gray-800 dark:shadow-gray-900/30"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexWrap: 'wrap' }}>
            {/* 行操作 */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => editor.chain().focus().addRowBefore().run()}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                title="在上方插入行"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                title="在下方插入行"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                title="删除行"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* 列操作 */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                title="在左侧插入列"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                title="在右侧插入列"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                title="删除列"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* 表头切换 */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                title="切换表头行"
              >
                <Rows className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                title="切换表头列"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* 单元格操作 */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => editor.chain().focus().mergeCells().run()}
                disabled={!editor.can().mergeCells()}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="合并单元格"
              >
                <Combine className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => editor.chain().focus().splitCell().run()}
                disabled={!editor.can().splitCell()}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="拆分单元格"
              >
                <Split className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleClearCells}
                className="p-1.5 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400 transition-colors"
                title="清空内容"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* 列宽固定 */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={handleFixColumnWidth}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                title="固定列宽"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* 背景颜色 */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1.5 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 transition-colors"
                title="单元格背景色"
              >
                <Palette className="w-3.5 h-3.5" />
              </button>
              
              {/* 颜色选择器弹窗 */}
              {showColorPicker && (
                <div
                  ref={colorPickerRef}
                  className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[1500]"
                  style={{ minWidth: '180px' }}
                >
                  <div className="grid grid-cols-4 gap-1.5">
                    {PRESET_COLORS.map(({ color, label }) => (
                      <button
                        key={color}
                        onClick={() => handleCellBackgroundColor(color)}
                        className="w-8 h-8 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-500 transition-colors"
                        style={{ backgroundColor: color }}
                        title={label}
                      />
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleCellBackgroundColor('')}
                      className="w-full text-xs py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      清除背景色
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* 删除表格 */}
            <button
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="px-2 py-1 rounded text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors font-medium"
              title="删除表格"
            >
              删除表格
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
