import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorPickerProps {
  onSelect: (color: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
  title?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ onSelect, onClose, position, title = '选择颜色' }) => {
  const [customColor, setCustomColor] = useState('#000000');

  // 预设颜色
  const presetColors = [
    // 基础色
    { name: '黑色', value: '#000000' },
    { name: '白色', value: '#FFFFFF' },
    { name: '灰色', value: '#9CA3AF' },
    
    // 红色系
    { name: '红色', value: '#EF4444' },
    { name: '粉色', value: '#EC4899' },
    { name: '玫瑰', value: '#F43F5E' },
    
    // 橙色系
    { name: '橙色', value: '#F97316' },
    { name: '琥珀', value: '#F59E0B' },
    { name: '黄色', value: '#EAB308' },
    
    // 绿色系
    { name: '青柠', value: '#84CC16' },
    { name: '绿色', value: '#22C55E' },
    { name: '翠绿', value: '#10B981' },
    
    // 蓝色系
    { name: '青色', value: '#06B6D4' },
    { name: '天蓝', value: '#0EA5E9' },
    { name: '蓝色', value: '#3B82F6' },
    
    // 紫色系
    { name: '靛蓝', value: '#6366F1' },
    { name: '紫色', value: '#8B5CF6' },
    { name: '玫紫', value: '#A855F7' },
    
    // 背景色（浅色）
    { name: '淡红', value: '#FEE2E2' },
    { name: '淡橙', value: '#FED7AA' },
    { name: '淡黄', value: '#FEF3C7' },
    { name: '淡绿', value: '#D1FAE5' },
    { name: '淡蓝', value: '#DBEAFE' },
    { name: '淡紫', value: '#E9D5FF' },
  ];

  const handleSelectColor = (color: string) => {
    onSelect(color);
    onClose();
  };

  return (
    <>
      {/* 背景遮罩 */}
      <div className="fixed inset-0 z-[10000]" onClick={onClose} />

      {/* 颜色选择器 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="fixed z-[10001] w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="p-4">
          {/* 标题 */}
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {title}
          </div>

          {/* 预设颜色网格 */}
          <div className="grid grid-cols-6 gap-2 mb-4">
            {presetColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleSelectColor(color.value)}
                className="w-10 h-10 rounded border-2 border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>

          {/* 自定义颜色 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              自定义颜色
            </div>
            <div className="flex gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-10 rounded border border-gray-200 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="#000000"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent"
              />
              <button
                onClick={() => handleSelectColor(customColor)}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
