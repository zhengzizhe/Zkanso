import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, Scissors, Trash2, ChevronRight,
  Indent, Outdent, FileText, Download,
  Plus,
  AlignLeft, AlignCenter, AlignRight, Palette, Grid3x3,
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Check,
  ImageIcon, Link as LinkIcon, FileDown, Clipboard,
  Type, Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Code, CheckSquare, Minus, Video, BarChart3,
  Sigma, Lightbulb, AlertCircle, Info, AlertTriangle
} from 'lucide-react';
import { ColorPicker } from './ColorPicker';

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  editor: any;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ isOpen, position, onClose, editor }) => {
  const [showColorPicker, setShowColorPicker] = useState<'text' | null>(null);
  const [colorPickerPosition, setColorPickerPosition] = useState({ x: 0, y: 0 });
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // 菜单打开时重置所有状态
  React.useEffect(() => {
    if (isOpen) {
      setActiveSubmenu(null);
      setShowColorPicker(null);
      setAdjustedPosition(position);
    }
  }, [isOpen]);

  // 智能调整菜单位置，避免超出屏幕或被遭挡
  React.useEffect(() => {
    if (isOpen && menuRef.current) {
      // 使用 requestAnimationFrame 确保 DOM已渲染
      requestAnimationFrame(() => {
        if (!menuRef.current) return;
        
        const menuWidth = menuRef.current.offsetWidth || 256;
        const menuHeight = menuRef.current.offsetHeight || 600;
        const padding = 10;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let newX = position.x;
        let newY = position.y;
        
        // 水平调整：如果右侧空间不够，就显示在鼠标左侧
        if (newX + menuWidth + padding > viewportWidth) {
          newX = Math.max(padding, newX - menuWidth);
        }
        
        // 垂直调整：如果底部空间不够，就向上显示
        if (newY + menuHeight > viewportHeight) {
          newY = Math.max(padding, viewportHeight - menuHeight - padding);
        }
        
        // 确保不超出屏幕上边缘
        if (newY < padding) {
          newY = padding;
        }
        
        setAdjustedPosition({ x: newX, y: newY });
      });
    }
  }, [isOpen, position, activeSubmenu]); // 子菜单展开时也重新计算位置

  
  // 使用 useMemo 优化菜单项性能
  const menuItems = useMemo(() => [
    // 基础操作（最高频）
    {
      group: 'basic',
      items: [
        { icon: <Scissors className="w-4 h-4" />, label: '剪切', shortcut: 'Cmd+X', action: () => document.execCommand('cut') },
        { icon: <Copy className="w-4 h-4" />, label: '复制', shortcut: 'Cmd+C', action: () => document.execCommand('copy') },
        { icon: <Clipboard className="w-4 h-4" />, label: '粘贴', shortcut: 'Cmd+V', action: () => document.execCommand('paste') },
        { icon: <Trash2 className="w-4 h-4" />, label: '删除', shortcut: 'Del', action: () => editor?.commands.deleteSelection(), danger: true },
      ]
    },
    // 块操作
    {
      group: 'block',
      items: [
        { 
          icon: <Type className="w-4 h-4" />, 
          label: '转换为',
          hasSubmenu: true,
          submenu: [
            { icon: <Type className="w-3 h-3" />, label: '正文', action: () => editor?.chain().focus().setParagraph().run() },
            { icon: <Heading1 className="w-3 h-3" />, label: '标题1', action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run() },
            { icon: <Heading2 className="w-3 h-3" />, label: '标题2', action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
            { icon: <Heading3 className="w-3 h-3" />, label: '标题3', action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() },
            { icon: <List className="w-3 h-3" />, label: '无序列表', action: () => editor?.chain().focus().toggleBulletList().run() },
            { icon: <ListOrdered className="w-3 h-3" />, label: '有序列表', action: () => editor?.chain().focus().toggleOrderedList().run() },
            { icon: <CheckSquare className="w-3 h-3" />, label: '任务列表', action: () => editor?.chain().focus().toggleTaskList().run() },
            { icon: <Quote className="w-3 h-3" />, label: '引用块', action: () => editor?.chain().focus().toggleBlockquote().run() },
            { icon: <Code className="w-3 h-3" />, label: '代码块', action: () => editor?.chain().focus().toggleCodeBlock().run() },
          ]
        },
        { 
          icon: <Plus className="w-4 h-4" />, 
          label: '插入',
          hasSubmenu: true,
          submenu: [
            { icon: <ImageIcon className="w-3 h-3" />, label: '图片', action: () => { const url = prompt('请输入图片链接：'); if (url) { editor?.chain().focus().setImage({ src: url }).run(); } } },
            { icon: <Video className="w-3 h-3" />, label: '视频', action: () => { const url = prompt('请输入视频链接：'); if (url) { alert('视频功能开发中'); } } },
            { icon: <LinkIcon className="w-3 h-3" />, label: '链接', action: () => { const url = prompt('请输入链接地址：'); if (url) { editor?.chain().focus().setLink({ href: url }).run(); } } },
            { icon: <Minus className="w-3 h-3" />, label: '分割线', action: () => editor?.chain().focus().setHorizontalRule().run() },
            { icon: <Sigma className="w-3 h-3" />, label: '公式', action: () => alert('公式功能开发中') },
            { icon: <BarChart3 className="w-3 h-3" />, label: 'Mermaid图表', action: () => alert('Mermaid图表功能开发中') },
          ]
        },
        { 
          icon: <AlertCircle className="w-4 h-4" />, 
          label: '提示块',
          hasSubmenu: true,
          submenu: [
            { icon: <Info className="w-3 h-3" />, label: '信息', action: () => alert('提示块功能开发中') },
            { icon: <AlertTriangle className="w-3 h-3" />, label: '警告', action: () => alert('提示块功能开发中') },
            { icon: <AlertCircle className="w-3 h-3" />, label: '错误', action: () => alert('提示块功能开发中') },
            { icon: <Lightbulb className="w-3 h-3" />, label: '提示', action: () => alert('提示块功能开发中') },
          ]
        },
        { icon: <FileText className="w-4 h-4" />, label: '同步块', action: () => {} },
        { icon: <Indent className="w-4 h-4" />, label: '增加缩进', shortcut: 'Tab', action: () => editor?.commands.indent?.() },
        { icon: <Outdent className="w-4 h-4" />, label: '减少缩进', shortcut: 'Shift+Tab', action: () => editor?.commands.outdent?.() },
      ]
    },
  ], [editor]);

  // 键盘导航（已禁用，避免与编辑器冲突）
  // 如果需要菜单键盘导航，可以取消注释下面的代码
  /*
  useEffect(() => {
    if (!isOpen) return;
    // 暂时禁用键盘导航，避免与编辑器冲突
    // 如需启用，取消下面代码的注释
    const handleKeyDown = (e: KeyboardEvent) => {
      // 只处理菜单打开时的键盘事件
      if (showColorPicker) return; // 如果颜色选择器打开，不处理
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          e.stopPropagation();
          setFocusedIndex((prev) => (prev + 1) % flattenedItems.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          e.stopPropagation();
          setFocusedIndex((prev) => (prev - 1 + flattenedItems.length) % flattenedItems.length);
          break;
        case 'Enter':
          e.preventDefault();
          e.stopPropagation();
          if (flattenedItems[focusedIndex]?.action) {
            flattenedItems[focusedIndex].action();
            setTimeout(() => onClose(), 50);
          }
          break;
        case 'Escape':
          e.preventDefault();
          e.stopPropagation();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isOpen, onClose, showColorPicker]);
  */

  const handleAction = useCallback((action?: (e?: any) => void | boolean, e?: React.MouseEvent) => {
    if (action) {
      // 阻止事件冒泡
      e?.stopPropagation();
      const result = action(e);
      // 如果 action 返回 true，表示需要保持菜单打开（比如打开颜色选择器）
      // 否则，延迟关闭菜单
      if (result !== true) {
        setTimeout(() => onClose(), 50);
      }
    }
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={onClose}
          />
          
          {/* 右键菜单 */}
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
            className="fixed z-[9999] w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden max-h-[80vh] overflow-y-auto ring-1 ring-black/5 dark:ring-white/5"
            style={{
              left: `${adjustedPosition.x}px`,
              top: `${adjustedPosition.y}px`,
            }}
          >
            <div className="py-2">
              {menuItems.map((group: any, groupIndex) => (
                <React.Fragment key={group.group}>
                  {groupIndex > 0 && (
                    <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                  )}
                  
                  {/* 分组标题（如果有） */}
                  {group.title && (
                    <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {group.title}
                    </div>
                  )}
                  
                  <div className="px-1">
                    {group.items.map((item: any, itemIndex: number) => (
                      <div key={itemIndex} className="relative">
                        <motion.button
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!item.disabled) {
                              if (item.hasSubmenu) {
                                setActiveSubmenu(activeSubmenu === `${groupIndex}-${itemIndex}` ? null : `${groupIndex}-${itemIndex}`);
                              } else {
                                handleAction(item.action, e);
                              }
                            }
                          }}
                          disabled={item.disabled}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left group ${
                            item.disabled
                              ? 'opacity-50 cursor-not-allowed'
                              : item.danger
                                ? 'hover:bg-red-50 dark:hover:bg-red-900/20'
                                : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700/50 dark:hover:to-gray-700/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                              item.danger 
                                ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' 
                                : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'
                            }`}>
                              {item.icon}
                            </div>
                            <span className={`text-sm font-medium ${
                              item.danger
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                            }`}>
                              {item.label}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {item.shortcut && (
                              <span className="text-xs text-gray-400 font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700">{item.shortcut}</span>
                            )}
                            {item.rightIcon && item.rightIcon}
                            {item.hasSubmenu && (
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                            )}
                          </div>
                        </motion.button>
                        
                        {/* 子菜单 - 优化样式 */}
                        {item.hasSubmenu && activeSubmenu === `${groupIndex}-${itemIndex}` && item.submenu && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 mt-1 mb-1 border-l-2 border-indigo-200 dark:border-indigo-800 pl-2 space-y-0.5"
                          >
                            {item.submenu.map((subItem: any, subIndex: number) => (
                              <motion.button
                                key={subIndex}
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: subIndex * 0.03 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction(subItem.action, e);
                                }}
                                disabled={subItem.disabled}
                                className={`w-full flex items-center justify-between gap-2 text-left px-3 py-2 text-sm rounded-lg transition-all group ${
                                  subItem.disabled
                                    ? 'opacity-50 cursor-not-allowed'
                                    : subItem.danger
                                      ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400'
                                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {subItem.icon && (
                                    <span className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center bg-gray-100 dark:bg-gray-700 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{subItem.icon}</span>
                                  )}
                                  <span>{subItem.label}</span>
                                </div>
                                {subItem.shortcut && (
                                  <span className="text-xs text-gray-400 font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700">{subItem.shortcut}</span>
                                )}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </motion.div>
          
          {/* 颜色选择器 */}
          <AnimatePresence>
            {showColorPicker && (
              <ColorPicker
                position={colorPickerPosition}
                title="选择文字颜色"
                onSelect={(color) => {
                  // 先关闭颜色选择器
                  setShowColorPicker(null);
                  
                  // 应用文字颜色
                  editor?.chain().focus().setColor(color).run();
                  
                  // 稍后关闭菜单
                  setTimeout(() => {
                    onClose();
                  }, 50);
                }}
                onClose={() => setShowColorPicker(null)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};
