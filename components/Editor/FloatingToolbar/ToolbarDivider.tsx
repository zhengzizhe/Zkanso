import React from 'react';

interface ToolbarDividerProps {
  theme?: 'feishu' | 'craft';
}

export const ToolbarDivider: React.FC<ToolbarDividerProps> = ({ theme = 'feishu' }) => {
  const color = theme === 'feishu' ? '#DEE0E3' : '#E5E5E5';

  return (
    <div
      style={{
        width: '1px',
        height: '20px',
        backgroundColor: color,
        margin: '0 4px',
      }}
      role="separator"
      aria-orientation="vertical"
    />
  );
};
