import React from 'react';
import { Editor } from '@tiptap/react';
import { motion } from 'framer-motion';
import { colors, spacing, typography, borderRadius } from '../../utils/designSystem';

interface StatusBarProps {
  editor: Editor | null;
}

export const StatusBar: React.FC<StatusBarProps> = ({ editor }) => {
  if (!editor) return null;

  const { characters, words } = editor.storage.characterCount || { characters: 0, words: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="sticky bottom-0 left-0 right-0 h-8 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-flex-end px-4 z-10"
      style={{
        fontSize: typography.fontSize.sm,
        color: colors.gray[500],
        gap: spacing.lg,
      }}
    >
      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-1">
          <span>字符数:</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">{characters()}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>词数:</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">{words()}</span>
        </div>
      </div>
    </motion.div>
  );
};
