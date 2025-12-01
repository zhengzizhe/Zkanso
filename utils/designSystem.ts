/**
 * 统一设计系统配置
 * 用于确保所有组件的样式和动画保持一致
 */

// 🎨 颜色系统
export const colors = {
  // 主色调
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
  },
  // 灰度
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  // 语义色
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// 📏 间距系统
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
};

// 🔤 字体系统
export const typography = {
  fontSize: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// 🎬 动画系统
export const animations = {
  // 统一的 Framer Motion 配置
  transition: {
    fast: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
    normal: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    slow: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  
  // 统一的动画变体
  variants: {
    // 弹出面板（从上方）
    popupFromTop: {
      initial: { opacity: 0, y: -8, scale: 0.96 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -8, scale: 0.96 },
    },
    // 弹出面板（从下方）
    popupFromBottom: {
      initial: { opacity: 0, y: 8, scale: 0.96 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 8, scale: 0.96 },
    },
    // 浮动工具栏
    floatingToolbar: {
      initial: { opacity: 0, scale: 0.95, y: -5 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: -5 },
    },
    // 模态框
    modal: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
    // 遮罩层
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    // 淡入淡出
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
};

// 🎨 阴影系统
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  base: '0 2px 8px rgba(0, 0, 0, 0.08)',
  md: '0 4px 12px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
  xl: '0 8px 32px rgba(0, 0, 0, 0.12)',
  '2xl': '0 12px 48px rgba(0, 0, 0, 0.16)',
};

// 📐 圆角系统
export const borderRadius = {
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

// 🎯 Z-index 系统
export const zIndex = {
  dropdown: 1000,
  sticky: 1100,
  floating: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  notification: 1600,
};

// 🧩 组件样式预设
export const componentStyles = {
  // 按钮
  button: {
    base: `
      inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium
      rounded-lg transition-all duration-150
      focus:outline-none focus:ring-2 focus:ring-offset-2
    `,
    primary: `
      bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
      text-white focus:ring-indigo-500
    `,
    secondary: `
      bg-white hover:bg-gray-50 active:bg-gray-100
      text-gray-700 border border-gray-300
      dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-600
    `,
    ghost: `
      hover:bg-gray-100 active:bg-gray-200
      text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300
    `,
    danger: `
      bg-red-600 hover:bg-red-700 active:bg-red-800
      text-white focus:ring-red-500
    `,
  },
  
  // 输入框
  input: `
    w-full px-3 py-2 text-sm
    bg-white dark:bg-gray-700
    border border-gray-300 dark:border-gray-600
    rounded-lg
    focus:ring-2 focus:ring-indigo-500 focus:border-transparent
    transition-all duration-150
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500
  `,
  
  // 面板/卡片
  panel: `
    bg-white dark:bg-gray-800
    rounded-lg
    border border-gray-200 dark:border-gray-700
  `,
  
  // 工具栏
  toolbar: `
    bg-white dark:bg-gray-800
    rounded-lg
    border border-gray-200 dark:border-gray-700
    shadow-lg
  `,
  
  // 分隔线
  divider: 'w-px h-5 bg-gray-200 dark:bg-gray-700',
};

// 🎨 CSS 变量（可用于动态主题）
export const cssVariables = {
  '--color-primary': colors.primary[600],
  '--color-primary-hover': colors.primary[700],
  '--shadow-base': shadows.base,
  '--shadow-lg': shadows.lg,
  '--radius-base': borderRadius.base,
  '--radius-lg': borderRadius.lg,
  '--transition-fast': '150ms',
  '--transition-normal': '200ms',
};
