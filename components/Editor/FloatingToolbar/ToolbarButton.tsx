import React from 'react';
import { motion } from 'framer-motion';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  theme?: 'feishu' | 'craft';
  shortcut?: string;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  label,
  onClick,
  isActive = false,
  disabled = false,
  theme = 'feishu',
  shortcut,
}) => {
  const themeStyles = {
    feishu: {
      size: 32,
      borderRadius: '4px',
      color: {
        default: '#1F2329',
        hover: '#1F2329',
        active: '#3370FF',
        disabled: '#C9CDD4',
      },
      background: {
        default: 'transparent',
        hover: '#F2F3F5',
        pressed: '#EBEDF0',
        active: '#E6EDFF',
        disabled: 'transparent',
      },
    },
    craft: {
      size: 32,
      borderRadius: '6px',
      color: {
        default: '#000000',
        hover: '#000000',
        active: '#0066CC',
        disabled: '#A0A0A0',
      },
      background: {
        default: 'transparent',
        hover: '#F5F5F5',
        pressed: '#E5E5E5',
        active: '#D4E8FF',
        disabled: 'transparent',
      },
    },
  };

  const currentTheme = themeStyles[theme];

  const getBackgroundColor = () => {
    if (disabled) return currentTheme.background.disabled;
    if (isActive) return currentTheme.background.active;
    return currentTheme.background.default;
  };

  const getColor = () => {
    if (disabled) return currentTheme.color.disabled;
    if (isActive) return currentTheme.color.active;
    return currentTheme.color.default;
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={
        !disabled
          ? { backgroundColor: isActive ? currentTheme.background.active : currentTheme.background.hover }
          : undefined
      }
      whileTap={
        !disabled
          ? { backgroundColor: currentTheme.background.pressed, scale: 0.95 }
          : undefined
      }
      title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
      aria-label={label}
      aria-pressed={isActive}
      style={{
        width: `${currentTheme.size}px`,
        height: `${currentTheme.size}px`,
        borderRadius: currentTheme.borderRadius,
        backgroundColor: getBackgroundColor(),
        color: getColor(),
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out',
        fontSize: '16px',
        padding: 0,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon}
    </motion.button>
  );
};
