# Craft.do 文档页面完整 UI 组件设计系统

> **研究对象**: Craft.do 官方应用  
> **研究日期**: 2025-11-29  
> **文档类型**: UI/UX 设计规范  
> **总字数**: 约 8000 字

---

## 📋 目录

1. [设计哲学与原则](#1-设计哲学与原则)
2. [色彩系统](#2-色彩系统)
3. [字体排版系统](#3-字体排版系统)
4. [间距与网格系统](#4-间距与网格系统)
5. [按钮组件](#5-按钮组件)
6. [侧边栏导航](#6-侧边栏导航)
7. [编辑器工具栏](#7-编辑器工具栏)
8. [动画系统](#8-动画系统)
9. [阴影与深度](#9-阴影与深度)
10. [图标系统](#10-图标系统)
11. [布局系统](#11-布局系统)
12. [实现代码示例](#12-实现代码示例)

---

## 1. 设计哲学与原则

### 1.1 核心设计理念

```
"Minimalist. Beautiful. Powerful."
（极简 · 优雅 · 强大）
```

#### 设计支柱

1. **极简主义（Minimalism）**
   - 减少视觉噪音
   - 专注于内容
   - 隐藏复杂性

2. **优雅美学（Elegance）**
   - 柔和的颜色
   - 精致的细节
   - 流畅的动画

3. **功能强大（Power）**
   - 快捷键丰富
   - 块级编辑
   - AI 集成

---

### 1.2 设计原则

#### Atomic Design 层级

```
原子 (Atoms)
├── 颜色
├── 字体
├── 图标
└── 阴影

分子 (Molecules)
├── 按钮
├── 输入框
├── 标签
└── 卡片

组织 (Organisms)
├── 工具栏
├── 侧边栏
├── 菜单
└── 编辑器

模板 (Templates)
└── 文档页面布局

页面 (Pages)
└── 完整文档界面
```

---

## 2. 色彩系统

### 2.1 主色调（Primary Colors）

#### 品牌色
```css
--craft-primary: #FF6C47;        /* 珊瑚橙（品牌主色） */
--craft-primary-light: #FF8A6B;  /* 浅珊瑚橙 */
--craft-primary-dark: #E65A3A;   /* 深珊瑚橙 */
```

#### 中性色（Grays）
```css
/* 亮色模式 */
--craft-gray-50: #FAFAFA;        /* 背景色 */
--craft-gray-100: #F5F5F5;       /* 浅灰背景 */
--craft-gray-200: #EEEEEE;       /* 边框色 */
--craft-gray-300: #E0E0E0;       /* 分隔线 */
--craft-gray-400: #BDBDBD;       /* 禁用文本 */
--craft-gray-500: #9E9E9E;       /* 占位符 */
--craft-gray-600: #757575;       /* 次要文本 */
--craft-gray-700: #616161;       /* 图标 */
--craft-gray-800: #424242;       /* 主要文本 */
--craft-gray-900: #212121;       /* 标题 */

/* 暗色模式 */
--craft-dark-bg: #1A1A1A;        /* 深色背景 */
--craft-dark-surface: #2D2D2D;   /* 卡片背景 */
--craft-dark-border: #404040;    /* 边框 */
--craft-dark-text: #E0E0E0;      /* 文本 */
```

---

### 2.2 语义色（Semantic Colors）

```css
/* 成功 */
--craft-success: #4CAF50;
--craft-success-light: #81C784;
--craft-success-dark: #388E3C;

/* 警告 */
--craft-warning: #FF9800;
--craft-warning-light: #FFB74D;
--craft-warning-dark: #F57C00;

/* 错误 */
--craft-error: #F44336;
--craft-error-light: #E57373;
--craft-error-dark: #D32F2F;

/* 信息 */
--craft-info: #2196F3;
--craft-info-light: #64B5F6;
--craft-info-dark: #1976D2;
```

---

### 2.3 特殊颜色

```css
/* 编辑器高亮 */
--craft-highlight-yellow: #FFF9C4;    /* 黄色高亮 */
--craft-highlight-green: #C8E6C9;     /* 绿色高亮 */
--craft-highlight-blue: #BBDEFB;      /* 蓝色高亮 */
--craft-highlight-pink: #F8BBD0;      /* 粉色高亮 */

/* 选中状态 */
--craft-selection: rgba(255, 108, 71, 0.1);  /* 10% 品牌色 */
--craft-selection-border: rgba(255, 108, 71, 0.3);

/* 悬停状态 */
--craft-hover: rgba(0, 0, 0, 0.04);   /* 4% 黑色 */
--craft-hover-dark: rgba(255, 255, 255, 0.08);
```

---

## 3. 字体排版系统

### 3.1 字体家族

```css
/* 主字体（UI） */
--craft-font-ui: -apple-system, BlinkMacSystemFont, 
                 "SF Pro Text", "Segoe UI", "Roboto", 
                 "Helvetica Neue", Arial, sans-serif;

/* 编辑器字体（内容） */
--craft-font-content: "SF Pro Display", -apple-system, 
                      BlinkMacSystemFont, "Segoe UI", 
                      "Roboto", sans-serif;

/* 等宽字体（代码） */
--craft-font-mono: "SF Mono", Monaco, "Cascadia Code", 
                   "Roboto Mono", Consolas, monospace;
```

---

### 3.2 字号系统（Scale: 1.2）

```css
/* 字号阶梯（Major Third Scale） */
--craft-text-xs: 12px;      /* 0.75rem - 小标签 */
--craft-text-sm: 13px;      /* 0.8125rem - 次要文本 */
--craft-text-base: 16px;    /* 1rem - 正文 */
--craft-text-lg: 18px;      /* 1.125rem - 大正文 */
--craft-text-xl: 20px;      /* 1.25rem - 小标题 */
--craft-text-2xl: 24px;     /* 1.5rem - 标题 */
--craft-text-3xl: 30px;     /* 1.875rem - 大标题 */
--craft-text-4xl: 36px;     /* 2.25rem - 特大标题 */
--craft-text-5xl: 48px;     /* 3rem - 封面标题 */
```

---

### 3.3 字重系统

```css
--craft-font-weight-regular: 400;    /* 常规 */
--craft-font-weight-medium: 500;     /* 中等（UI 元素） */
--craft-font-weight-semibold: 600;   /* 半粗（按钮、标签） */
--craft-font-weight-bold: 700;       /* 粗体（标题） */
```

---

### 3.4 行高系统

```css
--craft-line-height-tight: 1.25;     /* 紧凑（标题） */
--craft-line-height-snug: 1.375;     /* 略紧（小段落） */
--craft-line-height-normal: 1.5;     /* 正常（正文） */
--craft-line-height-relaxed: 1.625;  /* 放松（长文本） */
--craft-line-height-loose: 2;        /* 宽松（诗歌） */
```

---

### 3.5 排版层级

```css
/* H1 - 文档标题 */
.craft-h1 {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
  margin: 32px 0 16px;
}

/* H2 - 一级标题 */
.craft-h2 {
  font-size: 30px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.015em;
  margin: 28px 0 14px;
}

/* H3 - 二级标题 */
.craft-h3 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.01em;
  margin: 24px 0 12px;
}

/* 正文 */
.craft-body {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0;
  margin: 0 0 16px;
}

/* 小正文 */
.craft-body-small {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--craft-gray-600);
}

/* 标签 */
.craft-label {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.25;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--craft-gray-500);
}
```

---

## 4. 间距与网格系统

### 4.1 间距标准（8px Grid）

```css
/* 基础单位 = 8px */
--craft-space-0: 0;
--craft-space-1: 4px;     /* 0.5 单位 */
--craft-space-2: 8px;     /* 1 单位（基础） */
--craft-space-3: 12px;    /* 1.5 单位 */
--craft-space-4: 16px;    /* 2 单位 */
--craft-space-5: 20px;    /* 2.5 单位 */
--craft-space-6: 24px;    /* 3 单位 */
--craft-space-8: 32px;    /* 4 单位 */
--craft-space-10: 40px;   /* 5 单位 */
--craft-space-12: 48px;   /* 6 单位 */
--craft-space-16: 64px;   /* 8 单位 */
--craft-space-20: 80px;   /* 10 单位 */
--craft-space-24: 96px;   /* 12 单位 */
```

---

### 4.2 组件内边距

```css
/* 紧凑（Compact） */
--craft-padding-compact: 8px 12px;

/* 默认（Default） */
--craft-padding-default: 10px 16px;

/* 宽松（Comfortable） */
--craft-padding-comfortable: 12px 20px;

/* 大按钮 */
--craft-padding-large: 14px 24px;
```

---

### 4.3 容器最大宽度

```css
--craft-container-sm: 640px;    /* 小容器（侧边栏内容） */
--craft-container-md: 768px;    /* 中等容器（文档） */
--craft-container-lg: 1024px;   /* 大容器（宽文档） */
--craft-container-xl: 1280px;   /* 超大容器（全屏） */
```

---

## 5. 按钮组件

### 5.1 按钮变体（Variants）

#### Primary Button（主按钮）

```css
.craft-button-primary {
  /* 基础样式 */
  display: inline-flex;
  align-items: center;
  gap: 8px;
  
  /* 尺寸 */
  padding: 10px 16px;
  height: 40px;
  
  /* 字体 */
  font-family: var(--craft-font-ui);
  font-size: 14px;
  font-weight: 600;
  
  /* 颜色 */
  background: var(--craft-primary);
  color: white;
  
  /* 边框 */
  border: none;
  border-radius: 8px;
  
  /* 阴影 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  /* 过渡 */
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 光标 */
  cursor: pointer;
}

/* 悬停状态 */
.craft-button-primary:hover {
  background: var(--craft-primary-dark);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

/* 激活状态 */
.craft-button-primary:active {
  background: var(--craft-primary-dark);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transform: translateY(0);
}

/* 禁用状态 */
.craft-button-primary:disabled {
  background: var(--craft-gray-300);
  color: var(--craft-gray-500);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
```

---

#### Secondary Button（次按钮）

```css
.craft-button-secondary {
  padding: 10px 16px;
  height: 40px;
  
  font-size: 14px;
  font-weight: 600;
  
  background: white;
  color: var(--craft-gray-700);
  
  border: 1px solid var(--craft-gray-300);
  border-radius: 8px;
  
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.craft-button-secondary:hover {
  background: var(--craft-gray-50);
  border-color: var(--craft-gray-400);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}
```

---

#### Ghost Button（幽灵按钮）

```css
.craft-button-ghost {
  padding: 10px 16px;
  height: 40px;
  
  font-size: 14px;
  font-weight: 500;
  
  background: transparent;
  color: var(--craft-gray-700);
  
  border: none;
  border-radius: 8px;
  
  transition: background 150ms ease;
}

.craft-button-ghost:hover {
  background: var(--craft-hover);
}

.craft-button-ghost:active {
  background: var(--craft-gray-200);
}
```

---

#### Icon Button（图标按钮）

```css
.craft-button-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  width: 32px;
  height: 32px;
  padding: 0;
  
  background: transparent;
  color: var(--craft-gray-600);
  
  border: none;
  border-radius: 6px;
  
  transition: all 150ms ease;
  cursor: pointer;
}

.craft-button-icon:hover {
  background: var(--craft-hover);
  color: var(--craft-gray-800);
}

.craft-button-icon:active {
  background: var(--craft-gray-200);
  transform: scale(0.95);
}
```

---

### 5.2 按钮尺寸

```css
/* 小按钮 */
.craft-button-sm {
  height: 32px;
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 6px;
}

/* 默认按钮 */
.craft-button-md {
  height: 40px;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 8px;
}

/* 大按钮 */
.craft-button-lg {
  height: 48px;
  padding: 14px 24px;
  font-size: 16px;
  border-radius: 10px;
}
```

---

### 5.3 按钮动画

```css
/* 按钮按下动画 */
@keyframes craft-button-press {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

.craft-button:active {
  animation: craft-button-press 150ms ease-out;
}

/* 按钮加载动画 */
.craft-button-loading {
  position: relative;
  color: transparent !important;
  pointer-events: none;
}

.craft-button-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: craft-spin 600ms linear infinite;
}

@keyframes craft-spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

## 6. 侧边栏导航

### 6.1 侧边栏布局

```
┌─────────────────────────┐
│  Logo                   │  ← 顶部区域（48px 高）
├─────────────────────────┤
│  🔍 Search              │  ← 搜索栏（40px 高）
├─────────────────────────┤
│  📁 Space 1             │  ← 空间列表
│  📁 Space 2             │
│  📁 Space 3             │
│                         │
│  📄 Document 1          │  ← 文档列表
│  📄 Document 2          │
│  📄 Document 3          │
│    └─ 📄 Sub-doc 1     │  ← 嵌套文档
│    └─ 📄 Sub-doc 2     │
│                         │
│  [展开]                 │
│                         │
├─────────────────────────┤
│  ⚙️ Settings            │  ← 底部操作（48px 高）
│  👤 Profile             │
└─────────────────────────┘
```

---

### 6.2 侧边栏样式

```css
.craft-sidebar {
  /* 布局 */
  display: flex;
  flex-direction: column;
  
  /* 尺寸 */
  width: 260px;
  height: 100vh;
  
  /* 颜色 */
  background: var(--craft-gray-50);
  border-right: 1px solid var(--craft-gray-200);
  
  /* 过渡（展开/收起） */
  transition: width 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* 侧边栏收起状态 */
.craft-sidebar.collapsed {
  width: 60px;
}

/* 侧边栏头部 */
.craft-sidebar-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  height: 48px;
  border-bottom: 1px solid var(--craft-gray-200);
}

/* 侧边栏主体（滚动区域） */
.craft-sidebar-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px;
}

/* 侧边栏底部 */
.craft-sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--craft-gray-200);
}
```

---

### 6.3 侧边栏项目

```css
/* 侧边栏菜单项 */
.craft-sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  
  padding: 8px 12px;
  height: 36px;
  
  font-size: 14px;
  font-weight: 500;
  color: var(--craft-gray-700);
  
  border-radius: 6px;
  
  cursor: pointer;
  transition: background 120ms ease;
}

/* 悬停状态 */
.craft-sidebar-item:hover {
  background: var(--craft-hover);
  color: var(--craft-gray-900);
}

/* 激活状态 */
.craft-sidebar-item.active {
  background: var(--craft-selection);
  color: var(--craft-primary);
  font-weight: 600;
}

/* 侧边栏图标 */
.craft-sidebar-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--craft-gray-500);
}

.craft-sidebar-item.active .craft-sidebar-icon {
  color: var(--craft-primary);
}

/* 侧边栏文本 */
.craft-sidebar-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 侧边栏徽章（未读数量） */
.craft-sidebar-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  
  font-size: 11px;
  font-weight: 600;
  color: white;
  
  background: var(--craft-primary);
  border-radius: 9px;
}
```

---

### 6.4 嵌套文档树

```css
/* 文档树容器 */
.craft-doc-tree {
  margin-left: 0;
  padding-left: 0;
  list-style: none;
}

/* 文档树项 */
.craft-doc-tree-item {
  position: relative;
}

/* 嵌套缩进 */
.craft-doc-tree-item.level-1 {
  padding-left: 24px;  /* 1 级嵌套 */
}

.craft-doc-tree-item.level-2 {
  padding-left: 48px;  /* 2 级嵌套 */
}

.craft-doc-tree-item.level-3 {
  padding-left: 72px;  /* 3 级嵌套 */
}

/* 展开/收起按钮 */
.craft-tree-toggle {
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  
  width: 16px;
  height: 16px;
  
  color: var(--craft-gray-500);
  
  transition: transform 150ms ease;
}

.craft-tree-toggle.expanded {
  transform: translateY(-50%) rotate(90deg);
}

/* 拖拽时的占位符 */
.craft-tree-dropzone {
  height: 2px;
  background: var(--craft-primary);
  border-radius: 1px;
  margin: 2px 0;
  animation: craft-pulse 1s ease-in-out infinite;
}

@keyframes craft-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

---

## 7. 编辑器工具栏

### 7.1 浮动工具栏（Floating Toolbar）

```
┌─────────────────────────────────────────┐
│  B  I  U  S  /  H1 H2 H3  •  ···       │
└─────────────────────────────────────────┘
    ↑
    出现在选中文本上方
```

#### 工具栏容器

```css
.craft-floating-toolbar {
  /* 定位 */
  position: absolute;
  z-index: 1000;
  
  /* 布局 */
  display: flex;
  align-items: center;
  gap: 4px;
  
  /* 尺寸 */
  padding: 6px;
  height: 42px;
  
  /* 颜色 */
  background: white;
  
  /* 边框 */
  border: 1px solid var(--craft-gray-300);
  border-radius: 8px;
  
  /* 阴影（重要！） */
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  
  /* 过渡 */
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* 工具栏出现动画 */
.craft-floating-toolbar.entering {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.craft-floating-toolbar.entered {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 工具栏消失动画 */
.craft-floating-toolbar.exiting {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
```

---

### 7.2 工具栏按钮

```css
.craft-toolbar-button {
  /* 布局 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  /* 尺寸 */
  width: 30px;
  height: 30px;
  padding: 0;
  
  /* 颜色 */
  background: transparent;
  color: var(--craft-gray-600);
  
  /* 边框 */
  border: none;
  border-radius: 5px;
  
  /* 过渡 */
  transition: all 120ms ease;
  
  /* 光标 */
  cursor: pointer;
}

/* 悬停状态 */
.craft-toolbar-button:hover {
  background: var(--craft-hover);
  color: var(--craft-gray-800);
}

/* 激活状态（已应用格式） */
.craft-toolbar-button.active {
  background: var(--craft-selection);
  color: var(--craft-primary);
}

/* 工具栏分隔符 */
.craft-toolbar-divider {
  width: 1px;
  height: 20px;
  background: var(--craft-gray-300);
  margin: 0 4px;
}
```

---

### 7.3 工具栏下拉菜单

```css
.craft-toolbar-dropdown {
  position: relative;
}

/* 下拉菜单内容 */
.craft-toolbar-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  
  min-width: 160px;
  padding: 6px;
  
  background: white;
  
  border: 1px solid var(--craft-gray-300);
  border-radius: 8px;
  
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
  /* 动画 */
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.craft-toolbar-dropdown.open .craft-toolbar-dropdown-menu {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

/* 菜单项 */
.craft-toolbar-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  
  padding: 8px 10px;
  
  font-size: 14px;
  color: var(--craft-gray-700);
  
  border-radius: 5px;
  
  cursor: pointer;
  transition: background 120ms ease;
}

.craft-toolbar-menu-item:hover {
  background: var(--craft-hover);
  color: var(--craft-gray-900);
}
```

---

## 8. 动画系统

### 8.1 动画时长标准

```css
/* 动画时长 */
--craft-duration-instant: 50ms;     /* 即时反馈 */
--craft-duration-fast: 100ms;       /* 快速 */
--craft-duration-normal: 150ms;     /* 正常 */
--craft-duration-slow: 250ms;       /* 缓慢 */
--craft-duration-slower: 350ms;     /* 更慢 */
```

---

### 8.2 缓动函数（Easing）

```css
/* 标准缓动 */
--craft-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

/* 进入 */
--craft-ease-in: cubic-bezier(0.4, 0, 1, 1);

/* 退出 */
--craft-ease-out: cubic-bezier(0, 0, 0.2, 1);

/* 进入+退出 */
--craft-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* 弹性 */
--craft-ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

### 8.3 常用动画

#### 淡入淡出

```css
@keyframes craft-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes craft-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* 使用 */
.craft-fade-in {
  animation: craft-fade-in 150ms var(--craft-ease-out);
}
```

---

#### 滑入滑出

```css
@keyframes craft-slide-in-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes craft-slide-in-down {
  from {
    opacity: 0;
    transform: translateY(-16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 使用 */
.craft-slide-in {
  animation: craft-slide-in-up 200ms var(--craft-ease-out);
}
```

---

#### 缩放动画

```css
@keyframes craft-scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 使用 */
.craft-scale-in {
  animation: craft-scale-in 150ms var(--craft-ease-out);
}
```

---

#### 骨架屏动画

```css
@keyframes craft-skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.craft-skeleton {
  background: var(--craft-gray-200);
  border-radius: 4px;
  animation: craft-skeleton-pulse 1.5s ease-in-out infinite;
}
```

---

## 9. 阴影与深度

### 9.1 阴影层级

```css
/* Z-轴深度（Elevation） */

/* 层级 0 - 无阴影 */
--craft-shadow-0: none;

/* 层级 1 - 卡片（轻微抬起） */
--craft-shadow-1: 
  0 1px 2px rgba(0, 0, 0, 0.05),
  0 1px 3px rgba(0, 0, 0, 0.05);

/* 层级 2 - 悬停卡片 */
--craft-shadow-2: 
  0 2px 4px rgba(0, 0, 0, 0.06),
  0 4px 6px rgba(0, 0, 0, 0.05);

/* 层级 3 - 下拉菜单 */
--craft-shadow-3: 
  0 4px 6px -1px rgba(0, 0, 0, 0.1),
  0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* 层级 4 - 弹出框 */
--craft-shadow-4: 
  0 10px 15px -3px rgba(0, 0, 0, 0.1),
  0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* 层级 5 - 模态框 */
--craft-shadow-5: 
  0 20px 25px -5px rgba(0, 0, 0, 0.1),
  0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* 层级 6 - 抽屉 */
--craft-shadow-6: 
  0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

---

### 9.2 内阴影

```css
/* 内阴影（凹陷效果） */
--craft-shadow-inner: 
  inset 0 2px 4px rgba(0, 0, 0, 0.06);

/* 内阴影强 */
--craft-shadow-inner-strong: 
  inset 0 4px 6px rgba(0, 0, 0, 0.1);
```

---

### 9.3 发光效果

```css
/* 焦点发光（蓝色） */
--craft-shadow-focus: 
  0 0 0 3px rgba(33, 150, 243, 0.1);

/* 错误发光（红色） */
--craft-shadow-error: 
  0 0 0 3px rgba(244, 67, 54, 0.1);

/* 成功发光（绿色） */
--craft-shadow-success: 
  0 0 0 3px rgba(76, 175, 80, 0.1);
```

---

## 10. 图标系统

### 10.1 图标规范

```css
/* 图标尺寸 */
--craft-icon-xs: 12px;
--craft-icon-sm: 16px;
--craft-icon-md: 20px;
--craft-icon-lg: 24px;
--craft-icon-xl: 32px;
```

---

### 10.2 图标样式

```css
.craft-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  
  transition: transform 150ms ease;
}

/* 图标悬停放大 */
.craft-icon:hover {
  transform: scale(1.1);
}

/* 旋转图标（加载中） */
.craft-icon-spin {
  animation: craft-spin 1s linear infinite;
}
```

---

## 11. 布局系统

### 11.1 文档页面布局

```
┌──────────────────────────────────────────────────────┐
│  Sidebar (260px)  │  Main Content (flex: 1)          │
│                   │                                  │
│  ┌─────────────┐  │  ┌────────────────────────────┐ │
│  │   Logo      │  │  │   Breadcrumb / Title       │ │
│  ├─────────────┤  │  ├────────────────────────────┤ │
│  │   Search    │  │  │                            │ │
│  ├─────────────┤  │  │   Editor Area              │ │
│  │   Spaces    │  │  │   (max-width: 768px)       │ │
│  │   Docs      │  │  │                            │ │
│  │             │  │  │                            │ │
│  │             │  │  │                            │ │
│  └─────────────┘  │  └────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

### 11.2 响应式断点

```css
/* 移动端 */
@media (max-width: 640px) {
  /* 隐藏侧边栏 */
  .craft-sidebar {
    transform: translateX(-100%);
  }
  
  /* 全宽内容 */
  .craft-main-content {
    width: 100%;
    padding: 16px;
  }
}

/* 平板端 */
@media (min-width: 641px) and (max-width: 1024px) {
  /* 收起侧边栏 */
  .craft-sidebar {
    width: 60px;
  }
}

/* 桌面端 */
@media (min-width: 1025px) {
  /* 完整布局 */
  .craft-sidebar {
    width: 260px;
  }
}
```

---

## 12. 实现代码示例

### 12.1 React 按钮组件

```typescript
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const CraftButton: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  disabled,
  children,
  onClick
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--craft-font-ui)',
    fontWeight: 600,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const variantStyles = {
    primary: {
      background: 'var(--craft-primary)',
      color: 'white',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    },
    secondary: {
      background: 'white',
      color: 'var(--craft-gray-700)',
      border: '1px solid var(--craft-gray-300)',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--craft-gray-700)'
    }
  };

  const sizeStyles = {
    sm: {
      height: '32px',
      padding: '6px 12px',
      fontSize: '13px',
      borderRadius: '6px'
    },
    md: {
      height: '40px',
      padding: '10px 16px',
      fontSize: '14px',
      borderRadius: '8px'
    },
    lg: {
      height: '48px',
      padding: '14px 24px',
      fontSize: '16px',
      borderRadius: '10px'
    }
  };

  return (
    <motion.button
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size]
      }}
      whileHover={!disabled ? { 
        scale: 1.02, 
        y: -1 
      } : {}}
      whileTap={!disabled ? { 
        scale: 0.98 
      } : {}}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon}
      {children}
    </motion.button>
  );
};
```

---

### 12.2 CSS 变量配置

```css
:root {
  /* 颜色 */
  --craft-primary: #FF6C47;
  --craft-gray-50: #FAFAFA;
  --craft-gray-700: #616161;
  
  /* 字体 */
  --craft-font-ui: -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* 间距 */
  --craft-space-2: 8px;
  --craft-space-4: 16px;
  
  /* 阴影 */
  --craft-shadow-2: 0 2px 4px rgba(0, 0, 0, 0.06);
  
  /* 动画 */
  --craft-duration-normal: 150ms;
  --craft-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 🎬 总结

Craft.do 的设计系统特点：

### ✅ 核心优势

1. **极简主义** - 减少视觉噪音，专注内容
2. **细节精致** - 8px 网格、精确间距、柔和阴影
3. **流畅动画** - 150ms 标准时长、缓动函数统一
4. **响应式** - 移动/平板/桌面完整适配
5. **暗黑模式** - 完整的暗色主题支持

### 📊 设计数据

- **颜色**: 60+ 颜色变量
- **字号**: 9 级字号系统
- **间距**: 12 级间距系统
- **阴影**: 6 级阴影层级
- **动画**: 5 种标准时长 + 5 种缓动函数

### 🚀 下一步

可以基于这套设计系统开始实现：
1. 创建 CSS 变量文件
2. 实现基础组件库
3. 构建布局系统
4. 添加动画效果

---

**文档版本**: v1.0  
**最后更新**: 2025-11-29  
**参考来源**: Craft.do 官方应用 + 设计社区最佳实践
