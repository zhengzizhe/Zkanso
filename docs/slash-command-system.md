# 斜杠命令系统实现清单

## 📋 项目概述

本文档详细记录了 Kanso 编辑器斜杠命令（Slash Command）系统的完整设计、实现规范和开发计划。斜杠命令是现代编辑器（如 Notion、Linear）的核心功能，允许用户通过输入 `/` 快速插入各种块类型和执行命令。

---

## 🎯 功能目标

### 核心价值
- ⚡ **快速插入**: 无需鼠标点击，纯键盘操作
- 🔍 **智能搜索**: 支持中英文、拼音、关键词模糊搜索
- 🎨 **美观流畅**: 现代化UI + 丝滑动画
- 🧠 **智能提示**: 根据上下文推荐相关命令
- ⌨️ **键盘友好**: 完整的键盘导航支持

### 用户场景
```
场景1: 快速插入标题
用户输入 "/h1" → 弹出命令菜单 → 回车选择 → 插入一级标题

场景2: 搜索命令
用户输入 "/表格" → 自动过滤显示表格相关命令 → 选择插入

场景3: 键盘导航
用户输入 "/" → ↑↓ 选择命令 → Enter 确认 → Esc 取消
```

---

## 📦 命令分类体系

### 1. 基础块（Basic Blocks）

#### 1.1 文本块
| 命令ID | 名称 | 描述 | 快捷键 | 图标 |
|--------|------|------|--------|------|
| `paragraph` | 正文 | 普通段落文本 | - | Type |
| `heading1` | 标题 1 | 大号标题（H1） | Ctrl+Alt+1 | Heading1 |
| `heading2` | 标题 2 | 中号标题（H2） | Ctrl+Alt+2 | Heading2 |
| `heading3` | 标题 3 | 小号标题（H3） | Ctrl+Alt+3 | Heading3 |

**搜索关键词**
```javascript
{
  paragraph: ['text', 'p', '正文', '段落', '文本', 'para'],
  heading1: ['h1', 'title', '标题', '大标题', '一级标题', 'heading'],
  heading2: ['h2', 'subtitle', '标题', '副标题', '二级标题'],
  heading3: ['h3', 'small', '标题', '小标题', '三级标题']
}
```

**实现代码**
```typescript
{
  id: 'heading1',
  title: '标题 1',
  description: '大号标题，用于章节标题',
  icon: Heading1,
  keywords: ['h1', 'title', '标题', '大标题', '一级标题'],
  category: '基础块',
  action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run()
}
```

---

### 2. 列表（Lists）

#### 2.1 普通列表
| 命令ID | 名称 | 描述 | 快捷键 | 图标 |
|--------|------|------|--------|------|
| `bulletList` | 无序列表 | 带圆点的列表 | Ctrl+Shift+8 | List |
| `orderedList` | 有序列表 | 带数字编号的列表 | Ctrl+Shift+7 | ListOrdered |
| `taskList` | 任务列表 | 带复选框的待办事项 | Ctrl+Shift+9 | CheckSquare |

**搜索关键词**
```javascript
{
  bulletList: ['ul', 'bullet', 'list', '无序', '列表', '圆点', 'unordered'],
  orderedList: ['ol', 'numbered', 'ordered', '有序', '编号', '数字列表'],
  taskList: ['todo', 'task', 'checkbox', '任务', '待办', '清单', 'checklist', 'check']
}
```

#### 2.2 高级列表
| 命令ID | 名称 | 描述 | 图标 |
|--------|------|------|------|
| `toggleList` | 折叠列表 | 可展开/折叠的列表 | ChevronRight |
| `columnList` | 分栏列表 | 多列显示的列表 | Columns |

---

### 3. 内容块（Content Blocks）

#### 3.1 引用与代码
| 命令ID | 名称 | 描述 | 快捷键 | 图标 |
|--------|------|------|--------|------|
| `quote` | 引用 | 引用文本块 | Ctrl+Shift+B | Quote |
| `codeBlock` | 代码块 | 多行代码，支持语法高亮 | Ctrl+Alt+C | Code |
| `inlineCode` | 内联代码 | 行内代码 | Ctrl+E | Code |

**代码块语言支持**
```
- JavaScript / TypeScript
- Python
- Java / Kotlin
- C / C++ / C#
- Go / Rust
- HTML / CSS
- SQL
- Shell / Bash
- JSON / YAML
- Markdown
```

#### 3.2 视觉分隔
| 命令ID | 名称 | 描述 | 图标 |
|--------|------|------|------|
| `divider` | 分割线 | 水平分割线 | Minus |
| `pageBreak` | 分页符 | 强制分页 | Scissors |
| `spacer` | 空白间距 | 增加垂直空白 | MoveVertical |

---

### 4. 媒体（Media）

#### 4.1 图片与视频
| 命令ID | 名称 | 描述 | 支持格式 | 图标 |
|--------|------|------|----------|------|
| `image` | 图片 | 插入图片 | JPG, PNG, GIF, SVG, WebP | Image |
| `video` | 视频 | 嵌入视频 | MP4, YouTube, Vimeo | Video |
| `audio` | 音频 | 插入音频 | MP3, WAV | Music |
| `file` | 文件附件 | 上传文件 | 所有格式 | Paperclip |

**搜索关键词**
```javascript
{
  image: ['img', 'image', 'photo', 'picture', '图片', '照片', '图像'],
  video: ['video', 'movie', 'mp4', '视频', 'youtube', 'vimeo'],
  audio: ['audio', 'sound', 'music', '音频', '音乐', '声音'],
  file: ['file', 'attach', 'upload', '文件', '附件', '上传']
}
```

#### 4.2 嵌入内容
| 命令ID | 名称 | 描述 | 图标 |
|--------|------|------|------|
| `embed` | 嵌入网页 | iFrame 嵌入 | Globe |
| `tweet` | 推文 | 嵌入 Twitter | Twitter |
| `figma` | Figma 设计 | 嵌入 Figma | Figma |
| `codepen` | CodePen | 代码演示 | Code |

---

### 5. 表格与数据（Tables & Data）

#### 5.1 表格
| 命令ID | 名称 | 描述 | 默认大小 | 图标 |
|--------|------|------|----------|------|
| `table` | 表格 | 插入表格 | 3x3 | Table |
| `simpleTable` | 简单表格 | 无边框表格 | 3x3 | Table2 |
| `csvTable` | CSV 表格 | 导入 CSV 数据 | - | FileSpreadsheet |

**表格操作命令**
```
/table → 插入表格
/table-row-add → 添加行
/table-col-add → 添加列
/table-row-delete → 删除行
/table-col-delete → 删除列
/table-merge → 合并单元格
/table-split → 拆分单元格
```

#### 5.2 数据可视化
| 命令ID | 名称 | 描述 | 图标 |
|--------|------|------|------|
| `chart` | 图表 | 数据图表 | BarChart |
| `mermaid` | 流程图 | Mermaid 图表 | GitBranch |
| `mindmap` | 思维导图 | 脑图 | Network |

---

### 6. 高级块（Advanced Blocks）

#### 6.1 提示框（Callouts）
| 命令ID | 名称 | 描述 | 颜色 | 图标 |
|--------|------|------|------|------|
| `callout-info` | 信息提示 | 蓝色信息提示框 | 蓝色 | Info |
| `callout-success` | 成功提示 | 绿色成功提示框 | 绿色 | CheckCircle |
| `callout-warning` | 警告提示 | 黄色警告提示框 | 黄色 | AlertTriangle |
| `callout-error` | 错误提示 | 红色错误提示框 | 红色 | XCircle |
| `callout-tip` | 小技巧 | 灰色提示框 | 灰色 | Lightbulb |

**提示框样式**
```css
.callout-info {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%);
  border-left: 4px solid #3b82f6;
  padding: 16px;
  border-radius: 8px;
}
```

#### 6.2 折叠块
| 命令ID | 名称 | 描述 | 图标 |
|--------|------|------|------|
| `toggle` | 折叠块 | 可展开/折叠的内容 | ChevronRight |
| `details` | 详情块 | HTML Details 元素 | FileText |
| `accordion` | 手风琴 | 多个折叠项 | List |

#### 6.3 数学与公式
| 命令ID | 名称 | 描述 | 格式 | 图标 |
|--------|------|------|------|------|
| `mathInline` | 行内公式 | LaTeX 行内公式 | $...$  | Sigma |
| `mathBlock` | 公式块 | LaTeX 公式块 | $$...$$ | Calculator |
| `equation` | 方程式 | 数学方程 | - | Equal |

**示例**
```latex
行内公式: $E = mc^2$
公式块:
$$
\int_{a}^{b} f(x)dx = F(b) - F(a)
$$
```

---

### 7. 布局（Layout）

#### 7.1 分栏布局
| 命令ID | 名称 | 描述 | 图标 |
|--------|------|------|------|
| `columns-2` | 两栏布局 | 内容分为两栏 | Columns |
| `columns-3` | 三栏布局 | 内容分为三栏 | LayoutGrid |
| `columns-custom` | 自定义分栏 | 自定义栏数和宽度 | Layout |

#### 7.2 容器
| 命令ID | 名称 | 描述 | 图标 |
|--------|------|------|------|
| `container` | 容器 | 内容容器 | Box |
| `card` | 卡片 | 卡片样式容器 | CreditCard |
| `section` | 区块 | 内容区块 | Square |

---

### 8. AI 功能（AI Features）

#### 8.1 AI 写作助手
| 命令ID | 名称 | 描述 | 图标 |
|--------|------|------|------|
| `ai-continue` | AI 续写 | 根据上文继续写作 | Sparkles |
| `ai-rewrite` | AI 改写 | 重写选中内容 | RefreshCw |
| `ai-expand` | AI 扩展 | 扩展内容 | Maximize2 |
| `ai-simplify` | AI 简化 | 简化表达 | Minimize2 |
| `ai-translate` | AI 翻译 | 翻译文本 | Languages |
| `ai-summarize` | AI 总结 | 生成摘要 | FileText |
| `ai-grammar` | AI 语法检查 | 检查并修正语法 | CheckCircle |

**搜索关键词**
```javascript
{
  'ai-continue': ['ai', 'continue', 'write', '续写', '继续', '写作'],
  'ai-rewrite': ['ai', 'rewrite', 'rephrase', '改写', '重写', '换个说法'],
  'ai-expand': ['ai', 'expand', 'elaborate', '扩展', '展开', '详细'],
  'ai-simplify': ['ai', 'simplify', 'shorten', '简化', '精简', '缩短'],
  'ai-translate': ['ai', 'translate', '翻译', 'trans', '中英'],
  'ai-summarize': ['ai', 'summary', 'tldr', '总结', '摘要', '概括'],
  'ai-grammar': ['ai', 'grammar', 'correct', '语法', '纠错', '修正']
}
```

#### 8.2 AI 生成
| 命令ID | 名称 | 描述 | 图标 |
|--------|------|------|------|
| `ai-outline` | 生成大纲 | 根据主题生成文章大纲 | ListTree |
| `ai-ideas` | 头脑风暴 | 生成创意想法 | Lightbulb |
| `ai-email` | 写邮件 | 生成邮件模板 | Mail |
| `ai-blog` | 写博客 | 生成博客文章 | FileText |

---

### 9. 特殊功能（Special）

#### 9.1 日期与时间
| 命令ID | 名称 | 描述 | 图标 |
|--------|------|------|------|
| `date` | 插入日期 | 插入当前日期 | Calendar |
| `datetime` | 插入日期时间 | 插入完整日期时间 | Clock |
| `timestamp` | 时间戳 | Unix 时间戳 | Timer |
| `countdown` | 倒计时 | 倒计时器 | TimerOff |

#### 9.2 模板
| 命令ID | 名称 | 描述 | 图标 |
|--------|------|------|------|
| `template-meeting` | 会议纪要 | 会议记录模板 | Users |
| `template-todo` | 待办清单 | 任务清单模板 | CheckSquare |
| `template-blog` | 博客模板 | 博客文章模板 | FileText |
| `template-report` | 报告模板 | 工作报告模板 | FileText |

#### 9.3 工具
| 命令ID | 名称 | 描述 | 图标 |
|--------|------|------|------|
| `toc` | 目录 | 自动生成目录 | List |
| `bookmark` | 书签 | 添加书签链接 | Bookmark |
| `comment` | 评论 | 添加评论 | MessageCircle |
| `mention` | 提及 | @提及用户 | AtSign |

---

## 🎨 UI/UX 设计规范

### 菜单样式

#### 尺寸规范
```css
--menu-width: 320px;
--menu-max-height: 400px;
--item-height: 56px;
--icon-size: 36px;
--gap: 8px;
```

#### 颜色系统
```css
/* 亮色模式 */
--menu-bg: rgba(255, 255, 255, 0.98);
--menu-border: rgba(229, 231, 235, 0.8);
--item-hover: rgba(243, 244, 246, 1);
--item-selected: linear-gradient(90deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
--category-text: #9ca3af;

/* 暗色模式 */
--menu-bg-dark: rgba(31, 41, 55, 0.98);
--menu-border-dark: rgba(75, 85, 99, 0.6);
--item-hover-dark: rgba(55, 65, 81, 1);
--item-selected-dark: linear-gradient(90deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
```

#### 动画参数
```typescript
const animations = {
  menu: {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      mass: 0.8
    }
  },
  item: {
    hover: { scale: 1.02, x: 4 },
    tap: { scale: 0.98 }
  }
};
```

### 交互状态

#### 状态定义
```typescript
enum ItemState {
  Normal,      // 普通状态
  Hover,       // 鼠标悬停
  Selected,    // 键盘选中
  Active,      // 点击激活
  Disabled     // 禁用状态
}
```

#### 视觉反馈
| 状态 | 背景色 | 图标缩放 | 文字颜色 |
|------|--------|----------|----------|
| Normal | transparent | 1.0 | gray-700 |
| Hover | gray-50 | 1.05 | gray-900 |
| Selected | indigo-50 | 1.1 | indigo-700 |
| Active | indigo-100 | 0.95 | indigo-900 |
| Disabled | gray-100 | 1.0 | gray-400 |

---

## ⚙️ 技术实现

### 架构设计

```
SlashCommandSystem
├── SlashCommandMenu (UI组件)
│   ├── SearchHeader (搜索提示)
│   ├── CommandList (命令列表)
│   │   ├── CategoryGroup (分类组)
│   │   └── CommandItem (命令项)
│   └── KeyboardHints (快捷键提示)
├── SlashCommandExtension (Tiptap扩展)
│   ├── InputRule (输入规则)
│   ├── SuggestionPlugin (建议插件)
│   └── CommandRegistry (命令注册)
└── CommandDefinitions (命令定义)
    ├── BasicBlocks
    ├── Lists
    ├── Content
    ├── Media
    └── Advanced
```

### 核心代码结构

#### 1. 命令定义接口
```typescript
interface SlashCommand {
  // 唯一标识
  id: string;
  
  // 显示名称
  title: string;
  
  // 描述文字
  description: string;
  
  // 图标组件
  icon: React.FC<{ className?: string }>;
  
  // 搜索关键词（支持中英文）
  keywords: string[];
  
  // 所属分类
  category: string;
  
  // 快捷键（可选）
  shortcut?: string;
  
  // 执行动作
  action: (editor: Editor, range?: Range) => void;
  
  // 是否可用（可选）
  isEnabled?: (editor: Editor) => boolean;
  
  // 优先级（排序用，可选）
  priority?: number;
}
```

#### 2. 触发机制
```typescript
// Tiptap InputRule
const slashInputRule = InputRule({
  find: /\/$/,
  handler: ({ state, range }) => {
    // 显示斜杠命令菜单
    showSlashMenu(range);
  }
});
```

#### 3. 搜索过滤算法
```typescript
function filterCommands(query: string, commands: SlashCommand[]): SlashCommand[] {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) {
    return commands;
  }
  
  return commands
    .map(cmd => {
      // 计算匹配分数
      let score = 0;
      
      // 标题精确匹配 +10
      if (cmd.title.toLowerCase() === searchTerm) score += 10;
      
      // 标题包含 +5
      if (cmd.title.toLowerCase().includes(searchTerm)) score += 5;
      
      // 关键词匹配 +3
      if (cmd.keywords.some(kw => kw.includes(searchTerm))) score += 3;
      
      // 描述包含 +1
      if (cmd.description.toLowerCase().includes(searchTerm)) score += 1;
      
      return { ...cmd, score };
    })
    .filter(cmd => cmd.score > 0)
    .sort((a, b) => b.score - a.score);
}
```

#### 4. 键盘导航
```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % commands.length);
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + commands.length) % commands.length);
      break;
      
    case 'Enter':
      e.preventDefault();
      executeCommand(commands[selectedIndex]);
      break;
      
    case 'Escape':
      e.preventDefault();
      closeMenu();
      break;
      
    case 'Tab':
      e.preventDefault();
      // 切换分类
      nextCategory();
      break;
  }
};
```

#### 5. 位置计算
```typescript
function calculateMenuPosition(range: Range): { x: number; y: number } {
  const { view } = editor;
  const coords = view.coordsAtPos(range.from);
  
  return {
    x: coords.left,
    y: coords.bottom + 8 // 光标下方 8px
  };
}
```

---

## 📱 响应式设计

### 桌面端（Desktop）
```css
@media (min-width: 768px) {
  .slash-menu {
    width: 320px;
    max-height: 400px;
  }
  
  .command-item {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .command-icon {
    width: 36px;
    height: 36px;
  }
}
```

### 平板端（Tablet）
```css
@media (min-width: 481px) and (max-width: 767px) {
  .slash-menu {
    width: 280px;
    max-height: 350px;
  }
  
  .command-item {
    padding: 10px 14px;
    font-size: 13px;
  }
}
```

### 移动端（Mobile）
```css
@media (max-width: 480px) {
  .slash-menu {
    width: calc(100vw - 32px);
    max-width: 320px;
    max-height: 50vh;
  }
  
  .command-item {
    padding: 12px;
    font-size: 14px;
  }
  
  /* 底部弹出 */
  .slash-menu.mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 16px 16px 0 0;
  }
}
```

---

## 🚀 实施计划

### 第一阶段：基础框架（3天）

#### Day 1: 核心组件
- [ ] 创建 `SlashCommandMenu.tsx` 组件
- [ ] 实现基础UI布局（头部、列表、底部）
- [ ] 添加 Framer Motion 动画
- [ ] 实现基础样式（亮色/暗色主题）

**交付物**
- 可显示静态命令列表的菜单组件
- 完整的样式和动画效果

#### Day 2: Tiptap 集成
- [ ] 创建 `SlashCommandExtension.ts`
- [ ] 实现输入规则（InputRule）
- [ ] 实现 Suggestion 插件
- [ ] 菜单显示/隐藏逻辑

**交付物**
- 输入 `/` 能触发菜单显示
- 点击菜单外部自动关闭

#### Day 3: 命令注册系统
- [ ] 创建命令定义接口
- [ ] 实现命令注册器（CommandRegistry）
- [ ] 添加10个基础命令（标题、列表等）
- [ ] 命令执行逻辑

**交付物**
- 可正常执行的基础命令
- 命令注册和管理系统

---

### 第二阶段：搜索与导航（2天）

#### Day 4: 搜索功能
- [ ] 实现搜索过滤算法
- [ ] 支持中英文搜索
- [ ] 关键词高亮显示
- [ ] 搜索结果排序（相关性）

**交付物**
- 实时搜索过滤
- 智能排序算法

#### Day 5: 键盘导航
- [ ] ↑↓ 键选择命令
- [ ] Enter 执行命令
- [ ] Esc 关闭菜单
- [ ] Tab 切换分类
- [ ] 选中项自动滚动到可见区域

**交付物**
- 完整的键盘导航
- 流畅的交互体验

---

### 第三阶段：命令扩展（4天）

#### Day 6-7: 基础命令（40+）
- [ ] 基础块命令（5个）
- [ ] 列表命令（5个）
- [ ] 内容块命令（8个）
- [ ] 媒体命令（10个）
- [ ] 表格命令（5个）
- [ ] 高级块命令（7个）

#### Day 8-9: AI命令（15+）
- [ ] AI 写作助手命令（7个）
- [ ] AI 生成命令（4个）
- [ ] 特殊功能命令（4个）

**交付物**
- 55+ 可用命令
- 完整的命令文档

---

### 第四阶段：优化与测试（3天）

#### Day 10: 性能优化
- [ ] 虚拟滚动（大量命令时）
- [ ] 防抖搜索
- [ ] 懒加载图标
- [ ] 内存优化

#### Day 11: 用户体验
- [ ] 命令使用频率统计
- [ ] 最近使用命令
- [ ] 智能推荐
- [ ] 上下文感知命令

#### Day 12: 测试与修复
- [ ] 单元测试
- [ ] 集成测试
- [ ] 边界情况测试
- [ ] Bug 修复

---

## 🎯 完整命令清单

### 统计汇总
| 分类 | 命令数量 | 优先级 |
|------|----------|--------|
| 基础块 | 4 | P0 |
| 列表 | 5 | P0 |
| 内容块 | 6 | P0 |
| 媒体 | 6 | P1 |
| 表格与数据 | 6 | P1 |
| 高级块 | 12 | P1 |
| AI 功能 | 11 | P2 |
| 布局 | 6 | P2 |
| 特殊功能 | 14 | P2 |
| **总计** | **70** | - |

### P0 命令（15个）- 第一优先级
必须在第一阶段完成

```javascript
const P0_COMMANDS = [
  // 基础块（4个）
  'paragraph', 'heading1', 'heading2', 'heading3',
  
  // 列表（5个）
  'bulletList', 'orderedList', 'taskList',
  
  // 内容块（6个）
  'quote', 'codeBlock', 'divider', 'image', 'table', 'link'
];
```

### P1 命令（25个）- 第二优先级
第二阶段完成

```javascript
const P1_COMMANDS = [
  // 高级列表
  'toggleList', 'columnList',
  
  // 内容
  'inlineCode', 'pageBreak', 'spacer',
  
  // 媒体
  'video', 'audio', 'file', 'embed',
  
  // 表格
  'simpleTable', 'csvTable',
  
  // 数据可视化
  'chart', 'mermaid', 'mindmap',
  
  // 提示框
  'callout-info', 'callout-success', 'callout-warning', 
  'callout-error', 'callout-tip',
  
  // 折叠块
  'toggle', 'details', 'accordion',
  
  // 数学
  'mathInline', 'mathBlock'
];
```

### P2 命令（30个）- 第三优先级
第三阶段完成

```javascript
const P2_COMMANDS = [
  // AI 功能（11个）
  'ai-continue', 'ai-rewrite', 'ai-expand', 'ai-simplify',
  'ai-translate', 'ai-summarize', 'ai-grammar',
  'ai-outline', 'ai-ideas', 'ai-email', 'ai-blog',
  
  // 布局（6个）
  'columns-2', 'columns-3', 'columns-custom',
  'container', 'card', 'section',
  
  // 嵌入（4个）
  'tweet', 'figma', 'codepen', 'youtube',
  
  // 特殊功能（9个）
  'date', 'datetime', 'timestamp', 'countdown',
  'template-meeting', 'template-todo', 'template-blog',
  'toc', 'mention'
];
```

---

## 🔧 开发规范

### 命令定义模板
```typescript
// commands/basic-blocks.ts
export const headingCommand: SlashCommand = {
  id: 'heading1',
  title: '标题 1',
  description: '大号标题，用于章节标题',
  icon: Heading1,
  keywords: ['h1', 'title', 'heading', '标题', '大标题', '一级标题'],
  category: '基础块',
  shortcut: 'Ctrl+Alt+1',
  priority: 100,
  
  action: (editor, range) => {
    editor
      .chain()
      .focus()
      .deleteRange(range) // 删除 / 字符
      .toggleHeading({ level: 1 })
      .run();
  },
  
  isEnabled: (editor) => {
    return editor.can().toggleHeading({ level: 1 });
  }
};
```

### 文件组织结构
```
components/
├── SlashCommand/
│   ├── SlashCommandMenu.tsx          # 主菜单组件
│   ├── SlashCommandExtension.ts      # Tiptap 扩展
│   ├── SearchHeader.tsx              # 搜索头部
│   ├── CommandList.tsx               # 命令列表
│   ├── CommandItem.tsx               # 命令项
│   ├── CategoryGroup.tsx             # 分类组
│   ├── KeyboardHints.tsx             # 快捷键提示
│   └── types.ts                      # 类型定义
│
├── SlashCommand/commands/            # 命令定义
│   ├── index.ts                      # 导出所有命令
│   ├── basic-blocks.ts               # 基础块命令
│   ├── lists.ts                      # 列表命令
│   ├── content-blocks.ts             # 内容块命令
│   ├── media.ts                      # 媒体命令
│   ├── tables.ts                     # 表格命令
│   ├── advanced.ts                   # 高级块命令
│   ├── ai.ts                         # AI 命令
│   ├── layout.ts                     # 布局命令
│   └── special.ts                    # 特殊功能命令
│
└── SlashCommand/utils/               # 工具函数
    ├── search.ts                     # 搜索算法
    ├── registry.ts                   # 命令注册器
    └── position.ts                   # 位置计算
```

---

## 📊 性能指标

### 目标性能
| 指标 | 目标值 | 说明 |
|------|--------|------|
| 菜单显示延迟 | < 50ms | 从输入 `/` 到菜单出现 |
| 搜索响应时间 | < 100ms | 输入查询到结果更新 |
| 命令执行时间 | < 200ms | 点击命令到执行完成 |
| 内存占用 | < 10MB | 菜单组件内存占用 |
| 动画帧率 | 60 FPS | 动画流畅度 |

### 优化策略
1. **虚拟滚动**: 当命令数量超过50个时启用
2. **防抖搜索**: 300ms 防抖延迟
3. **懒加载**: 图标按需加载
4. **缓存**: 搜索结果缓存
5. **GPU 加速**: 使用 transform 而非 top/left

---

## 🐛 已知问题与限制

### 当前限制
- [ ] 不支持多语言（仅中英文）
- [ ] 不支持自定义命令排序
- [ ] 不支持命令分组折叠
- [ ] 移动端体验需优化

### 待解决问题
- [ ] 快速输入时菜单闪烁
- [ ] 某些命令图标加载慢
- [ ] 暗色模式下对比度不足
- [ ] 搜索结果排序需改进

---

## 📚 参考资料

### 竞品分析
- [Notion](https://notion.so) - 斜杠命令最佳实践
- [Linear](https://linear.app) - 键盘导航体验
- [Coda](https://coda.io) - 命令分类设计
- [Craft](https://craft.do) - UI 设计风格

### 技术文档
- [Tiptap Suggestion](https://tiptap.dev/api/utilities/suggestion)
- [Tiptap InputRule](https://tiptap.dev/api/utilities/input-rules)
- [Framer Motion](https://www.framer.com/motion/)

---

## 📝 更新日志

### v1.0.0 - 计划中
- [ ] 基础框架
- [ ] 15个 P0 命令
- [ ] 搜索与键盘导航

### v1.1.0 - 计划中
- [ ] 25个 P1 命令
- [ ] 性能优化
- [ ] 响应式设计

### v2.0.0 - 计划中
- [ ] 30个 P2 命令
- [ ] AI 功能集成
- [ ] 高级特性

---

**文档版本**: v1.0.0  
**最后更新**: 2025-01-XX  
**维护者**: Kanso Team  
**预计工作量**: 12 天  
**总命令数**: 70+
