import React from 'react';
import { Moon, Sun, Eye, EyeOff, AlignCenter } from 'lucide-react';

interface ModeToolbarProps {
  isDarkMode: boolean;
  isFocusMode: boolean;
  isTypewriterMode: boolean;
  onToggleDarkMode: () => void;
  onToggleFocusMode: () => void;
  onToggleTypewriterMode: () => void;
}

export const ModeToolbar: React.FC<ModeToolbarProps> = ({
  isDarkMode,
  isFocusMode,
  isTypewriterMode,
  onToggleDarkMode,
  onToggleFocusMode,
  onToggleTypewriterMode,
}) => {
  return (
    <div className="fixed bottom-8 right-8 z-[9998] flex gap-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2">
      {/* 暗黑模式 */}
      <button
        onClick={onToggleDarkMode}
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
          isDarkMode
            ? 'bg-indigo-500 text-white'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
        title="切换暗黑模式 (Cmd+D)"
      >
        {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      {/* 专注模式 */}
      <button
        onClick={onToggleFocusMode}
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
          isFocusMode
            ? 'bg-indigo-500 text-white'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
        title="切换专注模式 (Cmd+.)"
      >
        {isFocusMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>

      {/* 打字机模式 */}
      <button
        onClick={onToggleTypewriterMode}
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
          isTypewriterMode
            ? 'bg-indigo-500 text-white'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
        title="切换打字机模式 (Cmd+T)"
      >
        <AlignCenter className="w-5 h-5" />
      </button>
    </div>
  );
};
